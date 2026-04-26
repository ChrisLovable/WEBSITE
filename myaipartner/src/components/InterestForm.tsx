"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import css from "@/components/InterestForm.module.css";
import { trackEvent } from "@/hooks/useAnalytics";

const services = [
  { id: "svc_consulting", value: "AI Strategy & Consulting", icon: "🧠", desc: "Roadmap, opportunity assessment, AI adoption planning" },
  { id: "svc_automation", value: "Business Process Automation", icon: "⚙️", desc: "Automate repetitive workflows with AI and APIs" },
  { id: "svc_software", value: "Custom Software Development", icon: "💻", desc: "Web platforms, dashboards, portals, internal tools" },
  { id: "svc_web", value: "Website Design & AI Integration", icon: "🌐", desc: "Modern responsive websites with practical AI features built in" },
  { id: "svc_app", value: "Mobile & Desktop App Development", icon: "📱", desc: "Android, iOS, PWA, cross-platform desktop apps" },
  { id: "svc_training", value: "AI Training & Workforce Enablement", icon: "🎓", desc: "Train your team to use and build with AI" },
  { id: "svc_speaking", value: "Corporate AI Speaking & Executive Briefings", icon: "🎤", desc: "Business-focused AI talks, keynotes, and leadership briefings" },
  { id: "svc_ediscovery", value: "Forensic AI Email Investigation", icon: "⌕", desc: "Defensible AI querying across email and WhatsApp evidence" },
  { id: "svc_market", value: "Competitor & Market Intelligence", icon: "📈", desc: "Track competitors, pricing shifts, launches, and market signals" },
  { id: "svc_other", value: "Other / Not Sure Yet", icon: "💬", desc: "Tell us your problem and we'll advise" }
];

const appTypeOptions = ["Web Application", "Android App", "iOS App", "I don't know yet"];
const STT_SILENCE_STOP_MS = 5000;

const sectionMap: Record<string, string | null> = {
  "AI Strategy & Consulting": "sec_consulting",
  "Business Process Automation": "sec_automation",
  "Custom Software Development": "sec_app",
  "Website Design & AI Integration": "sec_website",
  "Mobile & Desktop App Development": "sec_app",
  "AI Training & Workforce Enablement": "sec_training",
  "Corporate AI Speaking & Executive Briefings": "sec_speaking",
  "Forensic AI Email Investigation": "sec_ediscovery",
  "Competitor & Market Intelligence": "sec_market",
  "Other / Not Sure Yet": null
};

