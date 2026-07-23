import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  {
    num: '01', title: 'Load SFT Model',
    desc: 'Start from the supervised fine-tuned adapter as baseline.',
    code: `model, tokenizer = load(
    MODEL_PATH,
    adapter_path=SFT_ADAPTER_PATH
)`,
  },
  {
    num: '02', title: 'Generate Completions',
    desc: '4 emoji sequences per movie, 1 greedy + 3 at temp 0.8.',
    code: `for movie in batch_movies:          # 200 movies
    completions = generate_completions(
        model, tokenizer, movie,
        n=4                              # NUM_COMPLETIONS
    )`,
  },
  {
    num: '03', title: 'Score with Rewards',
    desc: '5 signals weighted into a single reward score.',
    code: `reward = (
    0.30 * signature  +   # iconic emojis
    0.30 * relevance  +   # concept keywords
    0.20 * purity     +   # emoji vs text
    0.10 * length     +   # 8-15 ideal
    0.10 * diversity      # unique ratio
)`,
  },
  {
    num: '04', title: 'Filter Best Outputs',
    desc: 'Keep highest-scoring completion per movie if reward >= 0.6.',
    code: `if best_reward >= MIN_REWARD:   # 0.6
    selected_data.append({
        "messages": [
            {"role": "user", ...},
            {"role": "assistant",
             "content": best_completion}
        ]
    })`,
  },
  {
    num: '05', title: 'Build Training Set',
    desc: 'Combine original SFT data + reward-filtered RL selections.',
    code: `with open(rl_train_file, "w") as f:
    for line in original_lines:    # 386 SFT
        f.write(line)
    for entry in selected_data:    # ~164 RL
        f.write(json.dumps(entry))`,
  },
  {
    num: '06', title: 'Retrain LoRA',
    desc: '300 iterations on the combined set. Adapter saved to adapters-rl/.',
    code: `python -m mlx_lm lora \\
    --model ./gemma-model \\
    --data  ./data-rl-generated \\
    --adapter-path ./adapters-rl \\
    --iters 300 --batch-size 1 \\
    --learning-rate 1e-5`,
  },
  {
    num: '07', title: 'Repeat',
    desc: 'Iteration 2 loads the RL model and runs steps 2-6 again.',
    code: `# iteration 2: self-improve
model, tokenizer = load(
    MODEL_PATH,
    adapter_path=RL_ADAPTER_PATH  # from step 6
)
# -> generate -> score -> filter -> retrain`,
  },
];

const codeVariants = {
  enter: { opacity: 0, x: 30 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
};

export default function Slide10a() {
  const [active, setActive] = useState(0);

  return (
    <div className="slide">
      <div className="glow glow-blue" style={{ top: '-80px', right: '-100px' }} />
      <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        Inside <span className="accent">train_rl.py</span>
      </motion.h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', maxWidth: '1050px', width: '100%' }}>
        {/* Left: step list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => setActive(i)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                background: active === i ? 'rgba(108,92,231,0.15)' : 'var(--bg-card)',
                borderRadius: '10px',
                padding: '0.55rem 1rem',
                borderLeft: active === i ? '3px solid var(--accent)' : s.num === '07' ? '3px solid var(--accent-light)' : '3px solid var(--green)',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              <span className="icon" style={{ flexShrink: 0, width: 36, height: 36, fontSize: '1.3rem' }}>{s.num}</span>
              <div style={{ minWidth: 0 }}>
                <strong style={{ color: active === i ? 'var(--accent-light)' : 'var(--text-primary)', fontSize: '0.9rem' }}>{s.title}</strong>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', lineHeight: 1.4, marginTop: '0.1rem' }}>{s.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right: code snippet */}
        <div style={{ position: 'relative', minHeight: '340px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              variants={codeVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              style={{
                background: '#000',
                borderRadius: '12px',
                padding: '1.4rem 1.6rem',
                fontFamily: "'SF Mono', 'Fira Code', monospace",
                fontSize: '0.82rem',
                lineHeight: 1.75,
                color: 'var(--text-secondary)',
                border: '1px solid #333',
                position: 'absolute',
                inset: 0,
                overflow: 'auto',
              }}
            >
              <div style={{ color: '#555', marginBottom: '0.6rem', fontSize: '0.75rem' }}>
                # Step {steps[active].num}: {steps[active].title}
              </div>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#ccc' }}>{steps[active].code}</pre>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <motion.div
        className="highlight-box"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={{ marginTop: '1rem', fontSize: '0.95rem' }}
      >
        2 iterations &times; 200 movies &times; 4 completions = <strong style={{ color: 'var(--green)' }}>1,600 scored outputs</strong> &rarr; best survive to retrain.
      </motion.div>
      <div className="img-prompt">Prompt: step by step rl training pipeline</div>
    </div>
  );
}
