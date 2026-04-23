"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { Route } from 'next';

export default function Header() {
  const pathname = usePathname();
  const [hash, setHash] = useState('');
  const serviceLinks = [
    { href: '/services/ai-strategy-business-consulting', label: 'AI Strategy & Business Consulting' },
    { href: '/services/business-process-automation-ai-driven', label: 'Business Process Automation' },
    { href: '/services/custom-software-development-ai-enabled', label: 'Custom Software Development' },
    { href: '/services/mobile-desktop-app-development', label: 'Mobile & Desktop App Development' },
    { href: '/services/ai-training-workforce-enablement', label: 'AI Training & Workforce Enablement' },
    { href: '/services/ediscovery-forensic-ai-querying-email-whatsapp', label: 'Forensic AI Email Investigation' },
    { href: '/services/corporate-ai-speaking-executive-briefings', label: 'Corporate AI Speaking' },
    { href: '/services/competitor-market-intelligence-ai-monitored', label: 'Competitor & Market Intelligence' }
  ];

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const updateHash = () => setHash(window.location.hash || '');
    updateHash();
    window.addEventListener('hashchange', updateHash);
    return () => window.removeEventListener('hashchange', updateHash);
  }, []);

  const activeItem =
    pathname === '/'
      ? hash === '#services'
          ? 'services'
          : 'home'
      : pathname.startsWith('/services/')
        ? 'services'
        : pathname === '/pricing-engagement-process'
          ? 'pricing'
          : pathname === '/b-bbee'
            ? 'b-bbee'
            : pathname === '/interest'
              ? 'contact'
            : 'home';

  const navClass = (isActive: boolean) =>
    `text-[10px] sm:text-xs md:text-sm tracking-wide md:tracking-widest transition-colors ${isActive ? 'text-cyan-400 border-b border-cyan-400 pb-1' : 'text-gray-300 hover:text-cyan-400'}`;

  return (
    <header className="sticky top-0 z-40 border-b border-cyan-400/40 bg-black/90 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-20 gap-2 sm:gap-3">
          <div className="flex items-center gap-2 pt-2 md:pt-32 shrink-0">
            <img
              src="/logo.jpg"
              alt="myAIpartner Logo"
              className="w-12 h-12 sm:w-20 sm:h-20 md:w-48 md:h-48 rounded-full object-cover border-2 border-cyan-500/30 shadow-[0_0_26px_rgba(6,182,212,0.45)] transition-all duration-300 hover:scale-110 hover:shadow-[0_0_60px_rgba(6,182,212,0.7)]"
            />
          </div>
          <nav className="flex items-center gap-2 sm:gap-5 md:gap-8 font-tech whitespace-nowrap">
            <Link href="/" className={navClass(activeItem === 'home')}>HOME</Link>
            <div className="relative group">
              <button type="button" className={navClass(activeItem === 'services')}>
                SERVICES
              </button>
              <div className="invisible fixed left-1/2 top-[5.25rem] z-50 w-[92vw] max-w-[30rem] -translate-x-1/2 border border-cyan-500/60 bg-black p-3 opacity-0 shadow-[0_0_24px_rgba(6,182,212,0.3)] backdrop-blur-md transition-all duration-200 group-hover:visible group-hover:opacity-100 md:absolute md:left-0 md:top-full md:mt-3 md:w-[30rem] md:translate-x-0">
                {serviceLinks.map((service) => (
                  <Link
                    key={service.href}
                    href={service.href as Route}
                    className="mb-2 block border border-cyan-500/45 bg-[#02141a] px-3 py-2.5 font-sans text-xs md:text-sm font-medium leading-snug tracking-normal text-cyan-100 shadow-[0_0_14px_rgba(6,182,212,0.15)] transition-all duration-200 last:mb-0 hover:border-cyan-300 hover:bg-cyan-900/40 hover:text-white hover:shadow-[0_0_20px_rgba(6,182,212,0.35)]"
                  >
                    {service.label}
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/b-bbee" className={navClass(activeItem === 'b-bbee')}>B-BBEE</Link>
            <Link href="/pricing-engagement-process" className={navClass(activeItem === 'pricing')}>
              <span className="sm:hidden">PRICING</span>
              <span className="hidden sm:inline">PRICING & PROCESS</span>
            </Link>
            <Link href="/interest" className={navClass(activeItem === 'contact')}>CONTACT</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}


