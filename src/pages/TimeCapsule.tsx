import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { NavigationMenu } from '@/components/NavigationMenu';
import { PageHeader } from '@/components/PageHeader';
import { MessageCircleHeart, Lock, Send } from 'lucide-react';

const TimeCapsule = () => {
  const [note, setNote] = useState('');
  const [isLocked, setIsLocked] = useState(() => {
    return localStorage.getItem('time-capsule-locked') === 'true';
  });
  const [savedNote, setSavedNote] = useState(() => {
    return localStorage.getItem('time-capsule-note') || '';
  });
  const [isSealing, setIsSealing] = useState(false);

  useEffect(() => {
    if (isLocked) {
      localStorage.setItem('time-capsule-locked', 'true');
      localStorage.setItem('time-capsule-note', savedNote);
    }
  }, [isLocked, savedNote]);

  const handleSeal = () => {
    if (!note.trim()) return;
    setIsSealing(true);
    setSavedNote(note);

    setTimeout(() => {
      setIsLocked(true);
      setIsSealing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-purple-50/30 to-background relative overflow-hidden">
      <NavigationMenu />
      <PageHeader
        title="Time Capsule"
        subtitle="Promise Day • Feb 11"
        icon={<MessageCircleHeart className="w-5 h-5 text-primary" />}
      />

      <main className="pt-24 pb-8 px-4 max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {!isLocked && !isSealing ? (
            <motion.div
              key="write"
              className="glass-card rounded-3xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">💌</div>
                <h2 className="font-serif text-xl font-semibold text-foreground mb-2">
                  Write a Message to the Future
                </h2>
                <p className="text-muted-foreground text-sm">
                  Seal your thoughts in this digital time capsule
                </p>
              </div>

              <textarea
                className="w-full h-48 p-4 rounded-2xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Dear future us...

Write your promises, hopes, or memories here. This message will be sealed forever in your Valentine Archives. 💕"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />

              <motion.button
                className="w-full mt-4 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSeal}
                disabled={!note.trim()}
              >
                <Lock className="w-5 h-5" />
                Seal the Time Capsule
              </motion.button>
            </motion.div>
          ) : isSealing ? (
            <motion.div
              key="sealing"
              className="glass-card rounded-3xl p-8 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <motion.div
                className="text-7xl mb-4"
                animate={{ 
                  rotateY: [0, 180, 360],
                  scale: [1, 0.8, 1],
                }}
                transition={{ duration: 2, ease: 'easeInOut' }}
              >
                ✉️
              </motion.div>
              <h2 className="font-serif text-xl font-semibold text-foreground">
                Sealing your message...
              </h2>
            </motion.div>
          ) : (
            <motion.div
              key="sealed"
              className="glass-card rounded-3xl p-6 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <motion.div
                className="text-7xl mb-4"
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                📬
              </motion.div>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-2">
                Time Capsule Sealed! 🔒
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                Your message is safely stored in the archives
              </p>

              <div className="bg-secondary/50 rounded-2xl p-4 text-left">
                <p className="text-sm text-muted-foreground mb-2">Your message:</p>
                <p className="text-foreground text-sm italic whitespace-pre-wrap">
                  "{savedNote}"
                </p>
              </div>

              <p className="text-muted-foreground text-xs mt-4">
                Saved on {new Date().toLocaleDateString()}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default TimeCapsule;