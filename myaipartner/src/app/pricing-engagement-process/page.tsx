"use client";

import Link from "next/link";
import Shell from "@/components/Shell";

export default function PricingEngagementProcessPage() {
  return (
    <Shell>
      <main className="relative overflow-hidden bg-[#0a0a0a] pt-8 pb-20 md:pt-12">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.06)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="relative z-10 mx-auto max-w-5xl space-y-8 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="font-tech inline-flex border border-cyan-400 px-5 py-2 text-xs tracking-[0.16em] text-cyan-300 hover:bg-cyan-400/10">
            ← BACK
          </Link>

          <section className="space-y-4 border border-cyan-400/50 bg-black/70 p-8">
            <h1 className="font-tech text-3xl text-cyan-300 md:text-4xl">Pricing &amp; Engagement Process</h1>
            <p className="text-lg leading-relaxed text-gray-300">
              We believe in being clear and transparent about how we work, how projects are scoped, and how fees are structured. Because most of our work is tailored to the needs of each client, final pricing depends on the scope, complexity, and delivery requirements of the specific engagement.
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
              <h3 className="font-tech text-lg text-cyan-300 md:text-xl">3. Initial Consultation Fee</h3>
              <p className="text-gray-300 leading-relaxed">
                If you would like to proceed with the follow-up meeting, an initial once-off consultation fee of R2,000 is payable.
              </p>
              <p className="font-tech text-sm tracking-wider text-cyan-300">This fee covers:</p>
              <ul className="grid gap-2 sm:grid-cols-2">
                {[
                  "review of your submitted brief",
                  "preliminary research and preparation",
                  "initial solution thinking",
                  "the follow-up consultation session itself"
                ].map((item) => (
                  <li key={item} className="text-gray-200 text-sm border border-cyan-500/25 bg-cyan-500/5 px-3 py-2">
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-gray-300 leading-relaxed">
                This ensures that the time already invested in understanding your needs and preparing for the engagement is properly covered.
              </p>
            </article>

            <article className="space-y-3 border border-cyan-500/35 bg-black/50 p-6">
              <h3 className="font-tech text-lg text-cyan-300 md:text-xl">4. Scope, Specifications, and Initial Quotation</h3>
              <p className="text-gray-300 leading-relaxed">
                Once the initial consultation has taken place and there is mutual agreement to proceed, we prepare a specifications document together with an initial quotation.
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
                  "projected costing"
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
              <h3 className="font-tech text-lg text-cyan-300 md:text-xl">5. Final Scope Approval and Payment Structure</h3>
              <p className="text-gray-300 leading-relaxed">
                Once the scope, specifications, and final quotation have been agreed, the project moves into execution.
              </p>
              <p className="text-gray-300 leading-relaxed">At that point, payment is structured as follows:</p>
              <ul className="grid gap-2 sm:grid-cols-2">
                {[
                  "25% deposit on approval of final scope, specifications, and quotation",
                  "25% on presentation of the MVP",
                  "25% on final draft",
                  "25% on delivery of the final product"
                ].map((item) => (
                  <li key={item} className="text-gray-200 text-sm border border-cyan-500/25 bg-cyan-500/5 px-3 py-2">
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-gray-300 leading-relaxed">
                This staged structure helps ensure clarity, momentum, and fairness throughout the project lifecycle.
              </p>
            </article>

            <article className="space-y-3 border border-cyan-500/35 bg-black/50 p-6">
              <h3 className="font-tech text-lg text-cyan-300 md:text-xl">6. Timelines</h3>
              <p className="text-gray-300 leading-relaxed">
                Estimated timelines are included in the quotation. These are based on the agreed scope at the time of quotation and may change if the scope changes, additional requirements are introduced, or external dependencies affect delivery.
              </p>
              <p className="text-gray-300 leading-relaxed">
                We aim to provide realistic timeline projections that reflect the actual complexity of the work.
              </p>
            </article>
          </section>

          <section className="space-y-4 border border-cyan-400/50 bg-black/70 p-8">
            <h2 className="font-tech text-xl text-cyan-300 md:text-2xl">Hourly Rate</h2>
            <p className="text-gray-300 leading-relaxed">Our standard hourly consulting and development rate is:</p>
            <p className="font-tech text-3xl text-cyan-300">R650 per hour</p>
            <p className="text-gray-300 leading-relaxed">
              This hourly rate may apply where appropriate for advisory work, consulting engagements, revisions outside agreed scope, additional support, or work that is not covered under a fixed project quotation.
            </p>
          </section>

          <section className="space-y-4 border border-cyan-400/50 bg-black/70 p-8">
            <h2 className="font-tech text-xl text-cyan-300 md:text-2xl">Exclusions and Direct Costs</h2>
            <p className="text-gray-300 leading-relaxed">
              Unless explicitly stated otherwise in the quotation, our pricing excludes third-party and direct project costs, including but not limited to:
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
              Any such costs will be identified separately where possible and discussed with you as part of the quotation or project planning process.
            </p>
          </section>

          <section className="space-y-4 border border-cyan-400/50 bg-black/70 p-8">
            <h2 className="font-tech text-xl text-cyan-300 md:text-2xl">Why We Structure Pricing This Way</h2>
            <p className="text-gray-300 leading-relaxed">
              Our projects typically involve substantial upfront thinking before development begins. Reviewing your brief, researching your requirements, preparing an initial plan, and conducting the discovery discussion all require time and expertise.
            </p>
            <p className="text-gray-300 leading-relaxed">This process helps ensure that:</p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {[
                "your requirements are properly understood",
                "the project is scoped realistically",
                "costs are quoted more accurately",
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
                "Initial consultation fee: R2,000 once-off",
                "Standard hourly rate: R650 per hour",
                "25% deposit on approval of final scope and quotation",
                "25% on MVP presentation",
                "25% on final draft",
                "25% on final delivery"
              ].map((item) => (
                <li key={item} className="text-gray-200 text-sm border border-cyan-500/25 bg-cyan-500/5 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-gray-300 leading-relaxed">
              Please note: Pricing excludes hosting, API charges, and other direct third-party or development-related costs unless specifically included in the quotation.
            </p>
          </section>
        </div>
      </main>
    </Shell>
  );
}
