import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, RefreshCw, X, Stars, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Star {
    id: number;
    x: number; // percentage
    y: number; // percentage
    label: string;
}

// Optimized star positions to prevent clashing on all devices
// Ensuring better horizontal spread for the heart peaks
const starMap: Star[] = [
    { id: 1, x: 50, y: 40, label: "The Bus Glimpse: Shared smiles & chitchat." },
    { id: 2, x: 70, y: 25, label: "Night Owls: Calls that lasted until 4 AM." },
    { id: 3, x: 85, y: 20, label: "Jhumka Magic: Our first date at ISKCON." },
    { id: 4, x: 94, y: 40, label: "The Classroom Moment: From teasing to 'sorry'." },
    { id: 5, x: 88, y: 68, label: "Nature Walks: Exploring every garden together." },
    { id: 6, x: 72, y: 88, label: "A Hug to Remember: Was it at Usmanpura?" },
    { id: 7, x: 50, y: 96, label: "Highway Chai: Warm tea at SG Highway." },
    { id: 8, x: 28, y: 88, label: "Kantara Whispers: Our cinematic first kiss." },
    { id: 9, x: 12, y: 68, label: "Garba Nights: Dancing away at Dev's home." },
    { id: 10, x: 6, y: 40, label: "Game On!: Laughs at the Gamezone." },
    { id: 11, x: 15, y: 20, label: "Power Pair: Our 50-run cricket partnership." },
    { id: 12, x: 30, y: 25, label: "The Final Piece: You complete my universe." },
];

const RoseNebula = () => {
    const particles = useMemo(() => Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        size: Math.random() * 400 + 200,
        top: Math.random() * 100,
        left: Math.random() * 100,
        color: Math.random() > 0.5 ? 'rgba(225, 29, 72, 0.05)' : 'rgba(136, 19, 55, 0.08)',
        duration: Math.random() * 20 + 20,
    })), []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full blur-[100px]"
                    style={{
                        width: p.size,
                        height: p.size,
                        top: `${p.top}%`,
                        left: `${p.left}%`,
                        backgroundColor: p.color,
                    }}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3],
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            ))}
        </div>
    );
};

