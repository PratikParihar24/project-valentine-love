import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const MESSAGES: Record<string, string[]> = {
    '/': [
        "Hi Mikuu! Welcome to your special archives! 👋",
        "Explore every day, I've hidden surprises for you!",
        "You look beautiful today btw! ✨"
    ],
    '/rose-day': [
        "A garden just for you, Mikuu! 🌹",
        "Plant 50 roses for a big surprise! 🎁",
        "I love you more than all these flowers!"
    ],
    '/propose-day': [
        "Sign the contract Mikuu! It's binding! 📜",
        "Add your own terms... but be nice! 😉",
        "I promise to keep all my promises!"
    ],
    '/chocolate-day': [
        "Catch them all Mikuu! 🍫",
        "Don't let them fall! You got this!",
        "Sweets for my sweet! 🍭"
    ],
    '/teddy-day': [
        "Make the cutest buddy ever! 🧸",
        "Does he need glasses? Maybe a crown?",
        "Cuddle time!"
    ],
    '/promise-day': [
        "Promises are forever, Mikuu! 🤞",
        "We'll check this in a year... 📧",
        "I promise to always be your Chakudi!"
    ],
    '/hug-day': [
        "I need a big hug right now! 🤗",
        "Virtual hugs incoming!",
        "Squeeze the meter!"
    ],
    '/kiss-day': [
        "Mwah! 😘",
        "Catch all the kisses!",
        "One kiss is never enough!"
    ]
};

export const ChakudiGuide = () => {
    const location = useLocation();
    const [message, setMessage] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Determine message
        const path = location.pathname;
        const availableMessages = MESSAGES[path] || ["I love you Mikuu! ❤️", "Keep exploring!"];
        const randomMsg = availableMessages[Math.floor(Math.random() * availableMessages.length)];

        setMessage(randomMsg);
        setIsVisible(true);

        // Auto hide after 5 seconds
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 8000);

        return () => clearTimeout(timer);
    }, [location.pathname]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed bottom-4 left-4 z-50 flex items-end gap-2 pointer-events-none"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                >
                    {/* Character Image */}
                    <motion.img
                        src="/chakudi-boy.png"
                        alt="Chakudi Guide"
                        className="w-24 h-auto drop-shadow-xl mix-blend-multiply"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                    />

                    {/* Chat Bubble */}
                    <motion.div
                        className="bg-white/90 backdrop-blur-md text-foreground px-4 py-3 rounded-2xl rounded-bl-none shadow-lg max-w-[200px] mb-8 border border-primary/20"
                        initial={{ opacity: 0, x: -20, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <p className="text-sm font-medium leading-relaxed font-serif">
                            {message}
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
