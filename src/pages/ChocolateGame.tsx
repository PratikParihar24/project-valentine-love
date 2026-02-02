import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useState, useEffect, useCallback, useRef } from 'react';
import { NavigationMenu } from '@/components/NavigationMenu';
import { PageHeader } from '@/components/PageHeader';
import { Candy, Play, RotateCcw, Trophy } from 'lucide-react';
import { Confetti } from '@/components/Confetti';

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
const BASKET_WIDTH = 80;

const ChocolateGame = () => {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const stored = localStorage.getItem('chocolate-high-score');
    return stored ? parseInt(stored, 10) : 0;
  });
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [basketX, setBasketX] = useState(50);
  const [items, setItems] = useState<FallingItem[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const lastSpawnRef = useRef<number>(0);

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState('ended');
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
            const basketLeft = basketX - (BASKET_WIDTH / 2 / window.innerWidth) * 100;
            const basketRight = basketX + (BASKET_WIDTH / 2 / window.innerWidth) * 100;

            if (item.y > 80 && item.y < 95) {
              if (item.x >= basketLeft - 5 && item.x <= basketRight + 5) {
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
  }, [gameState, basketX]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setItems([]);
    lastSpawnRef.current = 0;
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
    <div className="min-h-screen bg-gradient-to-b from-background via-amber-50/30 to-background relative overflow-hidden">
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
            className="absolute bottom-16 select-none touch-none cursor-grab active:cursor-grabbing"
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
            <div className="text-5xl drop-shadow-lg">🧺</div>
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
      </div>
    </div>
  );
};

export default ChocolateGame;