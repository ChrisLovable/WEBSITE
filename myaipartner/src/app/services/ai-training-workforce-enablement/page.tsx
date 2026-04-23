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
    title: "1. AI Fundamentals for Business Leaders",
    paragraphs: [
      "Leaders need a clear and realistic understanding of AI in order to make good decisions about strategy, investment, risk, and organisational adoption.",
      "We provide AI training for executives and leadership teams that cuts through technical jargon and focuses on what matters from a business perspective. This includes what AI can and cannot do, where it creates real value, what risks need to be understood, and how leaders can guide responsible adoption within the organisation.",
      "This creates better alignment between business strategy, operational priorities, and AI opportunity."
    ],
    items: [
      "Clear understanding of AI concepts in business terms",
      "What AI can realistically do in an organisation",
      "Strategic opportunities and limitations",
      "Leadership decision-making around AI investment",
      "Risk, governance, and oversight considerations",
      "Building confidence for informed AI adoption"
    ]
  },
  {
    title: "2. Practical AI for Managers and Staff",
    paragraphs: [
      "AI creates the most value when it becomes useful in day-to-day work.",
      "We train managers and staff to use AI tools in practical ways that improve productivity, support better communication, reduce repetitive work, and enhance the quality of outputs. This training is grounded in real business use rather than theory, helping teams understand how AI can support their roles and responsibilities in meaningful ways.",
      "The aim is to make AI approachable, relevant, and immediately useful across the organisation."
    ],
    items: [
      "Practical use of AI tools in everyday work",
      "Productivity enhancement across common business tasks",
      "Better use of AI for communication, analysis, and admin",
      "Role-relevant examples and business scenarios",
      "Building confidence among non-technical users",
      "Encouraging responsible and effective tool usage"
    ]
  },
  {
    title: "3. Prompt Engineering and AI Workflows",
    paragraphs: [
      "Getting strong results from AI depends heavily on how it is used.",
      "We train teams to communicate effectively with AI systems by teaching structured prompting, better instruction design, context-setting, and workflow thinking. This helps users move beyond basic experimentation and start using AI more deliberately and productively.",
      "We also show teams how AI can be embedded into repeatable workflows so that outputs become more consistent, useful, and aligned to business needs."
    ],
    items: [
      "Prompting techniques for better AI outputs",
      "Structuring instructions and context clearly",
      "Improving consistency and relevance of results",
      "Using AI within repeatable work processes",
      "Designing smarter AI-assisted workflows",
      "Moving from casual use to practical capability"
    ]
  },
  {
    title: "4. Building AI-Powered Apps",
    paragraphs: [
      "For organisations with technical teams, internal innovators, or product ambitions, we provide training on how to design and build AI-enabled applications.",
      "This includes understanding where AI features can add value, how they fit into software workflows, how to think about user experience, and how to build useful AI-assisted systems rather than novelty features. The focus is on practical development thinking, solution design, and responsible implementation.",
      "This is especially valuable for teams looking to build internal tools, customer-facing products, or AI-enhanced platforms."
    ],
    items: [
      "Foundations for building AI-enabled applications",
      "Identifying useful AI features in software products",
      "Designing AI into business workflows and user journeys",
      "Practical thinking around implementation and usability",
      "Building internal or customer-facing AI tools",
      "Translating AI ideas into working solutions"
    ]
  },
  {
    title: "5. Responsible AI and Governance",
    paragraphs: [
      "Organisations need people who understand not only how to use AI, but how to use it responsibly.",
      "We provide training on responsible AI practices, including fairness, transparency, human oversight, privacy awareness, risk management, and governance thinking. This helps teams understand the broader responsibilities that come with AI adoption and supports safer, more credible implementation across the business.",
      "The objective is to help organisations use AI in ways that are trusted, controlled, and aligned to good business practice."
    ],
    items: [
      "Principles of responsible AI use",
      "Awareness of bias, fairness, and accountability issues",
      "Human oversight and appropriate control",
      "Privacy and risk-conscious AI adoption",
      "Governance thinking for organisational use",
      "Supporting trust and responsible decision-making"
    ]
  }
];

