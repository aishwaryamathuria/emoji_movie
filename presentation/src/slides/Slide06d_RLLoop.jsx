import { motion } from 'framer-motion';

const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };

const stepBadge = {
  background: 'var(--accent-glow)', color: 'var(--accent-light)', borderRadius: '50%',
  width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: '0.85rem', fontWeight: '700', flexShrink: 0,
};

export default function Slide06d() {
  return (
    <div className="slide" style={{ padding: '3rem 4rem' }}>
      <div className="glow glow-purple" style={{ top: '20%', right: '-100px' }} />
      <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        ReST Pipeline: <span className="accent">How Our RL Training Works</span>
      </motion.h2>

      <motion.p
        style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1.2rem', textAlign: 'center' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Reinforced Self-Training — the model learns from its own best outputs
      </motion.p>

      {/* Flow diagram */}
      <motion.div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.8rem' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <span className="tag tag-green">SFT Model</span>
        <span style={{ color: '#555' }}>→</span>
        <span className="tag tag-accent">Generate</span>
        <span style={{ color: '#555' }}>→</span>
        <span className="tag tag-orange">Score</span>
        <span style={{ color: '#555' }}>→</span>
        <span className="tag tag-accent">Filter</span>
        <span style={{ color: '#555' }}>→</span>
        <span className="tag tag-green">Retrain</span>
        <span style={{ color: '#555' }}>→</span>
        <span style={{ color: 'var(--blue)', fontWeight: 600 }}>Repeat</span>
      </motion.div>

      <motion.div className="cards cards-4" variants={container} initial="hidden" animate="show" style={{ maxWidth: '980px' }}>
        {/* Step 1 */}
        <motion.div className="card" variants={item}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
            <span style={stepBadge}>1</span>
            <h4 style={{ margin: 0 }}>Generate</h4>
          </div>
          <p style={{ fontSize: '0.82rem' }}>Load SFT model. For each of 200 movies, generate 4 completions with temp=0.8:</p>
          <div style={{ marginTop: '0.6rem', fontSize: '0.78rem', lineHeight: '1.8' }}>
            <div style={{ color: '#888', marginBottom: '0.3rem' }}>Titanic →</div>
            <div><span className="tag tag-green" style={{ marginRight: '0.3rem' }}>A</span> 🚢💑🧊💥🌊😭💎</div>
            <div><span className="tag tag-orange" style={{ marginRight: '0.3rem' }}>B</span> <span style={{ color: '#888' }}>The ship sinks 🚢💀</span></div>
            <div><span className="tag tag-accent" style={{ marginRight: '0.3rem' }}>C</span> 🚢🚢🚢🚢🚢</div>
            <div><span className="tag tag-green" style={{ marginRight: '0.3rem' }}>D</span> 🚢💑🎨🧊💥🥶🌊💀😭💎🔵</div>
          </div>
          <p style={{ fontSize: '0.7rem', color: '#555', marginTop: '0.5rem' }}>800 total generations (200 × 4)</p>
        </motion.div>

        {/* Step 2 */}
        <motion.div className="card" variants={item}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
            <span style={stepBadge}>2</span>
            <h4 style={{ margin: 0 }}>Score</h4>
          </div>
          <p style={{ fontSize: '0.82rem' }}>Reward function scores each output:</p>
          <div style={{ marginTop: '0.4rem', fontSize: '0.72rem', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
            <div style={{ marginBottom: '0.3rem' }}>
              <strong style={{ color: 'var(--pink)' }}>Signature 30%</strong> — iconic emojis (🚢🧊💑)
            </div>
            <div style={{ marginBottom: '0.3rem' }}>
              <strong style={{ color: 'var(--green)' }}>Relevance 30%</strong> — 5 keywords matched
            </div>
            <div style={{ marginBottom: '0.3rem' }}>
              <strong style={{ color: 'var(--blue)' }}>Purity 20%</strong> — emojis only, no text
            </div>
            <div style={{ marginBottom: '0.4rem' }}>
              <strong style={{ color: 'var(--yellow)' }}>Len 10% · Div 10%</strong>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2rem 1fr', gap: '0.2rem', fontSize: '0.7rem' }}>
              <strong>A</strong><span>iconic 3/3 · concepts 5/5 → <strong style={{ color: 'var(--green)' }}>0.94</strong></span>
              <strong>B</strong><span>iconic 1/3 · concepts 1/5 → <strong style={{ color: 'var(--orange)' }}>0.20</strong></span>
              <strong>C</strong><span>iconic 1/3 · concepts 1/5 → <strong style={{ color: 'var(--orange)' }}>0.35</strong></span>
              <strong>D</strong><span>iconic 3/3 · concepts 5/5 → <strong style={{ color: 'var(--green)' }}>0.97</strong></span>
            </div>
          </div>
        </motion.div>

        {/* Step 3 */}
        <motion.div className="card" variants={item}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
            <span style={stepBadge}>3</span>
            <h4 style={{ margin: 0 }}>Filter</h4>
          </div>
          <p style={{ fontSize: '0.82rem' }}>Keep best output per movie if reward ≥ 0.6:</p>
          <div style={{ marginTop: '0.6rem', fontSize: '0.78rem', lineHeight: '2' }}>
            <div><strong>A</strong> <span style={{ color: 'var(--green)' }}>0.94 ✓ kept</span></div>
            <div><strong>B</strong> <span style={{ color: '#555', textDecoration: 'line-through' }}>0.20 ✗ discarded</span></div>
            <div><strong>C</strong> <span style={{ color: '#555', textDecoration: 'line-through' }}>0.35 ✗ discarded</span></div>
            <div><strong>D</strong> <span style={{ color: 'var(--green)' }}>0.97 ✓ best → selected</span></div>
          </div>
          <p style={{ fontSize: '0.7rem', color: '#555', marginTop: '0.5rem' }}>~164/200 movies pass the threshold</p>
          <div style={{ marginTop: '0.4rem', fontSize: '0.72rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Training set = </span>
            <span style={{ color: 'var(--green)' }}>386 original</span>
            <span style={{ color: 'var(--text-secondary)' }}> + </span>
            <span style={{ color: 'var(--blue)' }}>164 RL-selected</span>
          </div>
        </motion.div>

        {/* Step 4 */}
        <motion.div className="card" variants={item}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
            <span style={stepBadge}>4</span>
            <h4 style={{ margin: 0 }}>Retrain</h4>
          </div>
          <p style={{ fontSize: '0.82rem' }}>Train LoRA on the combined dataset:</p>
          <div style={{ marginTop: '0.6rem', fontSize: '0.78rem', lineHeight: '2' }}>
            <div><strong style={{ color: 'var(--green)' }}>300 iterations</strong> <span style={{ color: '#888' }}>— LoRA fine-tuning</span></div>
            <div><strong style={{ color: 'var(--blue)' }}>Rank 8</strong> <span style={{ color: '#888' }}>— on 8 attention layers</span></div>
            <div><strong style={{ color: 'var(--pink)' }}>New adapters</strong> <span style={{ color: '#888' }}>→ adapters-rl/</span></div>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#555', marginTop: '0.8rem' }}>Then repeat: load new RL model → generate → score → filter → retrain</p>
          <div style={{ marginTop: '0.4rem', fontSize: '0.72rem', color: 'var(--blue)' }}>
            2 iterations total
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="highlight-box"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={{ maxWidth: '850px' }}
      >
        <strong style={{ color: 'var(--accent-light)' }}>SFT says</strong> "memorize these answers."
        <strong style={{ color: 'var(--blue)' }}> RL says</strong> "here's what a good answer looks like — figure it out."
        The model learns general patterns (emoji-only, match the storyline, use iconic emojis) rather than specific mappings.
      </motion.div>

      <div className="img-prompt">Prompt: Four interconnected gears turning in sequence, each labeled with a glowing icon — a spark, a star rating, a filter funnel, and a refresh arrow — mechanical precision meets neural glow, dark blueprint background, 16:9</div>
    </div>
  );
}
