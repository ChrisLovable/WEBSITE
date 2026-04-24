import { NextRequest, NextResponse } from "next/server";

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
    const languageMap: Record<string, string> = {
      en: "en",
      af: "af",
      hi: "hi",
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
    return NextResponse.json({ transcript: data.text || "" });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Transcription failed" },
      { status: 500 }
    );
  }
}
