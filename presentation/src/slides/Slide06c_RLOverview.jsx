import { motion } from 'framer-motion';

const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };
const container = { hidden: {}, show: { transition: { staggerChildren: 0.15 } } };

export default function Slide06c() {
  return (
    <div className="slide">
      <div className="glow glow-blue" style={{ top: '-80px', left: '-100px' }} />
      <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        What is <span className="accent">Reinforcement Learning</span> for LLMs?
      </motion.h2>

      <motion.p
        style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '750px', textAlign: 'center', lineHeight: 1.7, marginBottom: '2rem' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Instead of showing the model <strong style={{ color: 'var(--green)' }}>correct answers</strong> (SFT),
        we let it <strong style={{ color: 'var(--blue)' }}>explore</strong>, score its attempts, and
        reinforce what works.
      </motion.p>

      <motion.div className="cards cards-2" variants={container} initial="hidden" animate="show" style={{ maxWidth: '800px' }}>
        <motion.div className="card" variants={item}>
          <span className="icon">SF</span>
          <h4>SFT Approach</h4>
          <p>"Here's exactly what to say."</p>
          <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Teacher gives the answer → student memorizes it.
          </p>
        </motion.div>
        <motion.div className="card" variants={item} style={{ border: '1px solid rgba(116, 185, 255, 0.4)' }}>
          <span className="icon">RL</span>
          <h4>RL Approach</h4>
          <p>"Try things, I'll tell you what's good."</p>
          <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Student experiments → teacher scores attempts → student improves.
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        className="flow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flow-step">
          <div className="value" style={{ fontSize: '0.9rem' }}>Generate</div>
          <div className="label">Try multiple outputs</div>
        </div>
        <span className="flow-arrow">→</span>
        <div className="flow-step">
          <div className="value" style={{ fontSize: '0.9rem' }}>Score</div>
          <div className="label">Reward function rates each</div>
        </div>
        <span className="flow-arrow">→</span>
        <div className="flow-step">
          <div className="value" style={{ fontSize: '0.9rem' }}>Compare</div>
          <div className="label">Rank within the group</div>
        </div>
        <span className="flow-arrow">→</span>
        <div className="flow-step">
          <div className="value" style={{ fontSize: '0.9rem' }}>Update</div>
          <div className="label">Reinforce the best</div>
        </div>
      </motion.div>

      <motion.div
        className="highlight-box"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
      >
        No correct answers needed — just a <strong style={{ color: 'var(--blue)' }}>reward signal</strong> that knows good from bad.
      </motion.div>

      <div className="img-prompt">Prompt: A robot in a maze trying multiple paths simultaneously, some paths glow green (rewarded), others fade to red (penalized), top-down view, neon trails on dark background, strategic exploration, 16:9</div>
    </div>
  );
}
