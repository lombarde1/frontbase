import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from "sonner";
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Coinbase - O futuro do dinheiro',
  description: 'Compre, venda e gerencie centenas de criptomoedas de modo simples e seguro',
};

// Componente para o Utmify Pixel
function UtmifyPixel() {
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