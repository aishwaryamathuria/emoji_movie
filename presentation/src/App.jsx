import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './App.css';

import Slide06 from './slides/Slide06_FullVsPeft';
import Slide06a from './slides/Slide06a_FineTuningTypes';
import Slide06b from './slides/Slide06b_WhySFT';
import Slide06c from './slides/Slide06c_RLOverview';
import Slide06d from './slides/Slide06d_RLLoop';
import Slide07 from './slides/Slide07_PeftMethods';
import Slide08 from './slides/Slide08_WhatIsLoRA';
import Slide09 from './slides/Slide09_LoRADeep';
import Slide10 from './slides/Slide10_Demo';
import Slide10a from './slides/Slide10a_RLSteps';
import Slide11 from './slides/Slide11_PeftVsRag';
import Slide12 from './slides/Slide12_End';

const slides = [
  Slide06, Slide07, Slide08, Slide09, Slide06a, Slide06b, Slide06c, Slide10, Slide10a, Slide06d,
  Slide11, Slide12,
];

const variants = {
  enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
};

function App() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const navigate = useCallback((dir) => {
    setDirection(dir);
    setCurrent((prev) => {
      const next = prev + dir;
      if (next < 0) return 0;
      if (next >= slides.length) return slides.length - 1;
      return next;
    });
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        navigate(1);
      } else if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
        e.preventDefault();
        navigate(-1);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [navigate]);

  const CurrentSlide = slides[current];
  const progress = ((current + 1) / slides.length) * 100;

  return (
    <div className="presentation">
      <div className="progress-bar" style={{ width: `${progress}%` }} />

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <CurrentSlide />
        </motion.div>
      </AnimatePresence>

      <div className="slide-number">{current + 1} / {slides.length}</div>
      <div className="nav-hint">← → to navigate</div>
    </div>
  );
}

export default App;
