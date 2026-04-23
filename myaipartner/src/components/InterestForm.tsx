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

const sectionMap: Record<string, string | null> = {
  "AI Strategy & Consulting": "sec_consulting",
  "Business Process Automation": "sec_automation",
  "Custom Software Development": "sec_app",
  "Mobile & Desktop App Development": "sec_app",
  "AI Training & Workforce Enablement": "sec_training",
  "Corporate AI Speaking & Executive Briefings": "sec_speaking",
  "Forensic AI Email Investigation": "sec_ediscovery",
  "Competitor & Market Intelligence": null,
  "Other / Not Sure Yet": null
};

export default function InterestForm({ showBackHome = false }: { showBackHome?: boolean }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedService, setSelectedService] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sttListening, setSttListening] = useState(false);
  const [sttError, setSttError] = useState<string | null>(null);
  const [sttLanguage, setSttLanguage] = useState<"af-ZA" | "en-ZA">("en-ZA");
  const [activeField, setActiveField] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mobileStreamRef = useRef<MediaStream | null>(null);
  const isTranscribingRef = useRef(false);
  const mobileTranscribeTailRef = useRef<Promise<void>>(Promise.resolve());
  const mobileSessionSeqRef = useRef(0);
  const mobileActiveSessionRef = useRef<number | null>(null);
  const mobileCommittedSessionsRef = useRef<Set<number>>(new Set());
  const mobileLastCommittedTextRef = useRef<Record<string, string>>({});
  const finalizedIndicesRef = useRef<Set<number>>(new Set());
  const finalizedTextRef = useRef<Record<string, string>>({});

  const visibleSection = useMemo(() => sectionMap[selectedService] ?? null, [selectedService]);

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const navLang = (navigator.language || "").toLowerCase();
    setSttLanguage(navLang.startsWith("af") ? "af-ZA" : "en-ZA");
  }, []);

  useEffect(() => {
    return () => {
      try {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
          mediaRecorderRef.current.stop();
        }
      } catch {
        // no-op cleanup guard
      }
      mobileStreamRef.current?.getTracks().forEach((track) => track.stop());
      mobileStreamRef.current = null;
    };
  }, []);

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
      service: selectedService
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

  const appendToField = (fieldName: string, text: string) => {
    const field = formRef.current?.querySelector<HTMLInputElement | HTMLTextAreaElement>(
      `[name="${fieldName}"]`
    );
    if (!field) return;
    const cleanedText = text.replace(/\s+/g, " ").trim();
    if (!cleanedText) return;
    const previous = field.value.trim();
    const needsSentenceStart =
      previous.length === 0 || /[.!?]\s*$/.test(previous);

    const formattedText = needsSentenceStart
      ? cleanedText.charAt(0).toUpperCase() + cleanedText.slice(1)
      : cleanedText.charAt(0).toLowerCase() + cleanedText.slice(1);

    const spacer = previous && !/\s$/.test(field.value) ? " " : "";
    field.value = `${field.value}${spacer}${formattedText}`.trim();
  };

  const clearField = (fieldName: string) => {
    const field = formRef.current?.querySelector<HTMLInputElement | HTMLTextAreaElement>(
      `[name="${fieldName}"]`
    );
    if (!field) return;
    field.value = "";
  };

  const isMobile = () =>
    typeof navigator !== "undefined" &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const startMobileRecording = async (fieldName: string) => {
    if (isTranscribingRef.current || mediaRecorderRef.current) return;
    setSttError(null);

    try {
      if (typeof MediaRecorder === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        setSttError("Speech-to-text is not supported in this browser.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";
      const transcribeBlob = async (blob: Blob) => {
        if (!blob || blob.size < 1800) return;
        isTranscribingRef.current = true;
        try {
          const formData = new FormData();
          formData.append("audio", new File([blob], "recording.webm", { type: mimeType }));
          formData.append("language", sttLanguage.startsWith("af") ? "af" : "en");

          const response = await fetch("/api/transcribe", {
            method: "POST",
            body: formData,
          });
          const data = await response.json();
          if (!response.ok) throw new Error(data?.error || "Transcription failed");

          const transcript = String(data?.transcript || "").trim();
          if (transcript) {
            const normalizedTranscript = transcript.replace(/\s+/g, " ").trim().toLowerCase();
            const previousNormalized = (mobileLastCommittedTextRef.current[fieldName] || "").toLowerCase();
            if (normalizedTranscript && normalizedTranscript !== previousNormalized) {
              mobileLastCommittedTextRef.current[fieldName] = normalizedTranscript;
              appendToField(fieldName, transcript);
            }
          }
        } catch (err: unknown) {
          setSttError(err instanceof Error ? err.message : "Transcription failed");
        } finally {
          isTranscribingRef.current = false;
        }
      };

      const recorder = new MediaRecorder(stream, { mimeType });
      const sessionId = ++mobileSessionSeqRef.current;
      const sessionChunks: Blob[] = [];
      mobileStreamRef.current = stream;
      mobileActiveSessionRef.current = sessionId;

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          sessionChunks.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const chunksSnapshot = sessionChunks.slice();
        mobileStreamRef.current?.getTracks().forEach((track) => track.stop());
        mobileStreamRef.current = null;
        mediaRecorderRef.current = null;
        if (mobileActiveSessionRef.current === sessionId) {
          mobileActiveSessionRef.current = null;
        }
        if (mobileCommittedSessionsRef.current.has(sessionId)) return;
        mobileCommittedSessionsRef.current.add(sessionId);

        const blob = new Blob(chunksSnapshot, { type: mimeType });
        const job = mobileTranscribeTailRef.current.then(async () => {
          await transcribeBlob(blob);
        });
        mobileTranscribeTailRef.current = job.catch(() => {});
        await job;
      };

      recorder.onerror = () => {
        setSttListening(false);
        setActiveField(null);
        setSttError("Could not capture audio. Please check microphone permissions.");
      };

      mediaRecorderRef.current = recorder;
      setSttListening(true);
      setActiveField(fieldName);
      recorder.start();
    } catch {
      setSttListening(false);
      setActiveField(null);
      setSttError("Could not capture audio. Please check microphone permissions.");
    }
  };

  const toggleStt = (fieldName: string) => {
    if (typeof window === "undefined") return;

    if (isMobile()) {
      if (sttListening && mediaRecorderRef.current && activeField !== fieldName) {
        return;
      }
      if (sttListening && mediaRecorderRef.current && activeField === fieldName) {
        mediaRecorderRef.current.stop();
        setSttListening(false);
        setActiveField(null);
        return;
      }
      startMobileRecording(fieldName);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSttError("Speech-to-text is not supported in this browser.");
      return;
    }

    if (sttListening && recognitionRef.current && activeField === fieldName) {
      recognitionRef.current.stop();
      return;
    }

    setSttError(null);
    const recognition = new SpeechRecognition();
    recognition.lang = sttLanguage;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setSttListening(true);
      setActiveField(fieldName);
    };
    recognition.onend = () => {
      // Reset Set on each session end so new session indices aren't blocked
      finalizedIndicesRef.current = new Set();
      setSttListening(false);
      setActiveField(null);
    };
    recognition.onerror = (event: any) => {
      if (event.error === 'no-speech' || event.error === 'audio-capture') return;
      setSttListening(false);
      setSttError("Could not capture audio. Please check microphone permissions.");
    };
    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      let newFinalText = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const segment = event.results[i][0].transcript || "";
        if (event.results[i].isFinal) {
          if (!finalizedIndicesRef.current.has(i)) {
            newFinalText += segment + " ";
            finalizedIndicesRef.current.add(i);
          }
        } else {
          interimTranscript += segment;
        }
      }

      if (newFinalText.trim()) {
        finalizedTextRef.current[fieldName] =
          ((finalizedTextRef.current[fieldName] || "") + newFinalText).trimEnd();
        appendToField(fieldName, newFinalText.trim());
      }
    };

    recognitionRef.current = recognition;
    finalizedIndicesRef.current = new Set();
    finalizedTextRef.current[fieldName] = "";
    recognition.start();
  };

  const renderFieldActions = (fieldName: string) => (
    <div className={css.sttRow}>
      <button
        type="button"
        className={`${css.sttBtn} ${sttListening && activeField === fieldName ? css.sttBtnActive : ""}`}
        onClick={() => toggleStt(fieldName)}
      >
        {sttListening && activeField === fieldName ? "Stop Speech to Text" : "Start Speech to Text"}
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
            ← Back
          </button>
        )}
        <h1>Let&apos;s Build Something<br /><span>Intelligent</span></h1>
        <p>Tell us about your project. We&apos;ll review your brief and respond within one business day with a proposed approach and next steps.</p>
      </div>

      <div className={css.formWrap}>
        <form ref={formRef} onSubmit={handleSubmit} style={{ display: submitted ? "none" : "block" }}>
          <div className={css.formSection}>
            <div className={css.field}>
              <label>Speech to Text Language</label>
              <select value={sttLanguage} onChange={(e) => setSttLanguage(e.target.value as "af-ZA" | "en-ZA")}>
                <option value="af-ZA">Afrikaans (South Africa)</option>
                <option value="en-ZA">English (South Africa)</option>
              </select>
            </div>
          </div>
          <div className={css.formSection}>
            <div className={css.sectionHeader}><div className={css.sectionNum}>01</div><div className={css.sectionTitle}>Your Information</div></div>
            <div className={css.fieldGrid}>
              <div className={css.field}><label>First Name <span className={css.req}>*</span></label>{renderFieldActions("first_name")}<input name="first_name" required /></div>
              <div className={css.field}><label>Last Name <span className={css.req}>*</span></label>{renderFieldActions("last_name")}<input name="last_name" required /></div>
              <div className={css.field}><label>Email Address <span className={css.req}>*</span></label>{renderFieldActions("email")}<input type="email" name="email" required /></div>
              <div className={css.field}><label>Phone / WhatsApp <span className={css.req}>*</span></label>{renderFieldActions("phone")}<input name="phone" required /></div>
              <div className={css.field}><label>Company / Organisation <span className={css.req}>*</span></label>{renderFieldActions("company")}<input name="company" required /></div>
              <div className={css.field}><label>Industry <span className={css.req}>*</span></label><select name="industry" required><option value="">Select your industry</option><option>Technology & Software</option><option>Financial Services & Fintech</option><option>Healthcare & Medical</option><option>Retail & eCommerce</option><option>Other</option></select></div>
            </div>
          </div>

          <div className={css.formSection}>
            <div className={css.sectionHeader}><div className={css.sectionNum}>02</div><div className={css.sectionTitle}>What Do You Need?</div></div>
            <div className={css.serviceGrid}>
              {services.map((s) => (
                <div key={s.id}>
                  <input
                    id={s.id}
                    className={css.serviceOption}
                    type="radio"
                    name="service"
                    checked={selectedService === s.value}
                    onChange={() => setSelectedService(s.value)}
                  />
                  <label htmlFor={s.id} className={css.serviceLabel}>
                    <span className={css.serviceIconWrap}>
                      <span className={css.serviceIcon}>{s.icon}</span>
                    </span>
                    <span className={css.serviceName}>{s.value}</span>
                    <span className={css.serviceDesc}>{s.desc}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className={css.formSection}>
            <div className={css.sectionHeader}><div className={css.sectionNum}>03</div><div className={css.sectionTitle}>Project Brief</div></div>
            <div className={`${css.fieldGrid} ${css.one}`}>
              <div className={css.field}>
                <label>Describe Your Project / Problem <span className={css.req}>*</span></label>
                {renderFieldActions("description")}
                <textarea name="description" required rows={5} />
              </div>
              <div className={css.field}>
                <label>What outcome are you trying to achieve?</label>
                {renderFieldActions("outcome")}
                <textarea name="outcome" rows={3} />
              </div>
            </div>
          </div>

          <div id="sec_consulting" className={`${css.formSection} ${css.dynamicSection} ${visibleSection === "sec_consulting" ? css.visible : ""}`}>
            <div className={css.sectionHeader}><div className={css.sectionNum}>04</div><div className={css.sectionTitle}>Consulting Details</div></div>
            <div className={css.fieldGrid}>
              <div className={css.field}><label>Where are you in your AI journey?</label><select name="ai_maturity"><option value="">Select stage</option><option>Just starting</option><option>Exploring</option><option>Early adoption</option><option>Scaling</option></select></div>
              <div className={css.field}><label>Primary challenge</label><select name="challenge"><option value="">Select challenge</option><option>High operational costs</option><option>Too much manual work</option><option>Slow decision-making</option></select></div>
              <div className={`${css.field} ${css.span2}`}><label>Current tech stack</label>{renderFieldActions("tech_stack")}<input name="tech_stack" /></div>
            </div>
          </div>

          <div id="sec_automation" className={`${css.formSection} ${css.dynamicSection} ${visibleSection === "sec_automation" ? css.visible : ""}`}>
            <div className={css.sectionHeader}><div className={css.sectionNum}>04</div><div className={css.sectionTitle}>Automation Details</div></div>
            <div className={`${css.fieldGrid} ${css.one}`}>
              <div className={css.field}><label>Current manual process</label>{renderFieldActions("current_process")}<textarea name="current_process" rows={4} /></div>
              <div className={css.field}><label>Tools involved</label>{renderFieldActions("tools_involved")}<input name="tools_involved" /></div>
              <div className={css.field}><label>Process frequency</label><select name="process_frequency"><option value="">Select frequency</option><option>Daily</option><option>Weekly</option><option>Monthly</option></select></div>
            </div>
          </div>

          <div id="sec_app" className={`${css.formSection} ${css.dynamicSection} ${visibleSection === "sec_app" ? css.visible : ""}`}>
            <div className={css.sectionHeader}><div className={css.sectionNum}>04</div><div className={css.sectionTitle}>App / Software Details</div></div>
            <div className={css.fieldGrid}>
              <div className={css.field}><label>Type of Application</label><select name="app_type"><option value="">Select type</option><option>Web Application</option><option>Android App</option><option>iOS App</option><option>I don't know yet</option></select></div>
              <div className={css.field}><label>Primary Users</label><select name="app_users"><option value="">Who will use it?</option><option>Internal staff only</option><option>Customers / clients</option></select></div>
              <div className={css.field}><label>Expected Number of Users</label><select name="expected_users"><option value="">Select range</option><option>1</option><option>2-10</option><option>10-50</option><option>50-100</option><option>100-200</option><option>200+</option><option>1000&apos;s</option></select></div>
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
              <div className={`${css.field} ${css.span2}`}><label>Topics of interest</label>{renderFieldActions("training_topics")}<textarea name="training_topics" rows={3} /></div>
            </div>
          </div>

          <div id="sec_speaking" className={`${css.formSection} ${css.dynamicSection} ${visibleSection === "sec_speaking" ? css.visible : ""}`}>
            <div className={css.sectionHeader}><div className={css.sectionNum}>04</div><div className={css.sectionTitle}>Speaking Engagement Details</div></div>
            <div className={css.fieldGrid}>
              <div className={css.field}><label>Audience type</label><select name="speaking_audience"><option value="">Select audience</option><option>Executive leadership</option><option>Management teams</option><option>Company-wide staff</option><option>External conference/event</option></select></div>
              <div className={css.field}><label>Preferred format</label><select name="speaking_format"><option value="">Select format</option><option>Keynote</option><option>Fireside chat</option><option>Panel discussion</option><option>Workshop session</option></select></div>
              <div className={css.field}><label>Estimated audience size</label><input name="speaking_size" /></div>
              <div className={css.field}><label>Target date</label><input name="speaking_date" /></div>
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
              <div className={`${css.field} ${css.span2}`}><label>Key questions to answer</label>{renderFieldActions("ediscovery_questions")}<textarea name="ediscovery_questions" rows={3} placeholder="What should AI help surface, verify, or timeline?" /></div>
            </div>
          </div>

          <div id="sec_other" className={`${css.formSection} ${css.dynamicSection} ${visibleSection === null && selectedService === "Other / Not Sure Yet" ? css.visible : ""}`}>
            <div className={css.sectionHeader}><div className={css.sectionNum}>04</div><div className={css.sectionTitle}>Tell Us More</div></div>
            <div className={css.field}>
              <label>What do you need help with?</label>
              {renderFieldActions("other_details")}
              <textarea name="other_details" rows={4} />
            </div>
          </div>

          <div className={css.formSection}>
            <div className={css.sectionHeader}><div className={css.sectionNum}>05</div><div className={css.sectionTitle}>Timeline & Budget</div></div>
            <div className={css.fieldGrid}>
              <div className={css.field}><label>Desired Start Date</label><select name="start_date"><option value="">When do you want to start?</option><option>Immediately / ASAP</option><option>Within 1 month</option></select></div>
              <div className={css.field}><label>Estimated Budget (ZAR)</label><select name="budget"><option value="">Select budget range</option><option>Under R25,000</option><option>R25,000 – R75,000</option></select></div>
              <div className={`${css.field} ${css.span2}`}><label>Anything else we should know?</label>{renderFieldActions("additional")}<textarea name="additional" rows={3} /></div>
            </div>
          </div>

          <div className={css.formSection}>
            <div className={css.submitArea}>
              <button className={css.submitBtn} disabled={submitting} type="submit"><span>{submitting ? "Submitting..." : "Submit Project Brief →"}</span></button>
              <p className={css.submitNote}>We will review your brief and respond within one business day.<br />Your information is confidential and will never be shared.</p>
              {error && <p style={{ color: "#ff4d6d", margin: 0 }}>{error}</p>}
              {showBackHome && <a href="/" style={{ color: "#00e5ff" }}>← Back</a>}
            </div>
          </div>
        </form>

        <div className={`${css.successMsg} ${submitted ? css.successVisible : ""}`}>
          <div className={css.successIcon}>✦</div>
          <h2>Brief Received</h2>
          <p>Thank you. We&apos;ve received your project brief and will review it carefully.<br />Expect a response within one business day.</p>
        </div>
      </div>
    </div>
  );
}

