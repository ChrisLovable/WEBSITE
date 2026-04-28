'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

// ── Types ────────────────────────────────────────────────────────────────────
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

type Submission = {
  id: number | string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company?: string;
  industry?: string;
  service_required?: string;
  description?: string;
  budget_range?: string;
  start_date?: string;
  done?: boolean;
};

// ── Constants ────────────────────────────────────────────────────────────────
const DASHBOARD_UNLOCKED_KEY = 'map_dashboard_unlocked';
const ADMIN_PW = '11274';

const cardStyle =
  'rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] p-3 shadow-[0_0_18px_var(--color-border-accent)]';

// ── Helpers ──────────────────────────────────────────────────────────────────
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

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'analytics' | 'submissions'>('analytics');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [secondsAgo, setSecondsAgo] = useState(0);

  // Submissions state
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [subLoading, setSubLoading] = useState(false);
  const [subFilter, setSubFilter] = useState<'all' | 'pending' | 'done'>('all');

  const clickTsRef = useRef<number[]>([]);
  const pwRef = useRef<HTMLInputElement>(null);

  // ── Data loaders ────────────────────────────────────────────────────────
  const loadStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analytics/stats', {
        headers: { 'x-admin-password': ADMIN_PW },
      });
      if (!res.ok) throw new Error('Failed');
      setStats((await res.json()) as Stats);
      setLastUpdated(new Date());
      setSecondsAgo(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSubmissions = useCallback(async () => {
    setSubLoading(true);
    try {
      const res = await fetch('/api/submissions', {
        headers: { 'x-admin-password': ADMIN_PW },
      });
      if (!res.ok) throw new Error('Failed');
      const data = (await res.json()) as { submissions: Submission[] };
      setSubmissions(data.submissions ?? []);
    } finally {
      setSubLoading(false);
    }
  }, []);

  const markDone = async (id: number | string, done: boolean) => {
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, done } : s)));
    await fetch('/api/submissions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': ADMIN_PW },
      body: JSON.stringify({ id, done }),
    });
  };

  const deleteSubmission = async (id: number | string) => {
    if (!confirm('Delete this submission permanently?')) return;
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
    await fetch('/api/submissions', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': ADMIN_PW },
      body: JSON.stringify({ id }),
    });
  };

  // ── Effects ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (sessionStorage.getItem(DASHBOARD_UNLOCKED_KEY) === '1') setUnlocked(true);
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
          void loadSubmissions();
        } else {
          setPasswordOpen(true);
        }
      }
    };
    logo.addEventListener('click', onLogoClick);
    return () => logo.removeEventListener('click', onLogoClick);
  }, [unlocked, loadStats, loadSubmissions]);

  useEffect(() => {
    if (!passwordOpen) return;
    pwRef.current?.focus();
  }, [passwordOpen]);

  useEffect(() => {
    if (!open) return;
    const id = window.setInterval(() => setSecondsAgo((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const id = window.setInterval(() => { void loadStats(); void loadSubmissions(); }, 60_000);
    return () => window.clearInterval(id);
  }, [open, loadStats, loadSubmissions]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); setPasswordOpen(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // ── Derived values ────────────────────────────────────────────────────────
  const deviceTotal = (stats?.devices.mobile ?? 0) + (stats?.devices.desktop ?? 0);
  const mobilePct = deviceTotal ? Math.round(((stats?.devices.mobile ?? 0) / deviceTotal) * 100) : 0;
  const formAlert = useMemo(() => (stats?.interest_form_submits_today ?? 0) > 0, [stats]);
  const pendingCount = useMemo(() => submissions.filter((s) => !s.done).length, [submissions]);
  const filteredSubs = useMemo(() => {
    if (subFilter === 'pending') return submissions.filter((s) => !s.done);
    if (subFilter === 'done') return submissions.filter((s) => s.done);
    return submissions;
  }, [submissions, subFilter]);

  const eventColor = (type: string) => {
    if (type === 'page_view') return 'text-cyan-300';
    if (type === 'button_click') return 'text-emerald-300';
    if (type === 'form_submit' || type === 'interest_form_submit') return 'text-amber-300';
    if (type.startsWith('gabby_')) return 'text-purple-300';
    return 'text-slate-300';
  };

  const tabBtn = (tab: typeof activeTab, label: string, badge?: number) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`relative px-4 py-2 text-xs font-medium border rounded transition-colors ${
        activeTab === tab
          ? 'border-[var(--color-accent-text)] text-[var(--color-accent-text)] bg-[var(--color-accent-bg)]'
          : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
      }`}
    >
      {label}
      {badge !== undefined && badge > 0 && (
        <span className="ml-2 inline-flex items-center justify-center h-4 min-w-[1rem] px-1 rounded-full bg-orange-500 text-white text-[10px]">
          {badge}
        </span>
      )}
    </button>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Password gate */}
      {passwordOpen && !unlocked && (
        <div className="fixed inset-0 z-[999998] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className={`w-[min(92vw,420px)] rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5 ${error ? 'animate-pulse' : ''}`}>
            <h3 className="mb-3 font-tech text-sm tracking-[0.16em] text-[var(--color-accent-text)]">Admin Access</h3>
            <input
              ref={pwRef}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') document.getElementById('admin-login-btn')?.click(); }}
              className="mb-2 w-full border border-[var(--color-border)] bg-[var(--color-bg-input)] px-3 py-2 text-sm text-[var(--color-text-primary)]"
              placeholder="Enter dashboard password"
            />
            {error && <p className="mb-2 text-xs text-red-400">{error}</p>}
            <div className="flex justify-end gap-2">
              <button className="border border-[var(--color-border)] px-3 py-1 text-xs" onClick={() => setPasswordOpen(false)}>Cancel</button>
              <button
                id="admin-login-btn"
                className="border border-[var(--color-border)] bg-[var(--color-accent-bg)] px-3 py-1 text-xs text-[var(--color-accent-text)]"
                onClick={() => {
                  if (password === ADMIN_PW) {
                    setUnlocked(true);
                    sessionStorage.setItem(DASHBOARD_UNLOCKED_KEY, '1');
                    setPasswordOpen(false);
                    setOpen(true);
                    void loadStats();
                    void loadSubmissions();
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

      {/* Dashboard */}
      {open && (
        <div className="fixed inset-0 z-[999999] overflow-y-auto bg-[#050711]/95 p-3 text-[var(--color-text-primary)] md:p-5">
          <div className="mx-auto max-w-7xl space-y-4">

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] p-3">
              <div>
                <h2 className="font-tech text-lg text-[var(--color-accent-text)]">myAIpartner Admin</h2>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  {lastUpdated ? `Last updated ${lastUpdated.toLocaleTimeString()} · ${secondsAgo}s ago` : 'Loading...'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-2 text-xs text-emerald-300">
                  <span className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
                  LIVE
                </span>
                <button className="border border-[var(--color-border)] px-3 py-1 text-xs" onClick={() => { void loadStats(); void loadSubmissions(); }}>
                  Refresh
                </button>
                <button className="border border-[var(--color-border)] px-3 py-1 text-xs" onClick={() => setOpen(false)}>
                  ×
                </button>
              </div>
            </div>

            {/* Alert banner */}
            {formAlert && (
              <div className="animate-pulse rounded-lg border border-orange-400 bg-orange-500/15 p-3 text-sm text-orange-200">
                🔔 {stats?.interest_form_submits_today} interest form submission(s) today — someone wants to work with you!
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2">
              {tabBtn('analytics', 'Analytics')}
              {tabBtn('submissions', 'Enquiries', pendingCount)}
            </div>

            {/* ── ANALYTICS TAB ─────────────────────────────────────────── */}
            {activeTab === 'analytics' && (
              <>
                {loading && !stats && (
                  <div className="grid gap-3 md:grid-cols-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className={`${cardStyle} h-24 animate-pulse`} />
                    ))}
                  </div>
                )}

                {stats && (
                  <>
                    {/* KPI row */}
                    <div className="grid gap-3 grid-cols-2 md:grid-cols-6">
                      <div className={cardStyle}>
                        <p className="text-xs text-[var(--color-text-secondary)]">Unique Visitors</p>
                        <p className="text-2xl font-bold text-cyan-300">{stats.total_unique_visitors}</p>
                        <p className="text-xs text-[var(--color-text-secondary)]">All time</p>
                      </div>
                      <div className={cardStyle}>
                        <p className="text-xs text-[var(--color-text-secondary)]">Today</p>
                        <p className="text-2xl font-bold">{stats.today_sessions}</p>
                        <p className="text-xs text-emerald-300">{trend(stats.today_sessions, stats.yesterday_sessions)}</p>
                      </div>
                      <div className={cardStyle}>
                        <p className="text-xs text-[var(--color-text-secondary)]">Total Sessions</p>
                        <p className="text-2xl">{stats.total_sessions}</p>
                        <p className="text-xs text-[var(--color-text-secondary)]">Returning: {stats.returning_visitors}</p>
                      </div>
                      <div className={cardStyle}>
                        <p className="text-xs text-[var(--color-text-secondary)]">Page Views Today</p>
                        <p className="text-2xl">{stats.hourly.reduce((s, h) => s + h.page_views, 0)}</p>
                      </div>
                      <div className={cardStyle}>
                        <p className="text-xs text-[var(--color-text-secondary)]">Avg Time on Site</p>
                        <p className="text-2xl">{fmtMs(stats.avg_time_on_site_ms)}</p>
                      </div>
                      <div className={cardStyle}>
                        <p className="text-xs text-[var(--color-text-secondary)]">Enquiries</p>
                        <p className="text-2xl text-amber-300">{stats.interest_form_submits}</p>
                        <p className="text-xs">{stats.interest_form_submits_today} today</p>
                      </div>
                    </div>

                    {/* Charts */}
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
                              <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="sessions" fill="#22c55e" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>

                    {/* Pages + clicks */}
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className={cardStyle}>
                        <p className="mb-2 text-xs text-[var(--color-text-secondary)]">Top Pages</p>
                        <div className="space-y-1 text-xs">
                          {stats.pages.slice(0, 10).map((p) => (
                            <div key={p.page} className="flex justify-between border-b border-[var(--color-border)] py-1">
                              <span className="truncate pr-2">{p.page}</span>
                              <span className="shrink-0">{p.views} views · {fmtMs(p.avg_time_ms)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className={cardStyle}>
                        <p className="mb-2 text-xs text-[var(--color-text-secondary)]">Top Button Clicks</p>
                        <div className="space-y-1 text-xs">
                          {stats.top_clicks.map((c) => (
                            <div
                              key={c.element}
                              className={`flex justify-between border-b border-[var(--color-border)] py-1 ${
                                (c.element.toLowerCase().includes('submit') || c.element.toLowerCase().includes('interest'))
                                  ? 'text-amber-300' : ''
                              }`}
                            >
                              <span className="truncate pr-2">{c.element}</span>
                              <span>{c.count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Gabby + devices + referrers */}
                    <div className="grid gap-3 md:grid-cols-3">
                      <div className={cardStyle}>
                        <p className="text-xs text-[var(--color-text-secondary)]">Gabby Intelligence</p>
                        <p className="mt-2 text-sm">Open rate: {(stats.gabby_open_rate * 100).toFixed(1)}%</p>
                        <p className="text-sm">Opens: {stats.gabby_opens}</p>
                        <p className="text-sm">Messages: {stats.gabby_messages}</p>
                        {stats.gabby_open_rate * 100 > 20 && (
                          <p className="mt-2 text-xs text-emerald-300">Most engaged visitors use Gabby.</p>
                        )}
                      </div>
                      <div className={cardStyle}>
                        <p className="text-xs text-[var(--color-text-secondary)]">Device Split</p>
                        <div className="mt-3 h-3 w-full overflow-hidden rounded bg-slate-800">
                          <div className="h-full bg-cyan-400" style={{ width: `${mobilePct}%` }} />
                        </div>
                        <p className="mt-2 text-xs">📱 Mobile {stats.devices.mobile} · 🖥 Desktop {stats.devices.desktop}</p>
                        <p className="mt-1 text-xs text-[var(--color-text-secondary)]">{mobilePct}% mobile</p>
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

                    {/* Recent activity */}
                    <div className={cardStyle}>
                      <p className="mb-2 text-xs text-[var(--color-text-secondary)]">Recent Activity</p>
                      <div className="max-h-64 space-y-1 overflow-y-auto text-xs">
                        {stats.recent_events.map((e, i) => (
                          <div
                            key={`${e.created_at}-${i}`}
                            className={`border-b border-[var(--color-border)] py-1 ${eventColor(e.event_type)}`}
                          >
                            {e.event_type} · {e.page} · {e.element || '—'} · {new Date(e.created_at).toLocaleTimeString()}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent sessions */}
                    <div className={cardStyle}>
                      <p className="mb-2 text-xs text-[var(--color-text-secondary)]">Recent Sessions</p>
                      <div className="max-h-72 overflow-auto text-xs">
                        <table className="w-full">
                          <thead>
                            <tr className="text-left text-[var(--color-text-secondary)]">
                              <th className="pb-1">Session</th>
                              <th className="pb-1">Device</th>
                              <th className="pb-1">Browser</th>
                              <th className="pb-1">Referrer</th>
                              <th className="pb-1">Pages</th>
                              <th className="pb-1">Return</th>
                              <th className="pb-1">Started</th>
                            </tr>
                          </thead>
                          <tbody>
                            {stats.recent_sessions.map((s) => (
                              <tr key={s.id} className="border-t border-[var(--color-border)]">
                                <td className="py-1">{s.id.slice(0, 8)}…</td>
                                <td>{s.device}</td>
                                <td>{s.browser}</td>
                                <td className="max-w-[120px] truncate">{s.referrer || 'direct'}</td>
                                <td>{s.page_count}</td>
                                <td>{s.is_returning ? '✓' : '—'}</td>
                                <td>{new Date(s.started_at).toLocaleString('en-ZA')}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {/* ── SUBMISSIONS TAB ───────────────────────────────────────── */}
            {activeTab === 'submissions' && (
              <>
                {/* Sub-filter + count */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex gap-2">
                    {(['all', 'pending', 'done'] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setSubFilter(f)}
                        className={`px-3 py-1 text-xs border rounded capitalize transition-colors ${
                          subFilter === f
                            ? 'border-[var(--color-accent-text)] text-[var(--color-accent-text)]'
                            : 'border-[var(--color-border)] text-[var(--color-text-secondary)]'
                        }`}
                      >
                        {f} {f === 'all' ? `(${submissions.length})` : f === 'pending' ? `(${pendingCount})` : `(${submissions.length - pendingCount})`}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => void loadSubmissions()}
                    className="border border-[var(--color-border)] px-3 py-1 text-xs"
                  >
                    Refresh
                  </button>
                </div>

                {subLoading && (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className={`${cardStyle} h-36 animate-pulse`} />
                    ))}
                  </div>
                )}

                {!subLoading && filteredSubs.length === 0 && (
                  <div className={`${cardStyle} py-12 text-center text-sm text-[var(--color-text-secondary)]`}>
                    No submissions found.
                  </div>
                )}

                {/* Submission cards — newest first */}
                <div className="space-y-3">
                  {filteredSubs.map((sub) => (
                    <div
                      key={sub.id}
                      className={`rounded-lg border p-4 transition-opacity ${
                        sub.done
                          ? 'border-[var(--color-border)] opacity-60 bg-[var(--color-bg-card)]'
                          : 'border-amber-500/50 bg-amber-500/5 shadow-[0_0_12px_rgba(245,158,11,0.1)]'
                      }`}
                    >
                      {/* Card header */}
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-sm text-[var(--color-text-primary)]">
                              {sub.first_name} {sub.last_name}
                            </h3>
                            {sub.done && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                Done
                              </span>
                            )}
                            {!sub.done && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                Pending
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{fmtDate(sub.created_at)}</p>
                        </div>
                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => markDone(sub.id, !sub.done)}
                            className={`px-2 py-1 text-[11px] rounded border transition-colors ${
                              sub.done
                                ? 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                                : 'border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/10'
                            }`}
                          >
                            {sub.done ? 'Mark Pending' : '✓ Mark Done'}
                          </button>
                          <button
                            onClick={() => void deleteSubmission(sub.id)}
                            className="px-2 py-1 text-[11px] rounded border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {/* Card body */}
                      <div className="mt-3 grid gap-1 text-xs text-[var(--color-text-secondary)] sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                          <span className="text-[var(--color-text-primary)]">Email: </span>
                          <a href={`mailto:${sub.email}`} className="text-cyan-400 hover:underline">{sub.email}</a>
                        </div>
                        {sub.phone && (
                          <div>
                            <span className="text-[var(--color-text-primary)]">Phone: </span>
                            <a href={`tel:${sub.phone}`} className="text-cyan-400 hover:underline">{sub.phone}</a>
                          </div>
                        )}
                        {sub.company && (
                          <div>
                            <span className="text-[var(--color-text-primary)]">Company: </span>{sub.company}
                          </div>
                        )}
                        {sub.industry && sub.industry !== 'Unknown' && (
                          <div>
                            <span className="text-[var(--color-text-primary)]">Industry: </span>{sub.industry}
                          </div>
                        )}
                        {sub.service_required && (
                          <div>
                            <span className="text-[var(--color-text-primary)]">Service: </span>{sub.service_required}
                          </div>
                        )}
                        {sub.budget_range && (
                          <div>
                            <span className="text-[var(--color-text-primary)]">Budget: </span>{sub.budget_range}
                          </div>
                        )}
                      </div>
                      {sub.description && (
                        <div className="mt-3 text-xs">
                          <span className="text-[var(--color-text-primary)]">Message: </span>
                          <span className="text-[var(--color-text-secondary)]">{sub.description}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </>
  );
}
