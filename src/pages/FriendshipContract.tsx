import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { NavigationMenu } from '@/components/NavigationMenu';
import { PageHeader } from '@/components/PageHeader';
import { FileHeart, Check, Pen } from 'lucide-react';
import { Confetti } from '@/components/Confetti';

const CONTRACT_TERMS = [
  "Promise to always share the best memes first 📱",
  "Agree to be each other's emergency contact for emotional breakdowns 💕",
  "Commit to at least one chaotic adventure per year 🎢",
  "Vow to never judge each other's 3 AM snack choices 🍕",
  "Pledge to give honest opinions on outfits (but gently) 👗",
  "Promise to celebrate wins like they're our own 🎉",
  "Agree to forgive minor food-stealing incidents 🍟",
  "Commit to being the best hype person always 📣",
];

const FriendshipContract = () => {
  const [signed, setSigned] = useState(() => {
    return localStorage.getItem('friendship-contract-signed') === 'true';
  });
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (signed) {
      localStorage.setItem('friendship-contract-signed', 'true');
    }
  }, [signed]);

  const handleSign = () => {
    setSigned(true);
    setShowConfetti(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-amber-50/30 to-background relative overflow-hidden">
      <NavigationMenu />
      <PageHeader
        title="The Friendship Contract"
        subtitle="Propose Day • Feb 8"
        icon={<FileHeart className="w-5 h-5 text-primary" />}
      />

      <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />

      <main className="pt-24 pb-8 px-4 max-w-lg mx-auto">
        <motion.div
          className="bg-amber-50/80 backdrop-blur-sm border-2 border-amber-200 rounded-lg shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z' fill='%23d4a574' fill-opacity='0.08' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}
        >
          {/* Header */}
          <div className="p-6 text-center border-b border-amber-200/50">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-1">
              📜 Official Friendship Contract 📜
            </h2>
            <p className="text-muted-foreground text-sm">
              A Sacred Bond Between Best Friends
            </p>
          </div>

          {/* Terms */}
          <div className="p-6 space-y-4">
            <p className="text-foreground text-sm font-medium mb-4">
              By signing this document, the undersigned parties agree to the following terms and conditions of eternal friendship:
            </p>

            {CONTRACT_TERMS.map((term, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-3 text-sm text-foreground"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="text-primary font-bold">{index + 1}.</span>
                <span>{term}</span>
              </motion.div>
            ))}
          </div>

          {/* Signature */}
          <div className="p-6 border-t border-amber-200/50">
            {signed ? (
              <motion.div
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-100 text-green-700 font-semibold mb-4">
                  <Check className="w-5 h-5" />
                  Contract Signed ✅
                </div>
                <p className="text-muted-foreground text-sm">
                  This friendship is now legally binding* forever!
                </p>
                <p className="text-muted-foreground/60 text-xs mt-2">
                  *Not actually legal, but emotionally enforceable
                </p>
              </motion.div>
            ) : (
              <motion.button
                className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSign}
              >
                <Pen className="w-5 h-5" />
                Sign Here to Accept Terms
              </motion.button>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default FriendshipContract;