import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/store';
import { ToastProvider } from '@/components/ui/ToastProvider';
import TopBar from '@/components/navigation/TopBar';
import PwaRegister from '@/components/pwa/PwaRegister';

export const metadata: Metadata = {
  title: 'MécanoMobile Canada | Mécaniciens Mobiles à Domicile',
  description:
    'Panne de voiture ? Des mécaniciens mobiles certifiés Sceau Rouge interviennent directement à votre domicile ou bureau à Montréal, Québec, Gatineau, Ottawa, Toronto. Aucun remorquage requis.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-192.svg',
    apple: '/icons/icon-192.svg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MécanoMobile',
  },
};

export const viewport: Viewport = {
  themeColor: '#0c1f38',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full bg-[#f4f6fa] text-slate-900 antialiased selection:bg-[#ff6b00] selection:text-white">
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      </head>
      <body className="min-h-full flex flex-col bg-[#f4f6fa]">
        <AppProvider>
          <ToastProvider>
            <TopBar />
            <PwaRegister />
            <main className="flex-1 flex flex-col">{children}</main>
          </ToastProvider>
        </AppProvider>
      </body>
    </html>
  );
}
