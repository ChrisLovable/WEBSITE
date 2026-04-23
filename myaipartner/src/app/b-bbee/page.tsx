"use client";

import Link from "next/link";
import Header from "@/components/Header";

export default function BBbeePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <main className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.06)_1px,transparent_1px)] bg-[size:50px_50px]" />

        <section className="relative z-10 py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/" className="mb-6 inline-flex border border-cyan-400 px-5 py-2 font-tech text-xs tracking-[0.16em] text-cyan-300 hover:bg-cyan-400/10">
              ← BACK
            </Link>
            <div className="border border-cyan-400/50 bg-[#0a0a0a]/90 p-8 md:p-12 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
              <p className="font-tech text-xs tracking-[0.25em] text-cyan-400 mb-4">B-BBEE STATUS</p>
              <h1 className="font-tech text-3xl md:text-4xl text-cyan-300 mb-6">
                myAIpartner is a Level 1 B-BBEE Contributor
              </h1>

              <div className="space-y-5 text-gray-200 text-base md:text-lg leading-relaxed">
                <p>
                  At myAIpartner, we are proud to confirm our status as a Level 1 B-BBEE Contributor.
                </p>
                <p>
                  This reflects our commitment not only to innovation and excellence in AI consulting and software solutions,
                  but also to meaningful economic transformation and inclusive growth in South Africa.
                </p>
                <p>
                  Working with a Level 1 B-BBEE Contributor may enhance the procurement recognition benefits available to our
                  clients, while giving them access to forward-thinking AI services tailored to modern business needs.
                </p>
                <p>
                  We believe that building the future of business through artificial intelligence should go hand in hand with
                  building a more inclusive and empowered economy.
                </p>
              </div>

              <div className="mt-10 border border-cyan-400/30 bg-cyan-400/5 p-6">
                <h2 className="font-tech text-xl text-cyan-300 mb-4">Why this matters</h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-gray-200">
                    <span className="text-cyan-400 mt-1">•</span>
                    <span>A verified Level 1 B-BBEE Contributor</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-200">
                    <span className="text-cyan-400 mt-1">•</span>
                    <span>Innovative AI advisory, automation, and software development services</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-200">
                    <span className="text-cyan-400 mt-1">•</span>
                    <span>A partner committed to South African growth, transformation, and business enablement</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-200">
                    <span className="text-cyan-400 mt-1">•</span>
                    <span>Solutions designed to help organisations improve efficiency, decision-making, and competitiveness</span>
                  </li>
                </ul>
              </div>

              <div className="mt-10 border-t border-cyan-400/30 pt-6">
                <h2 className="font-tech text-xl text-cyan-300 mb-3">Verification</h2>
                <p className="text-gray-200 text-base md:text-lg leading-relaxed">
                  Our B-BBEE status can be confirmed on request, and supporting documentation is available for procurement
                  and compliance purposes.
                </p>
                <p className="text-gray-200 text-base md:text-lg leading-relaxed mt-4">
                  To request our B-BBEE certificate or supplier documentation, please contact us directly.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
