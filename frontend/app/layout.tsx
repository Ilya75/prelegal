import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Prelegal — Mutual NDA Creator',
  description: 'Create and download a Mutual Non-Disclosure Agreement',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50">{children}</body>
    </html>
  );
}
