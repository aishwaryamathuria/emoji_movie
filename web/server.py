import json
import random
import threading
from pathlib import Path

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from mlx_lm import load, generate

BASE_DIR = Path(__file__).parent
PROJECT_DIR = BASE_DIR.parent
MODEL_PATH = str(PROJECT_DIR / "gemma-model")
SFT_ADAPTER_PATH = str(PROJECT_DIR / "adapters")
RL_ADAPTER_PATH = str(PROJECT_DIR / "adapters-rl")

app = Flask(__name__)
CORS(app)

with open(BASE_DIR / "movies.json") as f:
    MOVIES = json.load(f)

print("Loading base model...")
base_model, base_tokenizer = load(MODEL_PATH)
print("Loading SFT fine-tuned model...")
sft_model, sft_tokenizer = load(MODEL_PATH, adapter_path=SFT_ADAPTER_PATH)
print("Loading RL/DPO fine-tuned model...")
rl_model, rl_tokenizer = load(MODEL_PATH, adapter_path=RL_ADAPTER_PATH)
print("All 3 models loaded!")

game_state = {}
mlx_lock = threading.Lock()


def generate_emojis(movie, model_type="sft"):
    prompt = f"Describe the plot of this movie using only emojis: {movie}"
    messages = [{"role": "user", "content": prompt}]

    if model_type == "base":
        m, t = base_model, base_tokenizer
    elif model_type == "rl":
        m, t = rl_model, rl_tokenizer
    else:
        m, t = sft_model, sft_tokenizer

    formatted = t.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    with mlx_lock:
        response = generate(m, t, prompt=formatted, max_tokens=60)
    return response.strip()


@app.route("/api/start")
def start_game():
    shuffled = random.sample(MOVIES, len(MOVIES))
    game_id = random.randint(1000, 9999)
    emojis_sft = {}
    emojis_rl = {}
    for movie in shuffled:
        emojis_sft[movie] = generate_emojis(movie, "sft")
        emojis_rl[movie] = generate_emojis(movie, "rl")
    game_state[game_id] = {"movies": shuffled, "emojis_sft": emojis_sft, "emojis_rl": emojis_rl, "current": 0, "score": 0}
    first = shuffled[0]
    return jsonify({
        "game_id": game_id,
        "round": 1,
        "total": len(shuffled),
        "emojis_sft": emojis_sft[first],
        "emojis_rl": emojis_rl[first],
    })


@app.route("/api/guess", methods=["POST"])
def make_guess():
    data = request.get_json()
    game_id = data["game_id"]
    guess = data["guess"]

    state = game_state.get(game_id)
    if not state:
        return jsonify({"error": "Game not found"})

    idx = state["current"]
    correct_movie = state["movies"][idx]
    is_correct = guess.strip().lower() == correct_movie.strip().lower()

    if is_correct:
        state["score"] += 1

    state["current"] += 1
    done = state["current"] >= len(state["movies"])

    result = {
        "correct": is_correct,
        "answer": correct_movie,
        "score": state["score"],
        "done": done,
    }

    if not done:
        next_movie = state["movies"][state["current"]]
        result["round"] = state["current"] + 1
        result["total"] = len(state["movies"])
        result["emojis_sft"] = state["emojis_sft"][next_movie]
        result["emojis_rl"] = state["emojis_rl"][next_movie]

    return jsonify(result)


@app.route("/api/compare", methods=["POST"])
def compare():
    data = request.get_json()
    movie = data["movie"]
    base_response = generate_emojis(movie, "base")
    sft_response = generate_emojis(movie, "sft")
    rl_response = generate_emojis(movie, "rl")
    return jsonify({
        "movie": movie,
        "base": base_response,
        "sft": sft_response,
        "rl": rl_response,
    })


@app.route("/")
def serve_ui():
    return send_file(BASE_DIR / "index.html")


@app.route("/compare")
def serve_compare():
    return send_file(BASE_DIR / "compare.html")


if __name__ == "__main__":
    app.run(debug=False, port=8000, threaded=False)
