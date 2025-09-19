import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowRight, Building2 } from 'lucide-react';
import { servicesOverview } from '@/data/services';
import { industries } from '@/data/industries';
import ContactSection from '@/components/ContactSection';

export default function HomePage() {
  return (
    <div>
      <Header />
      {/* Hero */}
      <section className="section pt-20 ai-gradient">
        <div className="container-max grid gap-8 md:grid-cols-2 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Your Partner in AI Transformation</h1>
            <p className="text-lg text-gray-600 max-w-2xl">We help businesses adopt, scale, and win with AI—from strategy and training to automation and implementation.</p>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/interest" className="btn-primary">Get Started</Link>
              <Link href="#services" className="inline-flex items-center gap-2 text-brand-700 font-medium hover:gap-3 transition-all">
                Explore Services <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] w-full rounded-2xl bg-gradient-to-br from-brand-500/20 via-purple-500/20 to-cyan-500/20 border border-gray-200/60 shadow-lg"></div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="section">
        <div className="container-max grid gap-8 md:grid-cols-2 items-start">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-semibold">About Us</h2>
            <p className="text-gray-600">My AI Partner helps organizations design and execute AI strategies that deliver measurable business value. We bring cross-industry expertise, practical delivery, and a focus on responsible AI.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[{icon: Layers, label: 'Expertise'}, {icon: Rocket, label: 'Strategy-Driven'}, {icon: Shield, label: 'Scalable & Secure'}, {icon: Sparkles, label: 'Ongoing Support'}].map(({icon:Icon,label}) => (
                <div key={label} className="card p-5 flex items-center gap-3">
                  <Icon className="h-5 w-5 text-brand-600"/>
                  <span className="font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="card p-6">
              <h3 className="font-semibold text-lg mb-2">Our Mission</h3>
              <p className="text-gray-600">Helping businesses adopt and thrive with AI—responsibly and at scale.</p>
            </div>
            <div className="card p-6">
              <h3 className="font-semibold text-lg mb-2">Who We Serve</h3>
              <p className="text-gray-600">From startups to enterprises across Retail, Finance, Healthcare, Education, Manufacturing, and more.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="section bg-gray-50">
        <div className="container-max">
          <h2 className="text-3xl md:text-4xl font-semibold mb-8">Services</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {servicesPreview.map((s) => (
              <div key={s.title} className="card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <s.icon className="h-5 w-5 text-brand-600" />
                  <h3 className="font-semibold">{s.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{s.desc}</p>
                <Link href="/interest" className="inline-flex items-center gap-2 text-brand-700 font-medium hover:gap-3 transition-all">
                  Learn More <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section id="industries" className="section">
        <div className="container-max">
          <h2 className="text-3xl md:text-4xl font-semibold mb-8">Industries</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {industries.map((label) => (
              <div key={label} className="card p-6 flex items-center gap-3">
                <Building2 className="h-5 w-5 text-brand-600" />
                <span className="font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />

      <Footer />
    </div>
  );
}

const servicesPreview = servicesOverview;


