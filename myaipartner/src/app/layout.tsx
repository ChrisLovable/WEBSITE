import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'My AI Partner | AI Consulting in South Africa',
  description: 'Your partner in AI transformation. Strategy, training, automation, and implementation for businesses across industries.',
  metadataBase: new URL('https://myaipartner.co.za')
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        {children}
      </body>
    </html>
  );
}


