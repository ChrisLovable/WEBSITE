import { NextRequest, NextResponse } from "next/server";

const FIELD_GUIDANCE: Record<string, string> = {
  first_name: "Return only the person's first name. Correct capitalization. No extra words or punctuation.",
  last_name: "Return only the person's surname. Correct capitalization. No extra words or punctuation.",
  company: "Return only the company or organisation name in natural title case.",
  email: "Return only a valid email address in lowercase with no spaces. Convert spoken forms like 'at' and 'dot'.",
  phone:
    "Return only a phone number. Keep leading + when present. Remove unrelated text. For South African local numbers starting with 0 and 10 digits, convert to +27 format.",
  description:
    "Return a clear, natural paragraph that preserves the user's meaning and important details for a project brief.",
  outcome:
    "Return a clear statement of the desired business outcome, preserving the user's intent and specifics.",
  additional:
    "Return a clear, concise note of additional context. Preserve specific names, numbers, and commitments.",
};

function getLanguageName(languageCode: string) {
  return languageCode === "afr" ? "Afrikaans" : "English";
}

function getFieldGuidance(fieldName: string) {
  if (FIELD_GUIDANCE[fieldName]) return FIELD_GUIDANCE[fieldName];
  if (fieldName.includes("date")) return "Return only the date information exactly as intended by the speaker.";
  if (fieldName.includes("email")) return FIELD_GUIDANCE.email;
  if (fieldName.includes("phone")) return FIELD_GUIDANCE.phone;
  if (fieldName.includes("name")) return "Return only the name text with correct capitalization.";
  return "Return clean, natural text that preserves meaning and important details.";
}

async function refineTranscript(
  text: string,
  languageCode: string,
  fieldName: string,
  currentValue: string
) {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey || !text.trim()) return text;

  const languageName = getLanguageName(languageCode);
  const guidance = getFieldGuidance(fieldName);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.1,
        messages: [
          {
            role: "system",
            content:
              "You are a speech-to-text correction assistant for web forms. Improve transcript quality while preserving meaning. Never invent facts. Keep numbers, names, and entities accurate. Return only final corrected text with no commentary.",
          },
          {
            role: "user",
            content: `Language: ${languageName}
Field name: ${fieldName || "(unknown)"}
Existing field value (context only): ${currentValue || "(empty)"}

Rules:
1) Output must be in ${languageName}, unless field format requires symbols (email/phone/date).
2) Apply field-specific formatting strictly.
3) Keep the original intent and factual content.
4) If uncertain about a word, choose the most plausible option from context and keep output concise.
5) Do not add explanations.

Field instruction:
${guidance}

Raw transcript:
${text}`,
          },
        ],
      }),
    });

    if (!response.ok) return text;
    const data = await response.json();
    const refined = String(data?.choices?.[0]?.message?.content || "")
      .replace(/^["']|["']$/g, "")
      .trim();
    return refined || text;
  } catch {
    return text;
  }
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server STT key not configured." },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const audio = formData.get("audio") as File;
    const rawLanguage = ((formData.get("language") as string) || "af").toLowerCase();
    const fieldName = String(formData.get("fieldName") || "").trim();
    const currentValue = String(formData.get("currentValue") || "").trim();
    const languageMap: Record<string, string> = {
      en: "eng",
      eng: "eng",
      af: "afr",
      afr: "afr",
    };
    const language = languageMap[rawLanguage];

    if (!audio) {
      return NextResponse.json({ error: "No audio file" }, { status: 400 });
    }
    if (!language) {
      return NextResponse.json({ error: `Unsupported language: ${rawLanguage}` }, { status: 400 });
    }

    const elFormData = new FormData();
    elFormData.append("file", audio, "recording.webm");
    elFormData.append("model_id", "scribe_v1");
    elFormData.append("language_code", language);

    const response = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
      },
      body: elFormData,
    });

    if (!response.ok) {
      const errText = await response.text();
      let message = errText || "Transcription failed";
      try {
        const parsed = JSON.parse(errText);
        message =
          parsed?.detail?.message ||
          parsed?.error?.message ||
          parsed?.message ||
          message;
      } catch {
        // Keep raw text when provider response is not JSON.
      }
      return NextResponse.json({ error: message }, { status: response.status });
    }

    const data = await response.json();
    const transcript = String(data.text || "").trim();
    if (!transcript) return NextResponse.json({ transcript: "" });

    const refined = await refineTranscript(transcript, language, fieldName, currentValue);
    return NextResponse.json({ transcript: refined });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Transcription failed" },
      { status: 500 }
    );
  }
}
