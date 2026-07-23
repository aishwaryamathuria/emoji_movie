import { motion } from 'framer-motion';

const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };
const container = { hidden: {}, show: { transition: { staggerChildren: 0.15 } } };

export default function Slide06b() {
  return (
    <div className="slide">
      <div className="glow glow-green" style={{ bottom: '-100px', left: '-80px' }} />
      <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        SFT Fine-Tuning: <span className="accent">Why & Why Not</span>
      </motion.h2>

      <motion.div className="two-col" variants={container} initial="hidden" animate="show">
        <motion.div className="col" variants={item}>
          <h3 style={{ color: 'var(--green)' }}>Why SFT</h3>
          <ul>
            <li><strong>Exact format control</strong> — you define the output precisely</li>
            <li><strong>Low data requirement</strong> — 50–400 examples is enough</li>
            <li><strong>Fast iteration</strong> — change data, retrain, test in minutes</li>
            <li><strong>Simple pipeline</strong> — just input/output pairs, no reward model</li>
            <li><strong>Teaches behavior</strong> — model already has knowledge, SFT rewires how it responds</li>
            <li><strong>Works on small models</strong> — a fine-tuned 4B can match a prompted 70B for narrow tasks</li>
          </ul>
        </motion.div>
        <motion.div className="col" variants={item}>
          <h3 style={{ color: 'var(--orange)' }}>Why Not SFT</h3>
          <ul>
            <li><strong>Memorization risk</strong> — model copies training data rather than learning patterns</li>
            <li><strong>No quality signal</strong> — treats all examples as equally good</li>
            <li><strong>Creative tasks</strong> — no single "right" answer to learn from</li>
            <li><strong>Preference/ranking</strong> — can't express "A is better than B"</li>
            <li><strong>Safety alignment</strong> — RLHF/DPO handle nuance and edge cases better</li>
            <li><strong>Catastrophic forgetting</strong> — too much training degrades general knowledge</li>
          </ul>
        </motion.div>
      </motion.div>

      <motion.div
        className="highlight-box"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        SFT is the <strong style={{ color: 'var(--green)' }}>starting point</strong> for most fine-tuning — simple, fast, effective. When you need more nuance, layer RL on top.
      </motion.div>
      <div className="img-prompt">Prompt: A split road diverging — left side is a clean straight highway (labeled "structured"), right side is a winding creative path (labeled "open-ended") — glowing signposts, dark moody background, green and orange accent lighting, 16:9</div>
    </div>
  );
}
