import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Outfit } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/lib/theme';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#06080f' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://trusty-ai.vercel.app'),
  title: { default: 'TRUSTY.bot — Intent authorization for AI agent payments', template: '%s | TRUSTY.bot' },
  description: 'Verify that agent purchases match human intent. Explore mandate checks for quantity, specifications and delivery across your financial workflows.',
  applicationName: 'TRUSTY.bot',
  icons: { icon: '/icon.png', shortcut: '/icon.png', apple: '/icon.png' },
  manifest: '/manifest.json',
  openGraph: { title: 'TRUSTY.bot — Human intent, intact.', description: 'Intent authorization for agent-powered financial workflows.', type: 'website', siteName: 'TRUSTY.bot', images: [{url: '/icon.png', width: 512, height: 512, alt: 'TRUSTY.bot'}] },
  twitter: { card: 'summary', title: 'TRUSTY.bot — Human intent, intact.', description: 'Verify the mandate before the purchase proceeds.', images: ['/icon.png'] },
  alternates: { canonical: '/' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body className={`${plusJakarta.className} min-h-screen flex flex-col font-sans antialiased selection:bg-blue-500/20 selection:text-[#0066FF] transition-colors duration-200`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
