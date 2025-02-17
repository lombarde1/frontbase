'use client';

import { UTMProvider } from '@/components/UTMProvider';
import { UtmifyScript } from '@/components/tracking/UtmifyScript';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UTMProvider>
      <UtmifyScript />
      {children}
    </UTMProvider>
  );
}