"""
Emoji Movie Plot Fine-Tuning Pipeline
Fine-tunes Gemma 3 using LoRA on MLX to describe movie plots using only emojis.
"""

import subprocess
import sys
from pathlib import Path

BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / "data"
DATA_RL_DIR = BASE_DIR / "data-rl"
ADAPTERS_DIR = BASE_DIR / "adapters"
ADAPTERS_RL_DIR = BASE_DIR / "adapters-rl"
FUSED_DIR = BASE_DIR / "fused-model"
CONFIG_FILE = BASE_DIR / "lora_config.yaml"
CONFIG_RL_FILE = BASE_DIR / "lora_config_rl.yaml"

MODEL = "./gemma-model"  # local path; or use "mlx-community/gemma-3-4b-it-4bit" to pull from HuggingFace

TRAIN_CONFIG = {
    "iters": 500,
    "batch_size": 1,
    "learning_rate": 1e-5,
    "steps_per_eval": 50,
    "steps_per_report": 10,
    "save_every": 100,
    "max_seq_length": 512,
}

TEST_PROMPTS = [
    "Describe the plot of this movie using only emojis: The Jungle Book",
    "Describe the plot of this movie using only emojis: Nemo",
    "Describe the plot of this movie using only emojis: Terminator 2",
]


def train():
    print(f"\n=== Training LoRA adapter on {MODEL} ===\n")
    cmd = [
        sys.executable, "-m", "mlx_lm", "lora",
        "--model", MODEL,
        "--train",
        "--data", str(DATA_DIR),
        "--adapter-path", str(ADAPTERS_DIR),
        "--config", str(CONFIG_FILE),
        "--iters", str(TRAIN_CONFIG["iters"]),
        "--batch-size", str(TRAIN_CONFIG["batch_size"]),
        "--learning-rate", str(TRAIN_CONFIG["learning_rate"]),
        "--num-layers", "8",
        "--steps-per-eval", str(TRAIN_CONFIG["steps_per_eval"]),
        "--steps-per-report", str(TRAIN_CONFIG["steps_per_report"]),
        "--save-every", str(TRAIN_CONFIG["save_every"]),
        "--max-seq-length", str(TRAIN_CONFIG["max_seq_length"]),
    ]
    subprocess.run(cmd, check=True)
    print("\n=== Training complete! Adapter saved to:", ADAPTERS_DIR, "===")


def test_base_model():
    print(f"\n=== Testing BASE model (no fine-tuning) ===\n")
    for prompt in TEST_PROMPTS:
        print(f"Prompt: {prompt}")
        cmd = [
            sys.executable, "-m", "mlx_lm", "generate",
            "--model", MODEL,
            "--prompt", prompt,
            "--max-tokens", "60",
        ]
        subprocess.run(cmd, check=True)
        print("-" * 40)


def test_finetuned():
    print(f"\n=== Testing FINE-TUNED model (with LoRA adapter) ===\n")
    for prompt in TEST_PROMPTS:
        print(f"Prompt: {prompt}")
        cmd = [
            sys.executable, "-m", "mlx_lm", "generate",
            "--model", MODEL,
            "--adapter-path", str(ADAPTERS_DIR),
            "--prompt", prompt,
            "--max-tokens", "60",
        ]
        subprocess.run(cmd, check=True)
        print("-" * 40)


def train_rl():
    print(f"\n=== ReST (Reinforced Self-Training) on {MODEL} ===\n")
    print("This uses a reward function to score emoji outputs and trains on the best ones.\n")
    cmd = [
        sys.executable, str(BASE_DIR / "train_rl.py"), "train",
    ]
    subprocess.run(cmd, check=True)
    print("\n=== RL Training complete! Adapter saved to:", ADAPTERS_RL_DIR, "===")


def test_rl():
    print(f"\n=== Testing RL/DPO fine-tuned model ===\n")
    for prompt in TEST_PROMPTS:
        print(f"Prompt: {prompt}")
        cmd = [
            sys.executable, "-m", "mlx_lm", "generate",
            "--model", MODEL,
            "--adapter-path", str(ADAPTERS_RL_DIR),
            "--prompt", prompt,
            "--max-tokens", "60",
        ]
        subprocess.run(cmd, check=True)
        print("-" * 40)


def fuse():
    print(f"\n=== Fusing adapter into model ===\n")
    cmd = [
        sys.executable, "-m", "mlx_lm", "fuse",
        "--model", MODEL,
        "--adapter-path", str(ADAPTERS_DIR),
        "--save-path", str(FUSED_DIR),
    ]
    subprocess.run(cmd, check=True)
    print("\n=== Fused model saved to:", FUSED_DIR, "===")


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Emoji Movie Fine-Tuning Pipeline")
    parser.add_argument("step", choices=[
        "install", "train", "train-rl", "test-base", "test-finetuned", "test-rl", "fuse", "all"
    ], help="Pipeline step to run")
    args = parser.parse_args()

    if args.step == "install":
        install_deps()
    elif args.step == "train":
        train()
    elif args.step == "train-rl":
        train_rl()
    elif args.step == "test-base":
        test_base_model()
    elif args.step == "test-finetuned":
        test_finetuned()
    elif args.step == "test-rl":
        test_rl()
    elif args.step == "fuse":
        fuse()
    elif args.step == "all":
        # install_deps()
        # print("\n" + "=" * 60)
        # test_base_model()
        # print("\n" + "=" * 60)
        train()
        print("\n" + "=" * 60)
        test_finetuned()
        print("\n" + "=" * 60)
        train_rl()
        print("\n" + "=" * 60)
        test_rl()
        print("\n" + "=" * 60)
        fuse()
