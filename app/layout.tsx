import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from "sonner";
import Script from 'next/script';
import { UtmifyPixel } from '@/components/tracking/utmify-pixel';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pico Invest - O futuro do dinheiro',
  description: 'Compre, venda e gerencie centenas de criptomoedas de modo simples e seguro',
};

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