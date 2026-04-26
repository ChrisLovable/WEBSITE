'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type Stats = {
  total_sessions: number;
  total_page_views: number;
  total_unique_visitors: number;
  returning_visitors: number;
  avg_time_on_site_ms: number;
  today_sessions: number;
  yesterday_sessions: number;
  pages: Array<{ page: string; views: number; avg_time_ms: number }>;
  top_clicks: Array<{ element: string; count: number }>;
  interest_form_submits: number;
  interest_form_submits_today: number;
  gabby_opens: number;
  gabby_messages: number;
  gabby_open_rate: number;
  devices: { mobile: number; desktop: number };
  referrers: Array<{ referrer: string; count: number }>;
  hourly: Array<{ hour: string; sessions: number; page_views: number }>;
  daily: Array<{ date: string; sessions: number; page_views: number }>;
  recent_sessions: Array<{
    id: string;
    started_at: string;
    device: string;
    browser: string;
    referrer: string;
    page_count: number;
    is_returning: boolean;
  }>;
  recent_events: Array<{
    event_type: string;
    page: string;
    element: string;
    created_at: string;
  }>;
};

const DASHBOARD_UNLOCKED_KEY = 'map_dashboard_unlocked';

const cardStyle =
  'rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] p-3 shadow-[0_0_18px_var(--color-border-accent)]';

