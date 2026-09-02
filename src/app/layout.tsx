import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/store';
import { ToastProvider } from '@/components/ui/ToastProvider';
import TopBar from '@/components/navigation/TopBar';
import PwaRegister from '@/components/pwa/PwaRegister';

export const metadata: Metadata = {
  metadataBase: new URL('https://wrenchmobile-canada.vercel.app'),
  title: 'WrenchMobile Canada | Mécaniciens Mobiles Certifiés à Domicile',
  description:
    'Panne de voiture ? Réservez un mécanicien automobile certifié Sceau Rouge directement dans votre allée ou au bureau. Diagnostic & dépannage rapide sans remorquage au Canada.',
  manifest: '/manifest.json',
  keywords: [
    'mécanicien mobile',
    'mécanique à domicile',
    'dépannage auto montréal',
    'mobile mechanic canada',
    'changement batterie domicile',
    'vidange huile mobile',
    'réparation freins',
    'sceau rouge',
  ],
  authors: [{ name: 'WrenchMobile Canada Inc.' }],
  openGraph: {
    type: 'website',
    locale: 'fr_CA',
    url: 'https://wrenchmobile-canada.vercel.app',
    siteName: 'WrenchMobile Canada',
    title: 'WrenchMobile Canada | Mécanique Mobile & Dépannage à Domicile',
    description:
      'Service automobile numéro 1 sur demande au Canada. Intervention le jour même, diagnostic sur place et techniciens certifiés Sceau Rouge.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'WrenchMobile Canada - Service de mécanique automobile mobile',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WrenchMobile Canada | Mécaniciens Mobiles à Domicile',
    description:
      'Panne de voiture ? Le mécanicien vient à vous. Diagnostic et réparation sur place sans remorquage.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: '/icons/icon-192.svg',
    apple: '/icons/icon-192.svg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'WrenchMobile',
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
