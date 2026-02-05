import { useState, useEffect, useCallback } from 'react';
import { useUnlockAll } from './useUnlockAll';
import { useToast } from './use-toast';

const UNLOCK_SEQUENCE = ['l', 'o', 'v', 'e'];
const RESET_SEQUENCE = ['r', 'e', 's', 'e', 't'];

export function useCheatCode() {
    const [input, setInput] = useState<string[]>([]);
    const { setUnlockAll } = useUnlockAll();
    const { toast } = useToast();

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        const key = event.key.toLowerCase();

        setInput(prev => {
            const newInput = [...prev, key].slice(-10); // Keep track of last 10 characters
            const joinedInput = newInput.join('');

            // Check for 'love'
            if (joinedInput.endsWith(UNLOCK_SEQUENCE.join(''))) {
                setUnlockAll(true);
                toast({
                    title: "Cheat Code Activated! ❤️",
                    description: "All days have been unlocked. Happy developing!",
                });
                return [];
            }

            // Check for 'reset'
            if (joinedInput.endsWith(RESET_SEQUENCE.join(''))) {
                setUnlockAll(false);
                toast({
                    title: "Lock System Reset! 🔒",
                    description: "All future dates are now locked again.",
                });
                return [];
            }

            return newInput;
        });
    }, [setUnlockAll, toast]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
}
