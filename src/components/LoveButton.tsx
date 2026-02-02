import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useState, useCallback } from 'react';
import { useLoveCounter } from '@/hooks/useLoveCounter';
import { Confetti } from './Confetti';

interface FloatingNumber {
  id: number;
  x: number;
  y: number;
}

export function LoveButton() {
  const { count, increment } = useLoveCounter();
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumber[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newFloating: FloatingNumber = {
      id: Date.now(),
      x,
      y,
    };

    setFloatingNumbers((prev) => [...prev, newFloating]);
    increment();

    // Trigger confetti every 10 clicks
    if ((count + 1) % 10 === 0) {
      setShowConfetti(true);
    }

    // Clean up floating numbers
    setTimeout(() => {
      setFloatingNumbers((prev) => prev.filter((n) => n.id !== newFloating.id));
    }, 1000);
  }, [count, increment]);

  return (
    <div className="relative flex flex-col items-center gap-8">
      <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Counter Display */}
      <motion.div
        className="glass-card rounded-3xl px-8 py-4 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-sm text-muted-foreground mb-1">Total Love Sent</p>
        <motion.p
          key={count}
          className="text-4xl font-bold text-primary tabular-nums"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {count.toLocaleString()}
        </motion.p>
      </motion.div>

      {/* Love Button */}
      <motion.button
        className="relative w-40 h-40 rounded-full bg-gradient-to-br from-primary to-rose-deep flex items-center justify-center shadow-glow cursor-pointer border-4 border-primary-foreground/20"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={isPressed ? {} : { scale: [1, 1.02, 1] }}
        transition={{
          scale: {
            repeat: Infinity,
            duration: 1.5,
            ease: 'easeInOut',
          },
        }}
        onClick={handleClick}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: 'easeInOut',
          }}
        >
          <Heart className="w-20 h-20 text-primary-foreground fill-current" />
        </motion.div>

        {/* Floating +1 numbers */}
        <AnimatePresence>
          {floatingNumbers.map((num) => (
            <motion.span
              key={num.id}
              className="absolute text-2xl font-bold text-primary-foreground pointer-events-none"
              style={{ left: num.x, top: num.y }}
              initial={{ opacity: 1, y: 0, scale: 1 }}
              animate={{ opacity: 0, y: -60, scale: 1.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              +1
            </motion.span>
          ))}
        </AnimatePresence>

        {/* Glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-primary/30"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: 'easeOut',
          }}
        />
      </motion.button>

      <motion.p
        className="text-muted-foreground text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Tap the heart to send love! 💕
      </motion.p>
    </div>
  );
}