import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useState, useEffect, useCallback, useRef } from 'react';
import { NavigationMenu } from '@/components/NavigationMenu';
import { PageHeader } from '@/components/PageHeader';
import { Candy, Play, RotateCcw, Trophy, Award, Star, Heart, Crown, Sparkles } from 'lucide-react';
import { Confetti } from '@/components/Confetti';
import { useToast } from '@/hooks/use-toast';

interface FallingItem {
  id: number;
  x: number;
  y: number;
  speed: number;
  emoji: string;
  rotation: number;
}

const CHOCOLATES = ['🍫', '🍬', '🍭', '🧁', '🍪', '🍩', '🎂'];
const GAME_DURATION = 30;

const ChocolateGame = () => {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const stored = localStorage.getItem('chocolate-high-score');
    return stored ? parseInt(stored, 10) : 0;
  });

  // Milestone Persistence State
  const [royalBasketUnlocked, setRoyalBasketUnlocked] = useState(() =>
    localStorage.getItem('chocolate-royal-basket-unlocked') === 'true'
  );
  const [extraSparklesUnlocked, setExtraSparklesUnlocked] = useState(() =>
    localStorage.getItem('chocolate-extra-sparkles-unlocked') === 'true'
  );

  const [showMilestone30, setShowMilestone30] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [basketX, setBasketX] = useState(50);
  const basketXRef = useRef(50);

  // Sync ref with state for logic access without re-running effects
  useEffect(() => {
    basketXRef.current = basketX;
  }, [basketX]);

  const [items, setItems] = useState<FallingItem[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const lastSpawnRef = useRef<number>(0);
  const { toast } = useToast();
  const lastMilestoneRef = useRef(0);

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState('ended');
          if (score >= 30) {
            setShowMilestone30(true);
          }
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('chocolate-high-score', score.toString());
            setShowConfetti(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, score, highScore]);

  // Milestone check
  useEffect(() => {
    if (gameState !== 'playing') return;

    // Milestone 70: Golden Gala
    if (score >= 70 && !extraSparklesUnlocked) {
      setExtraSparklesUnlocked(true);
      localStorage.setItem('chocolate-extra-sparkles-unlocked', 'true');
      toast({
        title: "Golden Gala Unlocked! ✨",
        description: "The background is now shimmering with gold and pink!",
      });
    }

    // Milestone 50: Royal Heart Basket
    if (score >= 50 && !royalBasketUnlocked) {
      setRoyalBasketUnlocked(true);
      localStorage.setItem('chocolate-royal-basket-unlocked', 'true');
      toast({
        title: "Royal Basket Unlocked! 👑",
        description: "You've earned the Royal Heart Basket!",
      });
    }

    // Existing generic milestones (Exactly on the mark)
    if (score === 100 && lastMilestoneRef.current < 100) {
      toast({
        title: "Chocolate Fever! 🍫🍫",
        description: "100 treats! You're a candy pro!",
        variant: "default",
      });
      lastMilestoneRef.current = 100;
    } else if (score === 50 && lastMilestoneRef.current < 50) {
      lastMilestoneRef.current = 50;
    } else if (score === 20 && lastMilestoneRef.current < 20) {
      toast({
        title: "Nice Catch! 🍬",
        description: "20 treats! You've got the rhythm.",
      });
      lastMilestoneRef.current = 20;
    }
  }, [score, gameState, toast, royalBasketUnlocked, extraSparklesUnlocked]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = (timestamp: number) => {
      // Spawn new items
      if (timestamp - lastSpawnRef.current > 800) {
        const newItem: FallingItem = {
          id: Date.now() + Math.random(),
          x: 10 + Math.random() * 80,
          y: -10,
          speed: 0.6 + Math.random() * 0.8,
          emoji: CHOCOLATES[Math.floor(Math.random() * CHOCOLATES.length)],
          rotation: Math.random() * 360,
        };
        setItems((prev) => [...prev, newItem]);
        lastSpawnRef.current = timestamp;
      }

      // Update positions
      setItems((prev) => {
        return prev
          .map((item) => ({
            ...item,
            y: item.y + item.speed,
            rotation: item.rotation + item.speed * 2,
          }))
          .filter((item) => {
            // Check if caught
            const basketPixelWidth = royalBasketUnlocked ? 106 : 96; // Matching w-24 (96px) + scaling
            const gameWidth = gameAreaRef.current?.clientWidth || window.innerWidth;
            const hitWidth = (basketPixelWidth / gameWidth) * 100;

            // Use ref to avoid re-running game loop effect on every mouse move
            const currentBasketX = basketXRef.current;
            const basketLeft = currentBasketX - hitWidth / 2;
            const basketRight = currentBasketX + hitWidth / 2;

            // item.y is the center of the chocolate. 
            // We'll check 82-98% with a small extra horizontal buffer (2.5%) for chocolate width
            if (item.y > 82 && item.y < 98) {
              if (item.x >= basketLeft - 2.5 && item.x <= basketRight + 2.5) {
                setScore((s) => s + 1);
                return false;
              }
            }

            // Remove if off screen
            return item.y < 100;
          });
      });

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState]); // Removed basketX dependency

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setItems([]);
    lastSpawnRef.current = 0;
    lastMilestoneRef.current = 0;
  };

  const handleDrag = useCallback((e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!gameAreaRef.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const newX = ((info.point.x - rect.left) / rect.width) * 100;
    setBasketX(Math.max(10, Math.min(90, newX)));
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (gameState !== 'playing' || !gameAreaRef.current) return;
    const touch = e.touches[0];
    const rect = gameAreaRef.current.getBoundingClientRect();
    const newX = ((touch.clientX - rect.left) / rect.width) * 100;
    setBasketX(Math.max(10, Math.min(90, newX)));
  }, [gameState]);

  return (
    <div className={`min-h-screen transition-colors duration-1000 relative overflow-hidden ${extraSparklesUnlocked
      ? 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from),_#fffce6_0%,_#ffeef0_50%,_#fff_100%)]'
      : 'bg-gradient-to-b from-background via-amber-50/30 to-background'
      }`}>
      {extraSparklesUnlocked && (
        <div className="absolute inset-0 pointer-events-none opacity-40">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-amber-400"
              initial={{
                x: Math.random() * 100 + '%',
                y: Math.random() * 100 + '%',
                scale: 0.5,
                opacity: 0
              }}
              animate={{
                y: [null, '-20%', '120%'],
                opacity: [0, 1, 0],
                rotate: [0, 360]
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
          ))}
        </div>
      )}
      <NavigationMenu />
      <PageHeader
        title="Sweet Catcher"
        subtitle="Chocolate Day • Feb 9"
        icon={<Candy className="w-5 h-5 text-primary" />}
      />

      <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Game Area */}
      <div
        ref={gameAreaRef}
        className="fixed inset-0 pt-20"
        onTouchMove={handleTouchMove}
      >
        {/* Score & Timer */}
        <motion.div
          className="absolute top-24 left-4 right-4 flex justify-between items-center z-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="glass-card rounded-2xl px-4 py-2 flex items-center gap-2">
            <span className="text-xl">🍫</span>
            <span className="font-bold text-foreground text-lg">{score}</span>
          </div>

          {gameState === 'playing' && (
            <div className="glass-card rounded-2xl px-4 py-2 flex items-center gap-2">
              <span className="text-muted-foreground text-sm">Time:</span>
              <span className={`font-bold text-lg ${timeLeft <= 10 ? 'text-destructive' : 'text-foreground'}`}>
                {timeLeft}s
              </span>
            </div>
          )}

          <div className="glass-card rounded-2xl px-4 py-2 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-accent" />
            <span className="font-bold text-foreground text-lg">{highScore}</span>
          </div>
        </motion.div>

        {/* Falling Items */}
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              className="absolute pointer-events-none text-3xl"
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              {item.emoji}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Basket */}
        {gameState === 'playing' && (
          <motion.div
            className="absolute bottom-4 select-none touch-none cursor-grab active:cursor-grabbing w-24 h-24 flex items-center justify-center"
            style={{
              left: `${basketX}%`,
              transform: 'translateX(-50%)',
            }}
            drag="x"
            dragConstraints={gameAreaRef}
            dragElastic={0}
            dragMomentum={false}
            onDrag={handleDrag}
          >
            <div className="relative">
              {royalBasketUnlocked && (
                <motion.div
                  className="absolute -top-6 left-1/2 -translate-x-1/2"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <Crown className="w-8 h-8 text-amber-500 fill-amber-200" />
                </motion.div>
              )}
              <div className={`text-6xl drop-shadow-xl select-none transition-transform duration-300 ${royalBasketUnlocked ? 'scale-110' : ''}`}>
                {royalBasketUnlocked ? '💝' : '🧺'}
              </div>
              {royalBasketUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center opacity-40">
                  <Heart className="w-12 h-12 text-primary fill-primary" />
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Idle Screen */}
        {gameState === 'idle' && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="glass-card rounded-3xl px-8 py-8 text-center max-w-xs mx-4">
              <div className="text-6xl mb-4">🍫</div>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-2">
                Sweet Catcher
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                Catch as many chocolates as you can in {GAME_DURATION} seconds!
              </p>
              <motion.button
                className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startGame}
              >
                <Play className="w-5 h-5" />
                Start Game
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* End Screen */}
        {gameState === 'ended' && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="glass-card rounded-3xl px-8 py-8 text-center max-w-xs mx-4">
              <div className="text-6xl mb-4">
                {score > highScore - 1 ? '🏆' : '🍫'}
              </div>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-2">
                {score >= highScore && score > 0 ? 'New High Score!' : 'Game Over!'}
              </h2>
              <p className="text-muted-foreground text-sm mb-2">
                You caught <span className="font-bold text-primary">{score}</span> treats!
              </p>
              <p className="text-muted-foreground text-xs mb-6">
                High Score: {highScore}
              </p>
              <motion.button
                className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startGame}
              >
                <RotateCcw className="w-5 h-5" />
                Play Again
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Milestone 30 Overlay */}
        <AnimatePresence>
          {showMilestone30 && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center z-50 bg-background/40 backdrop-blur-sm p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="glass-card rounded-[2rem] p-10 text-center max-w-sm border-2 border-primary/20 shadow-2xl relative overflow-hidden"
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", damping: 15 }}
              >
                {/* Decorative Elements */}
                <motion.div
                  className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />

                <div className="text-6xl mb-6 relative">
                  🍫
                  <motion.div
                    className="absolute -top-2 -right-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-6 h-6 text-amber-400" />
                  </motion.div>
                </div>

                <h2 className="font-serif text-3xl font-bold text-foreground mb-4 leading-tight">
                  A Sweet Milestone!
                </h2>

                <p className="text-xl italic text-primary/80 mb-8 font-medium">
                  "A chocolate for my Thirty on crossing 30."
                </p>

                <motion.button
                  className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-lg hover:shadow-primary/20 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowMilestone30(false)}
                >
                  Continue Game
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChocolateGame;