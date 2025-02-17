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
  const utmData = useUTMContext();

  // Adiciona UTMs à URL
  const getUrlWithUTMs = (url: string) => {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `${window.location.origin}${url}`);
      const params = new URLSearchParams(urlObj.search);

      if (utmData) {
        Object.entries(utmData).forEach(([key, value]) => {
          if (key !== 'timestamp' && value && !params.has(key)) {
            params.set(key, value);
          }
        });
      }

      urlObj.search = params.toString();
      return url.startsWith('http') ? urlObj.toString() : `${urlObj.pathname}${urlObj.search}`;
    } catch {
      return url;
    }
  };

  return (
    <Link href={getUrlWithUTMs(href)} {...props}>
      {children}
    </Link>
  );
}