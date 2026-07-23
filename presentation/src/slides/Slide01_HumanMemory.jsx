import { motion } from 'framer-motion';

const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };
const container = { hidden: {}, show: { transition: { staggerChildren: 0.15 } } };

export default function Slide01() {
  return (
    <div className="slide">
      <div className="glow glow-purple" style={{ top: '-100px', right: '-100px' }} />
      <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        How Humans <span className="accent">Store & Process</span> Memories
      </motion.h2>

      <motion.div className="cards cards-3" variants={container} initial="hidden" animate="show">
        <motion.div className="card" variants={item}>
          <span className="icon">👁️</span>
          <h4>Sensory Input</h4>
          <p>Eyes, ears, touch — raw signals flood in. Most are discarded in milliseconds.</p>
        </motion.div>
        <motion.div className="card" variants={item}>
          <span className="icon">🧠</span>
          <h4>Short-Term Memory</h4>
          <p>The hippocampus holds ~7 items for 20-30 seconds. A scratchpad, not storage.</p>
        </motion.div>
        <motion.div className="card" variants={item}>
          <span className="icon">💾</span>
          <h4>Long-Term Memory</h4>
          <p>Through repetition and meaning, neural pathways strengthen. Connections become permanent.</p>
        </motion.div>
      </motion.div>

      <motion.div className="flow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        <div className="flow-step">
          <div className="value">Encode</div>
          <div className="label">Experience it</div>
        </div>
        <span className="flow-arrow">→</span>
        <div className="flow-step">
          <div className="value">Store</div>
          <div className="label">Wire it</div>
        </div>
        <span className="flow-arrow">→</span>
        <div className="flow-step">
          <div className="value">Retrieve</div>
          <div className="label">Recall it</div>
        </div>
      </motion.div>
      <div className="img-prompt">Prompt: A luminous cross-section of a human brain with glowing neural pathways lighting up in sequence, soft purple and blue bioluminescence, dark background, cinematic, ultra detailed, 16:9</div>
    </div>
  );
}
