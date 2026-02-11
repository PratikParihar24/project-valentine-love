import { motion } from 'framer-motion';
import { useRef } from 'react';
import { NavigationMenu } from '@/components/NavigationMenu';
import { PageHeader } from '@/components/PageHeader';
import { PartyPopper, Heart, Star, Sparkles, Gift, Music, Camera, Coffee } from 'lucide-react';

interface Milestone {
  icon: typeof Heart;
  title: string;
  description: string;
  emoji: string;
}

const MILESTONES: Milestone[] = [
  { icon: Coffee, title: 'First Coffee', description: 'The day we became friends', emoji: '☕' },
  { icon: Camera, title: 'First Photo', description: 'Captured a memory', emoji: '📸' },
  { icon: Music, title: 'Our Song', description: 'Found our anthem', emoji: '🎵' },
  { icon: Star, title: 'Late Night Talks', description: 'Shared our dreams', emoji: '🌙' },
  { icon: Gift, title: 'First Gift', description: 'A token of friendship', emoji: '🎁' },
  { icon: Heart, title: 'Through Thick & Thin', description: 'Always there for each other', emoji: '💪' },
  { icon: Sparkles, title: 'Making Memories', description: 'Every moment matters', emoji: '✨' },
  { icon: PartyPopper, title: "Valentine's 2026", description: 'Best friends forever!', emoji: '🎉' },
];

const MemoryLane = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-purple-50/30 to-background relative overflow-hidden">
      <NavigationMenu />
      <PageHeader
        title="Memory Lane"
        subtitle="Valentine's Day • Feb 14"
        icon={<PartyPopper className="w-5 h-5 text-primary" />}
      />

      <main className="pt-24 pb-8">
        {/* Intro */}
        <motion.div
          className="text-center px-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-muted-foreground">
            Scroll right to walk through our memories →
          </p>
        </motion.div>

        {/* Horizontal Scroll Container */}
        <div
          ref={scrollRef}
          className="overflow-x-auto pb-8 px-4 hide-scrollbar"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <div className="flex gap-6 w-max">
            {/* Start Marker */}
            <motion.div
              className="flex-shrink-0 w-32 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-center">
                <span className="text-4xl">🚶</span>
                <p className="text-xs text-muted-foreground mt-2">Start</p>
              </div>
            </motion.div>

            {/* Milestones */}
            {MILESTONES.map((milestone, index) => {
              const Icon = milestone.icon;
              return (
                <motion.div
                  key={index}
                  className="flex-shrink-0 w-72"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  {/* Path line */}
                  <div className="h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50 rounded-full mb-4" />

                  {/* Card */}
                  <div className="glass-card rounded-3xl p-6 relative">
                    {/* Pixel-style border */}
                    <div className="absolute inset-0 rounded-3xl border-4 border-dashed border-primary/20 pointer-events-none" />

                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-3xl">{milestone.emoji}</span>
                      </div>

                      <div className="flex-1">
                        <h3 className="font-serif text-lg font-semibold text-foreground mb-1">
                          {milestone.title}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {milestone.description}
                        </p>
                      </div>
                    </div>

                    {/* Decorative pixel dots */}
                    <div className="absolute bottom-2 right-2 flex gap-1">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-sm bg-primary/30"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Final Banner */}
            <motion.div
              className="flex-shrink-0 w-80 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="glass-card rounded-3xl p-8 text-center bg-gradient-to-br from-primary/20 to-accent/20">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                  }}
                  className="text-6xl mb-4"
                >
                  💝
                </motion.div>

                <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
                  Happy Valentine's Day!
                </h2>

                <p className="text-muted-foreground text-sm mb-4">
                  Here's to many more memories together
                </p>

                <div className="flex justify-center gap-2">
                  {['💕', '✨', '🎉', '💖', '🌟'].map((emoji, i) => (
                    <motion.span
                      key={i}
                      className="text-xl"
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        delay: i * 0.1,
                      }}
                    >
                      {emoji}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Extra padding at end */}
            <div className="w-8 flex-shrink-0" />
          </div>
        </div>

        {/* Scroll hint */}
        <motion.div
          className="text-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="text-muted-foreground text-xs">
            Swipe to explore • Made with 💕
          </p>
        </motion.div>
      </main>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default MemoryLane;