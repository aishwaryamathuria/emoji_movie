import { motion } from 'framer-motion';

export default function Slide09() {
  return (
    <div className="slide">
      <div className="glow glow-green" style={{ top: '-100px', left: '40%' }} />
      <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        LoRA <span className="accent">Behind the Scenes</span>
      </motion.h2>

      <motion.div
        className="matrix-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div className="matrix large">
          <div className="dim">W</div>
          <div className="label">4096 x 4096</div>
          <div className="label" style={{ color: 'var(--orange)', marginTop: '0.3rem' }}>FROZEN</div>
        </div>
        <span className="operator">+</span>
        <div className="matrix small" style={{ borderColor: 'var(--blue)' }}>
          <div className="dim">A</div>
          <div className="label">4096 x 8</div>
        </div>
        <span className="operator">×</span>
        <div className="matrix small" style={{ borderColor: 'var(--pink)' }}>
          <div className="dim">B</div>
          <div className="label">8 x 4096</div>
        </div>
        <span className="operator">=</span>
        <div className="matrix" style={{ borderColor: 'var(--green)' }}>
          <div className="dim">W'</div>
          <div className="label">Updated output</div>
        </div>
      </motion.div>

      <motion.div
        style={{ maxWidth: '800px', width: '100%', marginTop: '2rem' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="code-block">
          <span className="comment"># Original: W has 16M parameters (4096 × 4096)</span><br />
          <span className="comment"># LoRA: A has 32K + B has 32K = 64K parameters</span><br />
          <span className="comment"># That's 0.4% of the original!</span><br /><br />
          <span className="keyword">output</span> = <span className="fn">W</span>(x) + <span className="fn">B</span>(<span className="fn">A</span>(x)) × <span className="number">scale</span><br /><br />
          <span className="comment"># rank = 8 → the "low-rank" in LoRA</span><br />
          <span className="comment"># Higher rank = more capacity = more params</span><br />
          <span className="comment"># Lower rank = faster training = less memory</span>
        </div>
      </motion.div>

      <motion.div
        className="flow"
        style={{ marginTop: '1.5rem' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="flow-step">
          <div className="value" style={{ fontSize: '0.95rem' }}>16,777,216</div>
          <div className="label">Original params per layer</div>
        </div>
        <span className="flow-arrow">→</span>
        <div className="flow-step" style={{ borderColor: 'var(--green)', border: '1px solid var(--green)' }}>
          <div className="value" style={{ color: 'var(--green)', fontSize: '0.95rem' }}>65,536</div>
          <div className="label">LoRA params (rank 8)</div>
        </div>
        <span className="flow-arrow">→</span>
        <div className="flow-step">
          <div className="value" style={{ color: 'var(--accent-light)', fontSize: '0.95rem' }}>250× less</div>
          <div className="label">Reduction</div>
        </div>
      </motion.div>
      <div className="img-prompt">Prompt: A large translucent matrix grid fading into the background, with two small vibrant glowing matrices in the foreground multiplying together, mathematical symbols floating in space, neon purple and green on black, cyberpunk aesthetic, 16:9</div>
    </div>
  );
}
