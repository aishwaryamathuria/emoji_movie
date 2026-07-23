"""
ReST (Reinforced Self-Training) for Emoji Movie Fine-Tuning
============================================================
Genuine RL-flavored training loop:
  1. Generate multiple completions per prompt (exploration)
  2. Score each with a reward function (emoji purity, relevance, length, diversity)
  3. Keep only high-scoring outputs (selection)
  4. Retrain LoRA on the reward-filtered data (learning)

Reward function checks if generated emojis have >=80% overlap with reference emojis.
"""

import json
import re
import shutil
import subprocess
import sys
import unicodedata
from pathlib import Path
from collections import Counter

import mlx.core as mx
from mlx_lm import load, generate

BASE_DIR = Path(__file__).parent
MODEL_PATH = str(BASE_DIR / "gemma-model")
SFT_ADAPTER_PATH = str(BASE_DIR / "adapters")
RL_ADAPTER_PATH = str(BASE_DIR / "adapters-rl")
DATA_RL_DIR = BASE_DIR / "data-rl"
REFERENCE_DATA = DATA_RL_DIR / "train.jsonl"
GENERATED_DIR = BASE_DIR / "data-rl-generated"
CONFIG_RL_FILE = str(BASE_DIR / "lora_config_rl.yaml")
CONCEPTS_FILE = BASE_DIR / "movie_concepts.json"

NUM_COMPLETIONS = 4
TEMPERATURE = 0.8
RELEVANCE_THRESHOLD = 0.5
MIN_REWARD = 0.6


def is_emoji(char):
    if char in (' ', '\n', '\t', '\r'):
        return False
    cat = unicodedata.category(char)
    if cat.startswith('So'):
        return True
    cp = ord(char)
    emoji_ranges = [
        (0x1F600, 0x1F64F), (0x1F300, 0x1F5FF), (0x1F680, 0x1F6FF),
        (0x1F1E0, 0x1F1FF), (0x2600, 0x26FF), (0x2700, 0x27BF),
        (0x1F900, 0x1F9FF), (0x1FA00, 0x1FA6F), (0x1FA70, 0x1FAFF),
        (0x231A, 0x231B), (0x23E9, 0x23F3), (0x23F8, 0x23FA),
        (0x25AA, 0x25AB), (0x25B6, 0x25C0), (0x25FB, 0x25FE),
        (0x2614, 0x2615), (0x2648, 0x2653), (0x267F, 0x267F),
        (0x2934, 0x2935), (0x2B05, 0x2B07), (0x2B1B, 0x2B1C),
        (0x3030, 0x3030), (0x303D, 0x303D), (0x3297, 0x3297),
        (0x3299, 0x3299), (0xFE0F, 0xFE0F), (0x200D, 0x200D),
    ]
    return any(start <= cp <= end for start, end in emoji_ranges)


def extract_emojis(text):
    return [ch for ch in text if is_emoji(ch)]


def reward_emoji_purity(text):
    """Score 1.0 if output is all emojis, penalize text content."""
    chars = [ch for ch in text if ch.strip()]
    if not chars:
        return 0.0
    emoji_chars = [ch for ch in chars if is_emoji(ch)]
    return len(emoji_chars) / len(chars)


def reward_length(text):
    """Ideal length is 8-15 emojis. Score drops outside that range."""
    emojis = extract_emojis(text)
    n = len(emojis)
    if n == 0:
        return 0.0
    if 8 <= n <= 15:
        return 1.0
    if 5 <= n < 8:
        return 0.7
    if 15 < n <= 20:
        return 0.7
    if n < 5:
        return 0.3
    return 0.4


def reward_diversity(text):
    """Higher score for more unique emojis (penalize repetition)."""
    emojis = extract_emojis(text)
    if not emojis:
        return 0.0
    unique = set(emojis)
    return len(unique) / len(emojis)


def load_concepts():
    """Load concept-to-emoji mapping, movie-to-concepts, and movie signatures."""
    with open(CONCEPTS_FILE) as f:
        data = json.load(f)
    concept_emojis = data.pop("_concept_emojis")
    movie_signatures = data.pop("_movie_signatures", {})
    movie_concepts = data
    return concept_emojis, movie_concepts, movie_signatures


CONCEPT_EMOJIS, MOVIE_CONCEPTS, MOVIE_SIGNATURES = load_concepts()


def reward_relevance(generated_text, movie_name):
    """Score based on how many of the 5 plot keywords are represented by emojis.
    Each keyword maps to a set of acceptable emojis. If at least one emoji from
    that concept set appears in the output, the concept is 'covered'.
    Score = covered_concepts / 5. Target: >=80% (4/5 concepts)."""
    concepts = MOVIE_CONCEPTS.get(movie_name)
    if not concepts:
        return reward_relevance_fallback(generated_text)

    gen_emojis = set(extract_emojis(generated_text))
    if not gen_emojis:
        return 0.0

    covered = 0
    for concept in concepts:
        acceptable = set(CONCEPT_EMOJIS.get(concept, []))
        if gen_emojis & acceptable:
            covered += 1

    return covered / len(concepts)


