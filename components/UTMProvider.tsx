// src/components/UTMProvider.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { UTMManager, UTMData } from '@/utils/utm-manager';

interface UTMContextType {
  utmData: UTMData | null;
  clientIP: string | null;
}

const UTMContext = createContext<UTMContextType>({ utmData: null, clientIP: null });

export function UTMProvider({ children }: { children: React.ReactNode }) {
  const [utmData, setUtmData] = useState<UTMData | null>(null);
  const [clientIP, setClientIP] = useState<string | null>(null);

  useEffect(() => {
    const initUTMs = async () => {
      const manager = UTMManager.getInstance();
      
      // Primeiro obtém o IP
      const ip = await manager.getClientIP();
      setClientIP(ip);

      // Depois busca as UTMs
      if (ip) {
        await manager.fetchStoredUTMs();
        setUtmData(manager.getUTMData());
      }
    };

    initUTMs();
  }, []);

  return (
    <UTMContext.Provider value={{ utmData, clientIP }}>
      {children}
    </UTMContext.Provider>
  );
}

export const useUTMContext = () => useContext(UTMContext);