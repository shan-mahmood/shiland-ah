import type { Metadata, Viewport } from 'next';
import { CLINIC_NAME } from '@/lib/config';
import './globals.css';

// No Open Graph, no Twitter card, no sitemap — by design. metadata.robots
// renders <meta name="robots" content="noindex, nofollow, noarchive"> into
// every page's <head>, including 404.
export const metadata: Metadata = {
  title: CLINIC_NAME,
  description: 'How did we do?',
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    googleBot: { index: false, follow: false, noarchive: true },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#15594B',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
