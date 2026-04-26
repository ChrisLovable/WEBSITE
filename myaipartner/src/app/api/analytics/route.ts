import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

type AnalyticsEventBody = {
  session_id?: string;
  event_type?: string;
  page?: string;
  element?: string;
  metadata?: Record<string, unknown>;
  duration_ms?: number;
};

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AnalyticsEventBody;
    if (!body?.session_id || !body?.event_type || !body?.page) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const supabase = getServiceClient();
    if (!supabase) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const nowIso = new Date().toISOString();
    await supabase.from('analytics_events').insert({
      session_id: body.session_id,
      event_type: body.event_type,
      page: body.page,
      element: body.element ?? null,
      metadata: body.metadata ?? {},
      duration_ms: typeof body.duration_ms === 'number' ? body.duration_ms : null,
      created_at: nowIso,
    });

    const sessionPatch: Record<string, unknown> = {
      id: body.session_id,
      last_seen_at: nowIso,
    };
    const metadata = body.metadata ?? {};
    const sessionMeta = (metadata.session as Record<string, unknown> | undefined) ?? {};
    if (typeof sessionMeta.device === 'string') sessionPatch.device = sessionMeta.device;
    if (typeof sessionMeta.browser === 'string') sessionPatch.browser = sessionMeta.browser;
    if (typeof sessionMeta.referrer === 'string') sessionPatch.referrer = sessionMeta.referrer;
    if (typeof sessionMeta.is_returning === 'boolean') sessionPatch.is_returning = sessionMeta.is_returning;
    if (typeof sessionMeta.country === 'string') sessionPatch.country = sessionMeta.country;

    if (body.event_type === 'page_view') {
      const { data: existing } = await supabase
        .from('analytics_sessions')
        .select('page_count')
        .eq('id', body.session_id)
        .maybeSingle();
      sessionPatch.page_count = (existing?.page_count ?? 0) + 1;
    }

    await supabase.from('analytics_sessions').upsert(sessionPatch, { onConflict: 'id' });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ ok: true }, { status: 200 });
  }
}

