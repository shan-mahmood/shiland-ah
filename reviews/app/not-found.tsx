import type { Metadata } from 'next';
import { CLINIC_NAME } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Not found',
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    googleBot: { index: false, follow: false, noarchive: true },
  },
};

export default function NotFound() {
  return (
    <div className="page">
      <main className="card center">
        <h1>Page not found</h1>
        <p className="sub">This link doesn&apos;t lead anywhere.</p>
        <div className="footer">
          <strong>{CLINIC_NAME}</strong>
        </div>
      </main>
    </div>
  );
}
