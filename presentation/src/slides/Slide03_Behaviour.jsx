import { motion } from 'framer-motion';

const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };
const container = { hidden: {}, show: { transition: { staggerChildren: 0.15 } } };

export default function Slide03() {
  return (
    <div className="slide">
      <div className="glow glow-green" style={{ top: '50%', right: '-150px' }} />
      <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        Memory Shapes <span className="accent">Behaviour</span>
      </motion.h2>

      <motion.ul className="point-list" variants={container} initial="hidden" animate="show">
        <motion.li variants={item}>
          <strong>Perception is filtered.</strong> <span className="dim">— Past experiences become the lens through which you see the world.</span>
        </motion.li>
        <motion.li variants={item}>
          <strong>Reactions become automatic.</strong> <span className="dim">— Touch a hot stove once → you flinch forever. No conscious thought needed.</span>
        </motion.li>
        <motion.li variants={item}>
          <strong>Expertise emerges.</strong> <span className="dim">— A chess grandmaster doesn't calculate every move — they recognize patterns from thousands of games stored in memory.</span>
        </motion.li>
        <motion.li variants={item}>
          <strong>Bias is learned memory.</strong> <span className="dim">— Your brain generalizes from past data, for better or worse.</span>
        </motion.li>
      </motion.ul>

      <motion.div
        className="highlight-box"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        We don't respond to reality — we respond to our <strong style={{ color: 'var(--accent-light)' }}>memory</strong> of reality.
      </motion.div>
      <div className="img-prompt">Prompt: Abstract silhouette of a human head with translucent layers of memories floating inside like holograms — a bicycle, a flame, a chess board — soft teal and indigo glow, minimal, dark background, 16:9</div>
    </div>
  );
}
