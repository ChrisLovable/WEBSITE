"use client";

import Link from 'next/link';
import Header from '@/components/Header';

export default function HomePage() {
  const shareOnWhatsApp = () => {
    if (typeof window === "undefined") return;
    const message = `Take a look at this site: ${window.location.href}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <main id="home" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.06)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <section className="relative z-10 pt-4 md:pt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <button
                type="button"
                onClick={shareOnWhatsApp}
                className="mb-4 inline-flex items-center justify-center rounded-sm border border-cyan-300 bg-cyan-400/15 px-4 py-2 font-tech text-xs tracking-[0.1em] text-cyan-100 shadow-[0_0_20px_rgba(6,182,212,0.22)] transition-all hover:bg-cyan-300 hover:text-black"
              >
                Share this site by WhatsApp with someone
              </button>
              <h1 className="font-tech text-[1.85rem] sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] sm:whitespace-nowrap">
                <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent italic">
                  Architects of Intelligence
                </span>
              </h1>
            </div>
            <div className="mt-6 md:mt-8">
              <p className="text-white max-w-3xl mx-auto text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed font-medium text-center px-2 sm:px-0">
              We provide end-to-end AI consulting and AI-enabled software development services, covering strategy,
              automation, implementation, training, and long-term support.
            </p>
              <div className="mt-8 text-center">
                <Link
                  href="/interest"
                  className="font-tech inline-flex items-center justify-center rounded-sm border border-cyan-300 bg-cyan-400/15 px-6 sm:px-10 py-3 sm:py-4 text-sm sm:text-base md:text-lg tracking-[0.12em] sm:tracking-[0.2em] text-cyan-100 shadow-[0_0_30px_rgba(6,182,212,0.28)] transition-all hover:-translate-y-0.5 hover:bg-cyan-300 hover:text-black hover:shadow-[0_0_50px_rgba(6,182,212,0.5)]"
                >
                  TELL US ABOUT WHAT YOU NEED
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="relative z-10 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-6 md:grid-cols-3">
            {serviceCards.map((service) => (
              service.href ? (
                <Link
                  id={service.id}
                  key={service.title}
                  href={service.href}
                  className="relative block bg-[#0a0a0a] border border-cyan-400/50 p-6 transition hover:shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:border-cyan-300"
                >
                  <ServiceCardContent service={service} />
                </Link>
              ) : (
                <article id={service.id} key={service.title} className="relative bg-[#0a0a0a] border border-cyan-400/50 p-6">
                  <ServiceCardContent service={service} />
                </article>
              )
            ))}
          </div>
        </section>

        <section id="training" className="py-6" />
        <section id="contact" className="py-6" />
      </main>
    </div>
  );
}

const serviceCards = [
  {
    id: "service-ai-strategy",
    href: "/services/ai-strategy-business-consulting",
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
    id: "service-automation",
    href: "/services/business-process-automation-ai-driven",
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
    id: "service-software",
    href: "/services/custom-software-development-ai-enabled",
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
    id: "service-mobile",
    href: "/services/mobile-desktop-app-development",
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
    id: "service-training",
    href: "/services/ai-training-workforce-enablement",
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
    id: "service-ediscovery",
    href: "/services/ediscovery-forensic-ai-querying-email-whatsapp",
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
    id: "service-speaking",
    href: "/services/corporate-ai-speaking-executive-briefings",
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
    id: "service-market-intelligence",
    href: "/services/competitor-market-intelligence-ai-monitored",
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
      <div className="w-12 h-12 border border-cyan-400/50 flex items-center justify-center text-cyan-400 mb-4 bg-cyan-400/5">
        <ServiceIcon kind={service.icon} />
      </div>
      <h3 className="font-tech text-xl md:text-2xl font-bold text-cyan-400 mb-4 tracking-wide">{service.title}</h3>
      <p className="text-gray-300 text-base leading-relaxed mb-6">{service.description}</p>
      <div className="mb-6 border border-cyan-400/60 bg-[#03141c] p-5 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
        <p className="font-tech text-xs tracking-[0.2em] text-cyan-300 mb-3">OUTCOME</p>
        <p className="text-white text-base leading-relaxed">{service.outcome}</p>
      </div>
      <div className="mb-5 flex justify-center">
        <span className="inline-flex items-center border border-cyan-400/70 bg-cyan-400/10 px-4 py-2 text-cyan-200 text-sm font-medium tracking-wide shadow-[0_0_14px_rgba(6,182,212,0.2)]">
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


