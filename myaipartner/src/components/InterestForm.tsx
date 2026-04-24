"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import css from "@/components/InterestForm.module.css";

const services = [
  { id: "svc_consulting", value: "AI Strategy & Consulting", icon: "🧠", desc: "Roadmap, opportunity assessment, AI adoption planning" },
  { id: "svc_automation", value: "Business Process Automation", icon: "⚙️", desc: "Automate repetitive workflows with AI and APIs" },
  { id: "svc_software", value: "Custom Software Development", icon: "💻", desc: "Web platforms, dashboards, portals, internal tools" },
  { id: "svc_app", value: "Mobile & Desktop App Development", icon: "📱", desc: "Android, iOS, PWA, cross-platform desktop apps" },
  { id: "svc_training", value: "AI Training & Workforce Enablement", icon: "🎓", desc: "Train your team to use and build with AI" },
  { id: "svc_speaking", value: "Corporate AI Speaking & Executive Briefings", icon: "🎤", desc: "Business-focused AI talks, keynotes, and leadership briefings" },
  { id: "svc_ediscovery", value: "Forensic AI Email Investigation", icon: "⌕", desc: "Defensible AI querying across email and WhatsApp evidence" },
  { id: "svc_market", value: "Competitor & Market Intelligence", icon: "📈", desc: "Track competitors, pricing shifts, launches, and market signals" },
  { id: "svc_other", value: "Other / Not Sure Yet", icon: "💬", desc: "Tell us your problem and we'll advise" }
];

const appTypeOptions = ["Web Application", "Android App", "iOS App", "I don't know yet"];

