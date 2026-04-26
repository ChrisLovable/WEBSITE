'use client';

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import { trackEvent } from '@/hooks/useAnalytics';

// ─── Constants ───────────────────────────────────────────────────────────────
const GABBY_MEMORY_KEY       = 'gabby-memory';
const GABBY_INTRO_SEEN_KEY   = 'gabby-intro-seen';
const GABBY_INTRO_PLAYED_KEY = 'gabby-intro-played';
const THINKING_MIN           = 1;    // public/thinking/thinking-1.mp3
const THINKING_MAX           = 16;   // … thinking-16.mp3
const TTS_CHUNK_SIZE         = 800;  // Max chars per TTS request (Google TTS safe limit)

// ─── Types ───────────────────────────────────────────────────────────────────
interface Message {
  role: 'user' | 'assistant';
  content: string;
  latencyMs?: number;
}

export interface ConversationMemory {
  lastVisit: string;
  userName?: string;
  userEmail?: string;
  topics: string[];
  messageCount: number;
  lastMessage: string;
}

interface SpeechRecognitionAlternativeLike { transcript: string }
interface SpeechRecognitionResultLike { 0: SpeechRecognitionAlternativeLike; isFinal?: boolean }
interface SpeechRecognitionEventLike extends Event { results: ArrayLike<SpeechRecognitionResultLike> }
interface SpeechRecognitionErrorEventLike extends Event { error: string }
interface SpeechRecognitionLike extends EventTarget {
  lang: string; continuous: boolean; interimResults: boolean;
  onstart: (() => void) | null;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: SpeechRecognitionErrorEventLike) => void) | null;
  start(): void; stop(): void;
}
interface SpeechRecognitionConstructorLike { new(): SpeechRecognitionLike }

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructorLike;
    webkitSpeechRecognition?: SpeechRecognitionConstructorLike;
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Strip markdown formatting and XML/SSML tags so TTS reads clean text.
 * Also strips <break> tags and any other XML that the AI might emit.
 */
