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
    title: "1. Competitor Website Monitoring",
    paragraphs: [
      "Competitor websites often reveal important changes before they are widely discussed elsewhere.",
      "We monitor selected public-facing competitor websites for updates in messaging, service offerings, positioning, new capabilities, product changes, market focus, and other meaningful developments. This helps your team stay aware of how competitors are presenting themselves and where they may be shifting strategically.",
      "The value lies not only in seeing what changed, but in understanding why it may matter."
    ],
    items: [
      "Monitoring of selected competitor websites",
      "Detection of changes in services, products, or positioning",
      "Visibility into strategic messaging shifts",
      "Tracking of new offerings or capability expansion",
      "Ongoing awareness of external market movement",
      "Better insight into competitor direction over time"
    ]
  },
  {
    title: "2. Pricing and Offer Tracking",
    paragraphs: [
      "Pricing changes can reveal a great deal about competitor strategy, market pressure, and positioning.",
      "We track publicly visible pricing signals, packages, offer structures, promotional activity, and service framing so your team can stay aware of how competitors are pricing and packaging their value. This can help inform your own commercial decisions, product positioning, and market response.",
      "The aim is to provide clearer visibility into pricing movement without requiring constant manual checking."
    ],
    items: [
      "Monitoring of public pricing pages and offer structures",
      "Detection of pricing changes and packaging adjustments",
      "Tracking of visible promotions or commercial shifts",
      "Comparison of market-facing offer positioning",
      "Better awareness of external pricing signals",
      "Support for more informed commercial decision-making"
    ]
  },
  {
    title: "3. Job Posting and Hiring Signal Analysis",
    paragraphs: [
      "Hiring activity can be a powerful indicator of where competitors are investing, expanding, or changing direction.",
      "We analyse public job postings and hiring patterns to identify signals such as growth areas, capability buildout, new market focus, technology adoption, geographic expansion, or operational shifts. This provides useful intelligence on what organisations may be preparing to do before the results become visible in the market.",
      "Job data often tells an early story about strategic intent."
    ],
    items: [
      "Monitoring of public job postings and recruitment patterns",
      "Identification of growth and expansion signals",
      "Insight into capability and team buildout",
      "Detection of technology or function-specific hiring trends",
      "Better understanding of competitor investment direction",
      "Early-warning intelligence from public talent signals"
    ]
  },
  {
    title: "4. News, Launches, and Announcement Monitoring",
    paragraphs: [
      "Important competitor and market signals often appear through articles, press releases, announcements, interviews, partnerships, and launch communications.",
      "We monitor relevant public news and announcement sources to identify developments that may affect your market, your competitors, or your strategic positioning. This helps businesses avoid being surprised by visible market moves and keeps leadership informed of changes that may require attention.",
      "The goal is to replace fragmented awareness with structured intelligence."
    ],
    items: [
      "Monitoring of relevant public news and announcement sources",
      "Tracking of launches, partnerships, and visible market activity",
      "Identification of noteworthy competitor developments",
      "Visibility into wider market movement",
      "Early awareness of potential opportunities or threats",
      "Better external intelligence for leadership teams"
    ]
  },
  {
    title: "5. Trend and Positioning Analysis",
    paragraphs: [
      "Raw monitoring is useful, but interpretation is where real value is created.",
      "We analyse the patterns emerging across monitored sources to identify broader trends in positioning, market messaging, capability expansion, pricing direction, demand signals, and strategic movement. This gives your team more than isolated updates - it provides a clearer picture of what may be happening in the market over time.",
      "This helps leadership move from observation to informed interpretation."
    ],
    items: [
      "Analysis of recurring competitor and market patterns",
      "Identification of trend direction over time",
      "Interpretation of positioning and messaging shifts",
      "Insight into emerging strategic themes",
      "Better understanding of external market dynamics",
      "Support for strategic planning and response"
    ]
  },
  {
    title: "6. Weekly AI-Generated Briefing Reports",
    paragraphs: [
      "Monitoring only becomes useful when it is turned into something decision-makers can quickly absorb and act on.",
      "We deliver structured weekly intelligence briefings that summarise the most relevant developments, highlight notable changes, and present clear takeaways for your team. These reports are designed to reduce information overload while keeping leadership informed of what matters.",
      "The result is a regular intelligence rhythm that supports stronger situational awareness and more confident decision-making."
    ],
    items: [
      "Weekly intelligence summaries",
      "Highlighted competitor and market developments",
      "Structured briefing format for easy review",
      "Executive-friendly reporting",
      "Action-oriented observations and takeaways",
      "Reduced manual effort in tracking market changes"
    ]
  }
];

