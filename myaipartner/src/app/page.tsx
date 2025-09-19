import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
 
 
import { industries } from '@/data/industries';
import ContactSection from '@/components/ContactSection';

export default function HomePage() {
  return (
    <div>
      <Header />
      {/* Hero */}
      <section className="section pt-20">
        <div className="container-max grid gap-8 md:grid-cols-2 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">Your Partner in AI Transformation</h1>
            <p className="text-lg text-gray-300 max-w-2xl">We help businesses adopt, scale, and win with AI—from strategy and training to automation and implementation.</p>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/interest" className="btn-primary">Get Started</Link>
              <Link href="#services" className="inline-flex items-center gap-2 text-gray-300 hover:text-white font-medium transition-all">
                Explore Services →
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] w-full rounded-2xl border border-white/10 bg-neutral-900"></div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="section">
        <div className="container-max grid gap-8 md:grid-cols-2 items-start">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-semibold text-white">About Us</h2>
            <p className="text-gray-300">My AI Partner helps organizations design and execute AI strategies that deliver measurable business value. We bring cross-industry expertise, practical delivery, and a focus on responsible AI.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {['Expertise','Strategy-Driven','Scalable & Secure','Ongoing Support'].map((label) => (
                <div key={label} className="card p-5 font-medium text-white">{label}</div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="card p-6">
              <h3 className="font-semibold text-lg mb-2 text-white">Our Mission</h3>
              <p className="text-gray-300">Helping businesses adopt and thrive with AI—responsibly and at scale.</p>
            </div>
            <div className="card p-6">
              <h3 className="font-semibold text-lg mb-2 text-white">Who We Serve</h3>
              <p className="text-gray-300">From startups to enterprises across Retail, Finance, Healthcare, Education, Manufacturing, and more.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="section">
        <div className="container-max">
          <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-white">Services</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {simpleServices.map((title) => (
              <div key={title} className="card p-6">
                <div className="font-semibold text-white">{title}</div>
                <div className="mt-4">
                  <Link href="/interest" className="inline-flex items-center gap-2 text-gray-300 hover:text-white font-medium transition-all">Get details →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section id="industries" className="section">
        <div className="container-max">
          <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-white">Industries</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {industries.map((label) => (
              <div key={label} className="card p-6 font-medium text-white">{label}</div>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />

      <Footer />
    </div>
  );
}

const simpleServices = [
  'Strategy & Advisory',
  'Training & Enablement',
  'Automation & Workflows',
  'Data & Analytics',
  'Custom AI Tools & Chatbots',
  'Dashboards & Reporting'
];


