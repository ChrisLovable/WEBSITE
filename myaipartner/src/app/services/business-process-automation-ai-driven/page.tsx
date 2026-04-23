"use client";

import Link from "next/link";
import Shell from "@/components/Shell";

export default function BusinessProcessAutomationPage() {
  return (
    <Shell>
      <main className="relative overflow-hidden bg-[#0a0a0a] pt-3 pb-20 md:pt-8">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.06)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="pt-0">
            <Link
              href="/"
              className="font-tech inline-flex items-center justify-center border border-cyan-400 px-5 py-2 text-xs tracking-[0.16em] text-cyan-300 transition hover:bg-cyan-400/10"
            >
              ← BACK
            </Link>
          </div>

          <section className="border border-cyan-400/50 bg-black/70 p-8">
            <h1 className="font-tech text-2xl md:text-3xl text-cyan-300 mb-4">Business Process Automation (AI-Driven)</h1>
            <p className="text-gray-200 text-lg leading-relaxed">
              We help businesses automate repetitive, manual, and error-prone processes using AI, APIs, and
              intelligent workflow design. By connecting your existing systems and removing unnecessary friction, we
              create faster, more reliable operations that reduce admin pressure and free your team to focus on
              higher-value work.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed mt-4">
              Our approach is practical and results-driven. We do not automate for the sake of automation. We identify
              where time is being lost, where errors are occurring, where staff are tied up in repetitive processes,
              and where intelligent automation can create measurable operational value.
            </p>
          </section>

          <section className="border border-cyan-400/50 bg-black/70 p-8">
            <h2 className="font-tech text-2xl text-cyan-300 mb-3">The Outcome</h2>
            <p className="text-gray-200 text-lg leading-relaxed">
              Faster operations, fewer errors, lower operating costs, and more scalable business processes.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed mt-4">
              Whether you are dealing with large volumes of documents, customer communications, approvals, reporting,
              or internal admin workflows, we help you streamline the way work gets done.
            </p>
          </section>

          <section className="border border-cyan-400/50 bg-black/70 p-8 space-y-8">
            <h2 className="font-tech text-2xl text-cyan-300">Our Automation Focus Areas</h2>

            <FocusArea
              title="1. Invoice and Document Processing (OCR + AI)"
              intro="Manual document handling slows businesses down and creates unnecessary risk."
              body="We design automation solutions that capture, read, classify, extract, and process information from invoices, forms, statements, receipts, supporting documents, and other business records. Using OCR combined with AI-based interpretation, we reduce manual data entry, improve turnaround times, and increase consistency."
              summary="This is especially valuable where teams are spending hours processing documents that follow recurring patterns but still require accuracy and control."
              items={[
                "Invoice capture and data extraction",
                "OCR-driven document reading",
                "Classification of business documents",
                "Validation of extracted fields",
                "Routing documents into downstream systems or workflows",
                "Reducing manual processing effort and input errors"
              ]}
            />

            <FocusArea
              title="2. Email, WhatsApp, and Customer Message Automation"
              intro="Customer communication can quickly become fragmented, repetitive, and difficult to manage at scale."
              body="We help businesses automate key parts of their inbound and outbound communication workflows across channels such as email, WhatsApp, website forms, and customer messaging platforms. This can include auto-responses, classification, routing, escalation logic, templated replies, intelligent message handling, and communication workflows triggered by events or business rules."
              summary="The goal is not to remove the human element where it matters - it is to reduce repetitive messaging work, speed up response times, and improve consistency across customer interactions."
              items={[
                "Automated message triage and routing",
                "Response workflows for common enquiries",
                "WhatsApp and email automation",
                "Customer communication triggers and follow-ups",
                "Escalation paths for high-priority messages",
                "Improved response speed and consistency"
              ]}
            />

            <FocusArea
              title="3. Workflow Approvals and Decision Engines"
              intro="Many organisations lose time because approvals, sign-offs, and routine decisions are handled manually through email chains, phone calls, or unclear internal processes."
              body="We build structured workflow systems that automate approval paths, enforce business rules, and improve visibility over decisions. This can include approval routing, conditional logic, status tracking, exception handling, notifications, and automated handoffs between people or systems."
              summary="Where appropriate, AI can also assist in supporting decisions by summarising data, identifying patterns, or helping classify requests before they move through the workflow."
              items={[
                "Automated approval workflows",
                "Rule-based decision routing",
                "Notifications and escalations",
                "Exception handling and process control",
                "Improved accountability and turnaround times",
                "Reduced delays caused by manual coordination"
              ]}
            />

            <FocusArea
              title="4. Reporting and Analytics Automation"
              intro="Reporting should not depend on people manually collecting, cleaning, combining, and formatting data every week or every month."
              body="We automate reporting processes so that business data can flow from your operational systems into dashboards, summaries, scheduled reports, and decision-support outputs with far less manual effort. This improves speed, reduces reporting errors, and gives management more reliable visibility into performance."
              summary="Automation can include pulling data from multiple sources, transforming it into a usable structure, validating it, and presenting it in a format that supports decision-making."
              items={[
                "Automated report generation",
                "Scheduled analytics and dashboard updates",
                "Data consolidation from multiple systems",
                "Reduction of manual spreadsheet work",
                "Improved reporting accuracy and speed",
                "More timely management insight"
              ]}
            />

            <FocusArea
              title="5. HR, Payroll, Scheduling, and Compliance Workflows"
              intro="Administrative workflows in HR and operations are often highly repetitive, time-sensitive, and vulnerable to mistakes."
              body="We help automate common internal workflows such as onboarding, leave handling, payroll support processes, scheduling coordination, staff communication, document collection, compliance tracking, and other recurring administrative tasks. This reduces manual follow-up, improves record consistency, and helps teams stay on top of operational requirements."
              summary="These workflows can often be linked to existing systems so that information moves more smoothly across the business without repeated manual intervention."
              items={[
                "HR and employee admin workflows",
                "Payroll support and related processing workflows",
                "Scheduling and roster automation",
                "Compliance tracking and reminders",
                "Internal notifications and task triggers",
                "Reduced administrative burden on operations teams"
              ]}
            />

            <FocusArea
              title="6. Data Extraction, Validation, and Reconciliation"
              intro="Businesses often rely on teams to manually compare, verify, and reconcile information across spreadsheets, documents, systems, and reports."
              body="We automate the extraction and checking of data so that inconsistencies, missing information, duplicates, and mismatches can be identified more quickly and more accurately. This is especially useful in finance, operations, reporting, payroll, stock control, compliance, and other environments where data integrity is essential."
              summary="Automation in this area helps improve confidence in your information while reducing the time spent on repetitive checking and correction."
              items={[
                "Extraction of structured and semi-structured data",
                "Validation against rules or reference sources",
                "Matching and reconciliation workflows",
                "Detection of anomalies and inconsistencies",
                "Reduction of manual checking effort",
                "Improved data accuracy and operational control"
              ]}
            />
          </section>

          <section className="border border-cyan-400/50 bg-black/70 p-8 space-y-6">
            <h2 className="font-tech text-2xl text-cyan-300">How We Work</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              We start by understanding how the process currently works, where the friction is, what systems are
              involved, and what outcomes matter most to the business.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              From there, we identify where automation can create the strongest return, design a practical solution,
              and help implement workflows that are reliable, efficient, and fit for real business use. Our focus is
              always on operational value, not unnecessary complexity.
            </p>
            <div>
              <p className="text-gray-200 mb-2">We can support you through:</p>
              <ul className="space-y-2 text-gray-300 list-disc list-inside">
                <li>process discovery and analysis</li>
                <li>automation opportunity assessments</li>
                <li>workflow design and optimisation</li>
                <li>system integration planning</li>
                <li>implementation support and refinement</li>
              </ul>
            </div>
          </section>

          <section className="border border-cyan-400/50 bg-black/70 p-8 space-y-6">
            <h2 className="font-tech text-2xl text-cyan-300">Who This Is For</h2>
            <ul className="space-y-2 text-gray-300 list-disc list-inside">
              <li>businesses with repetitive admin-heavy workflows</li>
              <li>teams struggling with manual document or message handling</li>
              <li>organisations looking to improve speed and accuracy</li>
              <li>businesses wanting to reduce operational bottlenecks</li>
              <li>companies that need scalable workflows without increasing headcount at the same rate</li>
            </ul>
          </section>

          <section className="border border-cyan-400/50 bg-black/70 p-8">
            <h2 className="font-tech text-2xl text-cyan-300 mb-3">Why Work With Us</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              We combine AI thinking, business process understanding, and practical automation design. That means we
              do not just look at tools - we look at how work actually flows through your business, where value is
              being lost, and how intelligent automation can improve performance in a measurable way.
            </p>
            <p className="text-gray-200 text-lg leading-relaxed mt-4">
              The result is more efficient operations, better consistency, and automation that supports real business
              outcomes.
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
      <h3 className="font-tech text-xl text-cyan-300">{title}</h3>
      <p className="text-gray-200 leading-relaxed">{intro}</p>
      <p className="text-gray-300 leading-relaxed">{body}</p>
      <p className="text-gray-300 leading-relaxed">{summary}</p>
      <div>
        <p className="text-gray-200 mb-2">What this covers:</p>
        <ul className="space-y-1 text-gray-300 list-disc list-inside">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

