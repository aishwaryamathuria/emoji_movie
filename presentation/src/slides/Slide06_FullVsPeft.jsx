import { motion } from 'framer-motion';

export default function Slide06() {
  const rows = [
    { aspect: 'Parameters updated', full: 'All billions', peft: 'Tiny subset (0.1-1%)' },
    { aspect: 'Training time', full: 'Days / weeks', peft: 'Minutes / hours' },
    { aspect: 'Hardware needed', full: 'Multi-GPU clusters', peft: 'Single GPU / laptop' },
    { aspect: 'Risk of forgetting', full: 'High — catastrophic forgetting', peft: 'Low — base knowledge preserved' },
    { aspect: 'Cost', full: '$$$$$', peft: '$' },
    { aspect: 'Data required', full: 'Massive datasets', peft: '50-1000 examples' },
  ];

  return (
    <div className="slide">
      <div className="glow glow-green" style={{ top: '-100px', right: '-50px' }} />
      <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <span className="accent">Full Fine-Tuning</span> vs <span className="accent">PEFT</span>
      </motion.h2>

      <motion.table
        className="compare-table"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <thead>
          <tr>
            <th></th>
            <th style={{ color: 'var(--orange)' }}>Full Fine-Tuning</th>
            <th style={{ color: 'var(--green)' }}>PEFT</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <motion.tr
              key={row.aspect}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
            >
              <td>{row.aspect}</td>
              <td>{row.full}</td>
              <td>{row.peft}</td>
            </motion.tr>
          ))}
        </tbody>
      </motion.table>

      <motion.div
        className="highlight-box"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        PEFT = <strong style={{ color: 'var(--accent-light)' }}>Parameter-Efficient Fine-Tuning</strong> — same result, fraction of the cost.
      </motion.div>
      <div className="img-prompt">Prompt: Two contrasting scenes side by side — left: a massive industrial forge reshaping an entire steel beam with fire, right: a precise jeweler's hand delicately adjusting a single gemstone — scale vs precision, warm orange vs cool teal, 16:9</div>
    </div>
  );
}
