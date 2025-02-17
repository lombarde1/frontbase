// components/UTMLink.tsx
'use client';

import Link from 'next/link';
import { useUTMContext } from '@/components/UTMProvider';

interface UTMLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export function UTMLink({ href, children, ...props }: UTMLinkProps) {
  const { utmData, clientIP } = useUTMContext();

  const getUrlWithUTMs = (url: string) => {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `${window.location.origin}${url}`);
      const params = new URLSearchParams(urlObj.search);

      // Adiciona o IP se disponível
      if (clientIP) {
        params.set('ip', clientIP);
      }

      // Adiciona os UTMs se disponíveis
      if (utmData) {
        if (utmData.utm_source) params.set('utm_source', String(utmData.utm_source));
        if (utmData.utm_medium) params.set('utm_medium', String(utmData.utm_medium));
        if (utmData.utm_campaign) params.set('utm_campaign', String(utmData.utm_campaign));
        if (utmData.utm_content) params.set('utm_content', String(utmData.utm_content));
        if (utmData.utm_term) params.set('utm_term', String(utmData.utm_term));
        if (utmData.src) params.set('src', String(utmData.src));
        if (utmData.sck) params.set('sck', String(utmData.sck));
      }
console.log(`utmData utms: ${utmData}`);
      console.log('URL final com UTMs:', urlObj.toString());
      // Retorna a URL final
      const finalPath = urlObj.pathname + (params.toString() ? `?${params.toString()}` : '');
      return url.startsWith('http') ? urlObj.toString() : finalPath;
    } catch (error) {
      console.error('Erro ao adicionar UTMs na URL:', error);
      return url;
    }
  };

  return (
    <Link href={getUrlWithUTMs(href)} {...props}>
      {children}
    </Link>
  );
}