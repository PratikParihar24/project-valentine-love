import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { NavigationMenu } from '@/components/NavigationMenu';
import { PageHeader } from '@/components/PageHeader';
import { Heart, Music, UtensilsCrossed, Hand, RotateCcw } from 'lucide-react';
import { Confetti } from '@/components/Confetti';
import { useToast } from '@/hooks/use-toast';

const TeddyBearGame = () => {
  const [happiness, setHappiness] = useState(20);
  const [interaction, setInteraction] = useState<string | null>(null);
  const [effects, setEffects] = useState<{ id: number; emoji: string; x: number }[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const lastMilestoneRef = useRef(0);

  // Decay timer logic
  useEffect(() => {
    if (happiness < 100) {
      intervalRef.current = setInterval(() => {
        setHappiness((prev) => Math.max(0, prev - 1));
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsWon(true);
      setShowConfetti(true);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [happiness]);

  // Milestone Check
  useEffect(() => {
    if (happiness >= 50 && lastMilestoneRef.current < 50 && !isWon) {
      toast({
        title: "Feeling the Love! 🧸",
        description: "Your buddy is halfway to being fully loved!",
      });
      lastMilestoneRef.current = 50;
    }
    if (happiness < 50) lastMilestoneRef.current = 0; // Reset for repeated enjoyment
  }, [happiness, isWon, toast]);

  const handleInteraction = (type: string, amount: number, emoji: string) => {
    if (isWon) return;
    setInteraction(type);
    setHappiness((prev) => Math.min(100, prev + amount));

    // Add floating effects
    const newEffects = [...Array(3)].map((_, i) => ({
      id: Date.now() + i + Math.random(),
      emoji: emoji,
      x: (Math.random() - 0.5) * 150
    }));
    setEffects(prev => [...prev, ...newEffects]);

    // Cleanup effects
    setTimeout(() => {
      setEffects(prev => prev.filter(e => !newEffects.find(ne => ne.id === e.id)));
    }, 1000);

    // Reset interaction state after animation
    setTimeout(() => setInteraction(null), 1000);
  };

  const resetGame = () => {
    setHappiness(20);
    setIsWon(false);
    setInteraction(null);
    setShowConfetti(false);
  };

  // Avatar state logic
  const getAvatarState = () => {
    if (happiness === 100) return 'loved';
    if (happiness > 30) return 'hopeful';
    return 'lonely';
  };

  const avatarState = getAvatarState();

  return (
    <div className="min-h-screen bg-amber-50 relative overflow-hidden flex flex-col items-center">
      <NavigationMenu />
      <PageHeader
        title="Teddy Day"
        subtitle="Raise your buddy's happiness!"
        icon={<Heart className="w-5 h-5 text-primary" />}
      />

      <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />

      <main className="flex-1 flex items-center justify-center p-4 w-full max-w-lg">
        <motion.div
          className="glass-card w-full rounded-3xl p-8 flex flex-col gap-6 shadow-2xl bg-white/60 backdrop-blur-md border border-white"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {/* Progress Bar */}
          <div className="w-full space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-sm font-medium text-amber-800 flex items-center gap-1">
                Happiness <Heart className={`w-3 h-3 fill-current ${happiness > 30 ? 'text-red-500' : 'text-gray-400'}`} />
              </span>
              <span className="text-xl font-bold text-amber-900">{happiness}%</span>
            </div>
            <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden border border-white shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
                initial={{ width: 0 }}
                animate={{ width: `${happiness}%` }}
                transition={{ type: 'spring', stiffness: 50, damping: 15 }}
              />
            </div>
          </div>

          {/* Avatar Container */}
          <div className="relative h-64 flex flex-col items-center justify-center">
            {/* Speech Bubble */}
            <AnimatePresence mode="wait">
              <motion.div
                key={avatarState}
                className="absolute -top-4 bg-white px-4 py-2 rounded-2xl shadow-md border border-amber-100 text-sm font-medium text-amber-900 z-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {avatarState === 'lonely' && "I need a friend..."}
                {avatarState === 'hopeful' && "Yay! More please!"}
                {avatarState === 'loved' && "You're the best! ❤️"}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-r border-b border-amber-100 rotate-45" />
              </motion.div>
            </AnimatePresence>

            {/* Teddy Avatar */}
            <motion.div
              className={`text-[10rem] select-none leading-none relative ${avatarState === 'lonely' ? 'grayscale-[0.5] contrast-[0.8] brightness-[1.1]' : ''
                }`}
              animate={
                isWon ? {
                  y: [0, -30, 0, -30, 0],
                  rotate: [0, 10, -10, 360],
                  scale: [1, 1.2, 1]
                } : (interaction === 'pat' ? {
                  scaleY: [1, 0.8, 1],
                  scaleX: [1, 1.1, 1]
                } : (interaction === 'honey' ? {
                  scale: [1, 1.2, 1]
                } : (interaction === 'sing' ? {
                  y: [0, -10, 0],
                  x: [0, 5, -5, 0]
                } : (avatarState === 'hopeful' ? {
                  y: [0, -10, 0]
                } : {
                  scale: [1, 1.05, 1]
                }))))
              }
              transition={
                isWon ? { duration: 1, repeat: Infinity } :
                  (avatarState === 'hopeful' && !interaction ? { duration: 2, repeat: Infinity, ease: "easeInOut" } :
                    (avatarState === 'lonely' && !interaction ? { duration: 3, repeat: Infinity, ease: "easeInOut" } :
                      { duration: 0.5 }))
              }
            >
              🧸
              {/* Floating Effects */}
              <AnimatePresence>
                {effects.map((effect) => (
                  <motion.div
                    key={effect.id}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none text-4xl"
                    initial={{ y: 0, x: effect.x, opacity: 1, scale: 0.5 }}
                    animate={{ y: -150, x: effect.x + (Math.random() - 0.5) * 50, opacity: 0, scale: 1.5 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  >
                    {effect.emoji}
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Controls or Win Message */}
          <div className="pt-4 h-32 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {!isWon ? (
                <motion.div
                  className="w-full grid grid-cols-3 gap-3"
                  key="controls"
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <InteractionButton
                    icon={<Hand className="w-6 h-6" />}
                    label="Pat Head"
                    emoji="✋"
                    onClick={() => handleInteraction('pat', 15, '✋')}
                  />
                  <InteractionButton
                    icon={<UtensilsCrossed className="w-6 h-6" />}
                    label="Give Honey"
                    emoji="🍯"
                    onClick={() => handleInteraction('honey', 15, '🍯')}
                  />
                  <InteractionButton
                    icon={<Music className="w-6 h-6" />}
                    label="Sing Song"
                    emoji="🎵"
                    onClick={() => handleInteraction('sing', 15, '🎵')}
                  />
                </motion.div>
              ) : (
                <motion.div
                  className="text-center space-y-4"
                  key="win-message"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-xl font-serif font-bold text-amber-900 animate-bounce">
                    You give the best hugs. Happy Teddy Day! 🐻
                  </p>
                  <button
                    onClick={resetGame}
                    className="flex items-center gap-2 mx-auto px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-full transition-colors shadow-lg font-medium"
                  >
                    <RotateCcw className="w-4 h-4" /> Play Again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>

      <motion.p
        className="text-amber-800 text-sm mb-8 text-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Mikuu & Chakudi love their teddy! 🧸💕
      </motion.p>
    </div>
  );
};

const InteractionButton = ({ icon, label, emoji, onClick }: { icon: React.ReactNode, label: string, emoji: string, onClick: () => void }) => (
  <motion.button
    className="flex flex-col items-center gap-2 p-3 bg-white/50 hover:bg-white/80 rounded-2xl border border-white transition-all shadow-sm"
    whileHover={{ scale: 1.05, y: -2 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
  >
    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 shadow-inner">
      {icon}
    </div>
    <div className="flex flex-col items-center">
      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800/60 leading-tight">{label}</span>
      <span className="text-sm font-medium text-amber-900">{emoji}</span>
    </div>
  </motion.button>
);

export default TeddyBearGame;