export default function AiTrainingWorkforceEnablementPage() {
  return (
    <Shell>
      <main className="relative overflow-hidden bg-[#0a0a0a] pt-3 pb-20 md:pt-8">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.06)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="relative z-10 mx-auto max-w-5xl space-y-8 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="font-tech inline-flex border border-cyan-400 px-5 py-2 text-xs tracking-[0.16em] text-cyan-300 hover:bg-cyan-400/10">
            ← BACK
          </Link>

          <section className="space-y-4 border border-cyan-400/50 bg-black/70 p-8">
            <h1 className="font-tech text-2xl text-cyan-300 md:text-3xl">AI Training &amp; Workforce Enablement</h1>
            <p className="text-lg leading-relaxed text-gray-200">
              We help organisations build AI capability across their teams - from leadership and managers to operational staff and technical builders. Our training is designed to make AI understandable, practical, and useful, regardless of technical background.
            </p>
            <p className="text-lg leading-relaxed text-gray-300">
              The goal is not just to explain what AI is, but to help people use it confidently, responsibly, and effectively in the context of their actual work. Whether your organisation is just starting its AI journey or looking to deepen internal capability, we provide structured, practical enablement that turns interest into action.
            </p>
            <p className="text-lg leading-relaxed text-gray-300">
              We focus on real-world understanding, practical skills, responsible use, and the ability to identify where AI can create value across the business.
            </p>
          </section>

          <section className="space-y-4 border border-cyan-400/50 bg-black/70 p-8">
            <h2 className="font-tech text-2xl text-cyan-300">The Outcome</h2>
            <p className="text-lg leading-relaxed text-gray-200">Empowered teams capable of leveraging AI tools effectively and responsibly.</p>
            <p className="text-lg leading-relaxed text-gray-300">
              Your people gain the knowledge, confidence, and practical capability to work with AI in ways that improve productivity, decision-making, innovation, and long-term organisational readiness.
            </p>
          </section>

          <section className="space-y-6 border border-cyan-400/50 bg-black/70 p-8">
            <h2 className="font-tech text-2xl text-cyan-300">Our Training Focus Areas</h2>
            {focusAreas.map((focusArea) => (
              <FocusArea key={focusArea.title} {...focusArea} />
            ))}
          </section>

          <section className="space-y-4 border border-cyan-400/50 bg-black/70 p-8">
            <h2 className="font-tech text-2xl text-cyan-300">How We Work</h2>
            <p className="text-lg leading-relaxed text-gray-300">
              We tailor training to the audience, business context, and level of AI maturity within the organisation.
            </p>
            <p className="text-lg leading-relaxed text-gray-300">
              Some teams need foundational awareness. Others need practical user training. Others need deeper capability-building around workflows, app development, or governance. We design training that is relevant, accessible, and directly connected to the work people actually do.
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {[
                "executive briefings",
                "leadership workshops",
                "team training sessions",
                "practical AI capability programmes",
                "AI adoption and enablement initiatives"
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
              <li>leadership teams wanting to understand AI strategically</li>
              <li>organisations preparing staff for AI adoption</li>
              <li>managers and employees needing practical AI skills</li>
              <li>businesses wanting more effective and responsible use of AI tools</li>
              <li>teams looking to build internal AI capability over time</li>
            </ul>
          </section>

          <section className="space-y-4 border border-cyan-400/50 bg-black/70 p-8">
            <h2 className="font-tech text-2xl text-cyan-300">Why Work With Us</h2>
            <p className="text-lg leading-relaxed text-gray-300">
              We combine practical AI understanding with real business context. That means our training is not abstract, overly technical, or disconnected from day-to-day work. We help teams understand what AI means in practice, how to use it effectively, and how to do so responsibly.
            </p>
            <p className="text-lg leading-relaxed text-gray-200">
              The result is a more capable workforce, better adoption outcomes, and stronger organisational readiness for the future.
            </p>
          </section>
        </div>
      </main>
    </Shell>
  );
}
