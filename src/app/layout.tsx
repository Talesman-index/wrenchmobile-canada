import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/store';
import { ToastProvider } from '@/components/ui/ToastProvider';
import TopBar from '@/components/navigation/TopBar';
import PwaRegister from '@/components/pwa/PwaRegister';

export const metadata: Metadata = {
  metadataBase: new URL('https://wrenchmobile-london.co.uk'),
  title: 'WrenchMobile London | Certified Mobile Mechanics At Your Doorstep',
  description:
    'Car trouble in London? Book an IMI-certified mobile mechanic directly to your home, office or roadside. Fast dealer-grade diagnostics & on-site repairs across Greater London.',
  manifest: '/manifest.json',
  keywords: [
    'mobile mechanic london',
    'mechanic at home london',
    'breakdown recovery london',
    'mobile car repair london',
    'mobile battery replacement',
    'mobile oil service',
    'brake pads replacement',
    'IMI certified mechanic',
  ],
  authors: [{ name: 'WrenchMobile London Ltd' }],
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://wrenchmobile-london.co.uk',
    siteName: 'WrenchMobile London',
    title: 'WrenchMobile London | Mobile Mechanics & Roadside Assistance',
    description:
      'London’s #1 on-demand mobile mechanic service. Same-day appointments, driveway diagnostics and IMI-certified master technicians.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'WrenchMobile London - On-Demand Mobile Vehicle Servicing',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WrenchMobile London | Certified Mobile Mechanics At Your Doorstep',
    description:
      'Car won’t start? We bring the garage to you. On-site diagnostics and repairs across London.',
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
    <html lang="en" className="h-full bg-[#f8f9fd] text-[#181528] antialiased selection:bg-[#5e17eb] selection:text-white">
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