const TwinklingStars = () => {
    const stars = useMemo(() => Array.from({ length: 100 }).map((_, i) => ({
        id: i,
        size: Math.random() * 2 + 1,
        top: Math.random() * 100,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: Math.random() * 3 + 2,
    })), []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {stars.map((star) => (
                <motion.div
                    key={star.id}
                    className="absolute bg-rose-200 rounded-full shadow-[0_0_5px_white]"
                    style={{
                        width: star.size,
                        height: star.size,
                        top: `${star.top}%`,
                        left: `${star.left}%`,
                    }}
                    animate={{
                        opacity: [0.2, 0.9, 0.2],
                        scale: [1, 1.5, 1],
                    }}
                    transition={{
                        duration: star.duration,
                        repeat: Infinity,
                        delay: star.delay,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
};

const TheConstellation = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedMilestone, setSelectedMilestone] = useState(0);
    const [finalePhase, setFinalePhase] = useState(0); // 0: None, 1: Ignite, 2: Warp, 3: Reveal
    const navigate = useNavigate();

    const handleStarClick = (id: number) => {
        if (id <= currentStep) {
            // Re-view existing milestone
            setSelectedMilestone(id);
        } else if (id === currentStep + 1) {
            // Advance to next milestone
            setCurrentStep(id);
            setSelectedMilestone(id);
        }
    };

    useEffect(() => {
        if (currentStep === starMap.length) {
            const startFinale = async () => {
                setFinalePhase(1); // Ignite
                await new Promise(r => setTimeout(r, 1500));
                setFinalePhase(2); // Warp
                await new Promise(r => setTimeout(r, 2000));
                setFinalePhase(3); // Reveal
            };
            startFinale();
        }
    }, [currentStep]);

    const resetGame = () => {
        setCurrentStep(0);
        setSelectedMilestone(0);
        setFinalePhase(0);
    };

    const finalMessage = "You connect all my dots. Every laugh, every garden walk, and every partnership has led to this moment. You are my universe, my guiding star, and my forever. Happy Valentine's Day!";

    return (
        <div className="relative min-h-screen w-full bg-[#0a0205] overflow-hidden font-sans">
            {/* Background Layer: Rose Nebula */}
            <div className={`absolute inset-0 transition-all duration-2000 ${finalePhase === 2 ? 'scale-150 blur-md opacity-30' : 'opacity-100'}`}>
                <RoseNebula />
                <TwinklingStars />
            </div>

            {/* Main Game Content */}
            <AnimatePresence>
                {finalePhase < 3 && (
                    <motion.div
                        exit={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
                        className="relative z-10 w-full h-screen p-4 flex flex-col items-center justify-between py-12"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center"
                        >
                            <h1 className="text-4xl md:text-6xl font-serif text-white mb-2 drop-shadow-[0_0_20px_rgba(225,29,72,0.6)] tracking-tight">
                                The <span className="text-primary italic">Constellation</span>
                            </h1>
                            <p className="text-rose-200/40 text-xs tracking-[0.3em] uppercase">
                                Valentine Archives • Memory Lane
                            </p>
                        </motion.div>

                        {/* Current Memory Display */}
                        <div className="h-32 flex items-center justify-center w-full max-w-xl px-4">
                            <AnimatePresence mode="wait">
                                {selectedMilestone > 0 && (
                                    <motion.div
                                        key={`milestone-${selectedMilestone}`}
                                        initial={{ opacity: 0, y: 15, rotateX: 45 }}
                                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="bg-primary/10 backdrop-blur-2xl border border-primary/20 rounded-3xl p-6 text-center shadow-soft overflow-hidden group relative w-full"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                                        <span className="block text-[10px] text-primary uppercase tracking-[0.25em] mb-2 font-bold animate-pulse">
                                            Stellar Memory #{selectedMilestone}
                                        </span>
                                        <p className="text-white text-base md:text-xl font-serif italic leading-snug">
                                            "{starMap[selectedMilestone - 1].label}"
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* The Heart Map */}
                        <div className="relative w-full max-w-[500px] aspect-square mx-auto mb-12 group">
                            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                                <defs>
                                    <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
                                        <feGaussianBlur stdDeviation="3" result="blur" />
                                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                    </filter>
                                    <linearGradient id="rose-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#e11d48" />
                                        <stop offset="100%" stopColor="#fb7185" />
                                    </linearGradient>
                                </defs>

                                {starMap.map((star, index) => {
                                    if (index === 0 || star.id > currentStep) return null;
                                    const prevStar = starMap[index - 1];
                                    return (
                                        <motion.line
                                            key={`line-${star.id}`}
                                            x1={`${prevStar.x}%`}
                                            y1={`${prevStar.y}%`}
                                            x2={`${star.x}%`}
                                            y2={`${star.y}%`}
                                            stroke="url(#rose-grad)"
                                            strokeWidth={finalePhase >= 1 ? "4" : "2"}
                                            strokeDasharray="10"
                                            initial={{ strokeDashoffset: 100 }}
                                            animate={{
                                                strokeDashoffset: 0,
                                                opacity: finalePhase >= 1 ? [0.4, 1, 0.4] : 0.8,
                                            }}
                                            style={{
                                                filter: finalePhase >= 1 ? "drop-shadow(0 0 15px #e11d48)" : "drop-shadow(0 0 5px rgba(225,29,72,0.3))"
                                            }}
                                            transition={{
                                                duration: 0.8,
                                                opacity: finalePhase >= 1 ? { repeat: Infinity, duration: 0.5 } : {}
                                            }}
                                        />
                                    );
                                })}

                                {/* Close the heart loop */}
                                {currentStep === starMap.length && (
                                    <motion.line
                                        x1={`${starMap[starMap.length - 1].x}%`}
                                        y1={`${starMap[starMap.length - 1].y}%`}
                                        x2={`${starMap[0].x}%`}
                                        y2={`${starMap[0].y}%`}
                                        stroke="url(#rose-grad)"
                                        strokeWidth={finalePhase >= 1 ? "4" : "2"}
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        style={{ filter: finalePhase >= 1 ? "drop-shadow(0 0 15px #e11d48)" : "none" }}
                                        transition={{ duration: 1 }}
                                    />
                                )}
                            </svg>

                            {/* Stars */}
                            {starMap.map((star) => {
                                const isCompleted = star.id <= currentStep;
                                const isActive = star.id === currentStep + 1;
                                const isSelected = star.id === selectedMilestone;

                                return (
                                    <div
                                        key={star.id}
                                        className="absolute"
                                        style={{ left: `${star.x}%`, top: `${star.y}%`, transform: 'translate(-50%, -50%)' }}
                                    >
                                        <motion.button
                                            onClick={() => handleStarClick(star.id)}
                                            className={`
                        w-9 h-9 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-500
                        ${isCompleted ? 'bg-primary shadow-glow' : 'bg-white/5 border border-white/10'}
                        ${isActive ? 'ring-2 ring-primary ring-offset-4 ring-offset-[#0a0205] scale-125 z-20 shadow-[0_0_30px_rgba(225,29,72,0.5)]' : ''}
                        ${isSelected && isCompleted ? 'ring-2 ring-white scale-110 z-30 shadow-[0_0_20px_white]' : ''}
                      `}
                                            animate={isActive ? { scale: [1.2, 1.4, 1.2], opacity: [0.7, 1, 0.7] } : {}}
                                            transition={isActive ? { repeat: Infinity, duration: 1.5 } : {}}
                                        >
                                            {isCompleted ? (
                                                <Heart size={14} className={`${isSelected ? 'text-white' : 'text-rose-100'} fill-current animate-pulse`} />
                                            ) : (
                                                <Sparkles size={12} className="text-white/20" />
                                            )}
                                        </motion.button>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="text-center space-y-2">
                            <p className="text-rose-200/60 text-xs tracking-widest uppercase">
                                {currentStep === starMap.length ? "Tap any star to relive the memory" : "Tap the glowing star to continue"}
                            </p>
                            <div className="flex gap-1.5 justify-center">
                                {starMap.map((s) => (
                                    <div
                                        key={s.id}
                                        className={`h-1 w-6 rounded-full transition-all duration-500 ${s.id <= currentStep ? 'bg-primary w-8 shadow-[0_0_10px_#e11d48]' : 'bg-white/10'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* PHASE 3: THE REVELATION (Immersive Finale) */}
            <AnimatePresence>
                {finalePhase === 3 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-[100] bg-[#0a0205] flex items-center justify-center p-6 overflow-hidden"
                    >
                        {/* Immersive Bokeh Background */}
                        <div className="absolute inset-0 z-0">
                            {Array.from({ length: 20 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute rounded-full bg-primary/20 blur-[60px]"
                                    style={{
                                        width: Math.random() * 300 + 100,
                                        height: Math.random() * 300 + 100,
                                        top: `${Math.random() * 100}%`,
                                        left: `${Math.random() * 100}%`,
                                    }}
                                    animate={{
                                        scale: [1, 1.5, 1],
                                        opacity: [0.2, 0.5, 0.2],
                                    }}
                                    transition={{ duration: Math.random() * 5 + 5, repeat: Infinity }}
                                />
                            ))}
                        </div>

                        <div className="relative z-10 max-w-2xl w-full text-center">
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", damping: 12 }}
                                className="mb-8 inline-block p-6 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-xl shadow-glow"
                            >
                                <Heart size={48} className="text-primary fill-primary" />
                            </motion.div>

                            <div className="space-y-6">
                                <motion.h2
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-5xl md:text-7xl font-serif text-white tracking-tight leading-none"
                                >
                                    To my <span className="text-primary">Universe</span>
                                </motion.h2>

                                <div className="px-4">
                                    <motion.p
                                        className="text-xl md:text-3xl font-serif text-rose-100/90 leading-relaxed italic"
                                    >
                                        {finalMessage.split(' ').map((word, i) => (
                                            <motion.span
                                                key={i}
                                                initial={{ opacity: 0, filter: 'blur(10px)', y: 5 }}
                                                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                                                transition={{ delay: 1 + (i * 0.1), duration: 0.5 }}
                                                className="inline-block mr-2"
                                            >
                                                {word}
                                            </motion.span>
                                        ))}
                                    </motion.p>
                                </div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 6 }}
                                className="mt-16 flex flex-col md:flex-row gap-4 justify-center"
                            >
                                <Button
                                    onClick={resetGame}
                                    className="bg-primary text-white rounded-full px-10 py-8 text-xl font-bold hover:scale-105 transition-transform shadow-[0_0_30px_rgba(225,29,72,0.4)]"
                                >
                                    <RefreshCw className="mr-3" /> Replay Selection
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => navigate('/')}
                                    className="rounded-full px-10 py-8 text-xl font-bold border-rose-200/20 text-rose-200 hover:bg-white/5"
                                >
                                    Return to Archives
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TheConstellation;
