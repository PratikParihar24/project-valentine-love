import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Star {
    id: number;
    x: number; // percentage
    y: number; // percentage
    label: string;
}

const starMap: Star[] = [
    { id: 1, x: 50, y: 40, label: "The Bus Glimpse: Shared smiles & chitchat." },
    { id: 2, x: 60, y: 25, label: "Night Owls: Calls that lasted until 4 AM." },
    { id: 3, x: 75, y: 20, label: "Jhumka Magic: Our first date at ISKCON." },
    { id: 4, x: 90, y: 35, label: "The Classroom Moment: From teasing to 'sorry'." },
    { id: 5, x: 85, y: 60, label: "Nature Walks: Exploring every garden together." },
    { id: 6, x: 70, y: 80, label: "A Hug to Remember: Was it at Usmanpura?" },
    { id: 7, x: 50, y: 95, label: "Highway Chai: Warm tea at SG Highway." },
    { id: 8, x: 30, y: 80, label: "Kantara Whispers: Our cinematic first kiss." },
    { id: 9, x: 15, y: 60, label: "Garba Nights: Dancing away at Dev's home." },
    { id: 10, x: 10, y: 35, label: "Game On!: Laughs at the Gamezone." },
    { id: 11, x: 25, y: 20, label: "Power Pair: Our 50-run cricket partnership." },
    { id: 12, x: 40, y: 25, label: "The Final Piece: You complete my universe." },
];

