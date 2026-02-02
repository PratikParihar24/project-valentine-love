import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Lock, Unlock } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getDaysWithUnlockStatus, formatDate } from '@/lib/valentine-data';
import { useUnlockAll } from '@/hooks/useUnlockAll';
import { Switch } from '@/components/ui/switch';

export function NavigationMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { unlockAll, toggleUnlockAll } = useUnlockAll();
  const days = getDaysWithUnlockStatus(unlockAll);
  const [devClickCount, setDevClickCount] = useState(0);
  const [showDevToggle, setShowDevToggle] = useState(false);

  const handleNavigation = (path: string, unlocked: boolean) => {
    if (unlocked) {
      navigate(path);
      setIsOpen(false);
    }
  };

  const handleTitleClick = () => {
    setDevClickCount((prev) => {
      const newCount = prev + 1;
      if (newCount >= 5) {
        setShowDevToggle(true);
        return 0;
      }
      return newCount;
    });
  };

  return (
    <>
      {/* Menu Button */}
      <motion.button
        className="fixed top-4 right-4 z-50 w-12 h-12 rounded-full glass-card flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-foreground" />
        ) : (
          <Menu className="w-6 h-6 text-foreground" />
        )}
      </motion.button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-card/95 backdrop-blur-xl z-40 shadow-2xl border-l border-border"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="p-6 pt-20 h-full overflow-y-auto">
              <h2
                className="text-2xl font-serif font-semibold text-foreground mb-6 cursor-pointer select-none"
                onClick={handleTitleClick}
              >
                Valentine Week
              </h2>

              <div className="space-y-2">
                {days.map((day, index) => {
                  const Icon = day.icon;
                  const isActive = location.pathname === day.path;

                  return (
                    <motion.button
                      key={day.id}
                      className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all ${
                        day.unlocked
                          ? isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary hover:bg-secondary/80 text-foreground'
                          : 'bg-muted/50 text-muted-foreground cursor-not-allowed'
                      }`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleNavigation(day.path, day.unlocked)}
                      disabled={!day.unlocked}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          day.unlocked
                            ? isActive
                              ? 'bg-primary-foreground/20'
                              : 'bg-primary/10'
                            : 'bg-muted'
                        }`}
                      >
                        {day.unlocked ? (
                          <Icon className={`w-5 h-5 ${isActive ? 'text-primary-foreground' : 'text-primary'}`} />
                        ) : (
                          <Lock className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-sm">{day.name}</p>
                        <p className="text-xs opacity-70">{formatDate(day.date)}</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Home button */}
              <motion.button
                className={`w-full mt-6 p-4 rounded-2xl flex items-center justify-center gap-2 ${
                  location.pathname === '/'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary hover:bg-secondary/80 text-foreground'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={() => {
                  navigate('/');
                  setIsOpen(false);
                }}
              >
                ← Back to Home
              </motion.button>

              {/* Developer Toggle (Hidden) */}
              <AnimatePresence>
                {showDevToggle && (
                  <motion.div
                    className="mt-8 p-4 rounded-2xl bg-muted/50 border border-border"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Unlock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Dev: Unlock All</span>
                      </div>
                      <Switch checked={unlockAll} onCheckedChange={toggleUnlockAll} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}