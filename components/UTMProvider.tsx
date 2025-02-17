// src/components/UTMProvider.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { UTMManager, UTMData } from '@/utils/utm-manager';

const UTMContext = createContext<UTMData | null>(null);

export function UTMProvider({ children }: { children: React.ReactNode }) {
  const [utmData, setUtmData] = useState<UTMData | null>(null);

  useEffect(() => {
    const initUTMs = async () => {
      const manager = UTMManager.getInstance();
      await manager.fetchStoredUTMs();
      setUtmData(manager.getUTMData());
    };

    initUTMs();
  }, []);

  return (
    <UTMContext.Provider value={utmData}>
      {children}
    </UTMContext.Provider>
  );
}

export const useUTMContext = () => useContext(UTMContext);