export default function InterestForm({ showBackHome = false }: { showBackHome?: boolean }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedService, setSelectedService] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sttLanguage] = useState<"en">("en");
  const [sttError, setSttError] = useState<string | null>(null);
  const [sttPhase, setSttPhase] = useState<"idle" | "recording" | "stopping" | "transcribing">("idle");
  const [activeField, setActiveField] = useState<string | null>(null);
  const sttPhaseRef = useRef<"idle" | "recording" | "stopping" | "transcribing">("idle");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const vadRafRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const lastSoundAtRef = useRef(0);
  const sessionRef = useRef<{
    id: number;
    fieldName: string;
    chunks: Blob[];
    stopRequested: boolean;
    committed: boolean;
    stream: MediaStream;
    mimeType: string;
  } | null>(null);
  const sessionCounterRef = useRef(0);
  const visibleSection = useMemo(() => sectionMap[selectedService] ?? null, [selectedService]);
  const tr = (en: string, _af?: string) => en;

  const setPhase = (phase: "idle" | "recording" | "stopping" | "transcribing") => {
    sttPhaseRef.current = phase;
    setSttPhase(phase);
  };

  const stopVadMonitoring = () => {
    if (vadRafRef.current !== null) {
      window.cancelAnimationFrame(vadRafRef.current);
      vadRafRef.current = null;
    }
    try {
      sourceNodeRef.current?.disconnect();
    } catch {
      // no-op
    }
    try {
      analyserRef.current?.disconnect();
    } catch {
      // no-op
    }
    sourceNodeRef.current = null;
    analyserRef.current = null;
    const ctx = audioContextRef.current;
    audioContextRef.current = null;
    if (ctx) {
      void ctx.close().catch(() => {});
    }
  };

  useEffect(() => {
    return () => {
      stopVadMonitoring();
      try {
        if (recorderRef.current && recorderRef.current.state !== "inactive") {
          recorderRef.current.stop();
        }
      } catch {
        // no-op
      }
      sessionRef.current?.stream.getTracks().forEach((track) => track.stop());
      recorderRef.current = null;
      sessionRef.current = null;
      sttPhaseRef.current = "idle";
    };
  }, []);

  useEffect(() => {
    const releaseLockedFields = () => {
      const locked = formRef.current?.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("[data-stt-locked='1']");
      locked?.forEach((el) => {
        el.readOnly = false;
        el.removeAttribute("data-stt-locked");
      });
    };

    if (sttPhase !== "recording" || !activeField) {
      releaseLockedFields();
      return;
    }

    releaseLockedFields();
    const target = formRef.current?.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${activeField}"]`);
    if (!target) return;
    target.readOnly = true;
    target.setAttribute("data-stt-locked", "1");

    return () => releaseLockedFields();
  }, [sttPhase, activeField]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    trackEvent("interest_form_submit", "Interest Form Submit Button", {
      page: typeof window !== "undefined" ? window.location.pathname : "/interest",
      timestamp: new Date().toISOString()
    });
    const formEl = event.currentTarget;
    let valid = true;
    const required = formEl.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("[required]");
    required.forEach((field) => {
      field.classList.remove(css.invalid);
      if (!field.value.trim()) {
        field.classList.add(css.invalid);
        valid = false;
      }
    });
    if (!selectedService) valid = false;
    if (!valid) return;

    setSubmitting(true);
    setError(null);

    const form = new FormData(formEl);
    const payload = {
      name: `${String(form.get("first_name") || "").trim()} ${String(form.get("last_name") || "").trim()}`.trim(),
      company: String(form.get("company") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      notes: String(form.get("description") || ""),
      service: selectedService,
      services: selectedService ? [selectedService] : []
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to submit");
      setSubmitted(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const toTitleCase = (value: string) =>
    value
      .toLowerCase()
      .split(" ")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

  const normalizeEmail = (value: string) =>
    value
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/\(at\)|\sat\s/g, "@")
      .replace(/\(dot\)|\sdot\s/g, ".");

  const normalizePhone = (value: string) => {
    const keep = value.replace(/[^\d+a-zA-Z\s()-]/g, "").trim();
    const extensionMatch = keep.match(/\b(ext|x)\s*\d+\b/i);
    const extension = extensionMatch ? ` ${extensionMatch[0]}` : "";
    const withoutExtension = extensionMatch ? keep.replace(extensionMatch[0], "").trim() : keep;

    const hasPlus = withoutExtension.includes("+");
    const digits = withoutExtension.replace(/[^\d]/g, "");
    if (!digits) return "";

    // South Africa normalization:
    // 0XXXXXXXXX -> +27XXXXXXXXX
    // 27XXXXXXXXX -> +27XXXXXXXXX
    if (digits.startsWith("0") && digits.length === 10) {
      return `+27${digits.slice(1)}${extension}`;
    }
    if (digits.startsWith("27") && digits.length >= 11) {
      return `+${digits}${extension}`;
    }

    if (hasPlus) return `+${digits}${extension}`;
    return `${digits}${extension}`;
  };

  const normalizeTranscriptForField = (fieldName: string, text: string) => {
    const compact = text.replace(/\s+/g, " ").trim();
    if (!compact) return "";

    if (fieldName === "email") return normalizeEmail(compact);
    if (fieldName === "phone") return normalizePhone(compact);
    if (fieldName === "first_name" || fieldName === "last_name") return toTitleCase(compact);
    if (fieldName === "company") return toTitleCase(compact);
    if (fieldName.includes("address")) return toTitleCase(compact);
    if (fieldName.includes("date")) return compact;

    return compact;
  };

  const appendToField = (fieldName: string, text: string) => {
    const field = formRef.current?.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${fieldName}"]`);
    if (!field) return;
    const cleaned = normalizeTranscriptForField(fieldName, text);
    if (!cleaned) return;

    const overwriteFields = new Set(["first_name", "last_name", "email", "phone", "company"]);
    if (overwriteFields.has(fieldName)) {
      field.value = cleaned;
      return;
    }

    const prev = field.value.trim();
    const spacer = prev && !/\s$/.test(field.value) ? " " : "";
    field.value = `${field.value}${spacer}${cleaned}`.trim();
  };

  const clearField = (fieldName: string) => {
    const field = formRef.current?.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${fieldName}"]`);
    if (!field) return;
    field.value = "";
  };

  const cleanupSession = (sessionId: number) => {
    const current = sessionRef.current;
    if (!current || current.id !== sessionId) return;
    stopVadMonitoring();
    current.stream.getTracks().forEach((track) => track.stop());
    sessionRef.current = null;
    recorderRef.current = null;
  };

  const startSttRecording = async (fieldName: string) => {
    if (sttPhaseRef.current !== "idle") return;
    setSttError(null);
    setActiveField(fieldName);
    setPhase("recording");
    try {
      if (typeof MediaRecorder === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        setSttError("Speech-to-text is not supported in this browser.");
        setPhase("idle");
        setActiveField(null);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";
      const recorder = new MediaRecorder(stream, { mimeType });
      const sessionId = ++sessionCounterRef.current;
      const session = {
        id: sessionId,
        fieldName,
        chunks: [] as Blob[],
        stopRequested: false,
        committed: false,
        stream,
        mimeType
      };
      sessionRef.current = session;
      recorderRef.current = recorder;

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) session.chunks.push(event.data);
      };

      const commitSession = async () => {
        if (session.committed) return;
        session.committed = true;
        cleanupSession(session.id);
        setPhase("transcribing");
        setActiveField(session.fieldName);
        try {
          const blob = new Blob(session.chunks, { type: session.mimeType });
          if (!blob || blob.size < 1800) return;
          const body = new FormData();
          const currentFieldValue =
            formRef.current?.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${session.fieldName}"]`)?.value || "";
          body.append("audio", new File([blob], "recording.webm", { type: session.mimeType }));
          body.append("language", "en");
          body.append("fieldName", session.fieldName);
          body.append("currentValue", currentFieldValue);
          const response = await fetch("/api/transcribe", { method: "POST", body });
          const data = await response.json();
          if (!response.ok) throw new Error(data?.error || "Transcription failed");
          const transcript = String(data?.transcript || "").trim();
          if (transcript) appendToField(session.fieldName, transcript);
        } catch (err: unknown) {
          setSttError(err instanceof Error ? err.message : "Transcription failed");
        } finally {
          setPhase("idle");
          setActiveField(null);
        }
      };

      recorder.onstop = () => {
        if (!session.stopRequested) {
          cleanupSession(session.id);
          setPhase("idle");
          setActiveField(null);
          return;
        }
        void commitSession();
      };

      recorder.onerror = () => {
        cleanupSession(session.id);
        setPhase("idle");
        setActiveField(null);
        setSttError("Could not capture audio. Please check microphone permissions.");
      };

      recorder.start(250);
      const AudioContextCtor = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioContextCtor) {
        const ctx = new AudioContextCtor();
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 2048;
        source.connect(analyser);
        audioContextRef.current = ctx;
        sourceNodeRef.current = source;
        analyserRef.current = analyser;
        lastSoundAtRef.current = Date.now();

        const sample = new Uint8Array(analyser.fftSize);
        const SILENCE_RMS_THRESHOLD = 0.018;
        const monitor = () => {
          if (sessionRef.current?.id !== session.id || sttPhaseRef.current !== "recording") return;
          analyser.getByteTimeDomainData(sample);
          let sumSquares = 0;
          for (let i = 0; i < sample.length; i += 1) {
            const centered = (sample[i] - 128) / 128;
            sumSquares += centered * centered;
          }
          const rms = Math.sqrt(sumSquares / sample.length);
          if (rms > SILENCE_RMS_THRESHOLD) {
            lastSoundAtRef.current = Date.now();
          }

          if (Date.now() - lastSoundAtRef.current >= STT_SILENCE_STOP_MS) {
            if (recorderRef.current?.state === "recording") {
              setPhase("stopping");
              session.stopRequested = true;
              recorderRef.current.stop();
            }
            return;
          }
          vadRafRef.current = window.requestAnimationFrame(monitor);
        };
        vadRafRef.current = window.requestAnimationFrame(monitor);
      }
    } catch {
      setPhase("idle");
      setActiveField(null);
      setSttError("Could not capture audio. Please check microphone permissions.");
    }
  };

  const toggleStt = (fieldName: string) => {
    if (typeof window === "undefined") return;
    if (sttPhaseRef.current === "stopping" || sttPhaseRef.current === "transcribing") return;
    if (sttPhaseRef.current === "recording" && activeField && activeField !== fieldName) return;

    if (sttPhaseRef.current === "recording" && recorderRef.current && activeField === fieldName) {
      if (recorderRef.current.state !== "inactive") {
        setPhase("stopping");
        if (sessionRef.current) sessionRef.current.stopRequested = true;
        recorderRef.current.stop();
      }
      return;
    }

    void startSttRecording(fieldName);
  };

  const sttButtonLabel = (fieldName: string) => {
    if (activeField === fieldName && sttPhase === "recording") return "Stop Speech to Text";
    if (activeField === fieldName && sttPhase === "stopping") return "Stopping...";
    if (activeField === fieldName && sttPhase === "transcribing") return "Transcribing...";
    return "Start Speech to Text";
  };

  const sttButtonDisabled = (fieldName: string) =>
    sttPhase === "stopping" ||
    sttPhase === "transcribing" ||
    (sttPhase === "recording" && activeField !== fieldName);

  const renderFieldActions = (fieldName: string) => (
    <div className={css.sttRow}>
      <button
        type="button"
        className={`${css.sttBtn} ${sttPhase === "recording" && activeField === fieldName ? css.sttBtnActive : ""}`}
        onClick={() => toggleStt(fieldName)}
        disabled={sttButtonDisabled(fieldName)}
      >
        {sttButtonLabel(fieldName)}
      </button>
      <button type="button" className={css.clearBtn} onClick={() => clearField(fieldName)}>
        Clear
      </button>
      {sttError && activeField === fieldName && <span className={css.sttError}>{sttError}</span>}
    </div>
  );

  const closeForm = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/");
  };

  return (
    <div className={css.root}>
      <div className={css.hero}>
        {showBackHome && (
          <button type="button" className={css.closeBtn} onClick={closeForm}>
            {tr("← Back", "← Terug")}
          </button>
        )}
        <h1>Let&apos;s Build Something<br /><span>Intelligent</span></h1>
        <p>Tell us about your project. We&apos;ll review your brief and respond within one business day with a proposed approach and next steps.</p>
      </div>

      <div className={css.formWrap}>
        <form ref={formRef} onSubmit={handleSubmit} style={{ display: submitted ? "none" : "block" }}>
          <div className={css.infoBanner} role="note" aria-live="polite">
            <span className={css.infoBadge}>INFO</span>
            <p className={css.infoText}>Please speak clearly in English for best transcription results.</p>
          </div>
          <div className={css.formSection}>
            <div className={css.sectionHeader}><div className={css.sectionNum}>01</div><div className={css.sectionTitle}>{tr("Your Information", "Jou Inligting")}</div></div>
            <div className={css.fieldGrid}>
              <div className={css.field}><label>{tr("First Name", "Naam")} <span className={css.req}>*</span></label><input name="first_name" required /></div>
              <div className={css.field}><label>{tr("Last Name", "Van")} <span className={css.req}>*</span></label><input name="last_name" required /></div>
              <div className={css.field}><label>{tr("Email Address", "E-pos Adres")} <span className={css.req}>*</span></label><input type="email" name="email" required /></div>
              <div className={css.field}><label>{tr("Phone / WhatsApp", "Foon / WhatsApp")} <span className={css.req}>*</span></label><input name="phone" required /></div>
              <div className={css.field}><label>{tr("Company / Organisation", "Maatskappy / Organisasie")} <span className={css.req}>*</span></label><input name="company" required /></div>
              <div className={css.field}><label>{tr("Industry", "Bedryf")} <span className={css.req}>*</span></label><CustomSelect name="industry" required placeholder={tr("Select your industry", "Kies jou bedryf")} options={["Agriculture","Architecture & Engineering","Automotive","Construction","Consulting Services","Education","Energy & Utilities","Financial Services & Fintech","Government & Public Sector","Healthcare & Medical","Hospitality & Tourism","Human Resources & Recruitment","Insurance","Legal Services","Logistics & Supply Chain","Manufacturing","Marketing & Advertising","Media & Entertainment","Mining","Nonprofit & NGO","Pharmaceuticals & Life Sciences","Professional Services","Property & Real Estate","Retail & eCommerce","Security & Risk Management","Technology & Software","Telecommunications","Transport",tr("Other", "Ander")]} /></div>
            </div>
          </div>

          <div className={css.formSection}>
            <div className={css.sectionHeader}><div className={css.sectionNum}>02</div><div className={css.sectionTitle}>{tr("What Do You Need?", "Wat Het Jy Nodig?")}</div></div>
            <div className={css.field}>
              <label>{tr("Service Required", "Vereiste Diens")} <span className={css.req}>*</span></label>
              <CustomSelect
                name="service"
                value={selectedService}
                onChange={setSelectedService}
                required
                placeholder={tr("Select a service", "Kies 'n diens")}
                options={services.map((s) => s.value)}
              />
            </div>
          </div>

          <div className={css.formSection}>
            <div className={css.sectionHeader}><div className={css.sectionNum}>03</div><div className={css.sectionTitle}>{tr("Project Brief", "Projek Opsomming")}</div></div>
            <div className={`${css.fieldGrid} ${css.one}`}>
              <div className={css.field}>
                <label>{tr("Describe Your Project / Problem", "Beskryf Jou Projek / Probleem")} <span className={css.req}>*</span></label>
                {renderFieldActions("description")}
                <textarea name="description" required rows={5} />
              </div>
              <div className={css.field}>
                <label>{tr("What outcome are you trying to achieve?", "Watter uitkoms probeer jy bereik?")}</label>
                {renderFieldActions("outcome")}
                <textarea name="outcome" rows={3} />
              </div>
            </div>
          </div>

          <div id="sec_consulting" className={`${css.formSection} ${css.dynamicSection} ${visibleSection === "sec_consulting" ? css.visible : ""}`}>
            <div className={css.sectionHeader}><div className={css.sectionNum}>04</div><div className={css.sectionTitle}>Consulting Details</div></div>
            <div className={css.fieldGrid}>
              <div className={css.field}><label>Where are you in your AI journey?</label><CustomSelect name="ai_maturity" placeholder="Select stage" options={["Just starting","Exploring","Early adoption","Scaling"]} /></div>
              <div className={css.field}><label>Primary challenge</label><CustomSelect name="challenge" placeholder="Select challenge" options={["High operational costs","Too much manual work","Slow decision-making","Disconnected systems and data silos","Poor visibility into performance metrics","Low productivity across teams","Inconsistent customer experience","Difficulty scaling operations","Skills gap for AI adoption","Compliance and governance concerns","Legacy systems limiting innovation","Other"]} /></div>
              <div className={css.field}><label>Strategic priority</label><CustomSelect name="consulting_priority" placeholder="Select priority" options={["Cost reduction","Revenue growth","Customer experience","Operational efficiency","Risk and compliance","Faster decision-making","Digital transformation","Process standardization","Product / service innovation","Workforce productivity","Improved reporting and analytics","Market expansion","Other"]} /></div>
              <div className={css.field}><label>Who will be involved in decisions?</label><CustomSelect name="decision_stakeholders" placeholder="Select stakeholders" options={["Founder / Owner","Executive team","Department heads","Mixed stakeholders"]} /></div>
              <div className={`${css.field} ${css.span2}`}><label>Current tech stack</label>{renderFieldActions("tech_stack")}<input name="tech_stack" /></div>
            </div>
          </div>

          <div id="sec_automation" className={`${css.formSection} ${css.dynamicSection} ${visibleSection === "sec_automation" ? css.visible : ""}`}>
            <div className={css.sectionHeader}><div className={css.sectionNum}>04</div><div className={css.sectionTitle}>Automation Details</div></div>
            <div className={`${css.fieldGrid} ${css.one}`}>
              <div className={css.field}><label>Current manual process</label>{renderFieldActions("current_process")}<textarea name="current_process" rows={4} /></div>
              <div className={css.field}><label>Tools involved</label>{renderFieldActions("tools_involved")}<input name="tools_involved" /></div>
              <div className={css.field}><label>Process frequency</label><CustomSelect name="process_frequency" placeholder="Select frequency" options={["Multiple times daily","Daily","Weekly","Monthly"]} /></div>
              <div className={css.field}><label>Approximate process volume</label><CustomSelect name="automation_volume" placeholder="Select volume" options={["Under 100 items/month","100 - 1,000 items/month","1,000 - 10,000 items/month","10,000+ items/month"]} /></div>
              <div className={css.field}><label>Urgency</label><CustomSelect name="automation_urgency" placeholder="Select urgency" options={["Immediate","Within this quarter","Within 6 months","Exploring only"]} /></div>
            </div>
          </div>

          <div id="sec_app" className={`${css.formSection} ${css.dynamicSection} ${visibleSection === "sec_app" ? css.visible : ""}`}>
            <div className={css.sectionHeader}><div className={css.sectionNum}>04</div><div className={css.sectionTitle}>App / Software Details</div></div>
            <div className={css.fieldGrid}>
              <div className={css.field}>
                <label>Type of Application</label>
                <div className={css.checkGroup}>
                  {appTypeOptions.map((option) => (
                    <label key={option} className={css.checkItem}>
                      <input type="checkbox" name="app_type" value={option} />
                      <span className={css.checkBox}></span>
                      <span className={css.checkText}>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className={css.field}><label>Primary Users</label><CustomSelect name="app_users" placeholder="Who will use it?" options={["Internal staff only","Customers / clients"]} /></div>
              <div className={css.field}><label>Expected Number of Users</label><CustomSelect name="expected_users" placeholder="Select range" options={["1","2-10","10-50","50-100","100-200","200+","1000's"]} /></div>
              <div className={css.field}><label>Deployment preference</label><CustomSelect name="deployment_preference" placeholder="Select preference" options={["Web only","Mobile only","Web + Mobile","Desktop app","Not sure yet"]} /></div>
              <div className={css.field}><label>Data sensitivity / compliance</label><CustomSelect name="compliance_needs" placeholder="Select level" options={["Standard business data","Confidential customer data","Regulated data (POPIA/other)","Unsure"]} /></div>
              <div className={`${css.field} ${css.span2}`}>
                <label>Key Features Required</label>
                <div className={css.checkGroup}>
                  {[
                    "User login / authentication",
                    "Role-based access / permissions",
                    "Database design / data storage",
                    "Dashboard / analytics",
                    "AI chat or assistant",
                    "API integrations",
                    "Admin panel / content management",
                    "File upload / document handling",
                    "Notifications (email / SMS / WhatsApp)",
                    "Payments / billing integration",
                    "Reporting / exports",
                    "I don't know yet"
                  ].map((f) => (
                    <label key={f} className={css.checkItem}><input type="checkbox" name="features" value={f} /><span className={css.checkBox}></span><span className={css.checkText}>{f}</span></label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div id="sec_website" className={`${css.formSection} ${css.dynamicSection} ${visibleSection === "sec_website" ? css.visible : ""}`}>
            <div className={css.sectionHeader}><div className={css.sectionNum}>04</div><div className={css.sectionTitle}>Website Design & AI Details</div></div>
            <div className={css.fieldGrid}>
              <div className={css.field}><label>Website type</label><CustomSelect name="website_type" placeholder="Select website type" options={["Business brochure site","Lead generation website","eCommerce website","Portal / member area","Not sure yet"]} /></div>
              <div className={css.field}><label>Current website status</label><CustomSelect name="website_status" placeholder="Select status" options={["No website yet","Existing website needs redesign","Existing website needs AI upgrade","Complete rebuild needed"]} /></div>
              <div className={css.field}><label>Primary website objective</label><CustomSelect name="website_objective" placeholder="Select objective" options={["Generate leads","Increase sales","Improve customer support","Build brand credibility","Educate and inform users"]} /></div>
              <div className={css.field}><label>AI features needed</label><CustomSelect name="website_ai_features" placeholder="Select focus" options={["AI chatbot","Smart recommendations","Automated content support","Visitor behavior insights","Multiple AI features"]} /></div>
              <div className={`${css.field} ${css.span2}`}><label>Pages or functionality required</label>{renderFieldActions("website_requirements")}<textarea name="website_requirements" rows={3} placeholder="List pages, integrations, and any must-have functionality." /></div>
            </div>
          </div>

          <div id="sec_training" className={`${css.formSection} ${css.dynamicSection} ${visibleSection === "sec_training" ? css.visible : ""}`}>
            <div className={css.sectionHeader}><div className={css.sectionNum}>04</div><div className={css.sectionTitle}>Training Details</div></div>
            <div className={css.fieldGrid}>
              <div className={css.field}><label>People to train</label><CustomSelect name="training_size" placeholder="Select size" options={["1-5","6-15","16-30","30+"]} /></div>
              <div className={css.field}><label>Technical level</label><CustomSelect name="technical_level" placeholder="Select level" options={["Non-technical","Mixed","Technical"]} /></div>
              <div className={css.field}><label>Training format</label><CustomSelect name="training_format" placeholder="Select format" options={["In-person workshop","Virtual live session","Hybrid","Self-paced + coaching"]} /></div>
              <div className={css.field}><label>Primary objective</label><CustomSelect name="training_objective" placeholder="Select objective" options={["AI awareness and fundamentals","Productivity with AI tools","Role-specific AI workflows","Build internal AI capability"]} /></div>
              <div className={`${css.field} ${css.span2}`}><label>Topics of interest</label>{renderFieldActions("training_topics")}<textarea name="training_topics" rows={3} /></div>
            </div>
          </div>

          <div id="sec_speaking" className={`${css.formSection} ${css.dynamicSection} ${visibleSection === "sec_speaking" ? css.visible : ""}`}>
            <div className={css.sectionHeader}><div className={css.sectionNum}>04</div><div className={css.sectionTitle}>Speaking Engagement Details</div></div>
            <div className={css.fieldGrid}>
              <div className={css.field}><label>Audience type</label><CustomSelect name="speaking_audience" placeholder="Select audience" options={["Executive leadership","Management teams","Company-wide staff","External conference/event"]} /></div>
              <div className={css.field}><label>Primary topic</label><CustomSelect name="speaking_topic" placeholder="Select topic" options={["AI strategy for leaders","AI productivity and automation","AI risks, governance, and ethics","Industry-specific AI opportunities","Future of AI in business"]} /></div>
              <div className={css.field}><label>Preferred format</label><CustomSelect name="speaking_format" placeholder="Select format" options={["Keynote","Fireside chat","Panel discussion","Workshop session"]} /></div>
              <div className={css.field}><label>Estimated audience size</label><CustomSelect name="speaking_size" placeholder="Select audience size" options={["Under 25","25 - 100","100 - 500","500 - 1,000","1,000+"]} /></div>
              <div className={css.field}><label>Target date</label><input name="speaking_date" placeholder="e.g. 15 September 2026" /></div>
              <div className={`${css.field} ${css.span2}`}><label>What should the audience walk away with?</label>{renderFieldActions("speaking_outcome")}<textarea name="speaking_outcome" rows={3} /></div>
            </div>
          </div>

          <div id="sec_ediscovery" className={`${css.formSection} ${css.dynamicSection} ${visibleSection === "sec_ediscovery" ? css.visible : ""}`}>
            <div className={css.sectionHeader}><div className={css.sectionNum}>04</div><div className={css.sectionTitle}>eDiscovery & Forensic AI Details</div></div>
            <div className={css.fieldGrid}>
              <div className={css.field}><label>Matter type</label><CustomSelect name="ediscovery_matter" placeholder="Select matter type" options={["Internal investigation","Litigation support","Regulatory response","Fraud/risk investigation"]} /></div>
              <div className={css.field}><label>Data sources</label><CustomSelect name="ediscovery_sources" placeholder="Select primary source" options={["Email only","WhatsApp only","Email + WhatsApp","Mixed sources"]} /></div>
              <div className={css.field}><label>Estimated data volume</label><input name="ediscovery_volume" placeholder="e.g. 50 mailboxes, 20 GB exports" /></div>
              <div className={css.field}><label>Urgency</label><CustomSelect name="ediscovery_urgency" placeholder="Select urgency" options={["Immediate (0-7 days)","High (1-4 weeks)","Planned (1-3 months)"]} /></div>
              <div className={css.field}><label>Output required</label><CustomSelect name="ediscovery_output" placeholder="Select output" options={["Fact timeline","Relevant communication bundle","Risk and pattern report","All of the above"]} /></div>
              <div className={css.field}><label>Primary stakeholders</label><CustomSelect name="ediscovery_stakeholders" placeholder="Select stakeholders" options={["Legal team","Compliance / Risk","Executive team","External counsel"]} /></div>
              <div className={`${css.field} ${css.span2}`}><label>Key questions to answer</label>{renderFieldActions("ediscovery_questions")}<textarea name="ediscovery_questions" rows={3} placeholder="What should AI help surface, verify, or timeline?" /></div>
            </div>
          </div>

          <div id="sec_market" className={`${css.formSection} ${css.dynamicSection} ${visibleSection === "sec_market" ? css.visible : ""}`}>
            <div className={css.sectionHeader}><div className={css.sectionNum}>04</div><div className={css.sectionTitle}>Market Intelligence Details</div></div>
            <div className={css.fieldGrid}>
              <div className={css.field}><label>Primary focus</label><CustomSelect name="market_focus" placeholder="Select focus" options={["Competitor activity tracking","Pricing and offer changes","New product/service launches","Industry trend monitoring"]} /></div>
              <div className={css.field}><label>How many competitors should be tracked?</label><CustomSelect name="market_competitor_count" placeholder="Select range" options={["1 - 3","4 - 10","11 - 25","25+"]} /></div>
              <div className={css.field}><label>Reporting cadence</label><CustomSelect name="market_reporting_cadence" placeholder="Select cadence" options={["Weekly","Bi-weekly","Monthly","Real-time alerts + monthly summary"]} /></div>
              <div className={css.field}><label>Preferred report format</label><CustomSelect name="market_report_format" placeholder="Select format" options={["Executive summary","Detailed analyst report","Dashboard + summary","Email alerts"]} /></div>
              <div className={`${css.field} ${css.span2}`}><label>Key markets, competitors, or signals to monitor</label>{renderFieldActions("market_signals")}<textarea name="market_signals" rows={3} placeholder="List competitor names, product lines, regions, keywords, or risk signals." /></div>
            </div>
          </div>

          <div id="sec_other" className={`${css.formSection} ${css.dynamicSection} ${visibleSection === null && selectedService === "Other / Not Sure Yet" ? css.visible : ""}`}>
            <div className={css.sectionHeader}><div className={css.sectionNum}>04</div><div className={css.sectionTitle}>{tr("Tell Us More", "Vertel Ons Meer")}</div></div>
            <div className={css.field}>
              <label>{tr("What do you need help with?", "Waarmee het jy hulp nodig?")}</label>
              {renderFieldActions("other_details")}
              <textarea name="other_details" rows={4} />
            </div>
          </div>

          <div className={css.formSection}>
            <div className={css.sectionHeader}><div className={css.sectionNum}>05</div><div className={css.sectionTitle}>{tr("Timeline & Budget", "Tydlyn en Begroting")}</div></div>
            <div className={css.fieldGrid}>
              <div className={css.field}><label>{tr("Desired Start Date", "Gewenste Begindatum")}</label><CustomSelect name="start_date" placeholder={tr("Select desired start date", "Kies gewenste begindatum")} options={[tr("Immediately", "Onmiddellik"),tr("Within 1 month", "Binne 1 maand"),tr("1-3 months", "1-3 maande"),tr("Just exploring", "Net besig om te verken")]} /></div>
              <div className={css.field}><label>{tr("Estimated Budget Range (ZAR)", "Geskatte Begrotingsreeks (ZAR)")}</label><CustomSelect name="budget_range" placeholder={tr("Select budget range", "Kies begrotingsreeks")} options={[tr("Under R50k", "Onder R50k"),"R50k - R200k","R200k - R500k","R500k+",tr("Not sure", "Nie seker nie")]} /></div>
              <div className={css.field}><label>{tr("Ideal Completion / Implementation Date", "Ideale Voltooiing / Implementeringsdatum")}</label><CustomSelect name="ideal_completion_date" placeholder={tr("Select target completion window", "Kies teiken voltooiingsvenster")} options={[tr("Within 2 weeks", "Binne 2 weke"),tr("Within 1 month", "Binne 1 maand"),tr("1-3 months", "1-3 maande"),tr("3-6 months", "3-6 maande"),tr("6+ months", "6+ maande"),tr("No fixed date yet", "Nog geen vaste datum")]} /></div>
              <div className={css.field}><label>{tr("Number of Intended Users", "Aantal Beoogde Gebruikers")}</label><CustomSelect name="intended_users" placeholder={tr("Select user range", "Kies gebruikersreeks")} options={[tr("Single user", "Enkele gebruiker"),"2-10","10-50","50-200","200-1000",tr("1000's", "1000's")]} /></div>
              <div className={`${css.field} ${css.span2}`}><label>{tr("Anything else we should know?", "Enigiets anders wat ons moet weet?")}</label>{renderFieldActions("additional")}<textarea name="additional" rows={3} /></div>
            </div>
          </div>

          <div className={css.formSection}>
            <div className={css.submitArea}>
              <button className={css.submitBtn} disabled={submitting} type="submit"><span>{submitting ? tr("Submitting...", "Besig om in te dien...") : tr("Submit Project Brief →", "Dien Projek Opsomming In →")}</span></button>
              <p className={css.submitNote}>{tr("We will review your brief and respond within one business day.", "Ons sal jou opsomming hersien en binne een werksdag reageer.")}<br />{tr("Your information is confidential and will never be shared.", "Jou inligting is vertroulik en sal nooit gedeel word nie.")}</p>
              {error && <p style={{ color: "var(--color-accent-text)", margin: 0 }}>{error}</p>}
              {showBackHome && <a href="/" style={{ color: "var(--color-link)" }}>{tr("← Back", "← Terug")}</a>}
            </div>
          </div>
        </form>

        <div className={`${css.successMsg} ${submitted ? css.successVisible : ""}`}>
          <div className={css.successIcon}>✦</div>
          <h2>{tr("Brief Received", "Opsomming Ontvang")}</h2>
          <p>{tr("Thank you. We've received your project brief and will review it carefully.", "Dankie. Ons het jou projek opsomming ontvang en sal dit sorgvuldig hersien.")}<br />{tr("Expect a response within one business day.", "Verwag 'n reaksie binne een werksdag.")}</p>
        </div>
      </div>
    </div>
  );
}

function CustomSelect({
  name,
  placeholder,
  options,
  required = false,
  value,
  onChange
}: {
  name: string;
  placeholder: string;
  options: string[];
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);
  const selected = value ?? internalValue;

  useEffect(() => {
    const onDocClick = (event: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const choose = (next: string) => {
    if (value === undefined) setInternalValue(next);
    onChange?.(next);
    setOpen(false);
  };

  return (
    <div ref={wrapRef} className={css.customSelectWrap}>
      <input type="text" name={name} value={selected} readOnly required={required} className={css.customSelectHiddenInput} />
      <button
        type="button"
        className={css.customSelectTrigger}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{selected || placeholder}</span>
        <span className={css.customSelectCaret}>▾</span>
      </button>
      {open && (
        <div className={css.customSelectMenu} role="listbox">
          <button type="button" className={css.customSelectItemMuted} onClick={() => choose("")}>
            {placeholder}
          </button>
          {options.map((option) => (
            <button
              key={`${name}-${option}`}
              type="button"
              className={`${css.customSelectItem} ${selected === option ? css.customSelectItemActive : ""}`}
              onClick={() => choose(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

