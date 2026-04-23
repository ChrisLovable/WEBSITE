import type { Metadata } from 'next';
import { Exo_2, Orbitron } from 'next/font/google';
import '@/styles/globals.css';

const exo2 = Exo_2({ subsets: ['latin'] });
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron' });

export const metadata: Metadata = {
  title: 'My AI Partner | AI Consulting in South Africa',
  description: 'Your partner in AI transformation. Strategy, training, automation, and implementation for businesses across industries.',
  metadataBase: new URL('https://myaipartner.co.za'),
  openGraph: {
    title: 'My AI Partner | AI Consulting in South Africa',
    description:
      'Your partner in AI transformation. Strategy, training, automation, and implementation for businesses across industries.',
    url: 'https://myaipartner.co.za',
    siteName: 'My AI Partner',
    type: 'website',
    images: [
      {
        url: '/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'My AI Partner logo'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My AI Partner | AI Consulting in South Africa',
    description:
      'Your partner in AI transformation. Strategy, training, automation, and implementation for businesses across industries.',
    images: ['/logo.jpg']
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${exo2.className} ${orbitron.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}


