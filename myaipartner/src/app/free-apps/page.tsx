"use client";

import Link from "next/link";
import Shell from "@/components/Shell";

export default function FreeAppsPage() {
  return (
    <Shell>
      <div className="relative overflow-hidden bg-[#0a0a0a] py-12 md:py-16">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.06)_1px,transparent_1px)] bg-[size:50px_50px]" />

        <section className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="mb-6 inline-flex border border-cyan-400 px-5 py-2 font-tech text-xs tracking-[0.16em] text-cyan-300 hover:bg-cyan-400/10"
          >
            ← BACK
          </Link>

          <div className="space-y-8 border border-cyan-400/50 bg-black/80 p-8 md:p-12 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
            <div className="space-y-3">
              <p className="font-tech text-xs tracking-[0.25em] text-cyan-400">FREE APPS</p>
              <h1 className="font-tech text-3xl text-cyan-300 md:text-4xl">
                Coming Soon <span aria-hidden>🚀</span>
              </h1>
              <p className="text-base leading-relaxed text-gray-200 md:text-lg">
                At MyAIpartner, we&apos;re excited to announce that a collection of free apps will soon be available right
                here on our platform.
              </p>
              <p className="text-base leading-relaxed text-gray-200 md:text-lg">
                These apps are being designed to give you a hands-on look at what we can build - simple, powerful, and
                practical AI-driven tools that solve real problems.
              </p>
            </div>

            <div className="space-y-4 border border-cyan-400/30 bg-cyan-500/5 p-6">
              <h2 className="font-tech text-xl text-cyan-300 md:text-2xl">What to Expect</h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {[
                  "Explore real examples of AI in action",
                  "Test features before committing to a custom solution",
                  "Get inspired by what is possible for your own business or project",
                  "Experience the quality and usability we bring to every product"
                ].map((item) => (
                  <li key={item} className="border border-cyan-500/25 bg-black/40 px-3 py-2 text-sm text-gray-200">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="font-tech text-xl text-cyan-300 md:text-2xl">Why We&apos;re Offering This</h2>
              <p className="text-base leading-relaxed text-gray-200 md:text-lg">
                We believe the best way to understand the value of AI is to see it and use it yourself. These free tools
                will serve as both:
              </p>
              <ul className="grid gap-2 sm:grid-cols-2">
                {[
                  "Useful resources you can benefit from immediately",
                  "Showcases of our development capabilities"
                ].map((item) => (
                  <li key={item} className="border border-cyan-500/25 bg-black/40 px-3 py-2 text-sm text-gray-200">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 border-t border-cyan-400/30 pt-6">
              <h2 className="font-tech text-xl text-cyan-300 md:text-2xl">Stay Tuned</h2>
              <p className="text-base leading-relaxed text-gray-200 md:text-lg">
                We&apos;re currently putting the finishing touches on these apps and will be launching them soon.
              </p>
              <p className="text-base leading-relaxed text-gray-200 md:text-lg">
                If you&apos;re interested in early access or want to be notified when they go live, feel free to get in
                touch with us.
              </p>
              <Link
                href="/interest"
                className="inline-flex border border-cyan-400 px-5 py-2 font-tech text-xs tracking-[0.16em] text-cyan-300 hover:bg-cyan-400/10"
              >
                CONTACT US
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Shell>
  );
}
