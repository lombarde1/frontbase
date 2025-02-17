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

      // Adiciona UTMs dinamicamente
      if (utmData) {
        Object.entries(utmData).forEach(([key, value]) => {
          if (value) params.set(key, String(value));
        });
      }

      console.log('utmData utms:', JSON.stringify(utmData, null, 2));
      console.log('Parâmetros formatados:', params.toString());

      // Atualiza a URL com os parâmetros
      urlObj.search = params.toString();
      console.log('URL final com UTMs:', urlObj.href);

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
