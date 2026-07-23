import { motion } from 'framer-motion';

const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };
const container = { hidden: {}, show: { transition: { staggerChildren: 0.15 } } };

export default function Slide08() {
  return (
    <div className="slide">
      <div className="glow glow-blue" style={{ top: '50%', left: '-100px' }} />
      <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        What is <span className="accent">LoRA</span>?
      </motion.h2>

      <motion.p
        style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '700px', textAlign: 'center', lineHeight: 1.7, marginBottom: '2rem' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <strong style={{ color: 'var(--text-primary)' }}>Low-Rank Adaptation</strong> — instead of updating all 4 billion parameters,
        LoRA freezes the original weights and trains two tiny matrices that capture the change.
      </motion.p>

      <motion.div className="cards cards-3" variants={container} initial="hidden" animate="show">
        <motion.div className="card" variants={item}>
          <span className="icon">Fr</span>
          <h4>Freeze Original</h4>
          <p>All pre-trained weights stay locked. No risk of forgetting what the model already knows.</p>
        </motion.div>
        <motion.div className="card" variants={item}>
          <span className="icon">Lo</span>
          <h4>Add Small Matrices</h4>
          <p>Two low-rank matrices (A and B) are inserted alongside the frozen weights. Only these are trained.</p>
        </motion.div>
        <motion.div className="card" variants={item}>
          <span className="icon">Mg</span>
          <h4>Merge at Inference</h4>
          <p>At runtime, the adapter output is added to the original. Same speed, new behaviour.</p>
        </motion.div>
      </motion.div>

      <motion.div
        className="highlight-box"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        4B params frozen + <strong style={{ color: 'var(--green)' }}>~4M trained</strong> = 0.1% of the model, 100% of the behaviour change.
      </motion.div>
      <div className="img-prompt">Prompt: A massive frozen glacier (representing frozen weights) with a thin glowing stream of water carving a new precise path through it, the stream radiates green light while the glacier is deep blue and translucent, aerial perspective, 16:9</div>
    </div>
  );
}