function cleanTextForTTS(text: string): string {
  return text
    .replace(/<[^>]*>/g, '')          // strip ALL XML/SSML tags (including <break>)
    .replace(/\*\*(.*?)\*\*/g, '$1')  // **bold**
    .replace(/\*(.*?)\*/g, '$1')      // *italic*
    .replace(/#{1,6}\s/g, '')         // headings
    .replace(/`(.*?)`/g, '$1')        // inline code
    .replace(/\s{2,}/g, ' ')          // collapse whitespace
    .trim();
}

/**
 * Strip XML/SSML tags for display so users don't see <break time="150ms"/> etc.
 */
function cleanTextForDisplay(text: string): string {
  return text
    .replace(/<[^>]*>/g, '')          // strip ALL XML/SSML tags
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Split text into chunks at sentence boundaries for chunked TTS.
 * Never exceeds maxChars per chunk.
 */
function chunkTextForTTS(text: string, maxChars = TTS_CHUNK_SIZE): string[] {
  const cleaned = cleanTextForTTS(text);
  if (cleaned.length <= maxChars) return cleaned ? [cleaned] : [];

  const chunks: string[] = [];
  let remaining = cleaned;

  while (remaining.length > maxChars) {
    const slice = remaining.slice(0, maxChars);
    const lastSentence = Math.max(
      slice.lastIndexOf('. '),
      slice.lastIndexOf('! '),
      slice.lastIndexOf('? '),
    );
    const cutAt = lastSentence > maxChars * 0.4 ? lastSentence + 2 : maxChars;
    chunks.push(remaining.slice(0, cutAt).trim());
    remaining = remaining.slice(cutAt).trim();
  }
  if (remaining) chunks.push(remaining);
  return chunks;
}

function waitForPaint(): Promise<void> {
  return new Promise(resolve =>
    queueMicrotask(() => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
  );
}

function toApiMessages(msgs: Message[]) {
  return msgs.map(({ role, content }) => ({ role, content }));
}

function formatLatency(ms: number) {
  if (ms < 1000) return `${ms} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

function readMemory(): ConversationMemory | null {
  if (typeof window === 'undefined') return null;
  const s = localStorage.getItem(GABBY_MEMORY_KEY);
  if (!s) return null;
  try { return JSON.parse(s) as ConversationMemory; }
  catch { localStorage.removeItem(GABBY_MEMORY_KEY); return null; }
}

function buildMemory(msgs: Message[], prior: ConversationMemory | null): ConversationMemory | null {
  const userMsgs = msgs.filter(m => m.role === 'user');
  if (!userMsgs.length) return null;
  const text = userMsgs.map(m => m.content).join(' ');
  const nameMatch  = text.match(/(?:my name is|i(?:'m| am)) ([A-Za-z]{2,20})/i);
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const kwMap: Record<string, string[]> = {
    'AI strategy':  ['strategy','plan','roadmap','consulting'],
    automation:     ['automate','automation','workflow','process'],
    software:       ['software','app','build','develop','system'],
    training:       ['training','team','learn','workshop'],
    forensic:       ['forensic','email','investigation','legal'],
    speaking:       ['speaking','keynote','conference','event'],
    pricing:        ['cost','price','budget','expensive','afford'],
    'mobile app':   ['mobile','phone','android','ios'],
    website:        ['website','web','online','site'],
  };
  const topics = Object.entries(kwMap)
    .filter(([, kws]) => kws.some(k => text.toLowerCase().includes(k)))
    .map(([t]) => t);
  return {
    lastVisit:    new Date().toISOString(),
    userName:     nameMatch?.[1]?.trim() || prior?.userName,
    userEmail:    emailMatch?.[0] || prior?.userEmail,
    topics:       [...new Set([...(prior?.topics ?? []), ...topics])].slice(-5),
    messageCount: Math.max(prior?.messageCount ?? 0, userMsgs.length),
    lastMessage:  userMsgs[userMsgs.length - 1].content.slice(0, 100),
  };
}

function withMemoryContext(msgs: Message[], mem: ConversationMemory | null): Message[] {
  if (!mem) return msgs;
  const ctx =
    `[CONTEXT — do not mention this directly: Returning visitor. ` +
    `${mem.userName ? `Name: ${mem.userName}. ` : ''}` +
    `${mem.userEmail ? `Email: ${mem.userEmail}. ` : ''}` +
    `Previous topics: ${mem.topics.length ? mem.topics.join(', ') : 'none'}. ` +
    `Message count: ${mem.messageCount}. ` +
    `Use their name naturally if known. Reference previous topics only if relevant.]`;
  return [{ role: 'user' as const, content: ctx }, ...msgs];
}

function getGreeting(mem: ConversationMemory | null): string {
  if (!mem) {
    return "Hi, I'm Gabby 👋 myAIpartner's AI assistant. I can help you explore our services, understand how AI could work for your business, or connect you with Chris directly. What brings you here today?";
  }
  const name = mem.userName;
  const days = Math.floor((Date.now() - new Date(mem.lastVisit).getTime()) / 86_400_000);
  if (days === 0) return `Welcome back${name ? ` ${name}` : ''}! Good to see you again. What can I help you with?`;
  if (days === 1 && mem.topics.length)
    return `Welcome back${name ? ` ${name}` : ''}! Yesterday you were asking about ${mem.topics[0]}. Want to continue, or is there something new?`;
  if (mem.topics.length)
    return `Hey${name ? ` ${name}` : ''}! Great to have you back. Last time you were exploring ${mem.topics.slice(0, 2).join(' and ')}. What can I help with today?`;
  return `Hey${name ? ` ${name}` : ''}! Great to see you back. What can I help you with today?`;
}

function getSpeechApi(): SpeechRecognitionConstructorLike | null {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function isMobileViewport() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 767px)').matches;
}

function canUseWakeWord() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(min-width: 768px)').matches;
}

// ─── HeyGabbyWakeControls sub-component ──────────────────────────────────────
type WakeProps = {
  wakeWordActive: boolean;
  micPermission: 'unknown' | 'granted' | 'denied';
  onToggle: () => void | Promise<void>;
};

function HeyGabbyWakeControls({ wakeWordActive, micPermission, onToggle }: WakeProps) {
  const [menuOpen, setMenuOpen]         = useState(false);
  const [speechOk, setSpeechOk]         = useState<boolean | null>(null);
  const wrapRef                         = useRef<HTMLDivElement>(null);

  useEffect(() => { setSpeechOk(!!getSpeechApi()); }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', esc); };
  }, [menuOpen]);

  const pillStyle: CSSProperties = {
    background: wakeWordActive ? 'rgba(74,222,128,0.12)' : 'var(--color-bg-card)',
    border: `1px solid ${wakeWordActive ? 'rgba(74,222,128,0.45)' : 'rgba(74,222,128,0.45)'}`,
    borderRadius: 20, padding: '6px 12px', fontSize: 13, fontWeight: 600,
    color: '#4ade80', cursor: 'pointer', whiteSpace: 'nowrap' as const,
  };

  if (speechOk !== true) {
    return (
      <div className="gabby-wake-controls">
        <button type="button" style={pillStyle}
          onClick={() => window.dispatchEvent(new CustomEvent('open-gabby-chat'))}>
          Just say: &quot;Hey Gabby&quot;
        </button>
      </div>
    );
  }

  return (
    <div ref={wrapRef} id="wake-word-btn" className="gabby-wake-controls" style={{ position: 'relative' }}>
      <button type="button" style={pillStyle} onClick={() => setMenuOpen(o => !o)}>
        {wakeWordActive ? 'Listening…' : 'Just say: "Hey Gabby"'}
      </button>
      {menuOpen && (
        <div style={{
          position: 'absolute', left: 0, top: 'calc(100% + 6px)', zIndex: 200,
          minWidth: 220, padding: 12, background: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)', borderRadius: 12,
          boxShadow: '0 12px 40px rgba(0,0,0,0.35)'
        }}>
          <button type="button" onClick={() => { void onToggle(); setMenuOpen(false); }} style={{
            ...pillStyle, width: '100%', justifyContent: 'center',
            background: wakeWordActive ? 'rgba(74,222,128,0.12)' : 'var(--color-bg-input)',
          }}>
            {wakeWordActive ? 'Stop listening' : 'Enable Hey Gabby'}
          </button>
          {micPermission === 'denied' && (
            <p style={{ fontSize: 10, color: 'var(--color-text-secondary)', marginTop: 8, lineHeight: 1.4 }}>
              Enable microphone in browser settings to use Hey Gabby
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AIChatAssistant() {
  const pathname = usePathname();

  // UI state
  const [open,          setOpen]          = useState(false);
  const [input,         setInput]         = useState('');
  const [loading,       setLoading]       = useState(false);
  const [listening,     setListening]     = useState(false);
  const [speechOk,      setSpeechOk]      = useState(false);
  const [speaking,      setSpeaking]      = useState(false);
  const [ttsEnabled,    setTtsEnabled]    = useState(false);
  const [showIntro,     setShowIntro]     = useState(false);
  const [introMuted,    setIntroMuted]    = useState(false);
  const [videoPlaying,  setVideoPlaying]  = useState(false);
  const [voiceMode,     setVoiceMode]     = useState(false);
  const [voiceStatus,   setVoiceStatus]   = useState<'idle'|'listening'|'thinking'|'speaking'>('idle');
  const [wakeWordActive,setWakeWordActive] = useState(false);
  const [micPermission, setMicPermission] = useState<'unknown'|'granted'|'denied'>('unknown');
  const [wakePortalEl,  setWakePortalEl]  = useState<HTMLElement | null>(null);

  // Memory + messages
  const [memory,   setMemory]   = useState<ConversationMemory | null>(() => readMemory());
  const [messages, setMessages] = useState<Message[]>([]);

  // Refs — mutable values that must not cause re-renders
  const openRef              = useRef(false);
  const ttsEnabledRef        = useRef(false);
  const micPermissionRef     = useRef<'unknown'|'granted'|'denied'>('unknown');
  const memoryRef            = useRef<ConversationMemory | null>(null);
  const latestMsgsRef        = useRef<Message[]>([]);
  const prevOpenRef          = useRef(false);
  const wakeWordActiveRef    = useRef(false);
  const wakeWasActiveRef      = useRef(false);
  const wakeProcessingRef    = useRef(false);
  const introRevealDoneRef   = useRef(false);
  // FIX: showIntroRef keeps showIntro in sync so async functions don't read stale closure
  const showIntroRef         = useRef(false);
  const isVideoPlayingRef    = useRef(false); // set SYNCHRONOUSLY on play tap — blocks wake word immediately
  const liveTranscriptRef    = useRef('');
  const lastThinkingRef      = useRef(0);
  const sendGenRef           = useRef(0);
  // TTS abort — allows stopping mid-chunk if new message comes in
  const ttsAbortRef          = useRef<AbortController | null>(null);

  // Audio refs
  const videoRef             = useRef<HTMLVideoElement>(null);
  const audioRef             = useRef<HTMLAudioElement | null>(null);
  const greetingAudioRef     = useRef<HTMLAudioElement | null>(null);
  const thinkingAudioRef     = useRef<HTMLAudioElement | null>(null);
  const unblockThinkingRef   = useRef<(() => void) | null>(null);
  const chatAbortRef         = useRef<AbortController | null>(null);

  // DOM refs
  const messagesScrollRef    = useRef<HTMLDivElement>(null);
  const messagesEndRef       = useRef<HTMLDivElement>(null);
  const inputRef             = useRef<HTMLInputElement>(null);
  const recognitionRef       = useRef<SpeechRecognitionLike | null>(null);
  const wakeRecognitionRef   = useRef<SpeechRecognitionLike | null>(null);
  const sttKeepListeningRef  = useRef(false);
  const lastOpenTrackedRef   = useRef(false);

  // Keep refs in sync
  openRef.current          = open;
  ttsEnabledRef.current    = ttsEnabled;
  micPermissionRef.current = micPermission;
  memoryRef.current        = memory;
  latestMsgsRef.current    = messages;
  showIntroRef.current     = showIntro; // FIX: keep showIntroRef in sync


  // ── Initial greeting message (set once after mount) ──────────────────────
  useEffect(() => {
    const mem = readMemory();
    setMemory(mem);
    setMessages([]);
  }, []);

  // ── FIX: Add greeting message when chat opens with empty messages ─────────
  useEffect(() => {
    if (open && latestMsgsRef.current.length === 0) {
      const greeting = getGreeting(memoryRef.current);
      // Strip any XML tags the greeting might contain
      const cleanGreeting = cleanTextForDisplay(greeting);
      const greetingMsg: Message = { role: 'assistant', content: cleanGreeting };
      setMessages([greetingMsg]);
      latestMsgsRef.current = [greetingMsg];
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // ── Enable TTS on desktop by default ────────────────────────────────────
  useEffect(() => {
    if (window.matchMedia('(min-width: 768px)').matches) setTtsEnabled(true);
  }, []);

  // ── Speech API check ─────────────────────────────────────────────────────
  useEffect(() => { setSpeechOk(!!getSpeechApi()); }, []);

  // ── Microphone permission check ──────────────────────────────────────────
  useEffect(() => {
    navigator.permissions.query({ name: 'microphone' as PermissionName })
      .then(r => {
        setMicPermission(r.state as 'granted'|'denied'|'unknown');
        r.onchange = () => setMicPermission(r.state as 'granted'|'denied'|'unknown');
      })
      .catch(() => {});
  }, []);

  // ── Auto-start wake word when permission granted ─────────────────────────
  useEffect(() => {
    if (micPermission === 'granted' && canUseWakeWord()) {
      wakeWordActiveRef.current = true;
      setWakeWordActive(true);
      startWakeWordListener();
    }
    return stopWakeWordListener;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [micPermission]);

  // ── Stop wake word when chat opens; restart when it closes ───────────────
  useEffect(() => {
    if (open) {
      wakeWasActiveRef.current = wakeWordActiveRef.current;
      stopWakeWordListener();
    } else if (prevOpenRef.current) {
      // Chat just closed — save memory
      const next = buildMemory(latestMsgsRef.current, memoryRef.current);
      if (next) {
        localStorage.setItem(GABBY_MEMORY_KEY, JSON.stringify(next));
        setMemory(next);
      }
      setTimeout(() => {
        const shouldRestart =
          (canUseWakeWord() && wakeWasActiveRef.current) ||
          micPermissionRef.current === 'granted';
        if (shouldRestart && !openRef.current && canUseWakeWord()) {
          wakeWordActiveRef.current = true;
          setWakeWordActive(true);
          startWakeWordListener();
        }
      }, 600);
    }
    prevOpenRef.current = open;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // ── Focus input when chat opens ──────────────────────────────────────────
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  useEffect(() => {
    if (open && !lastOpenTrackedRef.current) {
      trackEvent('gabby_opened', 'gabby_chat');
    }
    lastOpenTrackedRef.current = open;
  }, [open]);

  // ── Scroll to bottom on new messages ────────────────────────────────────
  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, open]);

  // ── Pause wake word while Gabby is speaking; restart after ───────────────
  // Prevents STT from picking up Gabby's own TTS audio through the speakers
  // and falsely triggering the wake word mid-response.
  useEffect(() => {
    if (speaking) {
      try { wakeRecognitionRef.current?.stop(); } catch {}
      wakeRecognitionRef.current = null;
    } else {
      // Don't restart wake word while intro video is showing —
      // the video audio itself would trigger the wake word.
      if (canUseWakeWord() && wakeWordActiveRef.current && !openRef.current && !showIntroRef.current) {
        setTimeout(() => {
          if (canUseWakeWord() && wakeWordActiveRef.current && !openRef.current && !showIntroRef.current) startWakeWordListener();
        }, 500);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speaking]);

  // ── Intro video — show on first visit ───────────────────────────────────
  useEffect(() => {
    if (sessionStorage.getItem(GABBY_INTRO_SEEN_KEY)) return;

    const reveal = () => {
      if (introRevealDoneRef.current) return;
      if (openRef.current) {
        introRevealDoneRef.current = true;
        return;
      }
      introRevealDoneRef.current = true;
      setShowIntro(true);
    };

    const tid = window.setTimeout(reveal, 1500);
    return () => { window.clearTimeout(tid); };
  }, []);

  // ── When intro shows: stop audio + pause wake word ──────────────────────
  // When intro dismisses: restart wake word so "Hey Gabby" works after video.
  useEffect(() => {
    if (showIntro) {
      // Video starting — kill wake word so it can't trigger during playback
      try { wakeRecognitionRef.current?.stop(); } catch {}
      wakeRecognitionRef.current = null;
      stopAllAudio();
    } else {
      // Video dismissed — force restart wake word regardless of wakeWordActiveRef state.
      setTimeout(() => {
        if (!openRef.current && canUseWakeWord()) {
          wakeWordActiveRef.current = true;
          setWakeWordActive(true);
          startWakeWordListener();
        }
      }, 600);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showIntro]);

  // ── Intro video starts PAUSED — user must tap play button ───────────────
  useLayoutEffect(() => {
    if (!showIntro || !videoRef.current) return;
    const v = videoRef.current;
    v.currentTime = 0;
    v.muted = false;
    v.volume = 1;
    v.pause();
    setIntroMuted(false);
    setVideoPlaying(false);
  }, [showIntro]);

  // ── Wake portal binding ──────────────────────────────────────────────────
  useLayoutEffect(() => {
    setWakePortalEl(null);
    let cancelled = false;
    let raf = 0;
    let tries = 0;
    const find = () => {
      if (cancelled) return;
      const el = document.getElementById('gabby-wake-slot');
      if (el) { setWakePortalEl(el); return; }
      if (++tries < 200) raf = requestAnimationFrame(find);
    };
    find();
    return () => { cancelled = true; cancelAnimationFrame(raf); };
  }, [pathname]);

  // ── Listen for custom open event (from navbar avatar / Hey Gabby button) ─
  useEffect(() => {
    const handler = () => {
      if (sessionStorage.getItem(GABBY_INTRO_SEEN_KEY) === null) {
        sessionStorage.setItem(GABBY_INTRO_SEEN_KEY, 'true');
      }
      const wasVideoPlaying = isVideoPlayingRef.current;
      isVideoPlayingRef.current = false;
      showIntroRef.current = false;
      setShowIntro(false);
      setVideoPlaying(false);
      if (!openRef.current && !wasVideoPlaying) {
        setOpen(true);
        void playGreeting();
        return;
      }
      setOpen(true);
    };
    window.addEventListener('open-gabby-chat', handler);
    return () => window.removeEventListener('open-gabby-chat', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handler = () => replayVideo();
    window.addEventListener('replay-gabby-video', handler);
    return () => window.removeEventListener('replay-gabby-video', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Cleanup on unmount ───────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      wakeRecognitionRef.current?.stop();
      stopAllAudio();
      chatAbortRef.current?.abort();
      ttsAbortRef.current?.abort();
    };
  }, []);

  // ─── Audio helpers ────────────────────────────────────────────────────────
  function stopAllAudio() {
    // Abort any in-progress chunked TTS
    ttsAbortRef.current?.abort();
    ttsAbortRef.current = null;

    if (audioRef.current) {
      const src = audioRef.current.src;
      audioRef.current.pause();
      if (src?.startsWith('blob:')) URL.revokeObjectURL(src);
      audioRef.current = null;
    }
    if (greetingAudioRef.current) {
      greetingAudioRef.current.pause();
      greetingAudioRef.current = null;
    }
    if (thinkingAudioRef.current) {
      thinkingAudioRef.current.pause();
      thinkingAudioRef.current = null;
    }
    unblockThinkingRef.current?.();
    unblockThinkingRef.current = null;
    setSpeaking(false);
  }

  function playGreeting(): Promise<void> {
    if (showIntroRef.current) return Promise.resolve();
    if (isVideoPlayingRef.current) return Promise.resolve(); // never play while video is active

    greetingAudioRef.current?.pause();
    const src = '/hithere.mp3';
    sessionStorage.setItem(GABBY_INTRO_PLAYED_KEY, 'true');

    return new Promise(resolve => {
      const audio = new Audio(src);
      greetingAudioRef.current = audio;
      audio.onended = () => { greetingAudioRef.current = null; resolve(); };
      audio.onerror = () => { greetingAudioRef.current = null; resolve(); };
      audio.play().catch(() => { greetingAudioRef.current = null; resolve(); });
    });
  }

  /**
   * FIX: Chunked TTS — handles long responses by splitting into chunks
   * and playing them sequentially. Each chunk is fetched and played in order.
   * Abortable via ttsAbortRef.
   */
  async function speakTextChunked(text: string): Promise<void> {
    if (!ttsEnabledRef.current || !text) return;
    if (showIntroRef.current) return;

    const chunks = chunkTextForTTS(text);
    if (!chunks.length) return;

    // Abort any previous TTS session
    ttsAbortRef.current?.abort();
    const abortCtrl = new AbortController();
    ttsAbortRef.current = abortCtrl;
    const signal = abortCtrl.signal;

    setSpeaking(true);
    try {
      for (const chunk of chunks) {
        if (signal.aborted || !ttsEnabledRef.current) break;

        let res: Response;
        try {
          res = await fetch('/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: chunk }),
            signal,
          });
        } catch {
          // AbortError or network error — stop
          break;
        }

        if (!res.ok || signal.aborted) break;

        const blob = await res.blob();
        if (signal.aborted) break;

        const url = URL.createObjectURL(blob);

        // Dispose previous audio element
        if (audioRef.current) {
          const old = audioRef.current.src;
          audioRef.current.pause();
          if (old?.startsWith('blob:')) URL.revokeObjectURL(old);
        }

        // Play this chunk and wait for it to finish before moving to next
        await new Promise<void>(resolve => {
          if (signal.aborted) { URL.revokeObjectURL(url); resolve(); return; }
          const audio = new Audio(url);
          audioRef.current = audio;
          audio.onended = () => { URL.revokeObjectURL(url); resolve(); };
          audio.onerror = () => { URL.revokeObjectURL(url); resolve(); };
          // Stop this chunk if aborted mid-play
          signal.addEventListener('abort', () => {
            audio.pause();
            URL.revokeObjectURL(url);
            resolve();
          }, { once: true });
          audio.play().catch(() => { URL.revokeObjectURL(url); resolve(); });
        });
      }
    } finally {
      if (ttsAbortRef.current === abortCtrl) {
        ttsAbortRef.current = null;
      }
      setSpeaking(false);
      audioRef.current = null;
    }
  }

  // ─── Wake word ────────────────────────────────────────────────────────────
  function stopWakeWordListener() {
    try { wakeRecognitionRef.current?.stop(); } catch {}
    wakeRecognitionRef.current = null;
    wakeWordActiveRef.current  = false;
    setWakeWordActive(false);
  }

  function startWakeWordListener() {
    if (!canUseWakeWord()) return;
    if (openRef.current) return;
    if (!wakeWordActiveRef.current) return;
    if (showIntroRef.current) return; // Never start during intro video

    try { wakeRecognitionRef.current?.stop(); } catch {}
    wakeRecognitionRef.current = null;

    const SR = getSpeechApi();
    if (!SR) return;

    const r = new SR();
    wakeRecognitionRef.current = r;
    r.lang           = 'en-US';
    r.continuous     = true;
    r.interimResults = true;
    wakeProcessingRef.current = false;

    r.onresult = (e: SpeechRecognitionEventLike) => {
      // Stale-instance guard: Chrome buffers audio and fires onresult AFTER stop().
      // If this instance was already replaced/nulled, discard the result.
      if (wakeRecognitionRef.current !== r) return;
      if (wakeProcessingRef.current) return;
      if (showIntroRef.current) return;
      if (isVideoPlayingRef.current) return;
      const t = Array.from(e.results)
        .map(x => x[0].transcript.toLowerCase())
        .join('');

      const matched =
        t.includes('hey gabby') ||
        t.includes('hei gabby') ||
        t.includes('haai gabby') ||
        t.includes('hi gabby') ||
        t.includes('gabby') ||
        t.includes('gabbie') ||
        t.includes('gabi');

      if (matched) {
        wakeProcessingRef.current = true;
        try { r.stop(); } catch {}
        wakeRecognitionRef.current = null;
        // Capture whether intro was playing BEFORE we clear it.
        // If the wake word fired from the video's own audio, skip hithere MP3
        // so it doesn't play on top of / immediately after the video.
        const introWasShowing = showIntroRef.current;
        sessionStorage.setItem(GABBY_INTRO_SEEN_KEY, 'true');
        showIntroRef.current = false;
        setShowIntro(false);
        setVideoPlaying(false);
        setOpen(true);
        if (!introWasShowing) void playGreeting();
      }
    };

    r.onend = () => {
      if (!wakeWordActiveRef.current || openRef.current) return;
      if (wakeRecognitionRef.current !== r) return;
      setTimeout(() => {
        if (wakeWordActiveRef.current && !openRef.current) {
          startWakeWordListener();
        }
      }, 300);
    };

    r.onerror = (e: SpeechRecognitionErrorEventLike) => {
      if (e.error === 'not-allowed') {
        setMicPermission('denied');
        wakeWordActiveRef.current = false;
        setWakeWordActive(false);
        wakeRecognitionRef.current = null;
        return;
      }
      if (wakeWordActiveRef.current && !openRef.current) {
        setTimeout(() => {
          if (wakeWordActiveRef.current && !openRef.current) {
            startWakeWordListener();
          }
        }, 500);
      }
    };

    try {
      r.start();
    } catch {
      setTimeout(() => {
        if (wakeWordActiveRef.current && !openRef.current) {
          startWakeWordListener();
        }
      }, 600);
    }
  }

  async function handleWakeToggle() {
    if (!canUseWakeWord()) return;
    if (wakeWordActive) {
      wakeWordActiveRef.current = false;
      stopWakeWordListener();
      return;
    }
    if (micPermission !== 'granted') {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicPermission('granted');
      } catch {
        setMicPermission('denied');
        return;
      }
    }
    wakeWordActiveRef.current = true;
    setWakeWordActive(true);
    startWakeWordListener();
  }

  // ─── STT (composer mic) ───────────────────────────────────────────────────
  function startListening() {
    const SR = getSpeechApi();
    if (!SR) return;

    if (listening) {
      sttKeepListeningRef.current = false;
      recognitionRef.current?.stop();
      recognitionRef.current = null;
      setListening(false);
      return;
    }

    sttKeepListeningRef.current = true;
    const r = new SR();
    recognitionRef.current = r;

    const lastMsg = latestMsgsRef.current.filter(m => m.role === 'user').slice(-1)[0]?.content?.toLowerCase() ?? '';
    const afrikaansWords = ['die','van','is','en','wat','ek','jy','ons','dit','nie','het','hoe','vir'];
    r.lang            = afrikaansWords.some(w => lastMsg.includes(` ${w} `)) ? 'af-ZA' : 'en-ZA';
    // Keep listening until user manually stops.
    r.continuous      = true;
    r.interimResults  = true;
    r.onstart         = () => {
      if (recognitionRef.current !== r) return;
      setListening(true);
    };
    r.onresult        = (e: SpeechRecognitionEventLike) => {
      if (recognitionRef.current !== r) return;
      const t = Array.from(e.results).map(x => x[0].transcript).join('');
      liveTranscriptRef.current = t;
      setInput(t);
    };
    r.onend = () => {
      if (recognitionRef.current !== r) return;
      recognitionRef.current = null;
      setListening(false);
      const t = liveTranscriptRef.current.trim();
      if (t) setInput(t);
      liveTranscriptRef.current = '';
      if (sttKeepListeningRef.current && !loading) {
        setTimeout(() => {
          if (sttKeepListeningRef.current && !recognitionRef.current && !loading) startListening();
        }, 120);
      }
    };
    r.onerror = (e: SpeechRecognitionErrorEventLike) => {
      if (recognitionRef.current !== r) return;
      recognitionRef.current = null;
      setListening(false);
      if (!sttKeepListeningRef.current) return;
      if (['aborted','no-speech','network'].includes(e.error)) {
        setTimeout(() => { if (!loading && sttKeepListeningRef.current) startListening(); }, 350);
        return;
      }
      console.warn('STT:', e.error);
    };

    r.start();
  }

  // ─── Send message ─────────────────────────────────────────────────────────
  async function sendMessage(customText?: string) {
    const raw = (customText ?? input).trim();
    if (!raw || loading) return;

    if (listening) {
      sttKeepListeningRef.current = false;
      recognitionRef.current?.stop();
      recognitionRef.current = null;
      setListening(false);
      liveTranscriptRef.current = '';
    }

    // Stop any in-progress TTS before new message
    ttsAbortRef.current?.abort();

    unblockThinkingRef.current?.();
    unblockThinkingRef.current = null;
    thinkingAudioRef.current?.pause();
    thinkingAudioRef.current = null;
    chatAbortRef.current?.abort();
    chatAbortRef.current = new AbortController();
    const signal = chatAbortRef.current.signal;
    const myGen  = ++sendGenRef.current;

    const userMsg: Message = { role: 'user', content: raw };
    trackEvent('gabby_message', 'gabby_user_message', { length: raw.length });
    const newMsgs = [...latestMsgsRef.current, userMsg];
    setMessages(newMsgs);
    latestMsgsRef.current = newMsgs;
    setInput('');
    setLoading(true);

    const t0 = performance.now();

    let pick: number;
    do {
      pick = THINKING_MIN + Math.floor(Math.random() * (THINKING_MAX - THINKING_MIN + 1));
    } while (pick === lastThinkingRef.current && THINKING_MAX > THINKING_MIN);
    lastThinkingRef.current = pick;

    const thinkingPromise = new Promise<void>(resolve => {
      let done = false;
      const finish = () => { if (done) return; done = true; unblockThinkingRef.current = null; thinkingAudioRef.current = null; resolve(); };
      unblockThinkingRef.current = finish;

      const audio = new Audio(`/thinking/thinking-${pick}.mp3`);
      thinkingAudioRef.current = audio;
      audio.onended = finish;
      audio.onerror = finish;
      audio.play().catch(finish);
    });

    const apiPromise = fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: toApiMessages(withMemoryContext(newMsgs, memoryRef.current)) }),
      signal,
    }).then(r => { if (!r.ok) throw new Error('Chat failed'); return r.json(); });

    try {
      const [, data] = await Promise.all([thinkingPromise, apiPromise]);
      if (myGen !== sendGenRef.current) return;

      const elapsed   = Math.round(performance.now() - t0);
      // FIX: strip XML/SSML tags from AI response before display
      const rawReply  = data.message || data.error || 'Sorry, something went wrong.';
      const replyText = cleanTextForDisplay(rawReply);

      // Add empty assistant message
      setMessages(prev => {
        const next = [...prev, { role: 'assistant' as const, content: '', latencyMs: elapsed }];
        latestMsgsRef.current = next;
        return next;
      });
      setLoading(false);
      await waitForPaint();

      // FIX: Stream words fast (25ms/word) — down from 400ms.
      // Text appears in ~1-2 seconds for a typical response, then TTS plays.
      const words = replyText.split(' ');
      let built = '';
      for (let i = 0; i < words.length; i++) {
        if (myGen !== sendGenRef.current) break;
        built += (i === 0 ? '' : ' ') + words[i];
        const snapshot = built;
        setMessages(prev => {
          if (prev.length === 0) return prev;
          const last = prev[prev.length - 1];
          if (last.role !== 'assistant') return prev;
          const next = [...prev.slice(0, -1), { ...last, content: snapshot }];
          latestMsgsRef.current = next;
          return next;
        });
        // Punctuation gets a brief pause, regular words are fast
        const word = words[i];
        const delay = /[.!?]$/.test(word) ? 80 : /[,;:]$/.test(word) ? 50 : 25;
        await new Promise<void>(r => setTimeout(r, delay));
      }

      // Text is fully shown — now play TTS (chunked, handles any length)
      if (myGen === sendGenRef.current && ttsEnabledRef.current) {
        await speakTextChunked(replyText);
      }

    } catch (err: unknown) {
      await thinkingPromise;
      if (myGen !== sendGenRef.current) return;
      const e = err as { name?: string };
      if (e?.name === 'AbortError' || signal.aborted) return;

      const elapsed   = Math.round(performance.now() - t0);
      const errText   = 'Sorry, something went wrong. Please try again or email info@myaipartner.co.za';
      setMessages(prev => {
        const next = [...prev, { role: 'assistant' as const, content: errText, latencyMs: elapsed }];
        latestMsgsRef.current = next;
        return next;
      });
      setLoading(false);
      if (ttsEnabledRef.current) await speakTextChunked(errText);
    }
  }

  // ─── Voice mode ───────────────────────────────────────────────────────────
  function startListeningVoiceMode() {
    const SR = getSpeechApi();
    if (!SR) return;
    const r = new SR();
    r.lang           = 'en-ZA';
    r.continuous     = false;
    r.interimResults = false;
    r.onresult       = (e: SpeechRecognitionEventLike) => runVoiceTurn(e.results[0][0].transcript);
    r.onerror        = () => setVoiceStatus('idle');
    r.start();
  }

  async function runVoiceTurn(transcript: string) {
    const text = transcript.trim();
    if (!text) { setVoiceStatus('listening'); startListeningVoiceMode(); return; }

    setVoiceStatus('thinking');
    const userMsg: Message = { role: 'user', content: text };
    const newMsgs = [...latestMsgsRef.current, userMsg];
    setMessages(newMsgs);
    latestMsgsRef.current = newMsgs;

    const t0 = performance.now();
    try {
      const res  = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: toApiMessages(withMemoryContext(newMsgs, memoryRef.current)) }),
      });
      const data    = await res.json();
      const elapsed = Math.round(performance.now() - t0);
      // FIX: strip XML/SSML from voice mode replies too
      const reply   = cleanTextForDisplay(data.message || data.error || 'Sorry, something went wrong.');

      setMessages(prev => {
        const next = [...prev, { role: 'assistant' as const, content: reply, latencyMs: elapsed }];
        latestMsgsRef.current = next;
        return next;
      });

      setVoiceStatus('speaking');
      await speakTextChunked(reply);
      if (voiceMode) { setVoiceStatus('listening'); startListeningVoiceMode(); }
    } catch {
      const elapsed = Math.round(performance.now() - t0);
      setMessages(prev => {
        const next = [...prev, { role: 'assistant' as const, content: 'Sorry, something went wrong.', latencyMs: elapsed }];
        latestMsgsRef.current = next;
        return next;
      });
      setVoiceStatus('idle');
    }
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────
  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  function formatMessage(text: string) {
    return text.split('\n').map((line, i, arr) => (
      <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
    ));
  }

  function dismissIntro() {
    isVideoPlayingRef.current = false;
    showIntroRef.current = false;
    setShowIntro(false);
    setVideoPlaying(false);
    sessionStorage.setItem(GABBY_INTRO_SEEN_KEY, 'true');
    window.dispatchEvent(new CustomEvent('gabby-intro-dismissed'));
    // Wake word restart is handled by the showIntro useEffect when showIntro→false.
  }

  function toggleMute() {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIntroMuted(prev => !prev);
  }

  function replayVideo() {
    isVideoPlayingRef.current = false;
    setVideoPlaying(false);
    setShowIntro(true);
    showIntroRef.current = true; // FIX: sync ref
    setTimeout(() => {
      if (!videoRef.current) return;
      const v = videoRef.current;
      v.currentTime = 0;
      v.muted = false;
      v.play()
        .then(() => setIntroMuted(false))
        .catch(() => { v.muted = true; setIntroMuted(true); v.play().catch(() => {}); });
    }, 50);
  }

  function startIntroVideoPlayback() {
    if (!videoRef.current) return;
    const v = videoRef.current;
    v.muted = false;
    v.volume = 1;
    isVideoPlayingRef.current = true;
    // Hard-kill wake word synchronously before video audio hits the STT buffer.
    // Chrome fires onresult from buffered audio even after stop() —
    // nulling the ref here triggers the stale-instance guard in onresult.
    try { wakeRecognitionRef.current?.stop(); } catch {}
    wakeRecognitionRef.current = null;
    v.play()
      .then(() => { setVideoPlaying(true); setIntroMuted(false); })
      .catch(() => {
        v.muted = true;
        setIntroMuted(true);
        v.play().then(() => setVideoPlaying(true)).catch(() => {});
      });
  }

  const iconBtn: CSSProperties = {
    background: 'none', border: 'none', cursor: 'pointer', padding: 4,
    borderRadius: 8, display: 'inline-flex', alignItems: 'center',
    justifyContent: 'center', width: 40, height: 40, flexShrink: 0,
    lineHeight: 0, color: 'var(--color-text-secondary)', transition: 'color 0.15s',
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Intro video ─────────────────────────────────────────────────── */}
      {showIntro && (
        <div style={{
          position: 'fixed',
          bottom: 90,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 99990,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <div style={{
            position: 'relative',
            width: 'min(320px, 80vw)',
            aspectRatio: '9/16',
            background: 'transparent',
            borderRadius: 20,
            overflow: 'hidden',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 88% at 50% 46%, black 42%, transparent 100%)',
            maskImage:        'radial-gradient(ellipse 80% 88% at 50% 46%, black 42%, transparent 100%)',
            filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.5))',
          }}>
            <video
              ref={videoRef}
              src="/gabby.mp4"
              preload="auto"
              playsInline
              muted={introMuted}
              onEnded={dismissIntro}
              onClick={() => {
                if (!videoPlaying) startIntroVideoPlayback();
              }}
              style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover', objectPosition: 'center top', mixBlendMode: 'normal', cursor: videoPlaying ? 'default' : 'pointer' }}
            />
            <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 20 }} />
          </div>

          <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 6, zIndex: 2 }}>
            {videoPlaying && (
              <button onClick={toggleMute} style={{
                background: 'rgba(0,0,0,0.65)', border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 20, padding: '5px 12px', color: '#fff', fontSize: 12, cursor: 'pointer',
              }}>
                {introMuted ? '🔇 Sound on' : '🔊 Mute'}
              </button>
            )}
            <button onClick={dismissIntro} style={{
              background: 'rgba(0,0,0,0.65)', border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50%', width: 28, height: 28, color: '#fff', fontSize: 16,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>×</button>
          </div>
        </div>
      )}

      {/* ── Voice mode overlay ───────────────────────────────────────────── */}
      {voiceMode && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)',
          zIndex: 999999, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 24,
        }}>
          <div style={{ position: 'relative' }}>
            <img src="/gabby.png" alt="Gabby" style={{
              width: 160, height: 160, borderRadius: '50%',
              objectFit: 'cover', objectPosition: 'center top',
              border: `4px solid ${voiceStatus === 'listening' ? '#4ade80' : voiceStatus === 'speaking' ? '#00e5ff' : voiceStatus === 'thinking' ? '#f59e0b' : '#333'}`,
              transition: 'border-color 0.3s',
              animation: voiceStatus === 'speaking' ? 'voice-pulse 1s infinite' : 'none',
            }} />
            {voiceStatus === 'listening' && (
              <div style={{
                position: 'absolute', inset: -8, borderRadius: '50%',
                border: '2px solid rgba(74,222,128,0.4)',
                animation: 'voice-ring 1.5s infinite',
              }} />
            )}
          </div>
          <div style={{ color: '#fff', fontSize: 18, fontWeight: 500 }}>
            {voiceStatus === 'listening' && 'Listening...'}
            {voiceStatus === 'thinking'  && 'Thinking...'}
            {voiceStatus === 'speaking'  && 'Gabby is speaking...'}
            {voiceStatus === 'idle'      && 'Voice mode ready'}
          </div>
          <button onClick={() => { setVoiceMode(false); setVoiceStatus('idle'); ttsAbortRef.current?.abort(); recognitionRef.current?.stop(); }} style={{
            padding: '14px 32px', borderRadius: 30, background: '#ff4d6d',
            border: 'none', color: '#fff', fontSize: 15, fontWeight: 500, cursor: 'pointer',
          }}>📵 End conversation</button>
        </div>
      )}

      {/* ── Chat window — never shows while intro video is playing ───────── */}
      {open && !showIntro && (
        <div className="chat-window" style={{
          position: 'fixed',
          top: 88, left: '50%', transform: 'translateX(-50%)',
          width: 'min(600px, 90vw)',
          height: 'min(720px, calc(100vh - 120px))',
          background: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 16,
          display: 'flex', flexDirection: 'column',
          zIndex: 100005,
          boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            flexShrink: 0, padding: '14px 16px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'var(--color-bg-card)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <img src="/gabby.png" alt="Gabby" style={{
                width: 48, height: 48, borderRadius: '50%',
                objectFit: 'cover', objectPosition: 'center top',
                border: '2px solid var(--color-border-accent)',
                flexShrink: 0,
              }} />
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1.2 }}>Gabby</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                  Online
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Replay video */}
              <button type="button" onClick={replayVideo} style={iconBtn} title="Play Gabby's intro again">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />
                </svg>
              </button>
              {/* Voice mode */}
              <button type="button" onClick={() => { setVoiceMode(true); setVoiceStatus('listening'); startListeningVoiceMode(); }} style={iconBtn} title="Start voice conversation">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </button>
              {/* TTS toggle */}
              <button type="button" onClick={() => {
                setTtsEnabled(p => !p);
                if (speaking) { ttsAbortRef.current?.abort(); setSpeaking(false); }
              }} style={{ ...iconBtn, color: ttsEnabled ? 'var(--color-accent-text)' : 'var(--color-text-secondary)' }}
                title={ttsEnabled ? 'Mute Gabby' : "Turn on Gabby's voice"}>
                {ttsEnabled
                  ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></svg>
                  : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="22" y1="9" x2="16" y2="15" /><line x1="16" y1="9" x2="22" y2="15" /></svg>
                }
              </button>
              {/* Close */}
              <button type="button" onClick={() => setOpen(false)} style={iconBtn} title="Close chat">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Memory banner */}
          {memory && (memory.messageCount ?? 0) > 0 && (
            <div style={{
              flexShrink: 0, fontSize: 11, color: 'var(--color-text-secondary)',
              textAlign: 'center', padding: '5px 16px', opacity: 0.6,
              borderBottom: '1px solid var(--color-border)',
            }}>
              ✦ Gabby remembers you
            </div>
          )}

          {/* Messages */}
          <div ref={messagesScrollRef} style={{
            flex: '1 1 0%', minHeight: 0, overflowY: 'auto',
            padding: '16px 16px 12px', display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '88%', padding: '10px 14px', fontSize: 15, lineHeight: 1.55,
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
                  background: msg.role === 'user' ? 'var(--color-accent-bg)' : 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  color: msg.role === 'user' ? 'var(--color-accent-text)' : 'var(--color-text-primary)',
                }}>
                  {formatMessage(msg.content)}
                  {/* Speaking wave on last assistant message */}
                  {speaking && msg.role === 'assistant' && i === messages.length - 1 && (
                    <div style={{ display: 'flex', gap: 3, alignItems: 'center', marginTop: 6 }}>
                      {[1,2,3,4].map(b => (
                        <div key={b} style={{
                          width: 3, borderRadius: 2,
                          background: 'var(--color-accent-text)',
                          animation: `wave ${0.55 + b * 0.1}s ease-in-out infinite alternate`,
                          height: 6 + b * 3,
                        }} />
                      ))}
                    </div>
                  )}
                </div>
                {msg.role === 'assistant' && msg.latencyMs != null && (
                  <div style={{ fontSize: 10, color: 'var(--color-text-secondary)', opacity: 0.6, paddingLeft: 4, marginTop: 2 }}>
                    Replied in {formatLatency(msg.latencyMs)}
                  </div>
                )}
              </div>
            ))}

            {/* Thinking dots */}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src="/gabby.png" alt="" style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center top', flexShrink: 0 }} />
                <div style={{ padding: '10px 14px', borderRadius: '4px 16px 16px 16px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', display: 'flex', gap: 5, alignItems: 'center' }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: 'var(--color-accent-text)',
                      animation: `thinking-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}

            {/* First-open hint */}
            {messages.length === 1 && !loading && (
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', textAlign: 'center', opacity: 0.7, padding: '4px 0' }}>
                {ttsEnabled ? '🔊 Gabby will speak her replies' : '🔇 Tap the speaker icon to hear Gabby'}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input bar */}
          <div style={{
            flexShrink: 0, padding: '12px 14px 14px',
            borderTop: '1px solid var(--color-border)',
            display: 'flex', gap: 8, alignItems: 'center',
            background: 'var(--color-bg-card)',
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={speechOk ? 'Ask me anything… or tap 🎤' : 'Ask me anything…'}
              style={{
                flex: 1, minWidth: 0, padding: '11px 16px',
                borderRadius: 24, border: '1px solid var(--color-border)',
                background: 'var(--color-bg)', color: 'var(--color-text-primary)',
                fontSize: 15, outline: 'none',
              }}
            />
            {/* Mic button */}
            {speechOk && (
              <button type="button" onClick={startListening}
                title={listening ? 'Stop' : 'Speak'}
                style={{
                  width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                  background: listening ? 'rgba(255,77,109,0.15)' : 'var(--color-bg)',
                  border: `1px solid ${listening ? 'rgba(255,77,109,0.5)' : 'var(--color-border)'}`,
                  color: listening ? '#ff4d6d' : 'var(--color-text-secondary)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: listening ? 'mic-pulse 1s infinite' : 'none',
                }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0 0 14 0" /><line x1="12" y1="19" x2="12" y2="22" /><line x1="8" y1="22" x2="16" y2="22" />
                </svg>
              </button>
            )}
            {/* Send button */}
            <button type="button" onClick={() => sendMessage()} disabled={!input.trim() || loading}
              style={{
                width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                background: input.trim() && !loading ? 'var(--color-accent-bg)' : 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-accent-text)', cursor: input.trim() && !loading ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: !input.trim() || loading ? 0.45 : 1, transition: 'opacity 0.2s',
              }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2 11 13" /><path d="M22 2 15 22 11 13 2 9 22 2z" />
              </svg>
            </button>
          </div>

          {/* Forget me */}
          <div style={{ flexShrink: 0, padding: '4px 12px 10px', textAlign: 'center', borderTop: '1px solid var(--color-border)' }}>
            <button type="button" onClick={() => {
              localStorage.removeItem(GABBY_MEMORY_KEY);
              setMemory(null);
              const fresh: Message[] = [];
              setMessages(fresh);
              latestMsgsRef.current = fresh;
            }} style={{ fontSize: 10, color: 'var(--color-text-secondary)', cursor: 'pointer', opacity: 0.45, textDecoration: 'underline', background: 'none', border: 'none', padding: '2px 6px' }}>
              Forget me
            </button>
          </div>
        </div>
      )}

      {/* ── Wake word portal ─────────────────────────────────────────────── */}
      {canUseWakeWord() && wakePortalEl && createPortal(
        <HeyGabbyWakeControls wakeWordActive={wakeWordActive} micPermission={micPermission} onToggle={handleWakeToggle} />,
        wakePortalEl
      )}

      {/* ── Animations ───────────────────────────────────────────────────── */}
      <style>{`
        @keyframes thinking-dot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes wave {
          from { transform: scaleY(0.5); opacity: 0.5; }
          to   { transform: scaleY(1.3); opacity: 1; }
        }
        @keyframes mic-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,77,109,0.4); }
          50%       { box-shadow: 0 0 0 6px rgba(255,77,109,0); }
        }
        @keyframes voice-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0,229,255,0.4); }
          50%       { box-shadow: 0 0 0 20px rgba(0,229,255,0); }
        }
        @keyframes voice-ring {
          0%   { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @media (max-width: 767px) {
          .chat-window {
            top: 50% !important;
            left: 50% !important;
            right: auto !important;
            transform: translate(-50%, -50%) !important;
            width: 90vw !important;
            height: 90vh !important;
            border-radius: 12px !important;
          }
        }
      `}</style>
    </>
  );
}
