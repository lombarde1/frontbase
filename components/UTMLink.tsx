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
  const { utmData } = useUTMContext();

  const getUrlWithUTMs = (url: string) => {
    try {
      // Verifica se está no ambiente do cliente
      if (typeof window === 'undefined') {
        return href;
      }

      const urlObj = new URL(url.startsWith('http') ? url : `${window.location.origin}${url}`);
      const params = new URLSearchParams(urlObj.search);

      // Adiciona UTMs apenas se existirem no utmData
      if (utmData) {
        if (utmData.utm_source) params.set('utm_source', utmData.utm_source);
        if (utmData.utm_medium) params.set('utm_medium', utmData.utm_medium);
        if (utmData.utm_campaign) params.set('utm_campaign', utmData.utm_campaign);
        if (utmData.utm_content) params.set('utm_content', utmData.utm_content);
        if (utmData.utm_term) params.set('utm_term', utmData.utm_term);
      }

      urlObj.search = params.toString();
      console.log('URL com UTMs:', urlObj.href);
      return urlObj.href;
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