def reward_relevance_fallback(generated_text):
    """Fallback: if movie not in concepts map, check that output has diverse emoji categories."""
    emojis = extract_emojis(generated_text)
    if not emojis:
        return 0.0
    unique = set(emojis)
    return min(len(unique) / 5, 1.0)


def reward_signature(generated_text, movie_name):
    """Check if the iconic/signature emojis for this movie appear in the output.
    These are the emojis the movie is FAMOUS for (e.g. 🚢🧊 for Titanic, 🦖 for Jurassic Park).
    Missing a signature emoji is a strong negative signal."""
    sigs = MOVIE_SIGNATURES.get(movie_name)
    if not sigs:
        return 1.0
    gen_emojis = set(extract_emojis(generated_text))
    if not gen_emojis:
        return 0.0
    matched = sum(1 for s in sigs if s in gen_emojis)
    return matched / len(sigs)


def compute_reward(generated_text, movie_name):
    """Combined reward: weighted sum of all signals."""
    purity = reward_emoji_purity(generated_text)
    length = reward_length(generated_text)
    diversity = reward_diversity(generated_text)
    relevance = reward_relevance(generated_text, movie_name)
    signature = reward_signature(generated_text, movie_name)

    reward = (
        0.20 * purity +
        0.10 * length +
        0.10 * diversity +
        0.30 * relevance +
        0.30 * signature
    )
    concepts_count = int(relevance * 5) if MOVIE_CONCEPTS.get(movie_name) else -1
    sigs = MOVIE_SIGNATURES.get(movie_name, [])
    sig_count = int(signature * len(sigs)) if sigs else -1

    return reward, {
        "purity": round(purity, 2),
        "length": round(length, 2),
        "diversity": round(diversity, 2),
        "relevance": round(relevance, 2),
        "signature": round(signature, 2),
        "concepts": f"{concepts_count}/5",
        "iconic": f"{sig_count}/{len(sigs)}" if sigs else "n/a",
        "total": round(reward, 2),
    }


def load_reference_data():
    """Load reference emoji answers from training data."""
    references = {}
    with open(REFERENCE_DATA) as f:
        for line in f:
            entry = json.loads(line)
            msgs = entry["messages"]
            user_msg = msgs[0]["content"]
            asst_msg = msgs[1]["content"]
            movie = user_msg.replace("Describe the plot of this movie using only emojis: ", "")
            references[movie] = asst_msg
    return references


def make_sampler(temperature):
    """Create a temperature sampler compatible with mlx_lm's generate_step."""
    def sampler(logits):
        if temperature == 0.0:
            return mx.argmax(logits, axis=-1)
        scaled = logits / temperature
        return mx.random.categorical(scaled)
    return sampler


def generate_completions(model, tokenizer, movie, n=NUM_COMPLETIONS):
    """Generate N completions for a movie prompt with temperature sampling."""
    prompt = f"Describe the plot of this movie using only emojis: {movie}"
    messages = [{"role": "user", "content": prompt}]
    formatted = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)

    completions = []
    for i in range(n):
        temp = TEMPERATURE if i > 0 else 0.0
        response = generate(
            model, tokenizer,
            prompt=formatted,
            max_tokens=60,
            sampler=make_sampler(temp),
        )
        completions.append(response.strip())
    return completions


