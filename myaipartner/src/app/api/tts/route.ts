import { NextRequest, NextResponse } from 'next/server'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// Google TTS hard limit is 5,000 chars. Stay safely under it.
const GOOGLE_TTS_MAX_CHARS = 4800

function readLocalEnvValue(key: string) {
  try {
    const candidates = [
      resolve(process.cwd(), '.env.local'),
      resolve(process.cwd(), 'src/data/.env.local'),
      resolve(process.cwd(), '.env'),
      resolve(process.cwd(), 'src/data/.env')
    ]
    for (const envPath of candidates) {
      if (!existsSync(envPath)) continue
      const raw = readFileSync(envPath, 'utf8')
      const lines = raw.split(/\r?\n/)
      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith('#')) continue
        const idx = trimmed.indexOf('=')
        if (idx < 1) continue
        const parsedKey = trimmed.slice(0, idx).trim()
        if (parsedKey !== key) continue
        return trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '')
      }
    }
    return undefined
  } catch {
    return undefined
  }
}

function getEnvValue(key: string) {
  return process.env[key]?.trim().replace(/^['"]|['"]$/g, '') || readLocalEnvValue(key)
}

/**
 * Strip all XML/SSML tags so Google TTS receives clean plain text.
 * The client already strips these before sending, but this is a
 * server-side safety net in case anything slips through.
 */
function cleanForTTS(text: string): string {
  return text
    .replace(/<[^>]*>/g, '')   // strip ALL XML/SSML tags (including <break>)
    .replace(/\s{2,}/g, ' ')   // collapse whitespace
    .trim()
}

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    // Strip tags then enforce Google's limit.
    // The client chunks at 800 chars so this ceiling should never be hit
    // in normal use — it's a safety net for direct API calls.
    const cleaned = cleanForTTS(text).slice(0, GOOGLE_TTS_MAX_CHARS)

    if (!cleaned) {
      return NextResponse.json({ error: 'Empty text after cleaning' }, { status: 400 })
    }

    const googleKey = getEnvValue('GOOGLE_TTS_API_KEY')

    if (!googleKey) {
      return NextResponse.json(
        { error: 'TTS not configured. Add GOOGLE_TTS_API_KEY.' },
        { status: 500 }
      )
    }

    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${googleKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Use plain text input — not SSML.
          // SSML <break> tags in AI responses were being read aloud literally.
          // Plain text is cleaner and avoids the whole class of SSML injection issues.
          input: { text: cleaned },
          voice: {
            languageCode: 'en-GB',
            name: 'en-GB-Neural2-C'
          },
          audioConfig: {
            audioEncoding: 'MP3'
          }
        })
      }
    )

    if (!response.ok) {
      const err = await response.text()
      console.error('Google TTS error:', err)
      throw new Error('Google TTS failed')
    }

    const data = (await response.json()) as { audioContent?: string }

    if (!data.audioContent) {
      throw new Error('Google TTS: no audioContent in response')
    }

    const audioBuffer = Buffer.from(data.audioContent, 'base64')

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store'
      }
    })
  } catch (error) {
    console.error('TTS error:', error)
    return NextResponse.json({ error: 'TTS failed' }, { status: 500 })
  }
}
