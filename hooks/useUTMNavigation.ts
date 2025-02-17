// hooks/useUTMNavigation.ts
'use client';

import { useRouter } from 'next/navigation';
import { useUTMContext } from '@/components/UTMProvider';

export function useUTMNavigation() {
  const router = useRouter();
  const utmData = useUTMContext();

  const navigateWithUTMs = (url: string) => {
    try {
      // Criar uma URL base
      const baseUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
      const urlObj = new URL(baseUrl);
      
      // Criar um novo objeto URLSearchParams com os parâmetros existentes
      const params = new URLSearchParams(urlObj.search);

      // Adicionar ou atualizar os parâmetros UTM
      if (utmData) {
        Object.entries(utmData).forEach(([key, value]) => {
          if (key !== 'timestamp' && value) {
            params.set(key, value.toString());
          }
        });
      }

      // Construir a URL final
      const queryString = params.toString();
      const finalPath = `${urlObj.pathname}${queryString ? `?${queryString}` : ''}`;

      // Navegar para a URL final
      router.push(finalPath);
    } catch (error) {
      console.error('Erro na navegação:', error);
      router.push(url);
    }
  };

  return { navigateWithUTMs };
}