const TwinklingStars = () => {
    const stars = useMemo(() => Array.from({ length: 150 }).map((_, i) => ({
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
                    className="absolute bg-white rounded-full"
                    style={{
                        width: star.size,
                        height: star.size,
                        top: `${star.top}%`,
                        left: `${star.left}%`,
                    }}
                    animate={{
                        opacity: [0.2, 0.8, 0.2],
                        scale: [1, 1.2, 1],
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
    const [showModal, setShowModal] = useState(false);
    const [isWarpSpeed, setIsWarpSpeed] = useState(false);
    const navigate = useNavigate();

    const handleStarClick = (id: number) => {
        if (id === currentStep + 1) {
            setCurrentStep(id);
        }
    };

    useEffect(() => {
        if (currentStep === starMap.length) {
            setIsWarpSpeed(true);
            const timer = setTimeout(() => {
                setShowModal(true);
                setIsWarpSpeed(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [currentStep]);

    const resetGame = () => {
        setCurrentStep(0);
        setShowModal(false);
        setIsWarpSpeed(false);
    };

    return (
        <div className="relative min-h-screen w-full bg-slate-950 overflow-hidden font-sans">
            {/* Background with Warp Speed Effect */}
            <div
                className={`absolute inset-0 transition-all duration-1000 ${isWarpSpeed ? 'scale-150 blur-sm opacity-50' : 'scale-100 opacity-100'
                    }`}
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black" />
                <TwinklingStars />
            </div>

            {/* Main Game Container */}
            <div className="relative z-10 w-full h-screen p-4 flex flex-col items-center justify-between py-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <h1 className="text-4xl md:text-6xl font-serif text-white mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                        The Constellation
                    </h1>
                    <p className="text-blue-200/40 text-sm tracking-widest uppercase">
                        A Journey Through Our Stars
                    </p>
                </motion.div>

                {/* Current Milestone Display (Centralized to avoid clashing) */}
                <div className="h-24 flex items-center justify-center w-full max-w-lg px-4">
                    <AnimatePresence mode="wait">
                        {currentStep > 0 && currentStep <= starMap.length && (
                            <motion.div
                                key={`milestone-${currentStep}`}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-center shadow-[0_0_30px_rgba(255,255,255,0.05)]"
                            >
                                <span className="block text-[10px] text-yellow-400 uppercase tracking-[0.2em] mb-1 font-bold">
                                    Memory #{currentStep}
                                </span>
                                <p className="text-white text-lg md:text-xl font-medium leading-tight">
                                    {starMap[currentStep - 1].label}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="relative w-full max-w-[500px] aspect-square mx-auto my-8">
                    {/* SVG Lines */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                        <defs>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
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
                                    stroke="rgba(255, 215, 0, 0.4)"
                                    strokeWidth="2.5"
                                    strokeDasharray="1000"
                                    initial={{ strokeDashoffset: 1000 }}
                                    animate={{
                                        strokeDashoffset: 0,
                                        stroke: currentStep === starMap.length ? "rgba(255, 215, 0, 1)" : "rgba(255, 230, 100, 0.6)",
                                    }}
                                    filter="url(#glow)"
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                />
                            );
                        })}
                        {/* Close the heart if completed */}
                        {currentStep === starMap.length && (
                            <motion.line
                                x1={`${starMap[starMap.length - 1].x}%`}
                                y1={`${starMap[starMap.length - 1].y}%`}
                                x2={`${starMap[0].x}%`}
                                y2={`${starMap[0].y}%`}
                                stroke="gold"
                                strokeWidth="3"
                                initial={{ strokeDashoffset: 1000 }}
                                animate={{ strokeDashoffset: 0 }}
                                filter="url(#glow)"
                                transition={{ duration: 1, ease: "easeInOut" }}
                            />
                        )}
                    </svg>

                    {/* Stars */}
                    {starMap.map((star) => {
                        const isCompleted = star.id <= currentStep;
                        const isActive = star.id === currentStep + 1;

                        return (
                            <div
                                key={star.id}
                                className="absolute"
                                style={{ left: `${star.x}%`, top: `${star.y}%`, transform: 'translate(-50%, -50%)' }}
                            >
                                <div className="relative group">
                                    <motion.button
                                        onClick={() => handleStarClick(star.id)}
                                        className={`
                      w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500
                      ${isCompleted ? 'bg-yellow-400 shadow-[0_0_20px_gold]' : 'bg-white/10 hover:bg-white/20 border border-white/20'}
                      ${isActive ? 'ring-2 ring-white scale-125 shadow-[0_0_15px_white]' : ''}
                    `}
                                        animate={isActive ? { scale: [1.1, 1.3, 1.1] } : {}}
                                        transition={isActive ? { repeat: Infinity, duration: 2 } : {}}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <div className={`w-3.5 h-3.5 rounded-full ${isCompleted ? 'bg-white' : 'bg-white/40'}`} />
                                    </motion.button>

                                    {/* Subtle index number for inactive stars */}
                                    {!isCompleted && (
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8px] text-white/40 font-bold pointer-events-none">
                                            {star.id}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="text-center">
                    <p className="text-blue-200/60 text-xs tracking-widest uppercase mb-2">
                        Status
                    </p>
                    <div className="h-6 overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={currentStep === starMap.length ? 'complete' : 'progress'}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-white font-medium"
                            >
                                {currentStep === starMap.length
                                    ? "A heart built from memories."
                                    : `Connecting point ${currentStep + 1} of 12`}
                            </motion.p>
                        </AnimatePresence>
                    </div>
                </div>
            </div>


            {/* Grand Finale Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg"
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white p-8 rounded-3xl max-w-md w-full text-center shadow-2xl relative"
                        >
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                            >
                                <X size={24} />
                            </button>

                            <div className="flex justify-center mb-6">
                                <Heart className="text-red-500 fill-red-500 w-16 h-16 animate-pulse" />
                            </div>

                            <h2 className="text-2xl font-serif text-slate-900 mb-4 font-bold">The Universe of Us</h2>
                            <p className="text-slate-600 leading-relaxed mb-8 text-lg italic">
                                "You connect all my dots. Every laugh, every garden walk, and every partnership has led to this. Happy Valentine's Day!"
                            </p>

                            <div className="flex flex-col gap-3">
                                <Button
                                    onClick={resetGame}
                                    className="bg-primary text-white rounded-full py-6 text-lg font-semibold hover:bg-primary/90 flex items-center justify-center gap-2"
                                >
                                    <RefreshCw size={20} />
                                    Replay Journey
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => navigate('/')}
                                    className="text-slate-500"
                                >
                                    Back to Hub
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TheConstellation;
