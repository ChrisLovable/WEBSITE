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
    title: "1. Targeted Collection and Normalization of Email and WhatsApp Evidence",
    paragraphs: [
      "Investigations are only as strong as the quality and usability of the underlying evidence.",
      "We support the targeted collection and preparation of communication data from email and WhatsApp sources so that it can be reviewed in a structured and consistent way. This includes normalising message formats, organising records, handling metadata appropriately, and preparing datasets for effective investigation and review workflows.",
      "The goal is to make communication evidence searchable, usable, and investigation-ready without losing important context."
    ],
    items: [
      "Targeted communication data collection support",
      "Preparation of email and WhatsApp datasets for review",
      "Normalisation of records into consistent structures",
      "Preservation of message context and metadata",
      "Improved usability of large communication evidence sets",
      "Better readiness for downstream analysis and legal review"
    ]
  },
  {
    title: "2. AI-Assisted Relevance Ranking, Conversation Clustering, and Timeline Reconstruction",
    paragraphs: [
      "Large-scale communication reviews become far more effective when data can be organised intelligently.",
      "We use AI-assisted methods to help identify potentially relevant communications, group related conversations, and reconstruct timelines that show how events unfolded across people, channels, and dates. This allows investigation teams to move more quickly from isolated messages to broader context, patterns, and narratives.",
      "Rather than replacing human judgement, these tools help legal and investigative teams focus attention where it matters most."
    ],
    items: [
      "Relevance ranking to prioritise likely important material",
      "Grouping of related communications and threads",
      "Conversation clustering across large datasets",
      "Reconstruction of communication timelines",
      "Identification of key sequences, actors, and events",
      "Improved speed in understanding case context"
    ]
  },
  {
    title: "3. Keyword, Semantic, and Multilingual Querying Across Large Communication Datasets",
    paragraphs: [
      "Traditional keyword searching is often not enough when language is inconsistent, messages are informal, or multiple languages are involved.",
      "We support more advanced querying approaches that combine keyword searches with semantic and multilingual search capability, helping teams find relevant content even where exact wording differs. This is especially useful in real-world communication datasets where slang, abbreviations, mixed languages, informal phrasing, and context-dependent meaning are common.",
      "The result is broader, more intelligent search capability across complex evidence collections."
    ],
    items: [
      "Keyword-based search and filtering",
      "Semantic querying for concept-based discovery",
      "Multilingual communication analysis support",
      "Better retrieval where wording varies",
      "More effective querying across informal message content",
      "Improved ability to locate hidden or non-obvious relevance"
    ]
  },
  {
    title: "4. Privilege and Sensitive-Content Triage Support for Legal Review Teams",
    paragraphs: [
      "High-volume investigations often require rapid identification of material that may need special handling.",
      "We help legal review teams prioritise communications that may contain privileged, confidential, personal, or otherwise sensitive content so that they can be handled with appropriate care. AI-assisted triage can help surface likely areas of concern earlier in the review process, reducing manual burden and improving control over sensitive material.",
      "This supports more efficient review workflows while recognising that final legal judgement remains with the appropriate professionals."
    ],
    items: [
      "Triage support for potentially privileged material",
      "Identification of sensitive or high-risk communications",
      "Prioritisation of review effort for legal teams",
      "Support for faster handling of high-volume datasets",
      "Better visibility over material requiring special treatment",
      "More controlled and structured legal review workflows"
    ]
  },
  {
    title: "5. Audit-Ready Workflows Aligned to Chain-of-Custody and Investigation Governance",
    paragraphs: [
      "In investigative contexts, process discipline matters just as much as analytical capability.",
      "We design workflows that support traceability, consistency, and good governance throughout the review and investigation process. This includes alignment to chain-of-custody principles, defensible handling practices, clear review structures, auditability, and investigation oversight requirements.",
      "Our aim is to help teams work in a way that is both efficient and supportable if the process later needs to be scrutinised."
    ],
    items: [
      "Structured and traceable investigation workflows",
      "Alignment to chain-of-custody principles",
      "Audit-ready process design",
      "Better review governance and control",
      "Clearer documentation of investigative handling",
      "Support for defensible internal and legal processes"
    ]
  },
  {
    title: "6. Executive-Ready Summaries, Findings Packs, and Escalation Reporting",
    paragraphs: [
      "Investigation outputs need to be understandable not only to analysts and reviewers, but also to decision-makers.",
      "We help translate complex communication analysis into structured findings packs, executive-ready summaries, timelines, issue overviews, and escalation reporting that can be used by leadership, legal stakeholders, compliance teams, or external advisers. This helps ensure that important findings are communicated clearly, accurately, and in a way that supports timely action.",
      "The focus is on turning technical review outputs into usable decision material."
    ],
    items: [
      "Investigation summaries for leadership and stakeholders",
      "Structured findings packs and evidence overviews",
      "Timeline-based reporting",
      "Escalation-ready issue summaries",
      "Clear communication of key findings and risks",
      "Better support for decision-making and next steps"
    ]
  }
];

