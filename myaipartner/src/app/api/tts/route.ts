import { NextRequest, NextResponse } from 'next/server'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

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

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const trimmed = text.slice(0, 500)

    const googleTtsKey = getEnvValue('GOOGLE_TTS_API_KEY')

    if (!googleTtsKey) {
      return NextResponse.json(
        { error: 'TTS not configured. Add GOOGLE_TTS_API_KEY.' },
        { status: 500 }
      )
    }

    const googleKey = getEnvValue('GOOGLE_TTS_API_KEY')
    console.log('Google key loaded:', googleKey?.slice(0, 10))

    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${googleKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { ssml: `<speak>${trimmed}</speak>` },
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