const sectionMap: Record<string, string | null> = {
  "AI Strategy & Consulting": "sec_consulting",
  "Business Process Automation": "sec_automation",
  "Custom Software Development": "sec_app",
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

  useEffect(() => {
    return () => {
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
              <div className={css.field}><label>{tr("Industry", "Bedryf")} <span className={css.req}>*</span></label><select name="industry" required><option value="">{tr("Select your industry", "Kies jou bedryf")}</option><option>Agriculture</option><option>Architecture & Engineering</option><option>Automotive</option><option>Construction</option><option>Consulting Services</option><option>Education</option><option>Energy & Utilities</option><option>Financial Services & Fintech</option><option>Government & Public Sector</option><option>Healthcare & Medical</option><option>Hospitality & Tourism</option><option>Human Resources & Recruitment</option><option>Insurance</option><option>Legal Services</option><option>Logistics & Supply Chain</option><option>Manufacturing</option><option>Marketing & Advertising</option><option>Media & Entertainment</option><option>Mining</option><option>Nonprofit & NGO</option><option>Pharmaceuticals & Life Sciences</option><option>Professional Services</option><option>Property & Real Estate</option><option>Retail & eCommerce</option><option>Security & Risk Management</option><option>Technology & Software</option><option>Telecommunications</option><option>Transport</option><option>{tr("Other", "Ander")}</option></select></div>
            </div>
          </div>

          <div className={css.formSection}>
            <div className={css.sectionHeader}><div className={css.sectionNum}>02</div><div className={css.sectionTitle}>{tr("What Do You Need?", "Wat Het Jy Nodig?")}</div></div>
            <div className={css.field}>
              <label>{tr("Service Required", "Vereiste Diens")} <span className={css.req}>*</span></label>
              <select
                name="service"
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                required
              >
                <option value="">{tr("Select a service", "Kies 'n diens")}</option>
                {services.map((s) => (
                  <option key={s.id} value={s.value}>
                    {s.value}
                  </option>
                ))}
              </select>
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
              <div className={css.field}><label>Where are you in your AI journey?</label><select name="ai_maturity"><option value="">Select stage</option><option>Just starting</option><option>Exploring</option><option>Early adoption</option><option>Scaling</option></select></div>
              <div className={css.field}><label>Primary challenge</label><select name="challenge"><option value="">Select challenge</option><option>High operational costs</option><option>Too much manual work</option><option>Slow decision-making</option><option>Disconnected systems and data silos</option><option>Poor visibility into performance metrics</option><option>Low productivity across teams</option><option>Inconsistent customer experience</option><option>Difficulty scaling operations</option><option>Skills gap for AI adoption</option><option>Compliance and governance concerns</option><option>Legacy systems limiting innovation</option><option>Other</option></select></div>
              <div className={css.field}><label>Strategic priority</label><select name="consulting_priority"><option value="">Select priority</option><option>Cost reduction</option><option>Revenue growth</option><option>Customer experience</option><option>Operational efficiency</option><option>Risk and compliance</option><option>Faster decision-making</option><option>Digital transformation</option><option>Process standardization</option><option>Product / service innovation</option><option>Workforce productivity</option><option>Improved reporting and analytics</option><option>Market expansion</option><option>Other</option></select></div>
              <div className={css.field}><label>Who will be involved in decisions?</label><select name="decision_stakeholders"><option value="">Select stakeholders</option><option>Founder / Owner</option><option>Executive team</option><option>Department heads</option><option>Mixed stakeholders</option></select></div>
              <div className={`${css.field} ${css.span2}`}><label>Current tech stack</label>{renderFieldActions("tech_stack")}<input name="tech_stack" /></div>
            </div>
          </div>

          <div id="sec_automation" className={`${css.formSection} ${css.dynamicSection} ${visibleSection === "sec_automation" ? css.visible : ""}`}>
            <div className={css.sectionHeader}><div className={css.sectionNum}>04</div><div className={css.sectionTitle}>Automation Details</div></div>
            <div className={`${css.fieldGrid} ${css.one}`}>
              <div className={css.field}><label>Current manual process</label>{renderFieldActions("current_process")}<textarea name="current_process" rows={4} /></div>
              <div className={css.field}><label>Tools involved</label>{renderFieldActions("tools_involved")}<input name="tools_involved" /></div>
              <div className={css.field}><label>Process frequency</label><select name="process_frequency"><option value="">Select frequency</option><option>Multiple times daily</option><option>Daily</option><option>Weekly</option><option>Monthly</option></select></div>
              <div className={css.field}><label>Approximate process volume</label><select name="automation_volume"><option value="">Select volume</option><option>Under 100 items/month</option><option>100 - 1,000 items/month</option><option>1,000 - 10,000 items/month</option><option>10,000+ items/month</option></select></div>
              <div className={css.field}><label>Urgency</label><select name="automation_urgency"><option value="">Select urgency</option><option>Immediate</option><option>Within this quarter</option><option>Within 6 months</option><option>Exploring only</option></select></div>
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
              <div className={css.field}><label>Primary Users</label><select name="app_users"><option value="">Who will use it?</option><option>Internal staff only</option><option>Customers / clients</option></select></div>
              <div className={css.field}><label>Expected Number of Users</label><select name="expected_users"><option value="">Select range</option><option>1</option><option>2-10</option><option>10-50</option><option>50-100</option><option>100-200</option><option>200+</option><option>1000&apos;s</option></select></div>
              <div className={css.field}><label>Deployment preference</label><select name="deployment_preference"><option value="">Select preference</option><option>Web only</option><option>Mobile only</option><option>Web + Mobile</option><option>Desktop app</option><option>Not sure yet</option></select></div>
              <div className={css.field}><label>Data sensitivity / compliance</label><select name="compliance_needs"><option value="">Select level</option><option>Standard business data</option><option>Confidential customer data</option><option>Regulated data (POPIA/other)</option><option>Unsure</option></select></div>
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

          <div id="sec_training" className={`${css.formSection} ${css.dynamicSection} ${visibleSection === "sec_training" ? css.visible : ""}`}>
            <div className={css.sectionHeader}><div className={css.sectionNum}>04</div><div className={css.sectionTitle}>Training Details</div></div>
            <div className={css.fieldGrid}>
              <div className={css.field}><label>People to train</label><select name="training_size"><option value="">Select size</option><option>1-5</option><option>6-15</option><option>16-30</option><option>30+</option></select></div>
              <div className={css.field}><label>Technical level</label><select name="technical_level"><option value="">Select level</option><option>Non-technical</option><option>Mixed</option><option>Technical</option></select></div>
              <div className={css.field}><label>Training format</label><select name="training_format"><option value="">Select format</option><option>In-person workshop</option><option>Virtual live session</option><option>Hybrid</option><option>Self-paced + coaching</option></select></div>
              <div className={css.field}><label>Primary objective</label><select name="training_objective"><option value="">Select objective</option><option>AI awareness and fundamentals</option><option>Productivity with AI tools</option><option>Role-specific AI workflows</option><option>Build internal AI capability</option></select></div>
              <div className={`${css.field} ${css.span2}`}><label>Topics of interest</label>{renderFieldActions("training_topics")}<textarea name="training_topics" rows={3} /></div>
            </div>
          </div>

          <div id="sec_speaking" className={`${css.formSection} ${css.dynamicSection} ${visibleSection === "sec_speaking" ? css.visible : ""}`}>
            <div className={css.sectionHeader}><div className={css.sectionNum}>04</div><div className={css.sectionTitle}>Speaking Engagement Details</div></div>
            <div className={css.fieldGrid}>
              <div className={css.field}><label>Audience type</label><select name="speaking_audience"><option value="">Select audience</option><option>Executive leadership</option><option>Management teams</option><option>Company-wide staff</option><option>External conference/event</option></select></div>
              <div className={css.field}><label>Primary topic</label><select name="speaking_topic"><option value="">Select topic</option><option>AI strategy for leaders</option><option>AI productivity and automation</option><option>AI risks, governance, and ethics</option><option>Industry-specific AI opportunities</option><option>Future of AI in business</option></select></div>
              <div className={css.field}><label>Preferred format</label><select name="speaking_format"><option value="">Select format</option><option>Keynote</option><option>Fireside chat</option><option>Panel discussion</option><option>Workshop session</option></select></div>
              <div className={css.field}><label>Estimated audience size</label><select name="speaking_size"><option value="">Select audience size</option><option>Under 25</option><option>25 - 100</option><option>100 - 500</option><option>500 - 1,000</option><option>1,000+</option></select></div>
              <div className={css.field}><label>Target date</label><input name="speaking_date" placeholder="e.g. 15 September 2026" /></div>
              <div className={`${css.field} ${css.span2}`}><label>What should the audience walk away with?</label>{renderFieldActions("speaking_outcome")}<textarea name="speaking_outcome" rows={3} /></div>
            </div>
          </div>

          <div id="sec_ediscovery" className={`${css.formSection} ${css.dynamicSection} ${visibleSection === "sec_ediscovery" ? css.visible : ""}`}>
            <div className={css.sectionHeader}><div className={css.sectionNum}>04</div><div className={css.sectionTitle}>eDiscovery & Forensic AI Details</div></div>
            <div className={css.fieldGrid}>
              <div className={css.field}><label>Matter type</label><select name="ediscovery_matter"><option value="">Select matter type</option><option>Internal investigation</option><option>Litigation support</option><option>Regulatory response</option><option>Fraud/risk investigation</option></select></div>
              <div className={css.field}><label>Data sources</label><select name="ediscovery_sources"><option value="">Select primary source</option><option>Email only</option><option>WhatsApp only</option><option>Email + WhatsApp</option><option>Mixed sources</option></select></div>
              <div className={css.field}><label>Estimated data volume</label><input name="ediscovery_volume" placeholder="e.g. 50 mailboxes, 20 GB exports" /></div>
              <div className={css.field}><label>Urgency</label><select name="ediscovery_urgency"><option value="">Select urgency</option><option>Immediate (0-7 days)</option><option>High (1-4 weeks)</option><option>Planned (1-3 months)</option></select></div>
              <div className={css.field}><label>Output required</label><select name="ediscovery_output"><option value="">Select output</option><option>Fact timeline</option><option>Relevant communication bundle</option><option>Risk and pattern report</option><option>All of the above</option></select></div>
              <div className={css.field}><label>Primary stakeholders</label><select name="ediscovery_stakeholders"><option value="">Select stakeholders</option><option>Legal team</option><option>Compliance / Risk</option><option>Executive team</option><option>External counsel</option></select></div>
              <div className={`${css.field} ${css.span2}`}><label>Key questions to answer</label>{renderFieldActions("ediscovery_questions")}<textarea name="ediscovery_questions" rows={3} placeholder="What should AI help surface, verify, or timeline?" /></div>
            </div>
          </div>

          <div id="sec_market" className={`${css.formSection} ${css.dynamicSection} ${visibleSection === "sec_market" ? css.visible : ""}`}>
            <div className={css.sectionHeader}><div className={css.sectionNum}>04</div><div className={css.sectionTitle}>Market Intelligence Details</div></div>
            <div className={css.fieldGrid}>
              <div className={css.field}><label>Primary focus</label><select name="market_focus"><option value="">Select focus</option><option>Competitor activity tracking</option><option>Pricing and offer changes</option><option>New product/service launches</option><option>Industry trend monitoring</option></select></div>
              <div className={css.field}><label>How many competitors should be tracked?</label><select name="market_competitor_count"><option value="">Select range</option><option>1 - 3</option><option>4 - 10</option><option>11 - 25</option><option>25+</option></select></div>
              <div className={css.field}><label>Reporting cadence</label><select name="market_reporting_cadence"><option value="">Select cadence</option><option>Weekly</option><option>Bi-weekly</option><option>Monthly</option><option>Real-time alerts + monthly summary</option></select></div>
              <div className={css.field}><label>Preferred report format</label><select name="market_report_format"><option value="">Select format</option><option>Executive summary</option><option>Detailed analyst report</option><option>Dashboard + summary</option><option>Email alerts</option></select></div>
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
              <div className={css.field}><label>{tr("Desired Start Date", "Gewenste Begindatum")}</label><select name="start_date"><option value="">{tr("Select desired start date", "Kies gewenste begindatum")}</option><option>{tr("Immediately", "Onmiddellik")}</option><option>{tr("Within 1 month", "Binne 1 maand")}</option><option>{tr("1-3 months", "1-3 maande")}</option><option>{tr("Just exploring", "Net besig om te verken")}</option></select></div>
              <div className={css.field}><label>{tr("Estimated Budget Range (ZAR)", "Geskatte Begrotingsreeks (ZAR)")}</label><select name="budget_range"><option value="">{tr("Select budget range", "Kies begrotingsreeks")}</option><option>{tr("Under R50k", "Onder R50k")}</option><option>R50k - R200k</option><option>R200k - R500k</option><option>R500k+</option><option>{tr("Not sure", "Nie seker nie")}</option></select></div>
              <div className={css.field}><label>{tr("Ideal Completion / Implementation Date", "Ideale Voltooiing / Implementeringsdatum")}</label><select name="ideal_completion_date"><option value="">{tr("Select target completion window", "Kies teiken voltooiingsvenster")}</option><option>{tr("Within 2 weeks", "Binne 2 weke")}</option><option>{tr("Within 1 month", "Binne 1 maand")}</option><option>{tr("1-3 months", "1-3 maande")}</option><option>{tr("3-6 months", "3-6 maande")}</option><option>{tr("6+ months", "6+ maande")}</option><option>{tr("No fixed date yet", "Nog geen vaste datum")}</option></select></div>
              <div className={css.field}><label>{tr("Number of Intended Users", "Aantal Beoogde Gebruikers")}</label><select name="intended_users"><option value="">{tr("Select user range", "Kies gebruikersreeks")}</option><option>{tr("Single user", "Enkele gebruiker")}</option><option>2-10</option><option>10-50</option><option>50-200</option><option>200-1000</option><option>{tr("1000's", "1000's")}</option></select></div>
              <div className={`${css.field} ${css.span2}`}><label>{tr("Anything else we should know?", "Enigiets anders wat ons moet weet?")}</label>{renderFieldActions("additional")}<textarea name="additional" rows={3} /></div>
            </div>
          </div>

          <div className={css.formSection}>
            <div className={css.submitArea}>
              <button className={css.submitBtn} disabled={submitting} type="submit"><span>{submitting ? tr("Submitting...", "Besig om in te dien...") : tr("Submit Project Brief →", "Dien Projek Opsomming In →")}</span></button>
              <p className={css.submitNote}>{tr("We will review your brief and respond within one business day.", "Ons sal jou opsomming hersien en binne een werksdag reageer.")}<br />{tr("Your information is confidential and will never be shared.", "Jou inligting is vertroulik en sal nooit gedeel word nie.")}</p>
              {error && <p style={{ color: "#ff4d6d", margin: 0 }}>{error}</p>}
              {showBackHome && <a href="/" style={{ color: "#00e5ff" }}>{tr("← Back", "← Terug")}</a>}
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

