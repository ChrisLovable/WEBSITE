import type { Metadata } from 'next';
import { Exo_2, Orbitron } from 'next/font/google';
import '@/styles/globals.css';
import AIChatAssistant from '@/components/AIChatAssistant';
import ThemeBoot from '@/components/ThemeBoot';
import AnalyticsProvider from '@/components/AnalyticsProvider';
import AdminDashboard from '@/components/AdminDashboard';

const exo2 = Exo_2({ subsets: ['latin'] });
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron' });

export const metadata: Metadata = {
  title: 'AI Consulting & Custom Software Development South Africa | myAIpartner',
  description:
    "South Africa's AI consulting partner. We deliver AI strategy, business process automation, custom software, mobile apps, AI training, and forensic email investigation across South Africa.",
  keywords: [
    'AI consulting South Africa',
    'AI strategy Johannesburg',
    'business process automation SA',
    'custom software development South Africa',
    'AI training South Africa',
    'forensic email investigation SA',
    'AI keynote speaker South Africa',
    'competitor intelligence South Africa',
    'KI konsultant Suid-Afrika',
    'kunsmatige intelligensie strategie Johannesburg',
    'besigheidsprosesoutomatisering SA',
    'pasgemaakte sagteware ontwikkeling Suid-Afrika',
    'KI opleiding Suid-Afrika',
    'forensiese e-pos ondersoek SA',
    'KI spreker Suid-Afrika',
    'mededinger intelligensie Suid-Afrika'
  ],
  metadataBase: new URL('https://www.myaipartner.co.za'),
  alternates: {
    canonical: 'https://www.myaipartner.co.za/',
    languages: {
      'en-ZA': 'https://www.myaipartner.co.za/',
      af: 'https://www.myaipartner.co.za/',
      'x-default': 'https://www.myaipartner.co.za/'
    }
  },
  robots: {
    index: true,
    follow: true
  },
  other: {
    'geo.region': 'ZA',
    'geo.placename': 'South Africa',
    'geo.position': '-26.2041;28.0473',
    ICBM: '-26.2041, 28.0473'
  },
  openGraph: {
    title: 'AI Consulting & Custom Software Development South Africa | myAIpartner',
    description:
      "South Africa's AI consulting partner. AI strategy, automation, custom software, mobile apps, training and forensic investigation.",
    url: 'https://www.myaipartner.co.za/',
    siteName: 'myAIpartner',
    type: 'website',
    locale: 'en_ZA',
    alternateLocale: 'af_ZA',
    images: [
      {
        url: '/logo.png',
        width: 818,
        height: 818,
        type: 'image/png',
        alt: 'My AI Partner logo'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Consulting & Custom Software Development South Africa | myAIpartner',
    description:
      "South Africa's AI consulting partner. AI strategy, automation, custom software, mobile apps, training and forensic investigation.",
    images: ['/logo.png']
  },
  icons: {
    icon: [{ url: '/logo.png', type: 'image/png', sizes: 'any' }],
    apple: [{ url: '/logo.png', type: 'image/png' }]
  }
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'myAIpartner',
  url: 'https://www.myaipartner.co.za',
  logo: 'https://www.myaipartner.co.za/logo.png',
  areaServed: {
    '@type': 'Country',
    name: 'South Africa'
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'ZA'
  },
  description:
    'AI consulting, business process automation, custom software development, mobile app development, AI training, forensic email investigation and corporate AI speaking in South Africa. Suid-Afrika se KI konsultasievennoot. Ons lewer KI-strategie, besigheidsprosesoutomatisering, pasgemaakte sagteware, mobiele toepassings, KI-opleiding en forensiese e-posondersoeke regoor Suid-Afrika.',
  serviceType: [
    'AI Strategy Consulting',
    'Business Process Automation',
    'Custom Software Development',
    'Mobile App Development',
    'AI Training',
    'Forensic Email Investigation',
    'Corporate AI Speaking',
    'Competitor Intelligence'
  ],
  sameAs: ['https://www.linkedin.com/company/myaipartner']
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${exo2.className} ${orbitron.variable}`}>
      <body className="min-h-screen theme-slateblue" suppressHydrationWarning>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <ThemeBoot />
        <AnalyticsProvider />
        <AdminDashboard />
        {children}
        <AIChatAssistant />
      </body>
    </html>
  );
}


