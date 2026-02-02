import { motion } from 'framer-motion';
import { useState } from 'react';
import { NavigationMenu } from '@/components/NavigationMenu';
import { PageHeader } from '@/components/PageHeader';
import { Heart } from 'lucide-react';

interface AccessoryState {
  hat: boolean;
  glasses: boolean;
  bowtie: boolean;
  blush: boolean;
  crown: boolean;
}

const ACCESSORIES = [
  { key: 'hat' as const, label: 'Hat', emoji: '🎩' },
  { key: 'glasses' as const, label: 'Glasses', emoji: '🕶️' },
  { key: 'bowtie' as const, label: 'Bowtie', emoji: '🎀' },
  { key: 'blush' as const, label: 'Blush', emoji: '😊' },
  { key: 'crown' as const, label: 'Crown', emoji: '👑' },
];

const BuildABuddy = () => {
  const [accessories, setAccessories] = useState<AccessoryState>({
    hat: false,
    glasses: false,
    bowtie: false,
    blush: false,
    crown: false,
  });

  const toggleAccessory = (key: keyof AccessoryState) => {
    setAccessories(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-rose-light/30 to-background relative overflow-hidden">
      <NavigationMenu />
      <PageHeader
        title="Build-a-Buddy"
        subtitle="Teddy Day • Feb 10"
        icon={<Heart className="w-5 h-5 text-primary" />}
      />

      <main className="pt-24 pb-8 px-4 flex flex-col items-center">
        {/* Bear Display */}
        <motion.div
          className="relative w-64 h-72 mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {/* Crown */}
          {accessories.crown && (
            <motion.div
              className="absolute -top-4 left-1/2 -translate-x-1/2 text-5xl z-10"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              👑
            </motion.div>
          )}

          {/* Hat */}
          {accessories.hat && !accessories.crown && (
            <motion.div
              className="absolute -top-2 left-1/2 -translate-x-1/2 text-5xl z-10"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              🎩
            </motion.div>
          )}

          {/* Bear Base */}
          <div className="text-[12rem] leading-none text-center select-none">
            🧸
          </div>

          {/* Glasses */}
          {accessories.glasses && (
            <motion.div
              className="absolute top-[85px] left-1/2 -translate-x-1/2 text-4xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              🕶️
            </motion.div>
          )}

          {/* Blush */}
          {accessories.blush && (
            <>
              <motion.div
                className="absolute top-[115px] left-[60px] w-6 h-4 rounded-full bg-pink-300/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
              <motion.div
                className="absolute top-[115px] right-[60px] w-6 h-4 rounded-full bg-pink-300/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            </>
          )}

          {/* Bowtie */}
          {accessories.bowtie && (
            <motion.div
              className="absolute top-[170px] left-1/2 -translate-x-1/2 text-3xl"
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
            >
              🎀
            </motion.div>
          )}
        </motion.div>

        {/* Accessory Toggles */}
        <motion.div
          className="glass-card rounded-3xl p-6 w-full max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="font-serif text-lg font-semibold text-foreground mb-4 text-center">
            Customize Your Buddy
          </h3>
          
          <div className="grid grid-cols-3 gap-3">
            {ACCESSORIES.map((acc) => (
              <motion.button
                key={acc.key}
                className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all ${
                  accessories[acc.key]
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary hover:bg-secondary/80 text-foreground'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleAccessory(acc.key)}
              >
                <span className="text-2xl">{acc.emoji}</span>
                <span className="text-xs font-medium">{acc.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.p
          className="text-muted-foreground text-sm mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Your perfect cuddle buddy awaits! 🧸💕
        </motion.p>
      </main>
    </div>
  );
};

export default BuildABuddy;