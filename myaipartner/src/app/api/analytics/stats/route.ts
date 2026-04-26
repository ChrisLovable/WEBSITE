import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function startOfDay(d: Date) {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date;
}

export async function GET(request: Request) {
  const password = request.headers.get('x-admin-password');
  if (password !== '11274') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase service role not configured' }, { status: 500 });
  }

  const now = new Date();
  const todayStart = startOfDay(now);
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  const monthBack = new Date(now);
  monthBack.setDate(monthBack.getDate() - 30);
  const dayBack = new Date(now);
  dayBack.setDate(dayBack.getDate() - 1);

  const [
    sessionsRes,
    eventsRes,
    topClicksRes,
    pagesRes,
    recentSessionsRes,
    recentEventsRes,
    referrersRes,
    timeEventsRes,
    pageViewsLast30Res,
    sessionsLast30Res,
  ] = await Promise.all([
    supabase.from('analytics_sessions').select('*'),
    supabase.from('analytics_events').select('*'),
    supabase
      .from('analytics_events')
      .select('element')
      .eq('event_type', 'button_click')
      .not('element', 'is', null),
    supabase.from('analytics_events').select('page, event_type, duration_ms'),
    supabase
      .from('analytics_sessions')
      .select('id, started_at, device, browser, referrer, page_count, is_returning')
      .order('started_at', { ascending: false })
      .limit(20),
    supabase
      .from('analytics_events')
      .select('event_type, page, element, created_at')
      .order('created_at', { ascending: false })
      .limit(50),
    supabase.from('analytics_sessions').select('referrer').not('referrer', 'is', null),
    supabase.from('analytics_events').select('duration_ms').eq('event_type', 'time_on_page').not('duration_ms', 'is', null),
    supabase.from('analytics_events').select('created_at, event_type').gte('created_at', monthBack.toISOString()),
    supabase.from('analytics_sessions').select('started_at').gte('started_at', monthBack.toISOString()),
  ]);

  const sessions = sessionsRes.data ?? [];
  const events = eventsRes.data ?? [];
  const pageRows = pagesRes.data ?? [];
  const clickRows = topClicksRes.data ?? [];
  const refRows = referrersRes.data ?? [];
  const recentSessions = recentSessionsRes.data ?? [];
  const recentEvents = recentEventsRes.data ?? [];
  const timeRows = timeEventsRes.data ?? [];
  const pageViewsLast30 = pageViewsLast30Res.data ?? [];
  const sessionsLast30 = sessionsLast30Res.data ?? [];

  const totalSessions = sessions.length;
  const totalPageViews = events.filter((e) => e.event_type === 'page_view').length;
  const returningVisitors = sessions.filter((s) => s.is_returning).length;
  const totalUniqueVisitors = totalSessions;

  const avgTimeOnSiteMs = timeRows.length
    ? Math.round(timeRows.reduce((sum, r) => sum + (r.duration_ms ?? 0), 0) / timeRows.length)
    : 0;

  const todaySessions = sessions.filter((s) => new Date(s.started_at) >= todayStart).length;
  const yesterdaySessions = sessions.filter(
    (s) => new Date(s.started_at) >= yesterdayStart && new Date(s.started_at) < todayStart,
  ).length;

  const pageMap = new Map<string, { views: number; totalMs: number; msCount: number }>();
  for (const row of pageRows) {
    const page = row.page || '/';
    const bucket = pageMap.get(page) ?? { views: 0, totalMs: 0, msCount: 0 };
    if (row.event_type === 'page_view') bucket.views += 1;
    if (row.event_type === 'time_on_page' && typeof row.duration_ms === 'number') {
      bucket.totalMs += row.duration_ms;
      bucket.msCount += 1;
    }
    pageMap.set(page, bucket);
  }
  const pages = Array.from(pageMap.entries())
    .map(([page, v]) => ({
      page,
      views: v.views,
      avg_time_ms: v.msCount ? Math.round(v.totalMs / v.msCount) : 0,
    }))
    .sort((a, b) => b.views - a.views);

  const clickMap = new Map<string, number>();
  for (const row of clickRows) {
    const key = row.element || 'unknown';
    clickMap.set(key, (clickMap.get(key) ?? 0) + 1);
  }
  const topClicks = Array.from(clickMap.entries())
    .map(([element, count]) => ({ element, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  const interestSubmits = events.filter((e) => e.event_type === 'interest_form_submit').length;
  const interestToday = events.filter(
    (e) => e.event_type === 'interest_form_submit' && new Date(e.created_at) >= todayStart,
  ).length;

  const gabbyOpens = events.filter((e) => e.event_type === 'gabby_opened').length;
  const gabbyMessages = events.filter((e) => e.event_type === 'gabby_message').length;
  const gabbyOpenRate = totalSessions ? gabbyOpens / totalSessions : 0;

  const mobileCount = sessions.filter((s) => String(s.device).toLowerCase().includes('mobile')).length;
  const desktopCount = totalSessions - mobileCount;

  const refMap = new Map<string, number>();
  for (const row of refRows) {
    const key = row.referrer || 'direct';
    refMap.set(key, (refMap.get(key) ?? 0) + 1);
  }
  const referrers = Array.from(refMap.entries())
    .map(([referrer, count]) => ({ referrer, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const hourlyMap = new Map<string, { sessions: number; page_views: number }>();
  for (let i = 23; i >= 0; i -= 1) {
    const d = new Date(now.getTime() - i * 60 * 60 * 1000);
    const k = `${d.getHours().toString().padStart(2, '0')}:00`;
    hourlyMap.set(k, { sessions: 0, page_views: 0 });
  }
  for (const s of sessions) {
    const d = new Date(s.started_at);
    if (d < dayBack) continue;
    const k = `${d.getHours().toString().padStart(2, '0')}:00`;
    const b = hourlyMap.get(k);
    if (b) b.sessions += 1;
  }
  for (const e of events) {
    const d = new Date(e.created_at);
    if (d < dayBack || e.event_type !== 'page_view') continue;
    const k = `${d.getHours().toString().padStart(2, '0')}:00`;
    const b = hourlyMap.get(k);
    if (b) b.page_views += 1;
  }
  const hourly = Array.from(hourlyMap.entries()).map(([hour, v]) => ({ hour, ...v }));

  const dailyMap = new Map<string, { sessions: number; page_views: number }>();
  for (let i = 29; i >= 0; i -= 1) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const k = d.toISOString().slice(0, 10);
    dailyMap.set(k, { sessions: 0, page_views: 0 });
  }
  for (const s of sessionsLast30) {
    const key = new Date(s.started_at).toISOString().slice(0, 10);
    const b = dailyMap.get(key);
    if (b) b.sessions += 1;
  }
  for (const e of pageViewsLast30) {
    if (e.event_type !== 'page_view') continue;
    const key = new Date(e.created_at).toISOString().slice(0, 10);
    const b = dailyMap.get(key);
    if (b) b.page_views += 1;
  }
  const daily = Array.from(dailyMap.entries()).map(([date, v]) => ({ date, ...v }));

  return NextResponse.json({
    total_sessions: totalSessions,
    total_page_views: totalPageViews,
    total_unique_visitors: totalUniqueVisitors,
    returning_visitors: returningVisitors,
    avg_time_on_site_ms: avgTimeOnSiteMs,
    today_sessions: todaySessions,
    yesterday_sessions: yesterdaySessions,
    pages,
    top_clicks: topClicks,
    interest_form_submits: interestSubmits,
    interest_form_submits_today: interestToday,
    gabby_opens: gabbyOpens,
    gabby_messages: gabbyMessages,
    gabby_open_rate: gabbyOpenRate,
    devices: { mobile: mobileCount, desktop: desktopCount },
    referrers,
    hourly,
    daily,
    recent_sessions: recentSessions,
    recent_events: recentEvents,
  });
}

