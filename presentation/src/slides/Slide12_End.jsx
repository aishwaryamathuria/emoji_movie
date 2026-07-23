import { motion } from 'framer-motion';

const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

export default function Slide12() {
  return (
    <div className="slide slide-title">
      <div className="glow glow-purple" style={{ top: '20%', left: '30%' }} />
      <div className="glow glow-blue" style={{ bottom: '20%', right: '30%' }} />

      <motion.div
        className="end-emoji"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        🧠 → 🤖
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Thank You
      </motion.h1>

      <motion.p
        className="subtitle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Fine-tuning isn't starting over — it's teaching what you already know, differently.
      </motion.p>

      <motion.div className="tag-row" variants={container} initial="hidden" animate="show" style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
        <motion.span className="tag tag-accent" variants={item}>MLX</motion.span>
        <motion.span className="tag tag-green" variants={item}>LoRA</motion.span>
        <motion.span className="tag tag-accent" variants={item}>Gemma 3</motion.span>
        <motion.span className="tag tag-green" variants={item}>Apple Silicon</motion.span>
        <motion.span className="tag tag-accent" variants={item}>PEFT</motion.span>
      </motion.div>

      <motion.div
        style={{ marginTop: '3rem', color: 'var(--text-secondary)', fontSize: '1rem' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Questions?
      </motion.div>
      <div className="img-prompt">Prompt: A human brain gracefully morphing into a glowing AI chip, connected by streams of light, floating in a serene dark cosmos with subtle stars, sense of transformation and possibility, cinematic, purple and gold accents, 16:9</div>
    </div>
  );
}
