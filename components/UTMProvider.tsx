'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { UTMManager } from '@/utils/utm-manager';

const UTMContext = createContext<any>(null);

export function UTMProvider({ children }: { children: React.ReactNode }) {
  const [utmData, setUtmData] = useState(null);

  useEffect(() => {
    async function init() {
      try {
        console.log('Iniciando busca de UTMs...');
        const manager = UTMManager.getInstance();
        
        // Busca as UTMs
        const success = await manager.fetchStoredUTMs();
        if (success) {
          const data = manager.getUTMData();
          console.log('UTMs obtidas do manager:', data);
          setUtmData(data);

          // Adiciona as UTMs na URL imediatamente
          if (data && typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            
            // Lista de todos os parâmetros UTM possíveis
            const utmParams = [
              'utm_source',
              'utm_medium',
              'utm_campaign',
              'utm_content',
              'utm_term',
              'src',
              'sck'
            ];

            // Adiciona cada parâmetro se existir no data
            utmParams.forEach(param => {
              if (data[param]) {
                url.searchParams.set(param, data[param]);
                console.log(`Adicionando ${param}:`, data[param]);
              }
            });

            window.history.replaceState({}, '', url.href);
            console.log('URL atualizada com UTMs:', url.href);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar UTMs:', error);
      }
    }

    init();
  }, []);

  return (
    <UTMContext.Provider value={{ utmData }}>
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