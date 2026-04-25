"use client";

import Link from "next/link";
import Shell from "@/components/Shell";

export default function ProcessPage() {
  return (
    <Shell>
      <main className="relative overflow-hidden bg-[var(--color-bg)] pt-8 pb-20 md:pt-12">
        <div className="absolute inset-0 bg-[linear-gradient(var(--color-grid)_1px,transparent_1px),linear-gradient(90deg,var(--color-grid)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="relative z-10 mx-auto max-w-5xl space-y-8 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="font-tech inline-flex border border-cyan-400 px-5 py-2 text-xs tracking-[0.16em] text-cyan-300 hover:bg-cyan-400/10">
            ← BACK
          </Link>

          <section className="space-y-4 border border-cyan-400/50 bg-black/70 p-8">
            <h1 className="font-tech text-2xl text-cyan-300 md:text-3xl">Engagement Process</h1>
            <p className="text-lg leading-relaxed text-gray-300">
              We believe in a clear, structured process so every engagement starts with alignment and moves forward with
              confidence. Our approach is designed to define scope properly, reduce delivery risk, and keep communication
              consistent from discovery through implementation.
            </p>
          </section>

          <section className="space-y-6 border border-cyan-400/50 bg-black/70 p-8">
            <h2 className="font-tech text-xl text-cyan-300 md:text-2xl">How the Process Works</h2>

            <article className="space-y-3 border border-cyan-500/35 bg-black/50 p-6">
              <h3 className="font-tech text-lg text-cyan-300 md:text-xl">1. Initial Brief Submission</h3>
              <p className="text-gray-300 leading-relaxed">
                The process starts when you submit your enquiry and complete the attached briefing form. This gives us the information we need to understand your requirements, business context, priorities, and the type of solution or service you are looking for.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Once we receive your brief, we review it carefully and begin preparing for the next step.
              </p>
            </article>

            <article className="space-y-3 border border-cyan-500/35 bg-black/50 p-6">
              <h3 className="font-tech text-lg text-cyan-300 md:text-xl">2. Discovery Follow-Up Meeting</h3>
              <p className="text-gray-300 leading-relaxed">
                After reviewing your brief, we schedule a follow-up discussion with you. This can take place in person, by video conference, or by phone - whichever you prefer.
              </p>
              <p className="text-gray-300 leading-relaxed">
                This session is typically one hour or longer, depending on the complexity of the requirement. By this stage, we have already spent time reviewing your brief, doing preliminary thinking and research, and preparing an initial direction and plan for discussion with you.
              </p>
            </article>

            <article className="space-y-3 border border-cyan-500/35 bg-black/50 p-6">
              <h3 className="font-tech text-lg text-cyan-300 md:text-xl">3. Discovery Summary and Direction</h3>
              <p className="text-gray-300 leading-relaxed">
                After discovery, we provide a clear summary of priorities, opportunities, constraints, and a recommended
                direction. This helps ensure both sides are aligned before formal implementation planning begins.
              </p>
              <p className="text-gray-300 leading-relaxed">
                The focus at this stage is clarity: what problem is being solved, what success looks like, and what should
                happen first.
              </p>
            </article>

            <article className="space-y-3 border border-cyan-500/35 bg-black/50 p-6">
              <h3 className="font-tech text-lg text-cyan-300 md:text-xl">4. Scope, Specifications, and Implementation Plan</h3>
              <p className="text-gray-300 leading-relaxed">
                Once there is mutual agreement to proceed, we prepare a detailed specification and implementation plan.
              </p>
              <p className="text-gray-300 leading-relaxed">This stage is used to define the project properly and may include:</p>
              <ul className="grid gap-2 sm:grid-cols-2">
                {[
                  "project scope",
                  "key deliverables",
                  "functional requirements",
                  "assumptions and exclusions",
                  "implementation approach",
                  "indicative timeline",
                  "dependencies and delivery checkpoints"
                ].map((item) => (
                  <li key={item} className="text-gray-200 text-sm border border-cyan-500/25 bg-cyan-500/5 px-3 py-2">
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-gray-300 leading-relaxed">
                Our goal is to make sure both parties have a clear, shared understanding of what is being built or delivered before development work begins.
              </p>
            </article>

            <article className="space-y-3 border border-cyan-500/35 bg-black/50 p-6">
              <h3 className="font-tech text-lg text-cyan-300 md:text-xl">5. Final Scope Approval and Project Kickoff</h3>
              <p className="text-gray-300 leading-relaxed">
                Once scope and specifications are agreed, the project moves into execution.
              </p>
              <p className="text-gray-300 leading-relaxed">At kickoff, we align on:</p>
              <ul className="grid gap-2 sm:grid-cols-2">
                {[
                  "delivery phases and milestones",
                  "reporting cadence and review points",
                  "stakeholder communication flow",
                  "acceptance criteria for each stage"
                ].map((item) => (
                  <li key={item} className="text-gray-200 text-sm border border-cyan-500/25 bg-cyan-500/5 px-3 py-2">
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-gray-300 leading-relaxed">This keeps execution structured and transparent across the full lifecycle.</p>
            </article>

            <article className="space-y-3 border border-cyan-500/35 bg-black/50 p-6">
              <h3 className="font-tech text-lg text-cyan-300 md:text-xl">6. Timelines</h3>
              <p className="text-gray-300 leading-relaxed">Estimated timelines are based on agreed scope and delivery dependencies.</p>
              <p className="text-gray-300 leading-relaxed">
                Where requirements evolve, timelines are reviewed collaboratively to maintain quality and delivery confidence.
              </p>
            </article>
          </section>

          <section className="space-y-4 border border-cyan-400/50 bg-black/70 p-8">
            <h2 className="font-tech text-xl text-cyan-300 md:text-2xl">Project Governance</h2>
            <p className="text-gray-300 leading-relaxed">
              Throughout delivery, we maintain structured governance with regular check-ins, documented decisions, and milestone
              reviews to ensure progress stays aligned with agreed objectives.
            </p>
          </section>

          <section className="space-y-4 border border-cyan-400/50 bg-black/70 p-8">
            <h2 className="font-tech text-xl text-cyan-300 md:text-2xl">Dependencies and Third-Party Considerations</h2>
            <p className="text-gray-300 leading-relaxed">
              Some projects involve external services and technical dependencies that can affect implementation timing and complexity.
              Typical examples include:
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {[
                "hosting and infrastructure costs",
                "API usage fees",
                "software licences or subscriptions",
                "external platform charges",
                "third-party integrations with usage-based billing",
                "other direct development or operational costs incurred by the development team"
              ].map((item) => (
                <li key={item} className="text-gray-200 text-sm border border-cyan-500/25 bg-cyan-500/5 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-gray-300 leading-relaxed">
              Where applicable, these are identified early and discussed as part of planning so delivery remains predictable.
            </p>
          </section>

          <section className="space-y-4 border border-cyan-400/50 bg-black/70 p-8">
            <h2 className="font-tech text-xl text-cyan-300 md:text-2xl">Why We Structure the Process This Way</h2>
            <p className="text-gray-300 leading-relaxed">
              Our projects typically involve substantial upfront thinking before development begins. Reviewing your brief, researching your requirements, preparing an initial plan, and conducting the discovery discussion all require time and expertise.
            </p>
            <p className="text-gray-300 leading-relaxed">This process helps ensure that:</p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {[
                "your requirements are properly understood",
                "the project is scoped realistically",
                "delivery risk is reduced early",
                "delivery expectations are clear from the start"
              ].map((item) => (
                <li key={item} className="text-gray-200 text-sm border border-cyan-500/25 bg-cyan-500/5 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-gray-300 leading-relaxed">
              It also allows us to begin engagements in a structured, professional way that protects both parties and improves the likelihood of a successful outcome.
            </p>
          </section>

          <section className="space-y-4 border border-cyan-400/50 bg-black/70 p-8">
            <h2 className="font-tech text-xl text-cyan-300 md:text-2xl">Summary</h2>
            <ul className="grid gap-2">
              {[
                "Clear intake and discovery process",
                "Structured scope and implementation planning",
                "Milestone-based delivery and governance",
                "Transparent stakeholder communication",
                "Realistic timelines aligned to project complexity"
              ].map((item) => (
                <li key={item} className="text-gray-200 text-sm border border-cyan-500/25 bg-cyan-500/5 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-gray-300 leading-relaxed">
              Our goal is to deliver work in a professional, predictable process that keeps strategy, execution, and outcomes aligned.
            </p>
          </section>
        </div>
      </main>
    </Shell>
  );
}
