import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavigationMenu } from '@/components/NavigationMenu';
import { PageHeader } from '@/components/PageHeader';
import { Flower2, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Flower {
  id: number;
  x: number;
  y: number;
  type: number;
  rotation: number;
  scale: number;
  swayDuration: number;
  swayDelay: number;
}

const FLOWER_EMOJIS = ['🌹', '🌷', '🌸', '💐', '🌺', '🌻', '🌼', '💮'];

const RoseGarden = () => {
  const [flowers, setFlowers] = useState<Flower[]>(() => {
    const saved = localStorage.getItem('rose-garden-flowers');
    return saved ? JSON.parse(saved) : [];
  });

  const [showSurprise, setShowSurprise] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const { toast } = useToast();
  const [lastMilestone, setLastMilestone] = useState(0);

  useEffect(() => {
    localStorage.setItem('rose-garden-flowers', JSON.stringify(flowers));

    // Milestone Check
    const count = flowers.length;
    if (count >= 100 && lastMilestone < 100) {
      toast({
        title: "Eternal Garden! 🌹",
        description: "Your garden is breathtaking! 100 roses of pure love.",
      });
      setLastMilestone(100);
    } else if (count >= 50 && lastMilestone < 50) {
      toast({
        title: "Growing Love! ✨",
        description: "50 roses... your love is blooming beautifully!",
        variant: "default",
      });
      setShowSurprise(true);
      setLastMilestone(50);
    } else if (count >= 10 && lastMilestone < 10) {
      toast({
        title: "A Sweet Start! 🌸",
        description: "10 roses planted with care.",
      });
      setLastMilestone(10);
    }
  }, [flowers, toast, lastMilestone]);

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
      swayDuration: 3 + Math.random() * 2,
      swayDelay: Math.random() * 2,
    };

    setFlowers((prev) => [...prev, newFlower]);
  }, []);

  const clearGarden = () => {
    setFlowers([]);
    setLastMilestone(0);
    setShowClearConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-green-50/30 to-background relative overflow-hidden">
      <NavigationMenu />
      <PageHeader
        title="The Infinite Garden"
        subtitle="Rose Day • Feb 7"
        icon={<Flower2 className="w-5 h-5 text-primary" />}
      />

      {/* Surprise Dialog */}
      <Dialog open={showSurprise} onOpenChange={setShowSurprise}>
        <DialogContent className="sm:max-w-md border-rose-200 bg-white/95 backdrop-blur-xl">
          <DialogHeader className="text-center items-center">
            <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mb-4 animate-bounce">
              <span className="text-3xl">❤️</span>
            </div>
            <DialogTitle className="text-3xl font-serif text-rose-600">I LOVE YOU!</DialogTitle>
            <DialogDescription className="text-lg pt-2 text-foreground/80">
              You've planted 50 flowers! That's a lot of love! 🌹
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>


      {/* Clear Garden Confirmation */}
      <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <DialogContent className="sm:max-w-md border-rose-200 bg-white/95 backdrop-blur-xl">
          <DialogHeader className="text-center items-center">
            <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mb-4 text-3xl">
              🥀
            </div>
            <DialogTitle className="text-2xl font-serif text-rose-600">Clear the Garden?</DialogTitle>
            <DialogDescription className="text-base pt-2 text-foreground/80">
              Are you sure you want to clear your beautiful garden? All your flowers will be gone! 🥺
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-center mt-4">
            <button
              onClick={() => setShowClearConfirm(false)}
              className="px-6 py-2 rounded-full border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors font-medium"
            >
              Wait, No!
            </button>
            <button
              onClick={clearGarden}
              className="px-6 py-2 rounded-full bg-rose-500 text-white hover:bg-rose-600 transition-colors shadow-md font-medium"
            >
              Clear Anyway
            </button>
          </div>
        </DialogContent>
      </Dialog>
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
              className="absolute select-none cursor-pointer"
              style={{
                left: flower.x,
                top: flower.y,
                originX: 0.5,
                originY: 1, // Pivot from bottom
              }}
              initial={{ scale: 0, opacity: 0, rotate: flower.rotation }}
              animate={{
                scale: flower.scale,
                opacity: 1,
                rotate: [flower.rotation - 5, flower.rotation + 5, flower.rotation - 5],
              }}
              whileHover={{
                scale: flower.scale * 1.5,
                rotate: flower.rotation, // Stop swaying on hover
                transition: { duration: 0.2 }
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                scale: { type: 'spring', stiffness: 300, damping: 15 },
                opacity: { duration: 0.3 },
                rotate: {
                  repeat: Infinity,
                  duration: flower.swayDuration,
                  delay: flower.swayDelay,
                  ease: "easeInOut"
                }
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div
                style={{ transform: 'translate(-50%, -100%)' }} // Center horizontally, place bottom at x,y
              >
                <span className="text-4xl sm:text-5xl drop-shadow-lg filter hover:brightness-110 transition-all">
                  {FLOWER_EMOJIS[flower.type]}
                </span>
              </div>
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
                Plant flowers to grow your garden.<br />
                <span className="text-primary font-medium mt-1 block">Surprise at 50 roses! 🎁</span>
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Counter & Clear */}
      <motion.div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 pointer-events-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="glass-card rounded-full px-6 py-3 flex items-center gap-3 shadow-lg bg-white/80 backdrop-blur-md whitespace-nowrap">
          <span className="text-2xl">🌹</span>
          <span className="font-semibold text-foreground w-8 text-center">{flowers.length}</span>
        </div>

        {flowers.length > 0 && (
          <motion.button
            className="p-3 bg-white/80 backdrop-blur-md rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors shadow-lg border border-white/20"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              setShowClearConfirm(true);
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            aria-label="Clear Garden"
          >
            <Trash2 className="w-5 h-5" />
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

export default RoseGarden;