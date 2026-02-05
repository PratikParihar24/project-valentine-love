import { motion } from 'framer-motion';
import { FloatingHearts } from '@/components/FloatingHearts';
import { LoveButton } from '@/components/LoveButton';
import { NavigationMenu } from '@/components/NavigationMenu';
import { Heart, Sparkles } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-rose-light/30 to-background relative overflow-hidden">
      <FloatingHearts />
      <NavigationMenu />

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        {/* Hero Title */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="w-4 h-4" />
            Feb 7 - Feb 14, 2026
          </motion.div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
            Mikuu's Valentine
            <br />
            <span className="text-primary">Archives</span>
          </h1>

          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            A celebration of friendship, memories, and the love that never fades ✨
          </p>
        </motion.div>

        {/* Love Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <LoveButton />
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-muted-foreground text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Heart className="w-4 h-4 text-primary animate-pulse" />
          <span>Tap the menu to explore each day</span>
        </motion.div>
      </main>

      {/* Background gradient orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default Index;