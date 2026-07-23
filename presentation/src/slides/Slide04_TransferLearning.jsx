import { motion } from 'framer-motion';

const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };
const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };

export default function Slide04() {
  return (
    <div className="slide">
      <div className="glow glow-purple" style={{ bottom: '-80px', left: '30%' }} />
      <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        Learning is <span className="accent">Not Starting Over</span>
      </motion.h2>

      <motion.div className="cards cards-2" variants={container} initial="hidden" animate="show" style={{ maxWidth: '800px' }}>
        <motion.div className="card" variants={item}>
          <span className="icon">🚲</span>
          <h4>Learn to ride a bicycle</h4>
          <p>Balance, steering, pedaling, braking — you build these neural pathways from scratch.</p>
        </motion.div>
        <motion.div className="card" variants={item}>
          <span className="icon">🛵</span>
          <h4>Then ride a scooter</h4>
          <p>Balance? Already learned. Steering? Same concept. You only learn the new parts — throttle and gears.</p>
        </motion.div>
        <motion.div className="card" variants={item}>
          <span className="icon">🎸</span>
          <h4>Learn guitar</h4>
          <p>Chord shapes, strumming patterns, rhythm — months of practice wired into your fingers.</p>
        </motion.div>
        <motion.div className="card" variants={item}>
          <span className="icon">🎸</span>
          <h4>Then learn ukulele</h4>
          <p>Your fingers already know fretboards. You adapt — not restart. Days, not months.</p>
        </motion.div>
      </motion.div>

      <motion.div
        className="highlight-box"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9 }}
      >
        The brain doesn't wipe and reinstall — it <strong style={{ color: 'var(--accent-light)' }}>extends existing pathways</strong> with new connections.
      </motion.div>
      <div className="img-prompt">Prompt: A glowing neural pathway branching into two roads — one leading to a bicycle, the other to a scooter — shared roots illuminated in purple, diverging paths in green and blue, dark minimalist background, 16:9</div>
    </div>
  );
}