export default function EdiscoveryForensicQueryingPage() {
  return (
    <Shell>
      <main className="relative overflow-hidden bg-[#0a0a0a] pt-3 pb-20 md:pt-8">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.06)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="relative z-10 mx-auto max-w-5xl space-y-8 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="font-tech inline-flex border border-cyan-400 px-5 py-2 text-xs tracking-[0.16em] text-cyan-300 hover:bg-cyan-400/10">
            ← BACK
          </Link>

          <section className="space-y-4 border border-cyan-400/50 bg-black/70 p-8">
            <h1 className="font-tech text-2xl text-cyan-300 md:text-3xl">eDiscovery &amp; Forensic AI Querying (Email + WhatsApp)</h1>
            <p className="text-lg leading-relaxed text-gray-200">
              We help legal, risk, compliance, and investigation teams analyse high-volume communication data quickly, systematically, and defensibly. Our AI-assisted workflows are designed to surface relevant evidence across email and WhatsApp datasets while supporting structured review processes, investigation governance, and forensic integrity.
            </p>
            <p className="text-lg leading-relaxed text-gray-300">
              Investigations involving large communication volumes are often slowed down by manual review, fragmented data, inconsistent search methods, and difficulty connecting conversations across people, time periods, and channels. We help organisations reduce that burden by combining targeted collection, intelligent querying, and structured review workflows that make complex communication evidence easier to understand and act on.
            </p>
            <p className="text-lg leading-relaxed text-gray-300">
              Our focus is not simply on speed, but on disciplined, investigation-ready analysis that helps teams move from raw data to clear findings with greater efficiency and control.
            </p>
          </section>

          <section className="space-y-4 border border-cyan-400/50 bg-black/70 p-8">
            <h2 className="font-tech text-2xl text-cyan-300">The Outcome</h2>
            <p className="text-lg leading-relaxed text-gray-200">Faster, defensible fact-finding with reduced manual review time and clearer investigation outcomes.</p>
            <p className="text-lg leading-relaxed text-gray-300">
              You get a more structured and efficient way to identify relevant evidence, understand communication patterns, support legal review, and prepare findings for internal, regulatory, or external use.
            </p>
          </section>

          <section className="space-y-6 border border-cyan-400/50 bg-black/70 p-8">
            <h2 className="font-tech text-2xl text-cyan-300">Our eDiscovery and Forensic Querying Focus Areas</h2>
            {focusAreas.map((focusArea) => (
              <FocusArea key={focusArea.title} {...focusArea} />
            ))}
          </section>

          <section className="space-y-4 border border-cyan-400/50 bg-black/70 p-8">
            <h2 className="font-tech text-2xl text-cyan-300">How We Work</h2>
            <p className="text-lg leading-relaxed text-gray-300">
              We begin by understanding the nature of the matter, the communication sources involved, the scale of the dataset, the investigation objectives, and the governance requirements that apply.
            </p>
            <p className="text-lg leading-relaxed text-gray-300">
              From there, we support a structured process for collecting, preparing, querying, reviewing, and summarising communication evidence in a way that is practical, disciplined, and aligned to the needs of the legal or investigative team. Where AI is used, it is used to assist speed, organisation, and insight - not to replace professional judgement.
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {[
                "investigation scoping and workflow design",
                "communication dataset preparation",
                "AI-assisted querying and review support",
                "timeline and conversation analysis",
                "findings preparation and escalation reporting"
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
              <li>legal teams handling internal or external investigations</li>
              <li>compliance and risk functions reviewing communication evidence</li>
              <li>organisations dealing with high-volume email and WhatsApp datasets</li>
              <li>review teams needing faster and more structured analysis</li>
              <li>businesses requiring defensible communication review workflows</li>
            </ul>
          </section>

          <section className="space-y-4 border border-cyan-400/50 bg-black/70 p-8">
            <h2 className="font-tech text-2xl text-cyan-300">Why Work With Us</h2>
            <p className="text-lg leading-relaxed text-gray-300">
              We combine AI capability, structured investigation thinking, and practical workflow design. That means we do not just help you search messages - we help you organise evidence, reduce review burden, improve visibility into key facts, and support more disciplined investigative outcomes.
            </p>
            <p className="text-lg leading-relaxed text-gray-200">
              The result is a faster, clearer, and more defensible path from communication data to actionable findings.
            </p>
          </section>
        </div>
      </main>
    </Shell>
  );
}
