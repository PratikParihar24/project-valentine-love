import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { NavigationMenu } from '@/components/NavigationMenu';
import { PageHeader } from '@/components/PageHeader';
import { Sparkles, Heart } from 'lucide-react';
import { Confetti } from '@/components/Confetti';

type KissType = 'peck' | 'cheek' | 'forehead' | 'butterfly' | 'eskimo';

interface KissConfig {
  id: KissType;
  label: string;
  emoji: string;
  description: string;
  girlEmoji: string;
  boyEmoji: string;
  kissEmoji: string;
}

const KISS_TYPES: KissConfig[] = [
  { id: 'peck', label: 'Quick Peck', emoji: '💋', description: 'A sweet quick kiss', girlEmoji: '😗', boyEmoji: '😙', kissEmoji: '💋' },
  { id: 'cheek', label: 'Cheek Kiss', emoji: '😘', description: 'A gentle kiss on the cheek', girlEmoji: '😚', boyEmoji: '☺️', kissEmoji: '💕' },
  { id: 'forehead', label: 'Forehead Kiss', emoji: '🥰', description: 'A caring forehead kiss', girlEmoji: '🥰', boyEmoji: '😌', kissEmoji: '💗' },
  { id: 'butterfly', label: 'Butterfly Kiss', emoji: '🦋', description: 'Eyelashes fluttering', girlEmoji: '😊', boyEmoji: '😊', kissEmoji: '🦋' },
  { id: 'eskimo', label: 'Eskimo Kiss', emoji: '👃', description: 'Nose to nose rub', girlEmoji: '🤭', boyEmoji: '😄', kissEmoji: '💖' },
];

const KissWall = () => {
  const [selectedKiss, setSelectedKiss] = useState<KissType>('peck');
  const [isKissing, setIsKissing] = useState(false);
  const [kissCount, setKissCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number }[]>([]);

  const currentKiss = KISS_TYPES.find(k => k.id === selectedKiss)!;

  const handleKiss = () => {
    if (isKissing) return;
    
    setIsKissing(true);
    setKissCount(prev => prev + 1);
    
    // Add floating hearts
    const newHearts = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 60 - 30,
    }));
    setFloatingHearts(prev => [...prev, ...newHearts]);
    
    // Show confetti every 5 kisses
    if ((kissCount + 1) % 5 === 0) {
      setShowConfetti(true);
    }
    
    setTimeout(() => {
      setIsKissing(false);
    }, 1500);
    
    // Clean up old hearts
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(h => !newHearts.find(nh => nh.id === h.id)));
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-rose-light/30 to-background relative overflow-hidden">
      <NavigationMenu />
      <PageHeader
        title="Kiss Day"
        subtitle="Kiss Day • Feb 13"
        icon={<Sparkles className="w-5 h-5 text-primary" />}
      />

      <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />

      <main className="pt-24 pb-8 px-4 flex flex-col items-center">
        {/* Characters Display */}
        <motion.div
          className="relative w-full max-w-sm h-56 mb-6 flex items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Mikuu (Girl) */}
          <motion.div
            className="absolute flex flex-col items-center"
            style={{ left: '25%' }}
            animate={{
              x: isKissing ? 30 : 0,
              scale: isKissing ? 1.1 : 1,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <motion.span 
              className="text-6xl"
              animate={{ rotate: isKissing ? 10 : 0 }}
            >
              {isKissing ? currentKiss.girlEmoji : '👩'}
            </motion.span>
            <span className="mt-2 text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
              Mikuu
            </span>
          </motion.div>

          {/* Kiss Effect in center */}
          <AnimatePresence>
            {isKissing && (
              <motion.div
                className="absolute left-1/2 top-1/3 -translate-x-1/2 text-4xl z-20"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.5, 1], opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {currentKiss.kissEmoji}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Hearts */}
          <AnimatePresence>
            {floatingHearts.map((heart) => (
              <motion.div
                key={heart.id}
                className="absolute left-1/2 top-1/3 text-2xl pointer-events-none"
                initial={{ opacity: 0, y: 0, x: heart.x }}
                animate={{ opacity: [0, 1, 0], y: -100, x: heart.x }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2 }}
              >
                💕
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Chakudi (Boy) */}
          <motion.div
            className="absolute flex flex-col items-center"
            style={{ right: '25%' }}
            animate={{
              x: isKissing ? -30 : 0,
              scale: isKissing ? 1.1 : 1,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <motion.span 
              className="text-6xl"
              animate={{ rotate: isKissing ? -10 : 0 }}
            >
              {isKissing ? currentKiss.boyEmoji : '👨'}
            </motion.span>
            <span className="mt-2 text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
              Chakudi
            </span>
          </motion.div>
        </motion.div>

        {/* Kiss Counter */}
        <motion.div
          className="glass-card rounded-full px-6 py-3 mb-6 flex items-center gap-3"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Heart className="w-5 h-5 text-primary fill-current" />
          <span className="font-bold text-foreground text-lg">{kissCount}</span>
          <span className="text-muted-foreground text-sm">kisses shared</span>
        </motion.div>

        {/* Kiss Types Selection */}
        <motion.div
          className="glass-card rounded-3xl p-6 w-full max-w-sm mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="font-serif text-lg font-semibold text-foreground mb-4 text-center">
            Choose Kiss Type
          </h3>
          
          <div className="grid grid-cols-3 gap-2 mb-4">
            {KISS_TYPES.slice(0, 3).map((kiss) => (
              <motion.button
                key={kiss.id}
                className={`p-3 rounded-2xl flex flex-col items-center gap-1 transition-all ${
                  selectedKiss === kiss.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary hover:bg-secondary/80 text-foreground'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedKiss(kiss.id)}
              >
                <span className="text-2xl">{kiss.emoji}</span>
                <span className="text-xs font-medium">{kiss.label}</span>
              </motion.button>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {KISS_TYPES.slice(3).map((kiss) => (
              <motion.button
                key={kiss.id}
                className={`p-3 rounded-2xl flex flex-col items-center gap-1 transition-all ${
                  selectedKiss === kiss.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary hover:bg-secondary/80 text-foreground'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedKiss(kiss.id)}
              >
                <span className="text-2xl">{kiss.emoji}</span>
                <span className="text-xs font-medium">{kiss.label}</span>
              </motion.button>
            ))}
          </div>

          <p className="text-center text-muted-foreground text-sm mt-4">
            {currentKiss.description}
          </p>
        </motion.div>

        {/* Kiss Button */}
        <motion.button
          className={`w-full max-w-sm py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 transition-all ${
            isKissing 
              ? 'bg-primary/70 text-primary-foreground' 
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
          whileHover={{ scale: isKissing ? 1 : 1.02 }}
          whileTap={{ scale: isKissing ? 1 : 0.98 }}
          onClick={handleKiss}
          disabled={isKissing}
        >
          <span className="text-2xl">{currentKiss.emoji}</span>
          {isKissing ? 'Kissing...' : `Give a ${currentKiss.label}!`}
        </motion.button>

        <motion.p
          className="text-muted-foreground text-sm mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Mikuu & Chakudi are ready for kisses! 💋
        </motion.p>
      </main>
    </div>
  );
};

export default KissWall;
