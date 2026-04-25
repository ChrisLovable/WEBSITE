"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import Shell from "@/components/Shell";

export default function FreeAppsPage() {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioNotice, setAudioNotice] = useState<string | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const mobileApps = [
    { id: "m1", title: "Mobile App 01", imageSrc: "/m1.jpg", audioSrc: "/m1.mp3" },
    { id: "m2", title: "Mobile App 02", imageSrc: "/m2.jpg", audioSrc: "/m2.mp3" },
    { id: "m3", title: "Mobile App 03", imageSrc: "/m3.jpg", audioSrc: "/m3.mp3" },
    { id: "m4", title: "Mobile App 04", imageSrc: "/m4.jpg", audioSrc: "/m4.mp3" },
    { id: "m5", title: "Mobile App 05", imageSrc: "/m5.jpg", audioSrc: "/m5.mp3" },
    { id: "m6", title: "Mobile App 06", imageSrc: "/m6.jpg", audioSrc: "/m6.mp3" }
  ];

  const desktopApps = [
    { id: "d1", title: "Desktop App 01", imageSrc: "/d1.png", audioSrc: "/d1.mp3" },
    { id: "d2", title: "Desktop App 02", imageSrc: "/d2.png", audioSrc: "/d2.mp3" }
  ];

  const stopCurrentAudio = () => {
    if (!currentAudioRef.current) return;
    currentAudioRef.current.pause();
    currentAudioRef.current.currentTime = 0;
    currentAudioRef.current = null;
  };

  const handleToggleAudio = async (id: string, src: string) => {
    setAudioNotice(null);
    if (playingId === id) {
      stopCurrentAudio();
      setPlayingId(null);
      return;
    }

    stopCurrentAudio();
    const nextAudio = new Audio(src);
    nextAudio.onended = () => {
      setPlayingId((current) => (current === id ? null : current));
      currentAudioRef.current = null;
    };
    nextAudio.onerror = () => {
      setPlayingId(null);
      setAudioNotice("Audio file not found yet. Add it directly under /public.");
      currentAudioRef.current = null;
    };

    try {
      await nextAudio.play();
      currentAudioRef.current = nextAudio;
      setPlayingId(id);
    } catch {
      setPlayingId(null);
      setAudioNotice("Tap again after interacting with the page to enable audio.");
      currentAudioRef.current = null;
    }
  };

  return (
    <Shell>
      <div className="relative overflow-hidden bg-[var(--color-bg)] py-12 md:py-16">
        <div className="absolute inset-0 bg-[linear-gradient(var(--color-grid)_1px,transparent_1px),linear-gradient(90deg,var(--color-grid)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(64,128,255,0.22),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(123,90,255,0.16),transparent_38%),radial-gradient(circle_at_50%_90%,rgba(90,255,219,0.12),transparent_42%)]" />

        <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="mb-6 inline-flex border border-[var(--color-border)] bg-[var(--color-bg-card)] px-5 py-2 font-tech text-xs tracking-[0.16em] text-[var(--color-accent-text)] shadow-[0_0_16px_var(--color-border-accent)] hover:bg-[var(--color-accent-bg)]"
          >
            ← BACK
          </Link>

          <div className="space-y-10 border border-[var(--color-border)] bg-[var(--color-bg-card)]/85 p-6 shadow-[0_0_34px_var(--color-border-accent)] backdrop-blur-sm md:p-10">
            <div className="space-y-3 text-center">
              <p className="font-tech text-xs tracking-[0.25em] text-[var(--color-accent-text)]">APPS SHOWCASE</p>
              <h1 className="font-tech text-3xl text-[var(--color-text-primary)] md:text-5xl">Apps</h1>
              <p className="mx-auto max-w-4xl text-sm leading-relaxed text-[var(--color-text-secondary)] md:text-base">
                MyAIPartner has developed over 40 commercial-use, AI-driven mobile apps, desktop apps, and intelligent websites. Every build is
                optimized separately for mobile and desktop experiences to deliver speed, clarity, and usability on each
                device type. Tap each card&apos;s audio button to hear what that app does.
              </p>
              <div className="mx-auto grid w-full max-w-5xl gap-2 text-left sm:grid-cols-2 lg:grid-cols-3">
                {[
                  "AI Stack Coverage: OpenAI, Anthropic, Google Gemini, Azure OpenAI, AWS Bedrock, Cohere, Mistral, Meta Llama, Perplexity, Stability AI, Whisper, ElevenLabs, Google Cloud Speech, weather APIs, OCR/document extraction, payment systems, geolocation services, image identification, and advanced video/audio processing workflows.",
                  "Identity & Access: Secure OAuth authorization and sign-on patterns including Google and Microsoft account authentication, with enterprise-ready session controls.",
                  "Platform Optimization: Native-style mobile UX patterns, responsive desktop workflows, and production-grade web delivery.",
                  "Data at Scale: Around 90% of delivered applications connect to large databases and support high-volume user activity."
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-input)] px-3 py-2 text-xs leading-relaxed text-[var(--color-text-secondary)] md:text-sm"
                  >
                    {item}
                  </div>
                ))}
              </div>
              {audioNotice && (
                <p className="mx-auto max-w-2xl border border-[var(--color-border)] bg-[var(--color-bg-input)] px-3 py-2 text-xs text-[var(--color-text-secondary)]">
                  {audioNotice}
                </p>
              )}
            </div>

            <div className="space-y-5">
              <h2 className="font-tech text-xl text-[var(--color-accent-text)] md:text-2xl">Mobile Apps</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {mobileApps.map((app) => (
                  <article
                    key={app.id}
                    className="group relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-input)] p-4 shadow-[0_0_24px_var(--color-border-accent)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_36px_var(--color-border-accent)]"
                  >
                    <div className="mx-auto w-[210px] rounded-[2rem] bg-gradient-to-b from-[#202a4f] to-[#0b1023] p-[7px] shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
                      <div className="relative overflow-hidden rounded-[1.6rem] border border-[#2f416e] bg-[#070b18]">
                        <div className="pointer-events-none absolute left-1/2 top-2 z-10 h-1.5 w-14 -translate-x-1/2 rounded-full bg-[#1f2a44]" />
                        <img
                          src={app.imageSrc}
                          alt={app.title}
                          className="block h-[360px] w-full rounded-[1.4rem] object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-2">
                      <p className="font-tech text-xs tracking-[0.12em] text-[var(--color-text-primary)]">{app.title}</p>
                      <button
                        type="button"
                        onClick={() => handleToggleAudio(app.id, app.audioSrc)}
                        className="inline-flex items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 py-1.5 font-tech text-[10px] tracking-[0.12em] text-[var(--color-accent-text)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-bg)]"
                      >
                        {playingId === app.id ? "STOP AUDIO" : "PLAY AUDIO"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <h2 className="font-tech text-xl text-[var(--color-accent-text)] md:text-2xl">Desktop Apps</h2>
              <div className="grid gap-6 lg:grid-cols-2">
                {desktopApps.map((app) => (
                  <article
                    key={app.id}
                    className="group relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-input)] p-4 shadow-[0_0_24px_var(--color-border-accent)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_36px_var(--color-border-accent)]"
                  >
                    <div className="overflow-hidden rounded-2xl border border-[#2f416e] bg-gradient-to-b from-[#162242] to-[#0a0f22] p-2 shadow-[0_16px_45px_rgba(0,0,0,0.45)]">
                      <div className="mb-2 flex items-center gap-1.5 border-b border-[#2b3a63] pb-2 pl-1">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                      </div>
                      <img
                        src={app.imageSrc}
                        alt={app.title}
                        className="block h-[250px] w-full rounded-xl object-cover md:h-[290px]"
                        loading="lazy"
                      />
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-2">
                      <p className="font-tech text-xs tracking-[0.12em] text-[var(--color-text-primary)]">{app.title}</p>
                      <button
                        type="button"
                        onClick={() => handleToggleAudio(app.id, app.audioSrc)}
                        className="inline-flex items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 py-1.5 font-tech text-[10px] tracking-[0.12em] text-[var(--color-accent-text)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-bg)]"
                      >
                        {playingId === app.id ? "STOP AUDIO" : "PLAY AUDIO"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </Shell>
  );
}
