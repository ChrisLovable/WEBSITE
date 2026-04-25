"use client";

import Shell from "@/components/Shell";
import Link from "next/link";

export default function AIStrategyBusinessConsultingPage() {
  return (
    <Shell>
      <main className="relative overflow-hidden bg-[var(--color-bg)] pt-3 pb-20 md:pt-8">
        <div className="absolute inset-0 bg-[linear-gradient(var(--color-grid)_1px,transparent_1px),linear-gradient(90deg,var(--color-grid)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="pt-0">
            <Link
              href="/"
              className="font-tech inline-flex items-center justify-center border border-[var(--color-border)] px-5 py-2 text-xs tracking-[0.16em] text-[var(--color-accent)] transition hover:bg-[var(--color-accent-bg)]"
            >
              ← BACK
            </Link>
          </div>

          <section className="border border-[var(--color-border)] bg-[var(--color-bg-card)] p-8">
            <h1 className="font-tech text-2xl md:text-3xl text-[var(--color-accent)] mb-4">AI Strategy &amp; Business Consulting</h1>
            <p className="text-[var(--color-text-primary)] text-lg leading-relaxed">
              We help leadership teams cut through the noise and identify where AI can create real business value. Our
              focus is practical, commercially sensible AI - not hype, not experimentation for its own sake, and not
              generic transformation language.
            </p>
            <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed mt-4">
              We work with you to understand your business model, operations, customer journeys, data landscape, and
              decision-making processes so we can identify the most valuable and realistic AI opportunities for your
              organisation.
            </p>
          </section>

          <section className="border border-[var(--color-border)] bg-[var(--color-bg-card)] p-8">
            <h2 className="font-tech text-2xl text-[var(--color-accent)] mb-3">The Outcome</h2>
            <p className="text-[var(--color-text-primary)] text-lg leading-relaxed">
              A clear, realistic AI strategy aligned to your business goals, operating realities, and budget - with a
              practical path to execution.
            </p>
            <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed mt-4">
              Whether you are just starting to explore AI or trying to prioritise where to invest next, we help you
              move forward with confidence, clarity, and a strong commercial foundation.
            </p>
          </section>

          <section className="border border-[var(--color-border)] bg-[var(--color-bg-card)] p-8 space-y-8">
            <h2 className="font-tech text-2xl text-[var(--color-accent)]">Our Consulting Focus Areas</h2>

            <FocusArea
              title="1. AI Opportunity Assessment"
              intro="We identify where AI can genuinely add value across your business."
              body="This includes reviewing your workflows, customer interactions, reporting needs, internal processes, and current pain points to uncover high-impact opportunities for AI adoption. We assess where AI can improve productivity, enhance decision-making, reduce manual effort, strengthen customer experience, or open up new commercial opportunities."
              summary="Rather than recommending AI for everything, we focus on the opportunities that are realistic, useful, and aligned to your business priorities."
              items={[
                "Identification of high-value AI use cases",
                "Prioritisation of quick wins vs strategic opportunities",
                "Assessment of business impact and practicality",
                "Evaluation of where AI is appropriate - and where it is not"
              ]}
            />

            <FocusArea
              title="2. Automation and Efficiency Audits"
              intro="We analyse your current business processes to identify inefficiencies, bottlenecks, repetitive tasks, and areas where intelligent automation can deliver measurable gains."
              body="Many businesses already have processes that are costing time, money, and management attention every day. We help you find those friction points and determine where AI, automation tools, or improved workflows can create operational efficiencies."
              summary="This is not just about reducing workload - it is about improving consistency, speed, visibility, and scalability."
              items={[
                "Review of manual, repetitive, or time-consuming tasks",
                "Process bottleneck identification",
                "Opportunities for AI-enabled workflow automation",
                "Efficiency improvement recommendations",
                "Assessment of productivity and service-delivery gains"
              ]}
            />

            <FocusArea
              title="3. AI Roadmap and Implementation Planning"
              intro="Once the right opportunities have been identified, we help you turn them into an actionable plan."
              body="We develop a practical AI roadmap that outlines what to do first, what to do later, what resources are needed, which systems may be affected, and how implementation can be phased to reduce risk and maximise value. This gives your leadership team a realistic plan rather than a vague intention to 'do AI'."
              summary="Our roadmaps are grounded in business priorities, change readiness, available data, technical feasibility, and internal capability."
              items={[
                "AI adoption roadmap development",
                "Prioritised implementation phases",
                "Short-, medium-, and long-term planning",
                "Resource and capability considerations",
                "Risk-aware rollout planning"
              ]}
            />

            <FocusArea
              title="4. Cost-Benefit and ROI Analysis"
              intro="AI should make commercial sense."
              body="We help you evaluate the likely costs, benefits, risks, and expected returns of AI initiatives before significant money or time is committed. This allows decision-makers to understand which opportunities justify investment and which may not yet be worth pursuing."
              summary="We look at financial return, operational value, time savings, service improvements, scalability, and strategic advantage - while also being honest about implementation costs and ongoing requirements."
              items={[
                "Expected cost analysis",
                "Benefit and value estimation",
                "ROI modelling and commercial justification",
                "Comparison of alternative approaches",
                "Decision support for leadership and stakeholders"
              ]}
            />

            <FocusArea
              title="5. Data Readiness and Infrastructure Assessment"
              intro="AI is only as effective as the data, systems, and operational foundations behind it."
              body="We assess whether your organisation is ready to support AI effectively by reviewing data quality, availability, structure, access, governance, and supporting infrastructure. Where gaps exist, we identify them clearly and recommend practical steps to improve readiness."
              summary="This ensures that AI initiatives are built on a stable foundation rather than weak assumptions."
              items={[
                "Review of current data availability and quality",
                "Assessment of data structure and accessibility",
                "Evaluation of system readiness and integration considerations",
                "Identification of data and infrastructure gaps",
                "Recommendations to strengthen AI readiness"
              ]}
            />

            <FocusArea
              title="6. Ethical and Responsible AI Guidance"
              intro="Adopting AI responsibly is not optional."
              body="We help organisations think through the ethical, operational, and governance implications of AI use. This includes fairness, transparency, accountability, privacy, bias, human oversight, and appropriate use of sensitive data."
              summary="Our goal is to help you implement AI in a way that supports trust, protects your brand, and reduces avoidable legal, reputational, and operational risks."
              items={[
                "Ethical AI considerations in business use",
                "Responsible AI decision-making principles",
                "Bias, fairness, and accountability awareness",
                "Governance and oversight guidance",
                "Privacy and risk-conscious AI use"
              ]}
            />
          </section>

          <section className="border border-[var(--color-border)] bg-[var(--color-bg-card)] p-8 space-y-6">
            <h2 className="font-tech text-2xl text-[var(--color-accent)]">How We Work</h2>
            <p className="text-[var(--color-text-primary)] text-lg leading-relaxed">
              Our approach is practical, business-focused, and outcome-driven.
            </p>
            <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed">
              We do not begin with technology. We begin with your business goals, your operational realities, and your
              biggest opportunities. From there, we help you make sensible decisions about where AI can create
              measurable value and how to pursue it in a structured, low-risk way.
            </p>
            <div>
              <p className="text-[var(--color-text-primary)] mb-2">We can support leadership teams through:</p>
              <ul className="space-y-2 text-[var(--color-text-secondary)] list-disc list-inside">
                <li>strategy workshops</li>
                <li>focused advisory sessions</li>
                <li>opportunity discovery engagements</li>
                <li>AI planning projects</li>
                <li>implementation guidance</li>
              </ul>
            </div>
          </section>

          <section className="border border-[var(--color-border)] bg-[var(--color-bg-card)] p-8 space-y-6">
            <h2 className="font-tech text-2xl text-[var(--color-accent)]">Who This Is For</h2>
            <ul className="space-y-2 text-[var(--color-text-secondary)] list-disc list-inside">
              <li>business owners and executives</li>
              <li>leadership teams exploring AI adoption</li>
              <li>organisations wanting clarity before investing</li>
              <li>companies looking to improve efficiency and reduce manual workload</li>
              <li>businesses that want a realistic, commercially grounded AI plan</li>
            </ul>
          </section>

          <section className="border border-[var(--color-border)] bg-[var(--color-bg-card)] p-8">
            <h2 className="font-tech text-2xl text-[var(--color-accent)] mb-3">Why Work With Us</h2>
            <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed">
              We combine business thinking with practical AI understanding. That means we do not simply recommend
              tools - we help you determine what is worth doing, why it matters, what it will take, and how to
              approach it responsibly.
            </p>
            <p className="text-[var(--color-text-primary)] text-lg leading-relaxed mt-4">
              The result is an AI strategy that is realistic, prioritised, and aligned to real business value.
            </p>
          </section>
        </div>
      </main>
    </Shell>
  );
}

function FocusArea({
  title,
  intro,
  body,
  summary,
  items
}: {
  title: string;
  intro: string;
  body: string;
  summary: string;
  items: string[];
}) {
  return (
    <div className="space-y-4">
      <h3 className="font-tech text-xl text-[var(--color-accent)]">{title}</h3>
      <p className="text-[var(--color-text-primary)] leading-relaxed">{intro}</p>
      <p className="text-[var(--color-text-secondary)] leading-relaxed">{body}</p>
      <p className="text-[var(--color-text-secondary)] leading-relaxed">{summary}</p>
      <div>
        <p className="text-[var(--color-text-primary)] mb-2">What this covers:</p>
        <ul className="space-y-1 text-[var(--color-text-secondary)] list-disc list-inside">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