def run_rest_pipeline(num_iterations=2, movies_per_iter=50):
    """Run the full ReST pipeline."""
    print("=" * 60)
    print("  ReST (Reinforced Self-Training) Pipeline")
    print("=" * 60)

    references = load_reference_data()
    all_movies = list(references.keys())

    GENERATED_DIR.mkdir(exist_ok=True)

    if Path(RL_ADAPTER_PATH).exists():
        print(f"  Cleaning old RL adapters: {RL_ADAPTER_PATH}")
        shutil.rmtree(RL_ADAPTER_PATH)

    for iteration in range(num_iterations):
        print(f"\n{'='*60}")
        print(f"  ITERATION {iteration + 1}/{num_iterations}")
        print(f"{'='*60}")

        if iteration == 0:
            print("\nLoading SFT model as starting point...")
            model, tokenizer = load(MODEL_PATH, adapter_path=SFT_ADAPTER_PATH)
        else:
            print("\nLoading RL model from previous iteration...")
            model, tokenizer = load(MODEL_PATH, adapter_path=RL_ADAPTER_PATH)

        start = (iteration * movies_per_iter) % len(all_movies)
        batch_movies = []
        for i in range(movies_per_iter):
            batch_movies.append(all_movies[(start + i) % len(all_movies)])

        selected_data = []
        total_generated = 0
        total_selected = 0
        reward_sum = 0

        print(f"\nGenerating {NUM_COMPLETIONS} completions each for {len(batch_movies)} movies...\n")

        for idx, movie in enumerate(batch_movies):
            completions = generate_completions(model, tokenizer, movie, NUM_COMPLETIONS)
            total_generated += len(completions)

            best_reward = -1
            best_completion = None
            best_details = None

            for comp in completions:
                reward, details = compute_reward(comp, movie)
                if reward > best_reward:
                    best_reward = reward
                    best_completion = comp
                    best_details = details

            status = "✓" if best_reward >= MIN_REWARD else "✗"
            concepts = best_details.get('concepts', '?')
            iconic = best_details.get('iconic', '?')
            print(f"  [{idx+1:3d}/{len(batch_movies)}] {status} {movie:40s} "
                  f"reward={best_reward:.2f} "
                  f"(concepts={concepts} iconic={iconic} "
                  f"pur={best_details['purity']:.1f} "
                  f"div={best_details['diversity']:.1f})")

            if best_reward >= MIN_REWARD:
                selected_data.append({
                    "messages": [
                        {"role": "user", "content": f"Describe the plot of this movie using only emojis: {movie}"},
                        {"role": "assistant", "content": best_completion},
                    ]
                })
                total_selected += 1
                reward_sum += best_reward

        avg_reward = reward_sum / max(total_selected, 1)
        print(f"\n  Generated: {total_generated} | Selected: {total_selected}/{len(batch_movies)} "
              f"| Avg reward: {avg_reward:.2f}")

        # Combine: original reference data + reward-filtered generated data
        GENERATED_DIR.mkdir(exist_ok=True)
        rl_train_file = GENERATED_DIR / "train.jsonl"
        with open(REFERENCE_DATA) as f:
            original_lines = f.readlines()

        with open(rl_train_file, "w") as f:
            for line in original_lines:
                f.write(line)
            for entry in selected_data:
                f.write(json.dumps(entry) + "\n")

        total_lines = len(original_lines) + len(selected_data)
        print(f"  RL training set: {total_lines} examples "
              f"({len(original_lines)} original + {len(selected_data)} RL-selected)")

        # Free model before training
        del model, tokenizer

        print(f"\n  Training LoRA on reward-filtered data (iteration {iteration + 1})...")
        cmd = [
            sys.executable, "-m", "mlx_lm", "lora",
            "--model", MODEL_PATH,
            "--train",
            "--data", str(GENERATED_DIR),
            "--adapter-path", RL_ADAPTER_PATH,
            "--config", CONFIG_RL_FILE,
            "--iters", "300",
            "--batch-size", "1",
            "--learning-rate", "1e-5",
            "--num-layers", "8",
            "--steps-per-eval", "50",
            "--steps-per-report", "10",
            "--save-every", "100",
            "--max-seq-length", "512",
        ]
        subprocess.run(cmd, check=True)
        print(f"\n  Iteration {iteration + 1} complete!")

    print(f"\n{'='*60}")
    print(f"  ReST PIPELINE COMPLETE")
    print(f"  RL adapter saved to: {RL_ADAPTER_PATH}")
    print(f"{'='*60}")


def test_rewards():
    """Quick test: score the reference data against concept keywords + signatures."""
    references = load_reference_data()
    print("Scoring reference data against concepts + iconic signatures...\n")
    rewards = []
    for movie, emojis in list(references.items())[:30]:
        reward, details = compute_reward(emojis, movie)
        rewards.append(reward)
        concepts = MOVIE_CONCEPTS.get(movie, [])
        sigs = MOVIE_SIGNATURES.get(movie, [])
        print(f"  {movie:40s} concepts={concepts}")
        print(f"  {'':40s} iconic={''.join(sigs) if sigs else 'n/a'}")
        print(f"  {'':40s} emojis={emojis}")
        print(f"  {'':40s} → {details}\n")
    print(f"\n  Average baseline reward: {sum(rewards)/len(rewards):.2f}")


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="ReST RL Training for Emoji Movies")
    parser.add_argument("step", choices=["test-rewards", "train", "train-small"],
                        help="Pipeline step")
    args = parser.parse_args()

    if args.step == "test-rewards":
        test_rewards()
    elif args.step == "train":
        run_rest_pipeline(num_iterations=2, movies_per_iter=200)
    elif args.step == "train-small":
        run_rest_pipeline(num_iterations=1, movies_per_iter=20)
