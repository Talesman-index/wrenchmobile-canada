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
  themeColor: '#5e17eb',
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
    <html lang="fr" className="h-full bg-[#f8f9fd] text-[#181528] antialiased selection:bg-[#5e17eb] selection:text-white">
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      </head>
      <body className="min-h-full flex flex-col bg-[#f8f9fd]">
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
