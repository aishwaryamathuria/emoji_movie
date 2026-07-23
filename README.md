cd emoji-movie-finetuning

# 1. Install dependencies
python train.py install

# 2. Test the base model first (see how it responds without fine-tuning)
python train.py test-base

# 3. Fine-tune with LoRA
python train.py train

# 4. Test the fine-tuned model (compare the difference)
python train.py test-finetuned

# 5. Fuse the adapter into a standalone model
python train.py fuse

# Base model chat
python -m mlx_lm chat --model ./gemma-model

# SFT chat
python -m mlx_lm chat --model ./gemma-model --adapter-path ./adapters

# RL chat
python -m mlx_lm chat --model ./gemma-model --adapter-path ./adapters-rl
