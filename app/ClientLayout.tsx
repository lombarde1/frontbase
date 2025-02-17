// app/ClientLayout.tsx
'use client';

import { UTMProvider } from '@/components/UTMProvider';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UTMProvider>
      {children}
    </UTMProvider>
  );
}