function fmtMs(ms: number) {
  const s = Math.max(0, Math.round(ms / 1000));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}m ${r}s`;
}

function trend(today: number, yesterday: number) {
  if (yesterday <= 0 && today > 0) return '+100%';
  if (yesterday <= 0) return '0%';
  const pct = ((today - yesterday) / yesterday) * 100;
  return `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`;
}

export default function AdminDashboard() {
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [secondsAgo, setSecondsAgo] = useState(0);
  const clickTsRef = useRef<number[]>([]);
  const pwRef = useRef<HTMLInputElement>(null);

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analytics/stats', {
        headers: { 'x-admin-password': '11274' },
      });
      if (!res.ok) throw new Error('Failed to fetch analytics');
      const data = (await res.json()) as Stats;
      setStats(data);
      setLastUpdated(new Date());
      setSecondsAgo(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem(DASHBOARD_UNLOCKED_KEY) === '1') {
      setUnlocked(true);
    }
  }, []);

  useEffect(() => {
    const logo = document.querySelector<HTMLImageElement>('img[src="/logo.png"], .logo');
    if (!logo) return;
    const onLogoClick = () => {
      const now = Date.now();
      clickTsRef.current = [...clickTsRef.current.filter((t) => now - t < 800), now];
      if (clickTsRef.current.length >= 3) {
        clickTsRef.current = [];
        if (unlocked) {
          setOpen(true);
          void loadStats();
        } else {
          setPasswordOpen(true);
        }
      }
    };
    logo.addEventListener('click', onLogoClick);
    return () => logo.removeEventListener('click', onLogoClick);
  }, [unlocked]);

  useEffect(() => {
    if (!passwordOpen) return;
    pwRef.current?.focus();
  }, [passwordOpen]);

  useEffect(() => {
    if (!open) return;
    const id = window.setInterval(() => {
      setSecondsAgo((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const id = window.setInterval(() => {
      void loadStats();
    }, 60_000);
    return () => window.clearInterval(id);
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setPasswordOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const deviceTotal = (stats?.devices.mobile ?? 0) + (stats?.devices.desktop ?? 0);
  const mobilePct = deviceTotal ? Math.round(((stats?.devices.mobile ?? 0) / deviceTotal) * 100) : 0;

  const formAlert = useMemo(() => (stats?.interest_form_submits_today ?? 0) > 0, [stats]);

  const eventColor = (type: string) => {
    if (type === 'page_view') return 'text-cyan-300';
    if (type === 'button_click') return 'text-emerald-300';
    if (type === 'form_submit' || type === 'interest_form_submit') return 'text-amber-300';
    if (type.startsWith('gabby_')) return 'text-purple-300';
    return 'text-slate-300';
  };

  return (
    <>
      {passwordOpen && !unlocked && (
        <div className="fixed inset-0 z-[999998] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className={`w-[min(92vw,420px)] rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5 ${error ? 'animate-pulse' : ''}`}>
            <h3 className="mb-3 font-tech text-sm tracking-[0.16em] text-[var(--color-accent-text)]">Admin Access</h3>
            <input
              ref={pwRef}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-2 w-full border border-[var(--color-border)] bg-[var(--color-bg-input)] px-3 py-2 text-sm text-[var(--color-text-primary)]"
              placeholder="Enter dashboard password"
            />
            {error && <p className="mb-2 text-xs text-red-400">{error}</p>}
            <div className="flex justify-end gap-2">
              <button className="border border-[var(--color-border)] px-3 py-1 text-xs" onClick={() => setPasswordOpen(false)}>Cancel</button>
              <button
                className="border border-[var(--color-border)] bg-[var(--color-accent-bg)] px-3 py-1 text-xs text-[var(--color-accent-text)]"
                onClick={() => {
                  if (password === '11274') {
                    setUnlocked(true);
                    sessionStorage.setItem(DASHBOARD_UNLOCKED_KEY, '1');
                    setPasswordOpen(false);
                    setOpen(true);
                    void loadStats();
                    setError('');
                    setPassword('');
                  } else {
                    setError('Incorrect password');
                  }
                }}
              >
                Access Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-[999999] overflow-y-auto bg-[#050711]/95 p-3 text-[var(--color-text-primary)] md:p-5">
          <div className="mx-auto max-w-7xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] p-3">
              <div>
                <h2 className="font-tech text-lg text-[var(--color-accent-text)]">myAIpartner Analytics</h2>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  {lastUpdated ? `Last updated ${lastUpdated.toLocaleTimeString()} · Updated ${secondsAgo}s ago` : 'Waiting for data...'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-2 text-xs text-emerald-300">
                  <span className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
                  LIVE
                </span>
                <button className="border border-[var(--color-border)] px-3 py-1 text-xs" onClick={() => void loadStats()}>
                  Refresh
                </button>
                <button className="border border-[var(--color-border)] px-3 py-1 text-xs" onClick={() => setOpen(false)}>
                  ×
                </button>
              </div>
            </div>

            {formAlert && (
              <div className="animate-pulse rounded-lg border border-orange-400 bg-orange-500/15 p-3 text-sm text-orange-200">
                🔔 {stats?.interest_form_submits_today} interest form submission(s) today — someone wants to work with you!
              </div>
            )}

            {loading && !stats && (
              <div className="grid gap-3 md:grid-cols-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className={`${cardStyle} h-24 animate-pulse`} />
                ))}
              </div>
            )}

            {stats && (
              <>
                <div className="grid gap-3 md:grid-cols-5">
                  <div className={cardStyle}><p className="text-xs text-[var(--color-text-secondary)]">Total Sessions</p><p className="text-2xl">{stats.total_sessions}</p><p className="text-xs">{trend(stats.today_sessions, stats.yesterday_sessions)}</p></div>
                  <div className={cardStyle}><p className="text-xs text-[var(--color-text-secondary)]">Page Views Today</p><p className="text-2xl">{stats.hourly.reduce((s, h) => s + h.page_views, 0)}</p></div>
                  <div className={cardStyle}><p className="text-xs text-[var(--color-text-secondary)]">Avg Time on Site</p><p className="text-2xl">{fmtMs(stats.avg_time_on_site_ms)}</p></div>
                  <div className={cardStyle}><p className="text-xs text-[var(--color-text-secondary)]">Interest Forms</p><p className="text-2xl">{stats.interest_form_submits}</p></div>
                  <div className={cardStyle}><p className="text-xs text-[var(--color-text-secondary)]">Gabby Opens</p><p className="text-2xl">{stats.gabby_opens}</p></div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className={cardStyle}>
                    <p className="mb-2 text-xs text-[var(--color-text-secondary)]">Daily Sessions (30 days)</p>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={stats.daily}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#2e3d61" />
                          <XAxis dataKey="date" hide />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="sessions" stroke="#38bdf8" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className={cardStyle}>
                    <p className="mb-2 text-xs text-[var(--color-text-secondary)]">Hourly Traffic (24h)</p>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.hourly}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#2e3d61" />
                          <XAxis dataKey="hour" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="sessions" fill="#22c55e" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className={cardStyle}>
                    <p className="mb-2 text-xs text-[var(--color-text-secondary)]">Top Pages</p>
                    <div className="space-y-1 text-xs">
                      {stats.pages.slice(0, 10).map((p) => (
                        <div key={p.page} className="flex justify-between border-b border-[var(--color-border)] py-1">
                          <span className="truncate pr-2">{p.page}</span>
                          <span>{p.views} · {fmtMs(p.avg_time_ms)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={cardStyle}>
                    <p className="mb-2 text-xs text-[var(--color-text-secondary)]">Top Button Clicks</p>
                    <div className="space-y-1 text-xs">
                      {stats.top_clicks.map((c) => (
                        <div key={c.element} className={`flex justify-between border-b border-[var(--color-border)] py-1 ${(c.element.toLowerCase().includes('submit') || c.element.toLowerCase().includes('interest')) ? 'text-amber-300' : ''}`}>
                          <span className="truncate pr-2">{c.element}</span>
                          <span>{c.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <div className={cardStyle}>
                    <p className="text-xs text-[var(--color-text-secondary)]">Gabby Intelligence</p>
                    <p className="mt-2 text-sm">Open rate: {(stats.gabby_open_rate * 100).toFixed(1)}%</p>
                    <p className="text-sm">Messages: {stats.gabby_messages}</p>
                    {(stats.gabby_open_rate * 100) > 20 && (
                      <p className="mt-2 text-xs text-emerald-300">Most engaged visitors use Gabby.</p>
                    )}
                  </div>
                  <div className={cardStyle}>
                    <p className="text-xs text-[var(--color-text-secondary)]">Device Split</p>
                    <div className="mt-3 h-3 w-full overflow-hidden rounded bg-slate-800">
                      <div className="h-full bg-cyan-400" style={{ width: `${mobilePct}%` }} />
                    </div>
                    <p className="mt-2 text-xs">Mobile {stats.devices.mobile} · Desktop {stats.devices.desktop}</p>
                  </div>
                  <div className={cardStyle}>
                    <p className="text-xs text-[var(--color-text-secondary)]">Top Referrers</p>
                    {stats.referrers.slice(0, 5).map((r) => (
                      <div key={r.referrer} className="mt-1 flex justify-between text-xs">
                        <span className="truncate pr-2">{r.referrer || 'direct'}</span>
                        <span>{r.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={cardStyle}>
                  <p className="mb-2 text-xs text-[var(--color-text-secondary)]">Recent Activity</p>
                  <div className="max-h-64 space-y-1 overflow-y-auto text-xs">
                    {stats.recent_events.map((e, i) => (
                      <div key={`${e.created_at}-${i}`} className={`border-b border-[var(--color-border)] py-1 ${eventColor(e.event_type)}`}>
                        {e.event_type} · {e.page} · {e.element || '—'} · {new Date(e.created_at).toLocaleTimeString()}
                      </div>
                    ))}
                  </div>
                </div>

                <div className={cardStyle}>
                  <p className="mb-2 text-xs text-[var(--color-text-secondary)]">Recent Sessions</p>
                  <div className="max-h-72 overflow-auto text-xs">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-[var(--color-text-secondary)]">
                          <th>Session</th><th>Device</th><th>Browser</th><th>Referrer</th><th>Pages</th><th>Returning</th><th>Started</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recent_sessions.map((s) => (
                          <tr key={s.id} className="border-t border-[var(--color-border)]">
                            <td>{s.id.slice(0, 8)}...</td>
                            <td>{s.device}</td>
                            <td>{s.browser}</td>
                            <td>{s.referrer || 'direct'}</td>
                            <td>{s.page_count}</td>
                            <td>{s.is_returning ? 'Yes' : 'No'}</td>
                            <td>{new Date(s.started_at).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

