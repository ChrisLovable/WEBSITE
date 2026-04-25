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
    title: "1. Executive Keynotes and Leadership Briefings",
    paragraphs: [
      "We deliver engaging and practical AI keynote talks and leadership briefings that make AI understandable in a business context.",
      "These sessions are designed for executive audiences who need strategic insight rather than technical deep dives. We focus on the real-world implications of AI for business models, operations, workforce capability, customer engagement, and competitive positioning.",
      "The objective is to inform, challenge, and inspire action without overwhelming the audience with jargon or hype."
    ],
    items: [
      "Business-focused AI keynote presentations",
      "Leadership briefings tailored to executive audiences",
      "Clear explanation of AI trends and business relevance",
      "Practical insight rather than technical overload",
      "Alignment around opportunities, risks, and priorities",
      "Stronger strategic understanding at leadership level"
    ]
  },
  {
    title: "2. Board and C-Suite AI Strategy Sessions",
    paragraphs: [
      "Boards and C-suite teams need structured conversations about AI that connect directly to business priorities, governance responsibilities, and investment decisions.",
      "We facilitate executive-level strategy sessions that help senior leaders think clearly about where AI fits within the organisation, what should be prioritised, what risks require oversight, and how leadership should guide responsible adoption.",
      "These sessions are designed to support sharper decision-making, better alignment, and more informed strategic direction."
    ],
    items: [
      "AI strategy sessions for boards and executive teams",
      "Discussion of AI opportunities in the context of business goals",
      "Leadership alignment around priorities and direction",
      "Governance, oversight, and risk considerations",
      "Executive decision support on AI investment and adoption",
      "More confident and informed strategic conversations"
    ]
  },
  {
    title: "3. Industry-Specific AI Trends and Implications",
    paragraphs: [
      "AI affects industries differently. Generic presentations often fail because they do not connect the technology to the realities of a particular sector.",
      "We tailor speaking engagements and briefings to the industry context of the audience, highlighting the trends, pressures, opportunities, and likely implications most relevant to that sector. This makes the conversation more practical, more credible, and far more useful to decision-makers.",
      "The aim is to help leaders understand not just AI in general, but AI in relation to their own business environment."
    ],
    items: [
      "Sector-relevant AI trends and developments",
      "Industry-specific business implications",
      "Use cases aligned to the audience's operating context",
      "Competitive and operational relevance",
      "More meaningful leadership engagement with AI topics",
      "Clearer understanding of what matters in that sector"
    ]
  },
  {
    title: "4. Actionable Next-Step Frameworks for Decision-Makers",
    paragraphs: [
      "Senior leaders do not just need insight - they need a way to translate insight into action.",
      "We provide practical frameworks that help leadership teams think about what to do next after the session. This may include prioritisation models, AI opportunity lenses, readiness questions, risk checkpoints, or structured next-step approaches to help move from awareness to action.",
      "This ensures that the session creates practical value rather than simply being interesting in the moment."
    ],
    items: [
      "Practical decision-making frameworks",
      "Prioritisation guidance for next steps",
      "Readiness and opportunity assessment lenses",
      "Leadership prompts for action and follow-through",
      "Structured thinking around responsible adoption",
      "Better conversion of insight into strategy"
    ]
  }
];

export default function CorporateAiSpeakingExecutiveBriefingsPage() {
  return (
    <Shell>
      <main className="relative overflow-hidden bg-[var(--color-bg)] pt-3 pb-20 md:pt-8">
        <div className="absolute inset-0 bg-[linear-gradient(var(--color-grid)_1px,transparent_1px),linear-gradient(90deg,var(--color-grid)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="relative z-10 mx-auto max-w-5xl space-y-8 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="font-tech inline-flex border border-cyan-400 px-5 py-2 text-xs tracking-[0.16em] text-cyan-300 hover:bg-cyan-400/10">
            ← BACK
          </Link>

          <section className="space-y-4 border border-cyan-400/50 bg-black/70 p-8">
            <h1 className="font-tech text-2xl text-cyan-300 md:text-3xl">Corporate AI Speaking &amp; Executive Briefings</h1>
            <p className="text-lg leading-relaxed text-gray-200">
              We deliver business-focused AI keynotes, executive briefings, and leadership sessions designed to help senior decision-makers understand where AI is creating real impact - and what that means for their organisation.
            </p>
            <p className="text-lg leading-relaxed text-gray-300">
              Our speaking and briefing engagements are practical, commercially grounded, and tailored to the realities of leadership. We cut through technical noise and inflated promises to focus on what executives actually need: strategic clarity, relevant opportunities, realistic risks, and a practical view of how AI can influence competitiveness, efficiency, innovation, and decision-making.
            </p>
            <p className="text-lg leading-relaxed text-gray-300">
              Whether the audience is a board, executive team, leadership group, industry forum, or conference audience, our goal is to create clarity, alignment, and momentum around the right AI conversations.
            </p>
          </section>

          <section className="space-y-4 border border-cyan-400/50 bg-black/70 p-8">
            <h2 className="font-tech text-2xl text-cyan-300">The Outcome</h2>
            <p className="text-lg leading-relaxed text-gray-200">Clear executive alignment and confident AI decision-making at leadership level.</p>
            <p className="text-lg leading-relaxed text-gray-300">
              Leaders leave with a better understanding of what matters, what is changing, where the opportunities are, and what practical next steps should look like.
            </p>
          </section>

          <section className="space-y-6 border border-cyan-400/50 bg-black/70 p-8">
            <h2 className="font-tech text-2xl text-cyan-300">Our Speaking and Briefing Focus Areas</h2>
            {focusAreas.map((focusArea) => (
              <FocusArea key={focusArea.title} {...focusArea} />
            ))}
          </section>

          <section className="space-y-4 border border-cyan-400/50 bg-black/70 p-8">
            <h2 className="font-tech text-2xl text-cyan-300">How We Work</h2>
            <p className="text-lg leading-relaxed text-gray-300">
              We tailor each speaking or briefing engagement to the audience, industry, and business context.
            </p>
            <p className="text-lg leading-relaxed text-gray-300">
              Some sessions are designed to inspire broad leadership awareness. Others are more focused and strategic, intended to support executive planning, board discussion, or industry-specific decision-making. In all cases, the content is designed to be commercially relevant, accessible, and grounded in real business value.
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {[
                "keynote speaking engagements",
                "leadership and executive briefings",
                "board-level AI strategy sessions",
                "industry conference presentations",
                "tailored decision-maker workshops"
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
              <li>boards and executive teams</li>
              <li>leadership groups exploring AI strategy</li>
              <li>organisations wanting executive alignment on AI</li>
              <li>conferences and industry forums seeking practical AI speakers</li>
              <li>decision-makers who need a business-first understanding of AI</li>
            </ul>
          </section>

          <section className="space-y-4 border border-cyan-400/50 bg-black/70 p-8">
            <h2 className="font-tech text-2xl text-cyan-300">Why Work With Us</h2>
            <p className="text-lg leading-relaxed text-gray-300">
              We combine AI insight, business understanding, and executive-level communication. That means our sessions are not abstract, overly technical, or trend-driven for the sake of it. We focus on what leadership teams actually need to know to make better decisions.
            </p>
            <p className="text-lg leading-relaxed text-gray-200">
              The result is a more informed leadership conversation, stronger alignment, and clearer next steps around AI.
            </p>
          </section>
        </div>
      </main>
    </Shell>
  );
}
