import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'FlightScope – Minimal Real-Time Flight Tracker',
  description: 'A clean and minimal real-time flight tracker, an alternative to FlightRadar24, displaying live aircraft positions on an interactive world map.',
  keywords: ['flight tracker', 'live flights', 'aircraft', 'OpenSky Network', 'map', 'real-time', 'minimal', 'FlightRadar24 alternative'],
  openGraph: {
    title: 'FlightScope – Minimal Real-Time Flight Tracker',
    description: 'A clean and minimal real-time flight tracker, an alternative to FlightRadar24, displaying live aircraft positions on an interactive world map.',
    url: 'https://flightscope.vercel.app', // Replace with your Vercel deployment URL
    siteName: 'FlightScope',
    images: [
      {
        url: 'https://images.pexels.com/photos/1309754/pexels-photo-1309754.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', // Example Pexels image
        width: 1200,
        height: 630,
        alt: 'FlightScope - Live Flight Tracking Map',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FlightScope – Minimal Real-Time Flight Tracker',
    description: 'A clean and minimal real-time flight tracker, an alternative to FlightRadar24, displaying live aircraft positions on an interactive world map.',
    images: ['https://images.pexels.com/photos/1309754/pexels-photo-1309754.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'], // Example Pexels image
    creator: '@yourtwitterhandle', // Replace with your Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // Add other meta tags as needed
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
