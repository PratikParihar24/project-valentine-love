import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { NavigationMenu } from '@/components/NavigationMenu';
import { PageHeader } from '@/components/PageHeader';
import { FileHeart, Check, Pen, Plus, Download, Trash2, Edit } from 'lucide-react';
import { Confetti } from '@/components/Confetti';
import html2canvas from 'html2canvas';

const DEFAULT_TERMS = [
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
  const [terms, setTerms] = useState<string[]>(() => {
    const saved = localStorage.getItem('friendship-contract-terms');
    return saved ? JSON.parse(saved) : DEFAULT_TERMS;
  });

  const [signed, setSigned] = useState(() => {
    return localStorage.getItem('friendship-contract-signed') === 'true';
  });

  const [newTerm, setNewTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const contractRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('friendship-contract-signed', String(signed));
  }, [signed]);

  useEffect(() => {
    localStorage.setItem('friendship-contract-terms', JSON.stringify(terms));
  }, [terms]);

  const handleSign = () => {
    setSigned(true);
    setIsEditing(false);
    setShowConfetti(true);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSigned(false);
  };

  const handleAddTerm = () => {
    if (newTerm.trim()) {
      setTerms([...terms, newTerm.trim()]);
      setNewTerm("");
    }
  };

  const handleDeleteTerm = (index: number) => {
    setTerms(terms.filter((_, i) => i !== index));
  };

  const handleExport = async () => {
    if (contractRef.current) {
      const canvas = await html2canvas(contractRef.current, {
        scale: 2,
        backgroundColor: null,
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = "Friendship_Contract_Official.png";
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-amber-50/30 to-background relative overflow-hidden pb-20">
      <NavigationMenu />
      <PageHeader
        title="The Friendship Contract"
        subtitle="Propose Day • Feb 8"
        icon={<FileHeart className="w-5 h-5 text-primary" />}
      />

      <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />

      <main className="pt-24 px-4 max-w-lg mx-auto">
        <div ref={contractRef}>
          <motion.div
            className="bg-amber-50/90 backdrop-blur-sm border-2 border-amber-200 rounded-lg shadow-xl overflow-hidden relative"
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

              <AnimatePresence>
                {terms.map((term, index) => (
                  <motion.div
                    key={index}
                    className="group flex items-start gap-3 text-sm text-foreground"
                    initial={{ opacity: 0, x: -20, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-primary font-bold mt-0.5">{index + 1}.</span>
                    <span className="flex-1">{term}</span>
                    {(!signed || isEditing) && (
                      <button
                        onClick={() => handleDeleteTerm(index)}
                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Add New Term Input */}
              {(!signed || isEditing) && (
                <motion.div
                  className="flex gap-2 mt-4 pt-4 border-t border-amber-200/30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <input
                    type="text"
                    value={newTerm}
                    onChange={(e) => setNewTerm(e.target.value)}
                    placeholder="Add your own term..."
                    className="flex-1 bg-white/50 border border-amber-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTerm()}
                  />
                  <button
                    onClick={handleAddTerm}
                    disabled={!newTerm.trim()}
                    className="bg-primary/10 text-primary p-2 rounded-lg hover:bg-primary/20 disabled:opacity-50 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </motion.div>
              )}
            </div>

            {/* Signature Area */}
            <div className="p-6 border-t border-amber-200/50">
              {signed && !isEditing ? (
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-100 text-green-700 font-semibold mb-4 border border-green-200 shadow-sm">
                    <Check className="w-5 h-5" />
                    Contract Signed ✅
                  </div>

                  <div className="flex flex-col gap-3 mt-2">
                    <p className="text-muted-foreground text-sm">
                      This friendship is now legally binding* forever!
                    </p>

                  </div>
                </motion.div>
              ) : (
                <motion.button
                  className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
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
        </div>

        {/* Action Buttons (Outside Contract View for Export) */}
        {signed && !isEditing && (
          <motion.div
            className="mt-6 flex flex-col sm:flex-row gap-3 justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <button
              onClick={handleExport}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-foreground rounded-full shadow-md border hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download Contract
            </button>
            <button
              onClick={handleEdit}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-foreground rounded-full shadow-md border hover:bg-gray-50 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit Terms
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default FriendshipContract;