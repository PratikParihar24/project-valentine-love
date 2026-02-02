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

  // Calculate positions - start far apart (15% and 85%), come together at center
  const leftPos = 15 + (value / 100) * 35; // 15% -> 50%
  const rightPos = 85 - (value / 100) * 35; // 85% -> 50%
  
  // At 100%, they should overlap in a hug
  const isHugging = value === 100;

  return (
    <div 
      className={`min-h-screen bg-gradient-to-b from-background via-rose-light/30 to-background relative overflow-hidden transition-transform duration-100 ${
        isHugging ? 'animate-shake' : ''
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
        {/* Character Display */}
        <div className="relative w-full max-w-sm h-64 mb-8">
          {/* Mikuu (Girl) - Left side */}
          <motion.div
            className="absolute flex flex-col items-center"
            style={{ left: `${leftPos}%`, top: '50%' }}
            animate={{
              x: '-50%',
              y: '-50%',
              scale: isHugging ? 1.15 : 1,
              rotate: isHugging ? -10 : 0,
            }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <span className="text-6xl">{isHugging ? '🤗' : '👩'}</span>
            <span className="mt-2 text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
              Mikuu
            </span>
          </motion.div>

          {/* Chakudi (Boy) - Right side */}
          <motion.div
            className="absolute flex flex-col items-center"
            style={{ left: `${rightPos}%`, top: '50%' }}
            animate={{
              x: '-50%',
              y: '-50%',
              scale: isHugging ? 1.15 : 1,
              rotate: isHugging ? 10 : 0,
            }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <span className="text-6xl">{isHugging ? '🤗' : '👨'}</span>
            <span className="mt-2 text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
              Chakudi
            </span>
          </motion.div>

          {/* Heart between them when hugging */}
          {isHugging && (
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl z-10"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              ❤️
            </motion.div>
          )}

          {/* Hearts floating up when hugging */}
          {isHugging && (
            <>
              {[...Array(7)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute left-1/2 top-1/3 text-2xl"
                  initial={{ opacity: 0, y: 0, x: '-50%' }}
                  animate={{
                    opacity: [0, 1, 0],
                    y: -80,
                    x: `calc(-50% + ${(i - 3) * 25}px)`,
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    delay: i * 0.25,
                  }}
                >
                  💕
                </motion.div>
              ))}
            </>
          )}

          {/* Connection line showing them getting closer */}
          {!isHugging && value > 0 && (
            <motion.div
              className="absolute top-1/2 h-1 bg-gradient-to-r from-pink-300 via-rose-400 to-pink-300 rounded-full"
              style={{
                left: `${leftPos + 5}%`,
                width: `${rightPos - leftPos - 10}%`,
                transform: 'translateY(-50%)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
            />
          )}
        </div>

        {/* Slider Card */}
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

          {isHugging && (
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <p className="text-primary font-semibold flex items-center justify-center gap-2">
                <Heart className="w-5 h-5 fill-current" />
                Mikuu & Chakudi are hugging!
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
          Slide to bring Mikuu & Chakudi together! 💕
        </motion.p>
      </main>
    </div>
  );
};

export default HugMeter;
