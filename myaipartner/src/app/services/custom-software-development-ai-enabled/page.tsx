"use client";

import Link from "next/link";
import Shell from "@/components/Shell";

export default function CustomSoftwareDevelopmentPage() {
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
            <h1 className="font-tech text-2xl md:text-3xl text-cyan-300 mb-4">Custom Software Development (AI-Enabled)</h1>
            <p className="text-gray-200 text-lg leading-relaxed">
              We design and build custom software systems around the way your business actually works - not the other
              way around. Our focus is on creating practical, scalable, and secure software solutions that solve real
              operational problems, improve visibility, and support growth.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed mt-4">
              Where AI adds genuine business value, we integrate it thoughtfully into the solution. That may mean
              intelligent automation, better decision support, smarter data handling, or improved user experience - but
              always with a clear purpose and measurable benefit.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed mt-4">
              Whether you need an internal platform, a management dashboard, a secure customer portal, or a
              specialised industry tool, we build software that fits your business model, processes, and goals.
            </p>
          </section>

          <section className="border border-cyan-400/50 bg-black/70 p-8">
            <h2 className="font-tech text-2xl text-cyan-300 mb-3">The Outcome</h2>
            <p className="text-gray-200 text-lg leading-relaxed">
              Software that fits your business - not generic tools that force you to adapt.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed mt-4">
              You get a system designed for your needs, your workflows, your users, and your future direction, with
              the flexibility to evolve as your business grows.
            </p>
          </section>

          <section className="border border-cyan-400/50 bg-black/70 p-8 space-y-8">
            <h2 className="font-tech text-2xl text-cyan-300">Our Development Focus Areas</h2>

            <FocusArea
              title="1. Internal Business Platforms"
              intro="Many businesses rely on spreadsheets, disconnected systems, email chains, and manual workarounds to run core parts of their operations."
              body="We build internal business platforms that centralise important processes, improve control, and give teams a more effective way to manage work. These systems can be designed for operations, administration, service delivery, compliance, logistics, internal communication, reporting, approvals, or any other critical business function."
              summary="The aim is to replace fragmented ways of working with a structured platform that improves consistency, efficiency, and visibility."
              items={[
                "Custom internal systems tailored to your workflows",
                "Centralised process and task management",
                "Role-based user access and permissions",
                "Workflow visibility and operational control",
                "Reduction of spreadsheet and email dependency",
                "Better scalability for growing teams and operations"
              ]}
            />

            <FocusArea
              title="2. Management Dashboards and BI Systems"
              intro="Leaders need clear, timely, and accurate visibility into what is happening in the business."
              body="We build management dashboards and business intelligence systems that bring together important data from across your operations and present it in a practical, decision-ready format. This can include KPIs, financial performance, operational metrics, productivity indicators, customer activity, risk signals, or other business-critical information."
              summary="Where relevant, AI can also assist by highlighting patterns, summarising trends, or supporting more informed decision-making."
              items={[
                "Executive and management dashboards",
                "Business intelligence and reporting systems",
                "KPI tracking and visualisation",
                "Data integration across multiple sources",
                "Performance monitoring tools",
                "Better insight for faster, more confident decisions"
              ]}
            />

            <FocusArea
              title="3. Secure Portals and Admin Systems"
              intro="Businesses often need secure digital environments for customers, staff, partners, or administrators to access information, submit data, manage requests, or complete processes."
              body="We build secure portals and administrative systems that support controlled access, structured workflows, and reliable user experiences. These systems can be designed for client interaction, service requests, document access, internal administration, approvals, submissions, compliance processes, and more."
              summary="Security, usability, and operational fit are central to how we design these solutions."
              items={[
                "Customer and client portals",
                "Staff and administrator systems",
                "Secure login and access control",
                "User-specific data views and permissions",
                "Workflow-based admin environments",
                "Reliable and secure digital interaction points"
              ]}
            />

            <FocusArea
              title="4. Industry-Specific Tools"
              intro="Off-the-shelf software often fails when businesses have specialised workflows, industry requirements, or unique operational models."
              body="We build industry-specific software tools designed around the realities of your sector, your compliance environment, and the way your teams work. This is especially valuable where standard software is too generic, too rigid, or requires constant manual workarounds."
              summary="The result is a solution that supports the actual needs of your business rather than forcing you into someone else’s framework."
              items={[
                "Bespoke software for specialised operational needs",
                "Sector-aligned systems and workflows",
                "Tools designed around industry realities",
                "Better fit than generic off-the-shelf platforms",
                "Flexibility to support unique business models",
                "Software aligned to how your teams already work"
              ]}
            />

            <FocusArea
              title="5. AI-Augmented Decision Systems"
              intro="AI can add real value when it helps people make faster, better, and more informed decisions."
              body="We build systems that use AI to support decision-making in practical ways - for example by analysing information, identifying patterns, surfacing risks, summarising inputs, assisting with prioritisation, or improving the quality and speed of operational choices. These systems are designed to support human decision-makers, not replace critical judgement where oversight is needed."
              summary="The value comes from making complex information more usable and routine decisions more efficient."
              items={[
                "AI-supported decision workflows",
                "Pattern recognition and insight generation",
                "Intelligent alerts and prioritisation support",
                "Summarisation of complex data or inputs",
                "Risk flagging and exception identification",
                "Better speed and consistency in decision support"
              ]}
            />
          </section>

          <section className="border border-cyan-400/50 bg-black/70 p-8 space-y-6">
            <h2 className="font-tech text-2xl text-cyan-300">How We Work</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              We begin by understanding your business, your users, your processes, and the problem the software needs
              to solve.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              From there, we define the right structure, features, workflow logic, user experience, and technical
              approach to build a solution that is practical, secure, and scalable. Where AI is relevant, we
              incorporate it carefully and purposefully - always in service of real business value.
            </p>
            <div>
              <p className="text-gray-200 mb-2">We can support you through:</p>
              <ul className="space-y-2 text-gray-300 list-disc list-inside">
                <li>solution scoping and requirements discovery</li>
                <li>system design and architecture planning</li>
                <li>custom software development</li>
                <li>dashboard and portal development</li>
                <li>iterative enhancement and scaling</li>
              </ul>
            </div>
          </section>

          <section className="border border-cyan-400/50 bg-black/70 p-8 space-y-6">
            <h2 className="font-tech text-2xl text-cyan-300">Who This Is For</h2>
            <ul className="space-y-2 text-gray-300 list-disc list-inside">
              <li>businesses that have outgrown generic software tools</li>
              <li>organisations with unique workflows or industry requirements</li>
              <li>leadership teams needing better visibility and control</li>
              <li>companies wanting secure digital systems for staff or customers</li>
              <li>businesses looking to build software that supports long-term growth</li>
            </ul>
          </section>

          <section className="border border-cyan-400/50 bg-black/70 p-8">
            <h2 className="font-tech text-2xl text-cyan-300 mb-3">Why Work With Us</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              We combine business understanding, software design thinking, and practical AI capability. That means we
              do not just build features - we build systems that support your operations, improve decision-making, and
              fit the way your business actually functions.
            </p>
            <p className="text-gray-200 text-lg leading-relaxed mt-4">
              The result is software that is useful, scalable, and aligned to real business needs rather than generic
              assumptions.
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

