'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'high-contrast';

interface HighContrastContextValue {
  highContrast: boolean;
  toggleHighContrast: () => void;
}

const HighContrastContext = createContext<HighContrastContextValue>({
  highContrast: false,
  toggleHighContrast: () => {},
});

export function HighContrastProvider({ children }: { children: React.ReactNode }) {
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'true') {
      setHighContrast(true);
      document.body.classList.add('high-contrast');
    }
  }, []);

  const toggleHighContrast = () => {
    setHighContrast(prev => {
      const next = !prev;
      if (next) {
        document.body.classList.add('high-contrast');
        localStorage.setItem(STORAGE_KEY, 'true');
      } else {
        document.body.classList.remove('high-contrast');
        localStorage.setItem(STORAGE_KEY, 'false');
      }
      return next;
    });
  };

  return (
    <HighContrastContext.Provider value={{ highContrast, toggleHighContrast }}>
      {children}
    </HighContrastContext.Provider>
  );
}

export function useHighContrast() {
  return useContext(HighContrastContext);
}
