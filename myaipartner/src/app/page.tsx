"use client";

import Link from 'next/link';
import type { Route } from 'next';
import Header from '@/components/Header';
import ThemeSwitcher from '@/components/ThemeSwitcher';

export default function HomePage() {
  const shareOnWhatsApp = () => {
    if (typeof window === "undefined") return;
    const shareUrl = window.location.origin;
    const message = `${shareUrl}\n\nTake a look at this site`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      <Header />
      <main id="home" className="relative overflow-x-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(var(--color-grid)_1px,transparent_1px),linear-gradient(90deg,var(--color-grid)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <section className="relative z-10 pt-4 md:pt-5">
          <div className="max-w-7xl mx-auto min-w-0 px-3 sm:px-6 lg:px-8">
            <div className="relative min-w-0 max-w-full text-center">
              <div className="relative z-20 mb-3 flex w-full min-w-0 justify-center px-1">
                <ThemeSwitcher />
              </div>
              <button
                type="button"
                onClick={shareOnWhatsApp}
                className="whatsapp-btn mb-4 box-border flex w-full max-w-full flex-row items-center justify-center gap-2 whitespace-nowrap rounded-sm border border-[var(--color-btn-border)] bg-[var(--color-btn-bg)] px-3 py-2.5 text-center font-tech text-[11px] leading-snug tracking-[0.06em] text-[var(--color-btn-text)] shadow-[0_0_20px_var(--color-border-accent)] transition-all hover:opacity-90 sm:inline-flex sm:w-auto sm:flex-row sm:px-4 sm:text-xs sm:tracking-[0.1em]"
              >
                <span>Share this site by WhatsApp with someone</span>
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 shrink-0">
                  <path
                    fill="currentColor"
                    d="M20.52 3.48A11.85 11.85 0 0 0 12.05 0C5.49 0 .12 5.37.12 11.94c0 2.1.55 4.16 1.59 5.98L0 24l6.25-1.64a11.86 11.86 0 0 0 5.78 1.48h.01c6.56 0 11.93-5.37 11.93-11.94 0-3.19-1.24-6.19-3.45-8.42Zm-8.48 18.34h-.01a9.9 9.9 0 0 1-5.05-1.39l-.36-.21-3.71.97.99-3.62-.24-.37a9.9 9.9 0 0 1-1.53-5.25c0-5.46 4.45-9.9 9.92-9.9 2.65 0 5.14 1.03 7.01 2.9a9.84 9.84 0 0 1 2.9 7c0 5.46-4.45 9.9-9.92 9.9Zm5.43-7.43c-.3-.15-1.78-.88-2.06-.98-.27-.1-.47-.15-.67.15-.2.3-.77.98-.95 1.18-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.46-.88-.79-1.47-1.77-1.64-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.08-.79.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.9 1.22 3.1.15.2 2.09 3.2 5.06 4.48.7.3 1.25.49 1.67.63.7.22 1.34.19 1.84.11.56-.08 1.78-.73 2.03-1.44.25-.71.25-1.32.17-1.44-.07-.12-.27-.2-.57-.35Z"
                  />
                </svg>
              </button>
              <h1 className="hero-title mx-auto w-full max-w-full min-w-0 break-words px-2 text-balance sm:hidden text-[clamp(1.2rem,5.2vw,1.75rem)] font-semibold tracking-tight leading-snug">
                <span className="ai-letter">A</span>rchitects of{" "}
                <span className="ai-letter">I</span>ntelligence
              </h1>
              <h1 className="hero-title hidden sm:block font-tech text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] italic">
                <span className="ai-letter">A</span>rchitects of{" "}
                <span className="ai-letter">I</span>ntelligence
              </h1>
            </div>
            <div className="mt-6 md:mt-8">
              <p className="hero-subtitle mx-auto max-w-3xl min-w-0 break-words text-pretty px-2 text-center text-[var(--color-text-secondary)] text-base leading-relaxed font-medium sm:px-0 sm:text-lg md:text-xl lg:text-2xl">
              We provide end-to-end AI consulting and AI-enabled software development services, covering strategy,
              automation, implementation, training, and long-term support.
            </p>
              <div className="mt-8 text-center">
                <Link
                  href="/interest"
                  className="font-tech mx-auto box-border block w-full max-w-md whitespace-normal break-words rounded-sm border border-[var(--color-btn-border)] bg-[var(--color-btn-bg)] px-4 py-3 text-center text-xs leading-snug tracking-wide text-[var(--color-btn-text)] shadow-[0_0_30px_var(--color-border-accent)] transition-all hover:-translate-y-0.5 hover:opacity-90 hover:shadow-[0_0_50px_var(--color-border-accent)] sm:inline-flex sm:max-w-none sm:w-auto sm:px-6 sm:py-4 sm:text-sm sm:tracking-[0.12em] md:text-lg md:tracking-[0.2em] lg:px-10"
                >
                  TELL US ABOUT WHAT YOU NEED
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="relative z-10 py-20">
          <div className="mx-auto grid min-w-0 max-w-7xl gap-6 px-3 sm:px-6 lg:px-8 md:grid-cols-3">
            {serviceCards.map((service) => (
              service.href ? (
                <Link
                  id={service.id}
                  aria-label={service.ariaLabel}
                  key={service.title}
                  href={service.href as Route}
                  className="service-card relative block bg-[var(--color-bg-card)] border border-[var(--color-border)] p-6 transition hover:shadow-[0_0_20px_var(--color-border-accent)] hover:border-[var(--color-accent)]"
                >
                  <ServiceCardContent service={service} />
                </Link>
              ) : (
                <article
                  id={service.id}
                  aria-label={service.ariaLabel}
                  key={service.title}
                  className="service-card relative bg-[var(--color-bg-card)] border border-[var(--color-border)] p-6"
                >
                  <ServiceCardContent service={service} />
                </article>
              )
            ))}
          </div>
        </section>

        <section id="training" className="py-6" />
        <section id="contact" className="py-6" />

        {/* SEO Content Block */}
        <div style={{ display: "none" }} aria-hidden="true">
          <h2>AI Consulting South Africa</h2>
          <p>
            myAIpartner provides expert AI strategy consulting, business process automation, and custom AI software
            development across South Africa including Johannesburg, Cape Town, Durban and Pretoria.
          </p>
          <h2>Forensic Email Investigation South Africa</h2>
          <p>AI-assisted forensic email and WhatsApp investigation for legal, compliance and risk teams in South Africa.</p>
          <h2>AI Training South Africa</h2>
          <p>Corporate AI training and workforce enablement programs for South African businesses of all sizes.</p>
          <h2>AI Keynote Speaker South Africa</h2>
          <p>Business-focused AI keynotes and executive briefings for South African leadership teams.</p>

          {/* Afrikaans SEO */}
          <h2>KI Konsultant Suid-Afrika</h2>
          <p>
            myAIpartner bied kundige KI-strategie konsultasie, besigheidsprosesoutomatisering en pasgemaakte
            KI-sagteware-ontwikkeling regoor Suid-Afrika aan, insluitend Johannesburg, Kaapstad, Durban en Pretoria.
          </p>
          <h2>Forensiese E-pos Ondersoek Suid-Afrika</h2>
          <p>
            KI-gesteunde forensiese e-pos en WhatsApp-ondersoeke vir regs-, voldoenings- en risikobestuurspanne in
            Suid-Afrika.
          </p>
          <h2>KI Opleiding Suid-Afrika</h2>
          <p>Korporatiewe KI-opleiding en arbeidsmag-bemagtigingsprogramme vir Suid-Afrikaanse besighede van alle groottes.</p>
          <h2>KI Spreker Suid-Afrika</h2>
          <p>Besigheidsgerigte KI-toesprake en uitvoerende orienteringsgesprekke vir Suid-Afrikaanse leierskapspanne.</p>
        </div>
      </main>
    </div>
  );
}

