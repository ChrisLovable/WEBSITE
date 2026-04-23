import type { Metadata } from 'next';
import { Exo_2, Orbitron } from 'next/font/google';
import '@/styles/globals.css';

const exo2 = Exo_2({ subsets: ['latin'] });
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron' });

export const metadata: Metadata = {
  title: 'My AI Partner | AI Consulting in South Africa',
  description: 'Your partner in AI transformation. Strategy, training, automation, and implementation for businesses across industries.',
  metadataBase: new URL('https://myaipartner.co.za')
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


