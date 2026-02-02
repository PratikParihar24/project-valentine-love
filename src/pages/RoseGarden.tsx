import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback } from 'react';
import { NavigationMenu } from '@/components/NavigationMenu';
import { PageHeader } from '@/components/PageHeader';
import { Flower2 } from 'lucide-react';

interface Flower {
  id: number;
  x: number;
  y: number;
  type: number;
  rotation: number;
  scale: number;
}

const FLOWER_EMOJIS = ['🌹', '🌷', '🌸', '💐', '🌺', '🌻', '🌼', '💮'];

const RoseGarden = () => {
  const [flowers, setFlowers] = useState<Flower[]>([]);

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

    const newFlower: Flower = {
      id: Date.now() + Math.random(),
      x,
      y,
      type: Math.floor(Math.random() * FLOWER_EMOJIS.length),
      rotation: Math.random() * 40 - 20,
      scale: 0.8 + Math.random() * 0.6,
    };

    setFlowers((prev) => [...prev, newFlower]);
  }, []);

  const clearGarden = () => {
    setFlowers([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-green-50/30 to-background relative overflow-hidden">
      <NavigationMenu />
      <PageHeader
        title="The Infinite Garden"
        subtitle="Rose Day • Feb 7"
        icon={<Flower2 className="w-5 h-5 text-primary" />}
      />

      {/* Canvas */}
      <div
        className="fixed inset-0 pt-20 cursor-crosshair"
        onClick={handleTap}
        onTouchStart={handleTap}
      >
        {/* Ground gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-100/50 to-transparent pointer-events-none" />

        {/* Flowers */}
        <AnimatePresence>
          {flowers.map((flower) => (
            <motion.div
              key={flower.id}
              className="absolute pointer-events-none select-none"
              style={{
                left: flower.x,
                top: flower.y,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ scale: 0, opacity: 0, rotate: flower.rotation - 20 }}
              animate={{
                scale: flower.scale,
                opacity: 1,
                rotate: flower.rotation,
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 15,
              }}
            >
              <span className="text-4xl sm:text-5xl drop-shadow-lg">
                {FLOWER_EMOJIS[flower.type]}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Instructions */}
        {flowers.length === 0 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="glass-card rounded-3xl px-8 py-6 text-center max-w-xs mx-4">
              <Flower2 className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="font-serif text-xl font-semibold text-foreground mb-2">
                Tap Anywhere
              </h2>
              <p className="text-muted-foreground text-sm">
                Plant flowers and grow an infinite garden of love 🌸
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
          <span className="text-2xl">🌹</span>
          <span className="font-semibold text-foreground">{flowers.length}</span>
          <span className="text-muted-foreground text-sm">flowers planted</span>
        </div>

        {flowers.length > 0 && (
          <motion.button
            className="glass-card rounded-full px-4 py-3 text-muted-foreground hover:text-foreground transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              clearGarden();
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

export default RoseGarden;