const serviceCards = [
  {
    id: "ai-strategy-consulting",
    href: "/services/ai-strategy-business-consulting",
    ariaLabel: "AI Strategy and Business Consulting South Africa",
    afrikaansTitle: "KI Strategie en Besigheidskonsultasie",
    icon: "strategy",
    title: "AI Strategy & Business Consulting",
    description:
      "We work with leadership teams to identify where AI actually makes sense in your business. We move beyond the hype to find practical, high-value use cases that drive real ROI.",
    outcome: "A clear, realistic AI strategy aligned to your business goals – not generic AI adoption.",
    points: [
      "AI opportunity assessment",
      "Automation and efficiency audits",
      "AI roadmap and implementation planning",
      "Cost-benefit and ROI analysis",
      "Data readiness and infrastructure assessment",
      "Ethical and responsible AI guidance"
    ]
  },
  {
    id: "business-process-automation",
    href: "/services/business-process-automation-ai-driven",
    ariaLabel: "Business Process Automation South Africa",
    afrikaansTitle: "Besigheidsprosesoutomatisering",
    icon: "automation",
    title: "Business Process Automation (AI-Driven)",
    description:
      "We automate repetitive, manual, and error-prone workflows using AI, APIs, and intelligent systems. By connecting your existing tools, we eliminate bottlenecks and free up your team for higher-value work.",
    outcome: "Faster operations, fewer errors, lower operating costs.",
    points: [
      "Invoice and document processing (OCR + AI)",
      "Email, WhatsApp, and customer message automation",
      "Workflow approvals and decision engines",
      "Reporting and analytics automation",
      "HR, payroll, scheduling, and compliance workflows",
      "Data extraction, validation, and reconciliation"
    ]
  },
  {
    id: "custom-software-development",
    href: "/services/custom-software-development-ai-enabled",
    ariaLabel: "Custom Software Development South Africa",
    afrikaansTitle: "Pasgemaakte Sagteware Ontwikkeling",
    icon: "software",
    title: "Custom Software Development (AI-Enabled)",
    description:
      "We build custom software systems designed around your business – enhanced with AI where it adds real value. Whether it's an internal dashboard or a customer-facing portal, we build scalable, secure solutions.",
    outcome: "Software that fits your business – not generic tools that force you to adapt.",
    points: [
      "Internal business platforms",
      "Management dashboards and BI systems",
      "Secure portals and admin systems",
      "Industry-specific tools",
      "AI-augmented decision systems"
    ]
  },
  {
    id: "website-design-ai-integration",
    href: "/services/website-design-ai-integration",
    ariaLabel: "Website Design and AI Integration South Africa",
    afrikaansTitle: "Webwerf Ontwerp en KI Integrasie",
    icon: "web",
    title: "Website Design & AI Integration",
    description:
      "We design high-performance websites and integrate practical AI features so your site can attract, convert, and support customers more effectively.",
    outcome: "A modern, conversion-ready website with built-in intelligence to support growth and automation.",
    points: [
      "Responsive website design",
      "AI chat and lead capture",
      "Smart recommendation features",
      "Automated content support",
      "Behavior and conversion insights"
    ]
  },
  {
    id: "mobile-app-development",
    href: "/services/mobile-desktop-app-development",
    ariaLabel: "Mobile and Desktop App Development South Africa",
    afrikaansTitle: "Mobiele Toepassing Ontwikkeling",
    icon: "mobile",
    title: "Mobile App & Desktop App Development",
    description:
      "We design and build AI-powered applications for mobile and desktop environments. From field-ready offline apps to cross-platform desktop tools, we ensure your team has the right technology in hand.",
    outcome: "Seamless, intelligent applications available on any device, anywhere.",
    points: [
      "Progressive Web Apps (PWAs)",
      "Android and iOS applications",
      "Offline-first and field-ready apps",
      "AI-driven capture, recognition, and analysis",
      "Cross-platform desktop apps",
      "AI-assisted workflows",
      "Local + cloud hybrid systems"
    ]
  },
  {
    id: "ai-training-workforce",
    href: "/services/ai-training-workforce-enablement",
    ariaLabel: "AI Training and Workforce Enablement South Africa",
    afrikaansTitle: "KI Opleiding en Arbeidsmag Bemagtiging",
    icon: "training",
    title: "AI Training & Workforce Enablement",
    description:
      "We train teams to understand, use, and build with AI, regardless of technical background. We empower your workforce to leverage these new tools effectively and responsibly.",
    outcome: "Empowered teams capable of leveraging AI tools effectively and responsibly.",
    points: [
      "AI fundamentals for business leaders",
      "Practical AI for managers and staff",
      "Prompt engineering and AI workflows",
      "Building AI-powered apps",
      "Responsible AI and governance"
    ]
  },
  {
    id: "forensic-email-investigation",
    href: "/services/ediscovery-forensic-ai-querying-email-whatsapp",
    ariaLabel: "Forensic AI Email Investigation South Africa",
    afrikaansTitle: "Forensiese KI E-pos Ondersoek",
    icon: "ediscovery",
    title: "Forensic AI Email Investigation",
    description:
      "We help legal, risk, and compliance teams investigate high-volume communications quickly and defensibly. Our AI-assisted workflows surface relevant evidence across email and WhatsApp datasets while preserving forensic integrity.",
    outcome: "Faster, defensible fact-finding with reduced manual review time and clearer investigation outcomes.",
    points: [
      "Targeted collection and normalization of email and WhatsApp evidence",
      "AI-assisted relevance ranking, conversation clustering, and timeline reconstruction",
      "Keyword, semantic, and multilingual querying across large communication datasets",
      "Privilege and sensitive-content triage support for legal review teams",
      "Audit-ready workflows aligned to chain-of-custody and investigation governance",
      "Executive-ready summaries, findings packs, and escalation reporting"
    ]
  }
  ,
  {
    id: "ai-speaking-executive-briefings",
    href: "/services/corporate-ai-speaking-executive-briefings",
    ariaLabel: "Corporate AI Speaking and Executive Briefings South Africa",
    afrikaansTitle: "Korporatiewe KI Spreker en Uitvoerende Orientering",
    icon: "speaking",
    title: "Corporate AI Speaking & Executive Briefings",
    description:
      "Business-focused AI keynotes, executive sessions, and practical strategic briefings that align leadership around high-impact AI opportunities.",
    outcome: "Clear executive alignment and confident AI decision-making at leadership level.",
    points: [
      "Executive keynotes and leadership briefings",
      "Board and C-suite AI strategy sessions",
      "Industry-specific AI trends and implications",
      "Actionable next-step frameworks for decision-makers"
    ]
  },
  {
    id: "competitor-market-intelligence",
    href: "/services/competitor-market-intelligence-ai-monitored",
    ariaLabel: "Competitor and Market Intelligence South Africa",
    afrikaansTitle: "Mededinger en Markintelligensie",
    icon: "market",
    title: "Competitor & Market Intelligence (AI-Monitored)",
    description:
      "We monitor competitor activity and market signals using scheduled AI-powered analysis of public websites, pricing pages, job postings, announcements, and news. This helps your team stay informed about market movement, competitor positioning, and emerging opportunities without manual tracking.",
    outcome: "A clear, ongoing view of competitor and market activity - delivered as actionable weekly intelligence.",
    points: [
      "Competitor website monitoring",
      "Pricing and offer tracking",
      "Job posting and hiring signal analysis",
      "News, launches, and announcement monitoring",
      "Trend and positioning analysis",
      "Weekly AI-generated briefing reports"
    ]
  }
];