export default function CompetitorMarketIntelligenceAiMonitoredPage() {
  return (
    <Shell>
      <main className="relative overflow-hidden bg-[#0a0a0a] pt-3 pb-20 md:pt-8">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.06)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="relative z-10 mx-auto max-w-5xl space-y-8 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="font-tech inline-flex border border-cyan-400 px-5 py-2 text-xs tracking-[0.16em] text-cyan-300 hover:bg-cyan-400/10">
            ← BACK
          </Link>

          <section className="space-y-4 border border-cyan-400/50 bg-black/70 p-8">
            <h1 className="font-tech text-2xl text-cyan-300 md:text-3xl">Competitor &amp; Market Intelligence (AI-Monitored)</h1>
            <p className="text-lg leading-relaxed text-gray-200">
              We help businesses stay informed about competitor activity, market shifts, and emerging signals through scheduled AI-powered monitoring and analysis. By tracking selected public sources such as competitor websites, pricing pages, job postings, announcements, and news, we turn scattered market information into structured, decision-useful intelligence.
            </p>
            <p className="text-lg leading-relaxed text-gray-300">
              Most organisations do not have the time to manually monitor competitor movement consistently. Important changes often happen quietly - a pricing shift, a new service launch, a hiring trend, a change in positioning, a new target market, or an expansion signal. We help you detect these developments early and interpret what they may mean for your business.
            </p>
            <p className="text-lg leading-relaxed text-gray-300">
              Our approach is focused on practical market awareness, not noise. The goal is to give leadership teams and decision-makers a clearer, more consistent view of what is changing in the market and how competitors are moving.
            </p>
          </section>

          <section className="space-y-4 border border-cyan-400/50 bg-black/70 p-8">
            <h2 className="font-tech text-2xl text-cyan-300">The Outcome</h2>
            <p className="text-lg leading-relaxed text-gray-200">A clear, ongoing view of competitor and market activity - delivered as actionable weekly intelligence.</p>
            <p className="text-lg leading-relaxed text-gray-300">
              You get structured visibility into relevant external developments, helping your team make better strategic, commercial, and operational decisions with less manual effort.
            </p>
          </section>

          <section className="space-y-6 border border-cyan-400/50 bg-black/70 p-8">
            <h2 className="font-tech text-2xl text-cyan-300">Our Intelligence Focus Areas</h2>
            {focusAreas.map((focusArea) => (
              <FocusArea key={focusArea.title} {...focusArea} />
            ))}
          </section>

          <section className="space-y-4 border border-cyan-400/50 bg-black/70 p-8">
            <h2 className="font-tech text-2xl text-cyan-300">How We Work</h2>
            <p className="text-lg leading-relaxed text-gray-300">
              We start by identifying which competitors, market segments, sources, and signals matter most to your business.
            </p>
            <p className="text-lg leading-relaxed text-gray-300">
              From there, we set up a structured monitoring and analysis process focused on the public information most relevant to your strategy. AI is used to support tracking, organisation, summarisation, and pattern detection, while the output is shaped into practical intelligence that leadership teams can use.
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {[
                "competitor and source selection",
                "monitoring framework design",
                "scheduled intelligence collection",
                "AI-assisted analysis and summarisation",
                "weekly briefing delivery",
                "refinement of tracking priorities over time"
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
              <li>leadership teams wanting better market visibility</li>
              <li>businesses operating in competitive or fast-changing sectors</li>
              <li>commercial teams needing structured competitor awareness</li>
              <li>organisations wanting regular strategic intelligence without manual effort</li>
              <li>decision-makers looking for clearer external signals to inform planning</li>
            </ul>
          </section>

          <section className="space-y-4 border border-cyan-400/50 bg-black/70 p-8">
            <h2 className="font-tech text-2xl text-cyan-300">Why Work With Us</h2>
            <p className="text-lg leading-relaxed text-gray-300">
              We combine AI capability, business understanding, and strategic interpretation. That means we do not just collect information - we help turn public market signals into structured intelligence that is relevant, readable, and useful.
            </p>
            <p className="text-lg leading-relaxed text-gray-200">
              The result is better visibility, less blind spot risk, and a more informed view of the market around you.
            </p>
          </section>
        </div>
      </main>
    </Shell>
  );
}
