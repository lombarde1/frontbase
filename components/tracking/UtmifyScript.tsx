'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { useUTMContext } from '@/components/UTMProvider';

export function UtmifyScript() {
  const { utmData } = useUTMContext();
  const [shouldLoadScript, setShouldLoadScript] = useState(false);

  useEffect(() => {
    // Verifica se temos UTMs e se estamos no cliente
    if (utmData && typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      const params = new URLSearchParams(url.search);

      // Adiciona as UTMs se não existirem
      if (utmData.utm_source) params.set('utm_source', utmData.utm_source);
      if (utmData.utm_medium) params.set('utm_medium', utmData.utm_medium);
      if (utmData.utm_campaign) params.set('utm_campaign', utmData.utm_campaign);
      if (utmData.utm_content) params.set('utm_content', utmData.utm_content);
      if (utmData.utm_term) params.set('utm_term', utmData.utm_term);

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