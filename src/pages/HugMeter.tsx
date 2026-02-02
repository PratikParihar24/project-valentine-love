import { motion } from 'framer-motion';
import { useState } from 'react';
import { NavigationMenu } from '@/components/NavigationMenu';
import { PageHeader } from '@/components/PageHeader';
import { Users, Heart } from 'lucide-react';
import { Confetti } from '@/components/Confetti';

const HugMeter = () => {
  const [value, setValue] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasReachedMax, setHasReachedMax] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    setValue(newValue);

    if (newValue === 100 && !hasReachedMax) {
      setHasReachedMax(true);
      setShowConfetti(true);
    }
  };

  // Calculate positions
  const leftPos = 50 - (value / 100) * 35;
  const rightPos = 50 + (value / 100) * 35;

  return (
    <div 
      className={`min-h-screen bg-gradient-to-b from-background via-rose-light/30 to-background relative overflow-hidden transition-transform duration-100 ${
        value === 100 ? 'animate-shake' : ''
      }`}
    >
      <NavigationMenu />
      <PageHeader
        title="Hug Meter"
        subtitle="Hug Day • Feb 12"
        icon={<Users className="w-5 h-5 text-primary" />}
      />

      <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />

      <main className="pt-24 pb-8 px-4 flex flex-col items-center justify-center min-h-screen">
        {/* Avatars */}
        <div className="relative w-full max-w-sm h-48 mb-8">
          {/* Left Avatar */}
          <motion.div
            className="absolute text-7xl"
            style={{ left: `${leftPos}%`, top: '50%' }}
            animate={{
              x: '-50%',
              y: '-50%',
              scale: value === 100 ? 1.1 : 1,
            }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            👩
          </motion.div>

          {/* Right Avatar */}
          <motion.div
            className="absolute text-7xl"
            style={{ left: `${rightPos}%`, top: '50%' }}
            animate={{
              x: '-50%',
              y: '-50%',
              scale: value === 100 ? 1.1 : 1,
            }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            👨
          </motion.div>

          {/* Hearts when at max */}
          {value === 100 && (
            <>
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute left-1/2 top-1/4 text-2xl"
                  initial={{ opacity: 0, y: 0, x: '-50%' }}
                  animate={{
                    opacity: [0, 1, 0],
                    y: -60,
                    x: `calc(-50% + ${(i - 2) * 20}px)`,
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                >
                  💕
                </motion.div>
              ))}
            </>
          )}
        </div>

        {/* Slider */}
        <motion.div
          className="glass-card rounded-3xl p-6 w-full max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground text-sm">Hug Power</span>
            <span className="text-2xl font-bold text-primary">{value}%</span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={handleChange}
            className="w-full h-3 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, hsl(347 77% 62%) ${value}%, hsl(347 30% 88%) ${value}%)`,
            }}
          />

          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>👋 Wave</span>
            <span>🤗 MEGA HUG</span>
          </div>

          {value === 100 && (
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <p className="text-primary font-semibold flex items-center justify-center gap-2">
                <Heart className="w-5 h-5 fill-current" />
                Maximum Hug Power Achieved!
                <Heart className="w-5 h-5 fill-current" />
              </p>
            </motion.div>
          )}
        </motion.div>

        <motion.p
          className="text-muted-foreground text-sm mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Slide to bring two hearts together! 💕
        </motion.p>
      </main>
    </div>
  );
};

export default HugMeter;