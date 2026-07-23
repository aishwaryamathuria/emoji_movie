import { motion } from 'framer-motion';

const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };
const container = { hidden: {}, show: { transition: { staggerChildren: 0.15 } } };

export default function Slide06a() {
  return (
    <div className="slide">
      <div className="glow glow-blue" style={{ top: '-80px', right: '-100px' }} />
      <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        Types of <span className="accent">Fine-Tuning</span>
      </motion.h2>

      <motion.div className="cards cards-2" variants={container} initial="hidden" animate="show" style={{ maxWidth: '900px' }}>
        <motion.div className="card" variants={item} style={{ border: '1px solid rgba(0, 184, 148, 0.4)' }}>
          <span className="icon">SF</span>
          <h4>Supervised Fine-Tuning (SFT)</h4>
          <p>"Here's the right answer." Model learns from explicit input → output pairs. Simplest and most direct.</p>
          <span className="tag tag-green" style={{ marginTop: '0.5rem' }}>Our approach</span>
        </motion.div>
        <motion.div className="card" variants={item}>
          <span className="icon">RH</span>
          <h4>RLHF</h4>
          <p>"This answer is better than that one." Humans rank outputs, model learns from preferences via a reward model.</p>
          <span className="tag tag-accent" style={{ marginTop: '0.5rem' }}>ChatGPT, Claude</span>
        </motion.div>
        <motion.div className="card" variants={item}>
          <span className="icon">DP</span>
          <h4>DPO (Direct Preference Optimization)</h4>
          <p>"Prefer this, reject that." Pairs of chosen vs rejected responses. Simpler than RLHF — no reward model needed.</p>
          <span className="tag tag-accent" style={{ marginTop: '0.5rem' }}>Llama 3, Zephyr</span>
        </motion.div>
        <motion.div className="card" variants={item}>
          <span className="icon">CP</span>
          <h4>Unsupervised / Continued Pre-training</h4>
          <p>"Just read this." Feed raw text with no labels. Model absorbs domain knowledge through next-token prediction.</p>
          <span className="tag tag-orange" style={{ marginTop: '0.5rem' }}>Domain adaptation</span>
        </motion.div>
      </motion.div>

      <motion.div
        className="flow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <div className="flow-step">
          <div className="value" style={{ fontSize: '0.9rem' }}>Pre-train</div>
          <div className="label">General knowledge</div>
        </div>
        <span className="flow-arrow">→</span>
        <div className="flow-step" style={{ border: '1px solid var(--green)' }}>
          <div className="value" style={{ fontSize: '0.9rem', color: 'var(--green)' }}>SFT</div>
          <div className="label">Follow instructions</div>
        </div>
        <span className="flow-arrow">→</span>
        <div className="flow-step">
          <div className="value" style={{ fontSize: '0.9rem' }}>RLHF / DPO</div>
          <div className="label">Align with humans</div>
        </div>
      </motion.div>
      <div className="img-prompt">Prompt: Four distinct training approaches visualized as different sculpting methods on a marble block — chisel, sandpaper, laser, water erosion — each producing a slightly different refined shape, soft dramatic lighting, dark studio background, 16:9</div>
    </div>
  );
}
