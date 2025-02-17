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
        const data = manager.getUTMData();
        
        // Formata os dados antes de salvar no estado
        if (data) {
            const formattedData: UTMData = {
                utm_source: data.utm_source || undefined,
                utm_medium: data.utm_medium || undefined,
                utm_campaign: data.utm_campaign || undefined,
                utm_content: data.utm_content || undefined,
                utm_term: data.utm_term || undefined,
                src: data.src || undefined,
                sck: data.sck || undefined
              };
              
          
          console.log('UTMs formatadas no provider:', formattedData);
          setUtmData(formattedData);
        }
      }
    };

    initUTMs();
  }, []);

  // Log quando o estado muda
  useEffect(() => {
    console.log('Estado atual do UTMProvider:', {
      clientIP,
      utmData
    });
  }, [clientIP, utmData]);

  return (
    <UTMContext.Provider value={{ utmData, clientIP }}>
      {children}
    </UTMContext.Provider>
  );
}

export const useUTMContext = () => {
  const context = useContext(UTMContext);
  if (!context) {
    throw new Error('useUTMContext deve ser usado dentro de um UTMProvider');
  }
  return context;
};