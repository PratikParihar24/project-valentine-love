import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  rotation: number;
  delay: number;
}

interface ConfettiProps {
  trigger: boolean;
  onComplete?: () => void;
}

const COLORS = [
  'hsl(347, 77%, 62%)', // rose
  'hsl(15, 90%, 70%)', // coral
  'hsl(340, 80%, 75%)', // pink
  'hsl(30, 80%, 65%)', // orange
  'hsl(355, 100%, 85%)', // light pink
  'hsl(280, 60%, 70%)', // purple
];

export function Confetti({ trigger, onComplete }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (trigger) {
      const newPieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * 360,
        delay: Math.random() * 0.3,
      }));
      setPieces(newPieces);

      const timer = setTimeout(() => {
        setPieces([]);
        onComplete?.();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {pieces.map((piece) => (
          <motion.div
            key={piece.id}
            className="absolute w-3 h-3 rounded-sm"
            style={{
              left: `${piece.x}%`,
              top: '-20px',
              backgroundColor: piece.color,
            }}
            initial={{ y: 0, rotate: 0, opacity: 1 }}
            animate={{
              y: '100vh',
              rotate: piece.rotation + 720,
              x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2.5 + Math.random(),
              delay: piece.delay,
              ease: 'easeIn',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}