import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
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
        "xi-api-key": process.env.ELEVENLABS_API_KEY || "",
      },
      body: elFormData,
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: err }, { status: response.status });
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
