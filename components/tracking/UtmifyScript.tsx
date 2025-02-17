// components/tracking/UtmifyScript.tsx
'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { useUTMContext } from '@/components/UTMProvider';

export function UtmifyScript() {
  const utmData = useUTMContext();
  const [shouldLoadScript, setShouldLoadScript] = useState(false);

  useEffect(() => {
    // Verifica se temos UTMs e se estamos no cliente
    if (utmData && typeof window !== 'undefined') {
      // Constrói a URL atual com as UTMs
      const url = new URL(window.location.href);
      const params = new URLSearchParams(url.search);

      // Adiciona as UTMs se não existirem
      Object.entries(utmData).forEach(([key, value]) => {
        if (key !== 'timestamp' && value && !params.has(key)) {
          params.set(key, value);
        }
      });

      // Atualiza a URL com as UTMs
      const newUrl = `${url.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
      window.history.replaceState({}, '', newUrl);

      // Marca que podemos carregar o script
      setShouldLoadScript(true);
    }
  }, [utmData]);

  if (!shouldLoadScript) return null;

  return (
    <Script
      src="https://cdn.utmify.com.br/scripts/utms/latest.js"
      data-utmify-prevent-subids
      async
      defer
      strategy="lazyOnload"
    />
  );
}