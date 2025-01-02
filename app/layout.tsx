import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from "sonner";
import Script from 'next/script';
import { useEffect } from 'react';
import { persistTrackingParams } from '@/services/tracking';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Coinbase - O futuro do dinheiro',
  description: 'Compre, venda e gerencie centenas de criptomoedas de modo simples e seguro',
};

// Componente para o Utmify Pixel com eventos personalizados
function UtmifyPixel() {
  useEffect(() => {
    // Persiste parâmetros UTM na sessão
    persistTrackingParams();

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
    <>
      <Script id="utmify-pixel" strategy="afterInteractive">
        {`
          window.pixelId = "677688e0527f11f5cbca2100";
          var a = document.createElement("script");
          a.setAttribute("async", "");
          a.setAttribute("defer", "");
          a.setAttribute("src", "https://cdn.utmify.com.br/scripts/pixel/pixel.js");
          document.head.appendChild(a);
        `}
      </Script>
    </>
  );
}

// Adicione essas definições de tipo
declare global {
  interface Window {
    utmify?: (event: string, action: string, params?: any) => void;
    pixelId: string;
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <UtmifyPixel />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}