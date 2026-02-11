import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { NavigationMenu } from '@/components/NavigationMenu';
import { PageHeader } from '@/components/PageHeader';
import { MessageCircleHeart, Lock, Send, Mail } from 'lucide-react';

const TimeCapsule = () => {
  const [note, setNote] = useState('');
  const [email, setEmail] = useState('');
  const [isLocked, setIsLocked] = useState(() => {
    return localStorage.getItem('time-capsule-locked') === 'true';
  });
  const [savedNote, setSavedNote] = useState(() => {
    return localStorage.getItem('time-capsule-note') || '';
  });
  const [isSealing, setIsSealing] = useState(false);
  const [isSealedByDate, setIsSealedByDate] = useState(() => {
    const today = new Date();
    const sealingDate = new Date(2026, 1, 12); // Feb 12, 2026
    return today >= sealingDate;
  });

  useEffect(() => {
    if (isLocked) {
      localStorage.setItem('time-capsule-locked', 'true');
      localStorage.setItem('time-capsule-note', savedNote);
      localStorage.setItem('time-capsule-email', email);
    }
  }, [isLocked, savedNote, email]);

  const handleSeal = () => {
    if (!note.trim() || !email.trim()) return;
    setIsSealing(true);
    setSavedNote(note);

    setTimeout(() => {
      setIsLocked(true);
      setIsSealing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
      <NavigationMenu />
      <PageHeader
        title="Mikuu's Eternal Promise"
        subtitle="Promise Day • Feb 11"
        icon={<MessageCircleHeart className="w-5 h-5 text-primary" />}
      />

      <main className="pt-24 pb-8 px-4 max-w-2xl mx-auto relative z-10">
        {isSealedByDate && !isLocked && (
          <motion.div
            className="mb-6 p-4 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-900 text-center font-medium shadow-sm backdrop-blur-sm"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            🔒 Promise Day has passed! The time capsule is now sealed forever.
          </motion.div>
        )}
        <AnimatePresence mode="wait">
          {!isLocked && !isSealing && !isSealedByDate ? (
            <motion.div
              key="write"
              className="glass-card rounded-[2rem] p-8 border-2 border-primary/10 shadow-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
            >
              <div className="text-center mb-8">
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  ✨💍✨
                </motion.div>
                <h2 className="font-serif text-3xl font-bold text-foreground mb-3">
                  Mikuu's Sacred Promises
                </h2>
                <div className="bg-primary/5 rounded-2xl p-4 mb-2">
                  <p className="text-primary font-medium text-sm leading-relaxed uppercase tracking-wider">
                    "WE WILL EMAIL YOU THE PROMISE EXACTLY AFTER A YEAR"
                  </p>
                  <p className="text-muted-foreground text-xs mt-1 italic">
                    to see how many promises you kept, my Mikuu... ❤️
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="group transition-all">
                  <label className="text-xs font-semibold text-primary uppercase ml-2 mb-1 block">Your Personal Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40 group-focus-within:text-primary transition-colors" />
                    <input
                      type="email"
                      placeholder="mikuu@love.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-secondary/30 border border-primary/10 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="group transition-all">
                  <label className="text-xs font-semibold text-primary uppercase ml-2 mb-1 block">Your Promises to Us</label>
                  <textarea
                    className="w-full h-56 p-6 rounded-2xl bg-secondary/30 border border-primary/10 text-foreground placeholder:text-muted-foreground/40 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-serif text-lg leading-relaxed"
                    placeholder="My dearest Mikuu, write your promises here...
  
This will be locked in time and space, sent back to your heart in 365 days."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
              </div>

              <motion.button
                className="w-full mt-8 py-5 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-lg shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale transition-all"
                whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSeal}
                disabled={!note.trim() || !email.trim()}
              >
                <Lock className="w-6 h-6" />
                Seal Our Destiny, Mikuu
              </motion.button>
            </motion.div>
          ) : isSealing ? (
            <motion.div
              key="sealing"
              className="glass-card rounded-[2rem] p-12 text-center border-2 border-primary/20 shadow-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="text-8xl mb-8 relative inline-block"
                animate={{
                  rotateY: [0, 360],
                  filter: ["drop-shadow(0 0 0px #ffafcc)", "drop-shadow(0 0 20px #ffafcc)", "drop-shadow(0 0 0px #ffafcc)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <img
                  src="/girl-basket-3d.png"
                  alt="Girl with basket"
                  className="w-full h-full object-contain drop-shadow-lg pointer-events-none mix-blend-multiply"
                />
              </motion.div>
              <h2 className="font-serif text-2xl font-bold text-foreground">
                Sealing Mikuu's Promises...
              </h2>
              <p className="text-muted-foreground mt-2">Connecting to the future archives</p>
            </motion.div>
          ) : (
            <motion.div
              key="sealed"
              className="glass-card rounded-[2rem] p-8 text-center border-2 border-primary/20 shadow-2xl overflow-hidden relative"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-primary animate-pulse" />

              <motion.div
                className="text-8xl mb-6"
                animate={{
                  y: [0, -10, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              >
                📬
              </motion.div>

              <h2 className="font-serif text-3xl font-bold text-foreground mb-2">
                Sealed Forever! 🔒
              </h2>
              <p className="text-primary font-semibold mb-8 px-4 py-2 bg-primary/10 rounded-full inline-block">
                Check your email in 365 days, Mikuu!
              </p>

              <div className="bg-secondary/40 rounded-3xl p-8 text-left border border-primary/5 relative">
                <div className="absolute top-4 right-4 text-primary/20 font-serif text-4xl leading-none">"</div>
                <p className="text-xs font-bold text-primary/60 uppercase tracking-widest mb-4">Mikuu's Message:</p>
                <p className="text-foreground text-lg italic serif leading-relaxed">
                  {savedNote}
                </p>
                <div className="absolute bottom-4 left-4 text-primary/20 font-serif text-4xl leading-none rotate-180">"</div>
              </div>

              <div className="mt-8 pt-6 border-t border-primary/10 flex justify-between items-center text-muted-foreground text-xs font-medium uppercase tracking-tighter">
                <span>Archives Locked</span>
                <span>{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default TimeCapsule;