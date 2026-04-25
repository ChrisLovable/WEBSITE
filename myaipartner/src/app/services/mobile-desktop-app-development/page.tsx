"use client";

import Link from "next/link";
import Shell from "@/components/Shell";

type FocusAreaProps = {
  title: string;
  paragraphs: string[];
  items: string[];
};

function FocusArea({ title, paragraphs, items }: FocusAreaProps) {
  return (
    <article className="space-y-4 border border-cyan-500/35 bg-black/50 p-6">
      <h3 className="font-tech text-xl text-cyan-300">{title}</h3>
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="text-gray-300 leading-relaxed">
          {paragraph}
        </p>
      ))}
      <div>
        <p className="font-tech text-sm tracking-wider text-cyan-300 mb-3">What this covers:</p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item} className="text-gray-200 text-sm border border-cyan-500/25 bg-cyan-500/5 px-3 py-2">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

const focusAreas: FocusAreaProps[] = [
  {
    title: "1. Progressive Web Apps (PWAs)",
    paragraphs: [
      "Progressive Web Apps offer a powerful way to deliver app-like experiences through the web, without the complexity of traditional app distribution in every case.",
      "We build PWAs that are fast, responsive, installable, and designed to work smoothly across devices. These are ideal for businesses that want broad accessibility, easier deployment, and a flexible way to deliver functionality to staff, customers, or partners.",
      "PWAs can be especially effective for operational tools, portals, dashboards, forms, workflow apps, and field-based systems."
    ],
    items: [
      "Installable web-based applications",
      "Mobile-friendly and responsive interfaces",
      "Fast, lightweight user experiences",
      "Broad device accessibility",
      "Easier deployment and maintenance",
      "Practical alternatives to conventional apps in many use cases"
    ]
  },
  {
    title: "2. Android and iOS Applications",
    paragraphs: [
      "For businesses that need native or mobile-first experiences, we design and build applications for Android and iOS that are tailored to the real needs of users in the field, on the move, or in customer-facing environments.",
      "These applications can support operational workflows, service delivery, data capture, communication, inspections, task management, customer interaction, and many other business functions. Our goal is always to create apps that are simple to use, reliable in practice, and aligned to the needs of the business."
    ],
    items: [
      "Business-focused mobile app development",
      "Android and iOS application design",
      "User-friendly interfaces for real-world use",
      "Operational, customer-facing, or internal business apps",
      "Scalable app architecture",
      "Secure and maintainable mobile solutions"
    ]
  },
  {
    title: "3. Offline-First and Field-Ready Apps",
    paragraphs: [
      "Many businesses operate in environments where connectivity is limited, unreliable, or inconsistent.",
      "We build offline-first applications that allow teams to keep working even when internet access is poor or unavailable. Data can be captured, stored locally, and synchronised when a connection becomes available again. This is especially valuable for field teams, remote operations, inspections, logistics, agriculture, security, healthcare, and other mobile work environments.",
      "The result is technology that works where your people actually work - not only when signal is perfect."
    ],
    items: [
      "Apps designed for unreliable connectivity environments",
      "Local data capture and storage",
      "Sync logic for reconnect scenarios",
      "Field-ready usability and workflow design",
      "Support for remote and operational teams",
      "Greater reliability in real-world conditions"
    ]
  },
  {
    title: "4. AI-Driven Capture, Recognition, and Analysis",
    paragraphs: [
      "AI can make apps significantly more powerful when it is used to improve how information is captured, interpreted, and acted on.",
      "We build applications that use AI to support functions such as document capture, OCR, image recognition, speech-to-text, smart classification, intelligent search, pattern detection, and automated analysis. This helps users work faster, reduce manual effort, and get more value from the information flowing through the app.",
      "The focus is always on useful functionality that improves the user experience and supports better operational outcomes."
    ],
    items: [
      "OCR and intelligent document capture",
      "Image and pattern recognition",
      "Speech and text-based AI features",
      "Smart classification and information extraction",
      "Automated analysis and insight support",
      "Reduced manual input and improved speed"
    ]
  },
  {
    title: "5. Cross-Platform Desktop Apps",
    paragraphs: [
      "Some business environments still require robust desktop applications for operational control, data-heavy tasks, internal tools, or specialist workflows.",
      "We build cross-platform desktop applications that can run across environments while delivering a consistent and capable user experience. These tools are well suited to businesses that need strong internal applications, operator workstations, reporting tools, admin environments, or specialised software that benefits from desktop-based interaction.",
      "Where relevant, these solutions can also be linked to mobile and cloud systems for a connected operational ecosystem."
    ],
    items: [
      "Cross-platform desktop software",
      "Internal operational and admin tools",
      "Data-intensive or workflow-heavy applications",
      "Consistent experiences across desktop environments",
      "Integration with cloud and mobile systems",
      "Secure and scalable desktop solutions"
    ]
  },
  {
    title: "6. AI-Assisted Workflows",
    paragraphs: [
      "Applications become more valuable when they do more than just collect and display information.",
      "We design workflow-driven systems where AI helps users complete tasks more efficiently, make better decisions, identify priorities, or process information more effectively. This can include intelligent prompts, automated recommendations, assisted reviews, summarisation, alerts, and decision support embedded directly into the application experience.",
      "This helps reduce admin load while improving consistency and responsiveness."
    ],
    items: [
      "AI support built into workflow steps",
      "Decision assistance and prioritisation",
      "Summaries, recommendations, and intelligent prompts",
      "Faster handling of routine tasks",
      "Better user support within the application",
      "Improved operational consistency"
    ]
  },
  {
    title: "7. Local + Cloud Hybrid Systems",
    paragraphs: [
      "Some businesses need the flexibility of cloud-connected systems together with the reliability or control of local application capability.",
      "We build hybrid systems that combine local functionality with cloud services, allowing businesses to balance performance, resilience, access, and scalability. This can be especially useful where local operations must continue uninterrupted but central reporting, synchronisation, analytics, or oversight are also required.",
      "These architectures support practical business needs rather than forcing an all-cloud or all-local approach where that does not make sense."
    ],
    items: [
      "Hybrid local and cloud-connected application design",
      "Local resilience with cloud scalability",
      "Data synchronisation across environments",
      "Central oversight with distributed operation",
      "Support for real-world operational complexity",
      "Flexible system design aligned to business needs"
    ]
  }
];

