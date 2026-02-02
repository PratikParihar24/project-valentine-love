import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'valentine-unlock-all';

export function useUnlockAll() {
  const [unlockAll, setUnlockAllState] = useState<boolean>(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'true') {
      setUnlockAllState(true);
    }
  }, []);

  const setUnlockAll = useCallback((value: boolean) => {
    setUnlockAllState(value);
    localStorage.setItem(STORAGE_KEY, value.toString());
  }, []);

  const toggleUnlockAll = useCallback(() => {
    setUnlockAll(!unlockAll);
  }, [unlockAll, setUnlockAll]);

  return { unlockAll, setUnlockAll, toggleUnlockAll };
}