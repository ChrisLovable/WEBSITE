"use client";
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { Route } from 'next';
import { createPortal } from 'react-dom';

export default function Header() {
  const pathname = usePathname();
  const [hash, setHash] = useState('');
  const [showMobileWakeNotice, setShowMobileWakeNotice] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const mobileServicesWrapRef = useRef<HTMLDivElement | null>(null);
  const MOBILE_WAKE_NOTICE_SEEN_KEY = 'mobile-wake-notice-seen-v2';
  const serviceLinks = [
    { href: '/services/ai-strategy-business-consulting', label: 'AI Strategy & Business Consulting' },
    { href: '/services/business-process-automation-ai-driven', label: 'Business Process Automation' },
    { href: '/services/custom-software-development-ai-enabled', label: 'Custom Software Development' },
    { href: '/services/website-design-ai-integration', label: 'Website Design & AI Integration' },
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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onIntroDismissed = () => {
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      if (!isMobile) return;
      const seen = sessionStorage.getItem(MOBILE_WAKE_NOTICE_SEEN_KEY);
      if (!seen) {
        setShowMobileWakeNotice(true);
        sessionStorage.setItem(MOBILE_WAKE_NOTICE_SEEN_KEY, 'true');
      }
    };
    window.addEventListener('gabby-intro-dismissed', onIntroDismissed);
    return () => window.removeEventListener('gabby-intro-dismissed', onIntroDismissed);
  }, []);

  useEffect(() => {
    setMobileServicesOpen(false);
  }, [pathname, hash]);

  useEffect(() => {
    if (!mobileServicesOpen) return;
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (mobileServicesWrapRef.current?.contains(target)) return;
      setMobileServicesOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown, { passive: true });
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
    };
  }, [mobileServicesOpen]);

  const activeItem =
    pathname === '/'
      ? hash === '#services'
        ? 'services'
        : 'home'
      : pathname.startsWith('/services/')
        ? 'services'
        : pathname === '/pricing-engagement-process'
          ? 'process'
          : pathname === '/free-apps'
            ? 'free-apps'
            : pathname === '/interest'
              ? 'contact'
              : 'home';

  const navClass = (isActive: boolean) =>
    `nav-link inline-flex max-w-full shrink-0 items-center justify-center border px-1.5 py-1.5 text-[9px] tracking-wide whitespace-nowrap transition-all max-md:inline-flex max-md:h-[22px] max-md:w-full max-md:min-w-0 max-md:shrink max-md:px-1 max-md:py-1 max-md:text-[8px] sm:px-2.5 sm:text-[10px] sm:text-xs md:text-sm md:tracking-widest ${
      isActive
        ? 'border-[var(--color-accent)] text-[var(--color-accent-text)] bg-[var(--color-accent-bg)] shadow-[0_0_12px_var(--color-border-accent)]'
        : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-accent-text)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-bg)]'
    }`;

  return (
    <header className="site-header sticky top-0 z-50 overflow-x-clip overflow-y-visible border-b border-[var(--color-border)] bg-[var(--color-bg-card)] backdrop-blur-md supports-[backdrop-filter]:bg-[var(--color-bg-card)]/92 md:overflow-x-visible">
      <div className="mx-auto max-w-7xl min-w-0 px-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 w-full flex-wrap items-start gap-2 py-2 max-md:gap-0 md:min-h-14 md:flex-row md:flex-nowrap md:items-center md:justify-start md:gap-4 md:py-2">
          {/* Logo only — md:w-24 anchors the large absolute hero logo (kept below nav row in z-order) */}
          <div className="relative z-[55] flex shrink-0 justify-start self-start md:w-24 md:shrink-0 md:self-stretch">
            <img
              src="/logo.png"
              alt="myAIpartner Logo"
              className="logo h-12 w-12 shrink-0 rounded-full border-2 border-[var(--color-border)] object-cover shadow-[0_0_26px_var(--color-border-accent)] transition-all duration-300 hover:shadow-[0_0_60px_var(--color-border-accent)] hover:scale-110 sm:h-20 sm:w-20 md:absolute md:left-1/2 md:top-full md:h-48 md:w-48 md:max-w-none md:-translate-x-1/2 md:-translate-y-1/2 md:hover:scale-105"
            />
          </div>

          {/* Gabby + Hey Gabby + nav — above overlapping hero logo; clickable on desktop */}
          <div className="relative z-[70] flex min-w-0 flex-1 flex-row flex-wrap items-center gap-2 max-md:gap-0 md:min-h-0 md:flex-nowrap md:items-center md:gap-4">
            <div className="gabby-header-cluster flex min-w-0 shrink-0 items-center gap-2 md:ml-[50px]">
              <button
                type="button"
                className="gabby-nav-avatar-wrap relative z-[71] overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-bg-input)] p-0 leading-none"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('open-gabby-chat'));
                  }
                }}
                title="Chat with Gabby"
                aria-label="Chat with Gabby"
              >
                <img id="nav-gabby-avatar" src="/gabby.png" alt="" className="gabby-nav-avatar block" />
              </button>
              <button
                type="button"
                className={`${navClass(false)} relative z-[71] max-md:w-auto max-md:min-w-[56px]`}
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('replay-gabby-video'));
                  }
                }}
                title="Replay Gabby video"
                aria-label="Replay Gabby video"
              >
                REPLAY
              </button>
              <div className="relative z-[71] flex min-w-0 shrink-0 flex-wrap items-center gap-2 md:ml-5">
                <div
                  id="gabby-wake-slot"
                  className="inline-flex min-w-0 shrink-0 items-center max-md:hidden"
                  aria-label="Hey Gabby wake word options"
                />
              </div>
            </div>
            <nav
              aria-label="Main"
              className="nav-links grid min-w-0 w-full grid-cols-5 gap-1 overflow-x-hidden overflow-y-visible font-tech max-md:basis-full max-md:mt-1 max-md:-mx-3 max-md:w-[calc(100%+1.5rem)] max-md:-translate-x-[14px] max-md:gap-0 max-md:items-stretch sm:w-auto md:ml-[50px] md:basis-auto md:min-w-0 md:flex md:flex-1 md:grid-cols-none md:justify-start md:gap-[10px] md:[overflow:visible] md:whitespace-nowrap"
            >
              <Link href="/" className={navClass(activeItem === 'home')}>
                HOME
              </Link>
              <div ref={mobileServicesWrapRef} className="relative z-[75] min-w-0 shrink-0 group max-md:flex max-md:w-full max-md:flex-col max-md:items-stretch">
                <button
                  type="button"
                  className={`${navClass(activeItem === 'services')} max-md:h-[22px] max-md:w-full`}
                  aria-expanded={mobileServicesOpen}
                  aria-controls="mobile-services-menu"
                  onClick={() => {
                    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches) {
                      setMobileServicesOpen((open) => !open);
                    }
                  }}
                >
                  SERVICES
                </button>
                {mobileServicesOpen && (
                  <div
                    id="mobile-services-menu"
                    className="absolute left-0 right-0 top-full z-[80] mt-1 max-h-[min(70vh,28rem)] overflow-y-auto border border-[var(--color-border)] bg-[var(--color-bg-card)] p-3 shadow-[0_0_24px_var(--color-border-accent)] md:hidden"
                  >
                    {serviceLinks.map((service) => (
                      <Link
                        key={`mobile-${service.href}`}
                        href={service.href as Route}
                        onClick={() => setMobileServicesOpen(false)}
                        className="mb-2 block border border-[var(--color-border)] bg-[var(--color-bg-input)] px-3 py-2.5 font-sans text-xs font-medium leading-snug tracking-normal text-[var(--color-text-primary)] shadow-[0_0_14px_var(--color-border-accent)] transition-all duration-200 last:mb-0 hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-bg)] hover:text-[var(--color-text-primary)] hover:shadow-[0_0_20px_var(--color-border-accent)]"
                      >
                        {service.label}
                      </Link>
                    ))}
                  </div>
                )}
                <div className="invisible fixed left-1/2 top-[5.25rem] z-50 hidden w-[92vw] max-w-[30rem] -translate-x-1/2 border border-[var(--color-border)] bg-[var(--color-bg-card)] p-3 opacity-0 shadow-[0_0_24px_var(--color-border-accent)] backdrop-blur-md transition-all duration-200 group-hover:visible group-hover:opacity-100 md:absolute md:left-0 md:top-full md:mt-3 md:block md:w-[30rem] md:translate-x-0">
                  {serviceLinks.map((service) => (
                    <Link
                      key={`desktop-${service.href}`}
                      href={service.href as Route}
                      onClick={() => setMobileServicesOpen(false)}
                      className="mb-2 block border border-[var(--color-border)] bg-[var(--color-bg-input)] px-3 py-2.5 font-sans text-xs md:text-sm font-medium leading-snug tracking-normal text-[var(--color-text-primary)] shadow-[0_0_14px_var(--color-border-accent)] transition-all duration-200 last:mb-0 hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-bg)] hover:text-[var(--color-text-primary)] hover:shadow-[0_0_20px_var(--color-border-accent)]"
                    >
                      {service.label}
                    </Link>
                  ))}
                </div>
              </div>
              <Link href="/free-apps" className={navClass(activeItem === 'free-apps')}>
                APPS
              </Link>
              <Link href="/pricing-engagement-process" className={navClass(activeItem === 'process')}>
                PROCESS
              </Link>
              <Link href="/interest" className={navClass(activeItem === 'contact')}>
                CONTACT
              </Link>
            </nav>
            {mounted && showMobileWakeNotice && createPortal(
              <div className="fixed inset-0 z-[9999] md:hidden">
                <div className="absolute inset-0 bg-black/35 backdrop-blur-sm" />
                <div className="absolute left-1/2 top-[96px] w-[calc(100vw-24px)] max-w-[420px] -translate-x-1/2">
                  <div className="relative border border-[#4ade80] bg-[#0f3d24] px-3 pb-3 pt-8 text-[22px] leading-relaxed text-[#d8ffe8] shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
                    <button
                      type="button"
                      onClick={() => setShowMobileWakeNotice(false)}
                      className="absolute right-2 top-2 inline-flex h-5 items-center justify-center border border-[#9affc5] bg-[#1d6b3f] px-2 text-[10px] font-semibold text-[#eafff3]"
                      aria-label="Close mobile wake notice"
                    >
                      OK
                    </button>
                    Saying &quot;Hey Gabby&quot; is blocked on most mobile operating systems. On mobile, tap the Gabby icon to ask her. On a laptop the &quot;Hey Gabby&quot; call will work perfectly fine provided you have given the necessary permission to access your microphone.
                  </div>
                </div>
              </div>,
              document.body
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
