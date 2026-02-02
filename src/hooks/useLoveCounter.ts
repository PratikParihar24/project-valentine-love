import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'valentine-love-counter';

export function useLoveCounter() {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setCount(parseInt(stored, 10) || 0);
    }
  }, []);

  const increment = useCallback(() => {
    setCount(prev => {
      const newCount = prev + 1;
      localStorage.setItem(STORAGE_KEY, newCount.toString());
      return newCount;
    });
  }, []);

  const reset = useCallback(() => {
    setCount(0);
    localStorage.setItem(STORAGE_KEY, '0');
  }, []);

  return { count, increment, reset };
}