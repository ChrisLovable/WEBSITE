import { NextRequest, NextResponse } from "next/server";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const FIELD_GUIDANCE: Record<string, string> = {
  first_name: "Return only the person's first name. Keep the spoken wording, only fix obvious recognition mistakes and capitalization.",
  last_name: "Return only the person's surname. Keep the spoken wording, only fix obvious recognition mistakes and capitalization.",
  company: "Return only the company or organisation name. Keep original wording; only fix obvious transcription mistakes and casing.",
  email: "Return only a valid email address in lowercase with no spaces. Convert spoken forms like 'at' and 'dot'.",
  phone:
    "Return only a phone number. Keep leading + when present. Remove unrelated text. For South African local numbers starting with 0 and 10 digits, convert to +27 format.",
  description:
    "Return an intelligent, natural sentence/paragraph that reflects what the user intended. Correct obvious recognition errors while preserving meaning and key details.",
  outcome:
    "Return an intelligent, clear outcome statement from what the user said, preserving intent and important details.",
  additional:
    "Return a clear, intelligent version of the user's note while preserving meaning, names, numbers, and commitments.",
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
  return "Interpret the user's speech intelligently and return clear natural text that preserves meaning and important details.";
}

function getLanguageSpecificPrompt(languageCode: string) {
  if (languageCode === "afr") {
    return `Afrikaans correction rules:
- Prefer valid Afrikaans words over malformed/non-words.
- Fix split or hyphen-broken tokens (example: "te-eb" -> "te web" or context-appropriate correction).
- Preserve apostrophes and contractions like "'n".
- If a token looks invalid, choose the most plausible Afrikaans word from sentence context.

Afrikaans examples:
Input: Ek koor te-eb wat verhonder kan soek.
Output: Ek kort 'n app wat vir honde kan soek.

Input: Ek wil n app he wat kliende kan vind.
Output: Ek wil 'n app he wat kliente kan vind.`;
  }

  return `English correction rules:
- Prefer valid English words over malformed/non-words.
- Fix split words and punctuation issues using context.`;
}

function readLocalEnvValue(key: string) {
  try {
    const envPath = resolve(process.cwd(), "src/data/.env");
    if (!existsSync(envPath)) return undefined;
    const raw = readFileSync(envPath, "utf8");
    const lines = raw.split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx < 1) continue;
      const parsedKey = trimmed.slice(0, idx).trim();
      if (parsedKey !== key) continue;
      return trimmed.slice(idx + 1).trim();
    }
    return undefined;
  } catch {
    return undefined;
  }
}

function getEnvValue(key: string) {
  return process.env[key]?.trim() || readLocalEnvValue(key);
}

async function refineTranscript(
  text: string,
  languageCode: string,
  fieldName: string,
  currentValue: string
) {
  const apiKey = getEnvValue("OPENAI_API_KEY");
  if (!apiKey || !text.trim()) return text;

  const languageName = getLanguageName(languageCode);
  const guidance = getFieldGuidance(fieldName);
  const languageSpecificPrompt = getLanguageSpecificPrompt(languageCode);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0,
        messages: [
          {
            role: "system",
            content:
              "You are an intelligent speech-to-text correction assistant for web forms. Resolve obvious recognition mistakes and ambiguous words using context. Preserve intent and key facts. Do not invent facts. Return only the final corrected text.",
          },
          {
            role: "user",
            content: `Language: ${languageName}
Field name: ${fieldName || "(unknown)"}
Existing field value (context only): ${currentValue || "(empty)"}

Rules:
1) Output must be in ${languageName}, unless field format requires symbols (email/phone/date).
2) Apply field-specific formatting strictly.
3) Preserve the user's intended meaning and key facts.
4) You may correct malformed/non-words when context clearly indicates intended words.
5) Do not add facts the user did not say.
6) Do not add explanations.

Language-specific rules and examples:
${languageSpecificPrompt}

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

function deterministicCleanup(text: string) {
  return text
    .replace(/\s+/g, " ")
    .replace(/\s+([,.!?;:])/g, "$1")
    .trim();
}

function normalizeEmailDeterministic(value: string) {
  return value
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/\(at\)|\sat\s/gi, "@")
    .replace(/\(dot\)|\sdot\s/gi, ".");
}

function normalizePhoneDeterministic(value: string) {
  const keep = value.replace(/[^\d+\s()-]/g, "").trim();
  const digits = keep.replace(/[^\d]/g, "");
  if (!digits) return "";
  if (digits.startsWith("0") && digits.length === 10) return `+27${digits.slice(1)}`;
  if (digits.startsWith("27") && digits.length >= 11) return `+${digits}`;
  return keep.includes("+") ? `+${digits}` : digits;
}

function shouldUseAiRefinement(languageCode: string, fieldName: string) {
  const strictFields = new Set(["email", "phone"]);
  if (strictFields.has(fieldName)) return false;
  // Use AI for meaningful free-text in both Afrikaans and English.
  void languageCode;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = getEnvValue("ELEVENLABS_API_KEY");
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server STT key not configured (ELEVENLABS_API_KEY)." },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const audio = formData.get("audio") as File;
    const rawLanguage = ((formData.get("language") as string) || "en").toLowerCase();
    const fieldName = String(formData.get("fieldName") || "").trim();
    const currentValue = String(formData.get("currentValue") || "").trim();
    const languageMap: Record<string, string> = {
      en: "eng",
      eng: "eng",
    };
    const language = languageMap[rawLanguage];

    if (!audio) {
      return NextResponse.json({ error: "No audio file" }, { status: 400 });
    }
    if (!language) {
      return NextResponse.json({ error: "Only English dictation is currently supported." }, { status: 400 });
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

    if (fieldName === "email") {
      return NextResponse.json({ transcript: normalizeEmailDeterministic(transcript) });
    }
    if (fieldName === "phone") {
      return NextResponse.json({ transcript: normalizePhoneDeterministic(transcript) });
    }

    if (!shouldUseAiRefinement(language, fieldName)) {
      return NextResponse.json({ transcript: deterministicCleanup(transcript) });
    }

    const refined = await refineTranscript(transcript, language, fieldName, currentValue);
    return NextResponse.json({ transcript: deterministicCleanup(refined || transcript) });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Transcription failed" },
      { status: 500 }
    );
  }
}
