'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { useUTMContext } from '@/components/UTMProvider';

export function UtmifyScript() {
  const { utmData } = useUTMContext();

  // Apenas carrega o script, a adição dos parâmetros já é feita no Provider
  return (
    <Script
      src="https://cdn.utmify.com.br/scripts/utms/latest.js"
      data-utmify-prevent-subids
    />
  );
}