import { motion } from 'framer-motion';

const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };

export default function Slide10() {
  return (
    <div className="slide">
      <div className="glow glow-purple" style={{ top: '30%', right: '-100px' }} />
      <div className="glow glow-green" style={{ bottom: '-50px', left: '-100px' }} />

      <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <span className="accent">Live Demo</span>
      </motion.h2>

      <motion.p
        style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2rem', textAlign: 'center' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Emoji Movie Plot Generator — fine-tuned with LoRA on MLX
      </motion.p>

      <motion.div className="cards cards-3" variants={container} initial="hidden" animate="show" style={{ marginBottom: '2rem' }}>
        <motion.div className="card" variants={item} style={{ textAlign: 'center' }}>
          <span className="icon">Dt</span>
          <h4>386 Examples</h4>
          <p>Movie → emoji pairs</p>
        </motion.div>
        <motion.div className="card" variants={item} style={{ textAlign: 'center' }}>
          <span className="icon">Tm</span>
          <h4>~10 Minutes</h4>
          <p>Training on M-series Mac</p>
        </motion.div>
        <motion.div className="card" variants={item} style={{ textAlign: 'center' }}>
          <span className="icon">Gm</span>
          <h4>Gemma 3 4B</h4>
          <p>4-bit quantized, LoRA rank 8</p>
        </motion.div>
      </motion.div>

      <motion.div
        className="demo-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="terminal">
          <div><span className="prompt">$ </span><span className="cmd">python -m mlx_lm chat --model ./gemma-model</span></div>
          <div style={{ color: '#666', marginTop: '0.5rem' }}>Base model — verbose, adds text</div>
          <br />
          <div><span className="prompt">$ </span><span className="cmd">python -m mlx_lm chat --model ./gemma-model --adapter-path ./adapters</span></div>
          <div style={{ color: '#666', marginTop: '0.5rem' }}>Fine-tuned — clean emojis only</div>
          <br />
          <div><span className="prompt">$ </span><span className="cmd">python server.py</span></div>
          <div style={{ color: '#666', marginTop: '0.5rem' }}>Web game + side-by-side comparison</div>
        </div>
      </motion.div>

      <motion.div
        style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1.5rem' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <span className="tag tag-green">localhost:8000</span>
        <span className="tag tag-accent">localhost:8000/compare</span>
      </motion.div>
      <div className="img-prompt">Prompt: A MacBook on a dark desk with its screen glowing, showing emoji characters floating out of the screen like magic particles, movie film reels scattered around, warm ambient lighting, shallow depth of field, 16:9</div>
    </div>
  );
}
