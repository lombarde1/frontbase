// hooks/useUTMNavigation.ts
'use client';

import { useRouter } from 'next/navigation';
import { useUTMContext } from '@/components/UTMProvider';

export function useUTMNavigation() {
  const router = useRouter();
  const { utmData } = useUTMContext();

  const navigateWithUTMs = (path: string) => {
    try {
      const url = new URL(path.startsWith('http') ? path : `${window.location.origin}${path}`);
      
      // Adiciona UTMs se existirem
      if (utmData) {
        const utmParams = [
          'utm_source',
          'utm_medium',
          'utm_campaign',
          'utm_content',
          'utm_term',
          'src',
          'sck'
        ];

        utmParams.forEach(param => {
          if (utmData[param]) {
            url.searchParams.set(param, utmData[param]);
          }
        });
      }

      router.push(url.pathname + url.search);
    } catch (error) {
      console.error('Erro ao navegar com UTMs:', error);
      router.push(path);
    }
  };

  return { navigateWithUTMs };
}