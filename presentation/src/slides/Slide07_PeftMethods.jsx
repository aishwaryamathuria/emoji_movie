import { motion } from 'framer-motion';

const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };
const container = { hidden: {}, show: { transition: { staggerChildren: 0.15 } } };

export default function Slide07() {
  return (
    <div className="slide">
      <div className="glow glow-purple" style={{ bottom: '-100px', right: '-100px' }} />
      <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        Why PEFT? And <span className="accent">What Methods</span> Exist?
      </motion.h2>

      <motion.div className="cards cards-3" variants={container} initial="hidden" animate="show" style={{ maxWidth: '1000px' }}>
        <motion.div className="card" variants={item}>
          <span className="icon">Ad</span>
          <h4>Adapters</h4>
          <p>Insert small trainable modules between frozen layers. Original weights untouched.</p>
          <span className="tag tag-accent" style={{ marginTop: '0.5rem' }}>Houlsby et al., 2019</span>
        </motion.div>
        <motion.div className="card" variants={item}>
          <span className="icon">Pt</span>
          <h4>Prompt Tuning</h4>
          <p>Learn soft prompt embeddings prepended to input. Model weights completely frozen.</p>
          <span className="tag tag-accent" style={{ marginTop: '0.5rem' }}>Lester et al., 2021</span>
        </motion.div>
        <motion.div className="card" variants={item}>
          <span className="icon">Px</span>
          <h4>Prefix Tuning</h4>
          <p>Learn continuous prefix vectors for each transformer layer. Like prompt tuning, but deeper.</p>
          <span className="tag tag-accent" style={{ marginTop: '0.5rem' }}>Li & Liang, 2021</span>
        </motion.div>
        <motion.div className="card" variants={item} style={{ border: '1px solid rgba(108, 92, 231, 0.4)' }}>
          <span className="icon">Lo</span>
          <h4>LoRA</h4>
          <p>Decompose weight updates into low-rank matrices. Most popular. Best efficiency-to-quality ratio.</p>
          <span className="tag tag-green" style={{ marginTop: '0.5rem' }}>Hu et al., 2021 — our choice</span>
        </motion.div>
        <motion.div className="card" variants={item}>
          <span className="icon">QL</span>
          <h4>QLoRA</h4>
          <p>LoRA on a quantized (4-bit) model. Same quality, fits on laptops. Exactly what we're doing in this demo.</p>
          <span className="tag tag-green" style={{ marginTop: '0.5rem' }}>Dettmers et al., 2023</span>
        </motion.div>
        <motion.div className="card" variants={item}>
          <span className="icon">Do</span>
          <h4>DoRA</h4>
          <p>Splits weights into magnitude + direction, applies LoRA to direction only. Often slightly better than LoRA.</p>
          <span className="tag tag-accent" style={{ marginTop: '0.5rem' }}>Liu et al., 2024</span>
        </motion.div>
      </motion.div>
      <div className="img-prompt">Prompt: Six glowing tools floating in a dark void — a plug adapter, a pencil, an ice cube, a star-shaped key, a compression clamp, and a compass — each radiating a different subtle color, arranged in a grid, minimal futuristic style, 16:9</div>
    </div>
  );
}