export default function MobileDesktopAppDevelopmentPage() {
  return (
    <Shell>
      <main className="relative overflow-hidden bg-[var(--color-bg)] pt-3 pb-20 md:pt-8">
        <div className="absolute inset-0 bg-[linear-gradient(var(--color-grid)_1px,transparent_1px),linear-gradient(90deg,var(--color-grid)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="relative z-10 mx-auto max-w-5xl space-y-8 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="font-tech inline-flex border border-cyan-400 px-5 py-2 text-xs tracking-[0.16em] text-cyan-300 hover:bg-cyan-400/10">
            ← BACK
          </Link>

          <section className="space-y-4 border border-cyan-400/50 bg-black/70 p-8">
            <h1 className="font-tech text-2xl text-cyan-300 md:text-3xl">Mobile App &amp; Desktop App Development</h1>
            <p className="text-lg leading-relaxed text-gray-200">
              We design and build AI-powered applications for mobile and desktop environments, tailored to the way your business operates. Whether your team works in the office, in the field, on the road, or across multiple locations, we create practical, intelligent software that gives them the right tools wherever they are.
            </p>
            <p className="text-lg leading-relaxed text-gray-300">
              Our focus is on applications that are reliable, scalable, user-friendly, and built around real operational needs. Where AI adds genuine value, we integrate it thoughtfully - whether through smarter data capture, recognition, workflow support, analysis, or decision assistance.
            </p>
            <p className="text-lg leading-relaxed text-gray-300">
              From field-ready mobile tools to cross-platform desktop systems, we help businesses put the right technology directly into the hands of their teams.
            </p>
          </section>

          <section className="space-y-4 border border-cyan-400/50 bg-black/70 p-8">
            <h2 className="font-tech text-2xl text-cyan-300">The Outcome</h2>
            <p className="text-lg leading-relaxed text-gray-200">Seamless, intelligent applications available on any device, anywhere.</p>
            <p className="text-lg leading-relaxed text-gray-300">
              You get software that supports your operations in the real world - whether connected to the cloud, working offline, or operating in a hybrid environment.
            </p>
          </section>

          <section className="space-y-6 border border-cyan-400/50 bg-black/70 p-8">
            <h2 className="font-tech text-2xl text-cyan-300">Our Development Focus Areas</h2>
            {focusAreas.map((focusArea) => (
              <FocusArea key={focusArea.title} {...focusArea} />
            ))}
          </section>

          <section className="space-y-4 border border-cyan-400/50 bg-black/70 p-8">
            <h2 className="font-tech text-2xl text-cyan-300">How We Work</h2>
            <p className="text-lg leading-relaxed text-gray-300">
              We start by understanding where the app will be used, who will use it, what problems it needs to solve, and what level of intelligence or connectivity the solution requires.
            </p>
            <p className="text-lg leading-relaxed text-gray-300">
              From there, we design and build applications that are practical, scalable, and aligned to your business workflows. Where AI is appropriate, we integrate it deliberately to improve speed, insight, usability, or automation - not simply to add complexity.
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {[
                "app strategy and solution scoping",
                "UX and workflow design",
                "mobile, desktop, and PWA development",
                "offline and sync architecture planning",
                "AI feature integration",
                "deployment, refinement, and scaling"
              ].map((item) => (
                <li key={item} className="text-gray-200 text-sm border border-cyan-500/25 bg-cyan-500/5 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-4 border border-cyan-400/50 bg-black/70 p-8">
            <h2 className="font-tech text-2xl text-cyan-300">Who This Is For</h2>
            <ul className="space-y-2 text-gray-200 leading-relaxed">
              <li>businesses with mobile or field-based teams</li>
              <li>organisations that need apps across multiple device types</li>
              <li>companies operating in low-connectivity or remote environments</li>
              <li>businesses wanting smarter operational tools</li>
              <li>teams needing custom apps rather than generic software products</li>
            </ul>
          </section>

          <section className="space-y-4 border border-cyan-400/50 bg-black/70 p-8">
            <h2 className="font-tech text-2xl text-cyan-300">Why Work With Us</h2>
            <p className="text-lg leading-relaxed text-gray-300">
              We combine software development, business process understanding, and practical AI capability. That means we build applications that do more than function technically - they support real work, real users, and real operating conditions.
            </p>
            <p className="text-lg leading-relaxed text-gray-200">
              The result is intelligent software that is available where your business needs it most, whether in the office, in the field, on a desktop, or on a mobile device.
            </p>
          </section>
        </div>
      </main>
    </Shell>
  );
}
