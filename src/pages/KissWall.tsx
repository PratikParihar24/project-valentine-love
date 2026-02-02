import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback } from 'react';
import { NavigationMenu } from '@/components/NavigationMenu';
import { PageHeader } from '@/components/PageHeader';
import { Sparkles } from 'lucide-react';

interface KissMark {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
}

const KISS_COLORS = [
  'hsl(347, 77%, 62%)', // rose
  'hsl(340, 82%, 52%)', // pink
  'hsl(0, 78%, 62%)', // red
  'hsl(350, 70%, 55%)', // crimson
  'hsl(330, 75%, 60%)', // magenta
];

const KissWall = () => {
  const [kisses, setKisses] = useState<KissMark[]>([]);

  const handleTap = useCallback((e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    let x: number, y: number;

    if ('touches' in e) {
      const touch = e.touches[0];
      const rect = e.currentTarget.getBoundingClientRect();
      x = touch.clientX - rect.left;
      y = touch.clientY - rect.top;
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    const newKiss: KissMark = {
      id: Date.now() + Math.random(),
      x,
      y,
      rotation: Math.random() * 40 - 20,
      scale: 0.8 + Math.random() * 0.4,
      color: KISS_COLORS[Math.floor(Math.random() * KISS_COLORS.length)],
    };

    setKisses(prev => [...prev, newKiss]);
  }, []);

  // Simulate gravity - kisses fall slowly
  const [fallingKisses, setFallingKisses] = useState<KissMark[]>([]);

  const handleKissFall = useCallback((kiss: KissMark) => {
    // Move to falling array with new position
    setKisses(prev => prev.filter(k => k.id !== kiss.id));
    
    const bottomY = window.innerHeight - 100 - Math.random() * 50;
    const fallenKiss = {
      ...kiss,
      y: bottomY,
      x: kiss.x + (Math.random() * 40 - 20),
    };
    
    setFallingKisses(prev => [...prev.slice(-30), fallenKiss]);
  }, []);

  const clearKisses = () => {
    setKisses([]);
    setFallingKisses([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-rose-light/30 to-background relative overflow-hidden">
      <NavigationMenu />
      <PageHeader
        title="The Kiss Wall"
        subtitle="Kiss Day • Feb 13"
        icon={<Sparkles className="w-5 h-5 text-primary" />}
      />

      {/* Canvas */}
      <div
        className="fixed inset-0 pt-20 cursor-crosshair"
        onClick={handleTap}
        onTouchStart={handleTap}
      >
        {/* Fallen Kisses at bottom */}
        <AnimatePresence>
          {fallingKisses.map((kiss) => (
            <motion.div
              key={`fallen-${kiss.id}`}
              className="absolute pointer-events-none select-none"
              style={{
                left: kiss.x,
                top: kiss.y,
                transform: 'translate(-50%, -50%)',
                color: kiss.color,
              }}
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 0.6 }}
            >
              <span 
                className="text-3xl" 
                style={{ 
                  transform: `scale(${kiss.scale}) rotate(${kiss.rotation}deg)`,
                  display: 'inline-block',
                }}
              >
                💋
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Active Kisses */}
        <AnimatePresence>
          {kisses.map((kiss) => (
            <motion.div
              key={kiss.id}
              className="absolute pointer-events-none select-none"
              style={{
                left: kiss.x,
                transform: 'translate(-50%, -50%)',
                color: kiss.color,
              }}
              initial={{ 
                y: kiss.y, 
                scale: 0, 
                opacity: 0,
                rotate: kiss.rotation - 20,
              }}
              animate={{ 
                y: kiss.y + 100,
                scale: kiss.scale, 
                opacity: 1,
                rotate: kiss.rotation,
              }}
              transition={{
                type: 'spring',
                stiffness: 100,
                damping: 10,
              }}
              onAnimationComplete={() => handleKissFall(kiss)}
            >
              <span 
                className="text-4xl drop-shadow-lg"
                style={{ display: 'inline-block' }}
              >
                💋
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Instructions */}
        {kisses.length === 0 && fallingKisses.length === 0 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="glass-card rounded-3xl px-8 py-6 text-center max-w-xs mx-4">
              <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="font-serif text-xl font-semibold text-foreground mb-2">
                Tap to Kiss
              </h2>
              <p className="text-muted-foreground text-sm">
                Watch them fall and pile up at the bottom! 💋
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Counter & Clear */}
      <motion.div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="glass-card rounded-full px-6 py-3 flex items-center gap-3">
          <span className="text-2xl">💋</span>
          <span className="font-semibold text-foreground">{kisses.length + fallingKisses.length}</span>
          <span className="text-muted-foreground text-sm">kisses</span>
        </div>

        {(kisses.length > 0 || fallingKisses.length > 0) && (
          <motion.button
            className="glass-card rounded-full px-4 py-3 text-muted-foreground hover:text-foreground transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              clearKisses();
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            Clear
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

export default KissWall;