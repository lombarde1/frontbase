'use client';

// components/tracking/utmify-pixel.tsx
import Script from 'next/script';
import { useEffect } from 'react';
import { persistTrackingParams } from '@/services/tracking';

export function UtmifyPixel() {
  useEffect(() => {
    // Função assíncrona para inicializar o tracking
    const initializeTracking = async () => {
      // Persiste parâmetros UTM na sessão
      await persistTrackingParams();
    };

    initializeTracking();

    // Adiciona listener para eventos de conversão personalizados
    const handlePixGenerated = (detail: any) => {
      if (window.utmify) {
        window.utmify('track', 'pix_generated', {
          value: detail.amount,
          transaction_id: detail.transactionId
        });
      }
    };

    const handlePixPaid = (detail: any) => {
      if (window.utmify) {
        window.utmify('track', 'pix_paid', {
          value: detail.amount,
          transaction_id: detail.transactionId
        });
      }
    };

    window.addEventListener('pix_generated', handlePixGenerated);
    window.addEventListener('pix_paid', handlePixPaid);

    return () => {
      window.removeEventListener('pix_generated', handlePixGenerated);
      window.removeEventListener('pix_paid', handlePixPaid);
    };
  }, []);

  return (


    <Script id="utmify-pixel" strategy="afterInteractive">
      {`
        window.pixelId = "67b2d45f34f33f281dd438b4";
        var a = document.createElement("script");
        a.setAttribute("async", "");
        a.setAttribute("defer", "");
        a.setAttribute("src", "https://cdn.utmify.com.br/scripts/pixel/pixel.js");
        document.head.appendChild(a);
      `}
    </Script>
  );
}

// Adicione essas definições de tipo
declare global {
  interface Window {
    utmify?: (event: string, action: string, params?: any) => void;
    pixelId: string;
  }
}