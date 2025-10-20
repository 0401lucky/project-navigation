import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Density = 'comfortable' | 'compact' | 'condensed';

interface DensityContextType {
  density: Density;
  cycleDensity: () => void;
  setDensity: (d: Density) => void;
}

const DensityContext = createContext<DensityContextType | undefined>(undefined);

const STORAGE_KEY = 'ui-density';

export const DensityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [density, setDensity] = useState<Density>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Density | null;
    if (saved === 'comfortable' || saved === 'compact' || saved === 'condensed') return saved;
    return 'comfortable';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-density', density);
    localStorage.setItem(STORAGE_KEY, density);
  }, [density]);

  const cycleDensity = () => {
    setDensity((prev) => (prev === 'comfortable' ? 'compact' : prev === 'compact' ? 'condensed' : 'comfortable'));
  };

  const value = useMemo(() => ({ density, cycleDensity, setDensity }), [density]);

  return <DensityContext.Provider value={value}>{children}</DensityContext.Provider>;
};

export const useDensity = () => {
  const ctx = useContext(DensityContext);
  if (!ctx) throw new Error('useDensity 必须在 DensityProvider 内使用');
  return ctx;
};