function ServiceCardContent({ service }: { service: any }) {
  return (
    <>
      <span style={{ display: "none" }}>{service.afrikaansTitle}</span>
      <div className="w-12 h-12 border border-[var(--color-border)] flex items-center justify-center text-[var(--color-accent)] mb-4 bg-[var(--color-accent-bg)]">
        <ServiceIcon kind={service.icon} />
      </div>
      <h3 className="font-tech text-xl md:text-2xl font-bold text-[var(--color-accent)] mb-4 tracking-wide">{service.title}</h3>
      <p className="text-[var(--color-text-secondary)] text-base leading-relaxed mb-6">{service.description}</p>
      <div className="mb-5 flex justify-center">
        <span className="inline-flex items-center border border-[var(--color-border)] bg-[var(--color-accent-bg)] px-4 py-2 text-[var(--color-accent-text)] text-sm font-medium tracking-wide shadow-[0_0_14px_var(--color-border-accent)]">
          Click to learn more →
        </span>
      </div>
    </>
  );
}

function ServiceIcon({ kind }: { kind: string }) {
  const cls = "h-6 w-6";
  switch (kind) {
    case "strategy":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={cls}>
          <path d="M4 20h16" />
          <path d="M6 16V9h3v7" />
          <path d="M11 16V5h3v11" />
          <path d="M16 16v-4h3v4" />
        </svg>
      );
    case "automation":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={cls}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a2 2 0 1 1-4 0v-.2a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a2 2 0 1 1 0-4h.2a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1 1 0 0 0 1.1.2h.1a1 1 0 0 0 .6-.9V4a2 2 0 1 1 4 0v.2a1 1 0 0 0 .6.9h.1a1 1 0 0 0 1.1-.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1 1 0 0 0-.2 1.1v.1a1 1 0 0 0 .9.6h.2a2 2 0 1 1 0 4h-.2a1 1 0 0 0-.9.6z" />
        </svg>
      );
    case "software":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={cls}>
          <rect x="3" y="4" width="18" height="14" rx="2" />
          <path d="M8 21h8" />
          <path d="M10 18v3M14 18v3" />
        </svg>
      );
    case "web":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={cls}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3Z" />
        </svg>
      );
    case "mobile":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={cls}>
          <rect x="7" y="2.5" width="10" height="19" rx="2" />
          <path d="M11 18h2" />
        </svg>
      );
    case "training":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={cls}>
          <path d="M3 8l9-4 9 4-9 4-9-4z" />
          <path d="M7 10v4c0 1.8 2.2 3 5 3s5-1.2 5-3v-4" />
        </svg>
      );
    case "ediscovery":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={cls}>
          <circle cx="11" cy="11" r="6" />
          <path d="m20 20-4.2-4.2" />
          <path d="M11 8v6M8 11h6" />
        </svg>
      );
    case "speaking":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={cls}>
          <rect x="9" y="3" width="6" height="10" rx="3" />
          <path d="M12 13v4M8 17h8" />
          <path d="M6 10a6 6 0 0 0 12 0" />
        </svg>
      );
    case "market":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={cls}>
          <path d="M3 20h18" />
          <path d="M5 16l4-5 3 3 5-7 2 2" />
          <circle cx="17" cy="7" r="1.3" />
        </svg>
      );
    default:
      return <span className="text-xl">◈</span>;
  }
}


