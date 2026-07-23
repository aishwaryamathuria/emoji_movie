import { motion } from 'framer-motion';

const item = { hidden: { opacity: 0, x: -40 }, show: { opacity: 1, x: 0 } };
const container = { hidden: {}, show: { transition: { staggerChildren: 0.2 } } };

export default function Slide02() {
  return (
    <div className="slide">
      <div className="glow glow-blue" style={{ bottom: '-100px', left: '-100px' }} />
      <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        What <span className="accent">Strengthens</span> Neural Connections?
      </motion.h2>

      <motion.div className="cards cards-3" variants={container} initial="hidden" animate="show">
        <motion.div className="card" variants={item}>
          <span className="icon">✨</span>
          <h4>Novelty</h4>
          <p>The brain prioritizes new, unexpected experiences. Dopamine spikes tag them as "worth remembering."</p>
        </motion.div>
        <motion.div className="card" variants={item}>
          <span className="icon">💛</span>
          <h4>Emotion</h4>
          <p>The amygdala amplifies emotional moments. You remember your wedding day, not last Tuesday's lunch.</p>
        </motion.div>
        <motion.div className="card" variants={item}>
          <span className="icon">🔄</span>
          <h4>Repetition & Recall</h4>
          <p>Each recall strengthens the synapse. Practice doesn't make perfect — it makes permanent.</p>
        </motion.div>
      </motion.div>

      <motion.div
        className="highlight-box"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        "Neurons that fire together, wire together" — Donald Hebb
      </motion.div>
      <div className="img-prompt">Prompt: Microscopic view of synapses firing between neurons, golden electric sparks jumping across gaps, warm amber and deep violet tones, bokeh background, scientific illustration style, 16:9</div>
    </div>
  );
}
