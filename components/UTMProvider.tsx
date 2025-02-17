import { createContext, useContext, useEffect, useState } from 'react';
import { UTMManager } from '@/utils/utm-manager';

// Interface para a resposta da API
interface APIResponse {
  success: boolean;
  found: boolean;
  data: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
    timestamp?: number;
  };
}

// Interface para os dados UTM formatados
interface UTMData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

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
        const apiResponse = manager.getUTMData() as APIResponse;
        
        // Formata os dados antes de salvar no estado
        if (apiResponse && apiResponse.success && apiResponse.data) {
          const formattedData: UTMData = {
            utm_source: apiResponse.data.utm_source,
            utm_medium: apiResponse.data.utm_medium,
            utm_campaign: apiResponse.data.utm_campaign,
            utm_content: apiResponse.data.utm_content,
            utm_term: apiResponse.data.utm_term
          };
          
          // Remove propriedades undefined
          Object.keys(formattedData).forEach(key => {
            if (formattedData[key as keyof UTMData] === undefined) {
              delete formattedData[key as keyof UTMData];
            }
          });
          
          console.log('UTMs formatadas:', formattedData);
          setUtmData(formattedData);
        }
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

export const useUTMContext = () => {
  const context = useContext(UTMContext);
  if (!context) {
    throw new Error('useUTMContext deve ser usado dentro de um UTMProvider');
  }
  return context;
};