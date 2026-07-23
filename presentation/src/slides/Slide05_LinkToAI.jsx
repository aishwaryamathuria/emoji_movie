import { motion } from 'framer-motion';

const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };
const container = { hidden: {}, show: { transition: { staggerChildren: 0.15 } } };

export default function Slide05() {
  return (
    <div className="slide">
      <div className="glow glow-blue" style={{ top: '-50px', left: '-100px' }} />
      <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        The Same Pattern in <span className="accent">AI</span>
      </motion.h2>

      <motion.div className="two-col" variants={container} initial="hidden" animate="show">
        <motion.div className="col" variants={item}>
          <h3>Human Brain</h3>
          <ul>
            <li><strong>Neurons & synapses</strong> form connections</li>
            <li><strong>Learning</strong> strengthens pathways</li>
            <li><strong>Experience</strong> shapes behaviour</li>
            <li><strong>Transfer learning</strong> — bike → scooter</li>
            <li><strong>Specialization</strong> through practice</li>
          </ul>
        </motion.div>
        <motion.div className="col" variants={item}>
          <h3>Neural Network</h3>
          <ul>
            <li><strong>Parameters & weights</strong> form connections</li>
            <li><strong>Training</strong> adjusts weights</li>
            <li><strong>Data</strong> shapes output</li>
            <li><strong>Fine-tuning</strong> — base model → specialist</li>
            <li><strong>Domain adaptation</strong> through examples</li>
          </ul>
        </motion.div>
      </motion.div>

      <motion.div
        className="highlight-box"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Pre-trained model = a brain that went to school.<br />
        Fine-tuning = teaching it <strong style={{ color: 'var(--accent-light)' }}>your specific job</strong>.
      </motion.div>
      <div className="img-prompt">Prompt: Split composition — left side shows a biological brain with organic neural networks, right side shows a digital brain made of circuit traces and glowing nodes, merging seamlessly in the center, purple and cyan palette, dark background, 16:9</div>
    </div>
  );
}
