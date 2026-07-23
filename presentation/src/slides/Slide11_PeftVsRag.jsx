import { motion } from 'framer-motion';

export default function Slide11() {
  const rows = [
    { aspect: 'Solves', peft: 'Wrong behaviour / format', rag: 'Missing knowledge' },
    { aspect: 'Analogy', peft: 'Teaching someone how to talk', rag: 'Giving someone a reference book' },
    { aspect: 'Latency', peft: 'Same as base model', rag: 'Extra retrieval step' },
    { aspect: 'Data needed', peft: '50-1000 examples', rag: 'A document corpus' },
    { aspect: 'When to use', peft: 'Style, tone, format, domain', rag: 'Private docs, real-time data' },
    { aspect: 'Our emoji demo', peft: '✅ Model knew plots, needed format', rag: '❌ Nothing to retrieve' },
  ];

  return (
    <div className="slide">
      <div className="glow glow-blue" style={{ bottom: '-100px', right: '-100px' }} />
      <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        Why <span className="accent">Fine-Tuning</span> and Not <span className="accent">RAG</span>?
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
            <th style={{ color: 'var(--green)' }}>Fine-Tuning (PEFT)</th>
            <th style={{ color: 'var(--blue)' }}>RAG</th>
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
              <td>{row.peft}</td>
              <td>{row.rag}</td>
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
        RAG fixes <strong style={{ color: 'var(--blue)' }}>"doesn't know"</strong>. Fine-tuning fixes <strong style={{ color: 'var(--green)' }}>"knows but won't say it right"</strong>.
      </motion.div>
      <div className="img-prompt">Prompt: Two contrasting scenes — left: a brain being rewired with tiny glowing threads (fine-tuning), right: a robot reading through a stack of books with a magnifying glass (RAG) — split composition, purple vs blue tones, dark background, 16:9</div>
    </div>
  );
}
