import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

const STORAGE_KEY = 'valentine-unlock-all';

interface UnlockContextType {
  unlockAll: boolean;
  setUnlockAll: (value: boolean) => void;
  toggleUnlockAll: () => void;
}

const UnlockContext = createContext<UnlockContextType | undefined>(undefined);

export function UnlockProvider({ children }: { children: ReactNode }) {
  const [unlockAll, setUnlockAllState] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  });

  const setUnlockAll = useCallback((value: boolean) => {
    setUnlockAllState(value);
    localStorage.setItem(STORAGE_KEY, value.toString());
  }, []);

  const toggleUnlockAll = useCallback(() => {
    setUnlockAllState(prev => {
      const newValue = !prev;
      localStorage.setItem(STORAGE_KEY, newValue.toString());
      return newValue;
    });
  }, []);

  // Sync across tabs/windows
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setUnlockAllState(e.newValue === 'true');
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <UnlockContext.Provider value={{ unlockAll, setUnlockAll, toggleUnlockAll }}>
      {children}
    </UnlockContext.Provider>
  );
}

export function useUnlockAll() {
  const context = useContext(UnlockContext);
  if (context === undefined) {
    throw new Error('useUnlockAll must be used within an UnlockProvider');
  }
  return context;
}
