"use client";

import Shell from "@/components/Shell";
import Link from "next/link";

export default function WebsiteDesignAiIntegrationPage() {
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
            <h1 className="font-tech text-2xl md:text-3xl text-cyan-300 mb-4">Website Design &amp; AI Integration</h1>
            <p className="text-gray-200 text-lg leading-relaxed">
              At MyAIpartner, we do not just build websites - we create intelligent digital experiences. Our website design
              service combines modern, responsive design with practical AI integration so your business can stand out and work
              smarter online.
            </p>
          </section>

          <section className="border border-cyan-400/50 bg-black/70 p-8">
            <h2 className="font-tech text-2xl text-cyan-300 mb-3">The Outcome</h2>
            <p className="text-gray-200 text-lg leading-relaxed">
              A high-performing, modern website that does more than present your brand - it helps you convert visitors,
              automate engagement, and generate better business insights.
            </p>
          </section>

          <section className="border border-cyan-400/50 bg-black/70 p-8 space-y-6">
            <h2 className="font-tech text-2xl text-cyan-300">What We Offer</h2>

            <div className="space-y-3">
              <h3 className="font-tech text-xl text-cyan-300">Custom Website Design</h3>
              <p className="text-gray-300 leading-relaxed">
                We design visually striking, user-friendly websites tailored to your brand and business goals.
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>Fully responsive across mobile, tablet, and desktop</li>
                <li>Optimized for speed and performance</li>
                <li>Built with a clean, modern user experience</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-tech text-xl text-cyan-300">AI-Powered Features</h3>
              <p className="text-gray-300 leading-relaxed">
                Take your website beyond static pages with built-in intelligence.
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>AI chatbots for support and lead generation</li>
                <li>Smart recommendations to personalize user journeys</li>
                <li>Automated content support for blogs, FAQs, and updates</li>
                <li>Data-driven insights into visitor behavior</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-tech text-xl text-cyan-300">Seamless Integration</h3>
              <p className="text-gray-300 leading-relaxed">
                We integrate AI tools directly into your website so everything works together smoothly with minimal complexity.
              </p>
            </div>
          </section>

          <section className="border border-cyan-400/50 bg-black/70 p-8 space-y-6">
            <h2 className="font-tech text-2xl text-cyan-300">Why Choose MyAIpartner?</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>We blend design, technology, and AI into one solution</li>
              <li>We focus on practical functionality, not just aesthetics</li>
              <li>We build scalable websites that grow with your business</li>
              <li>We help you stay ahead in an increasingly AI-driven world</li>
            </ul>
          </section>

          <section className="border border-cyan-400/50 bg-black/70 p-8 space-y-6">
            <h2 className="font-tech text-2xl text-cyan-300">Perfect For</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Startups launching with a strong digital presence</li>
              <li>Businesses upgrading to smarter, automated websites</li>
              <li>Companies interested in AI but unsure where to start</li>
            </ul>
          </section>

          <section className="border border-cyan-400/50 bg-black/70 p-8">
            <h2 className="font-tech text-2xl text-cyan-300 mb-3">Let&apos;s Build Something Smart</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Your website should do more than exist - it should work for you. Get in touch with MyAIpartner today and
              let&apos;s build a website that is not only beautiful, but intelligent.
            </p>
          </section>
        </div>
      </main>
    </Shell>
  );
}
