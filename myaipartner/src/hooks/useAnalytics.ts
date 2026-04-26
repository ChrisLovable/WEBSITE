'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';

export type AnalyticsEventType =
  | 'page_view'
  | 'button_click'
  | 'form_submit'
  | 'time_on_page'
  | 'gabby_opened'
  | 'gabby_message'
  | 'interest_form_submit'
  | 'scroll_depth'
  | 'portfolio_click'
  | 'whatsapp_share_click';

type EventPayload = {
  session_id: string;
  event_type: AnalyticsEventType | string;
  page: string;
  element?: string;
  metadata?: Record<string, unknown>;
  duration_ms?: number;
};

const SESSION_KEY = 'map_session_id';
const RETURNING_KEY = 'map_seen';
const SESSION_INIT_KEY = 'map_session_initialized';

function getBrowser(ua: string) {
  const lower = ua.toLowerCase();
  if (lower.includes('edg/')) return 'Edge';
  if (lower.includes('opr/') || lower.includes('opera')) return 'Opera';
  if (lower.includes('chrome/')) return 'Chrome';
  if (lower.includes('safari/') && !lower.includes('chrome/')) return 'Safari';
  if (lower.includes('firefox/')) return 'Firefox';
  return 'Other';
}

function getDevice() {
  if (typeof window === 'undefined') return 'desktop';
  return window.innerWidth < 768 ? 'mobile' : 'desktop';
}

export function getOrCreateSessionId() {
  if (typeof window === 'undefined') return '';
  const existing = sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const next = crypto.randomUUID();
  sessionStorage.setItem(SESSION_KEY, next);
  return next;
}

function sendAnalyticsEvent(payload: EventPayload, useBeacon = false) {
  if (typeof window === 'undefined') return;
  try {
    if (useBeacon && navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon('/api/analytics', blob);
      return;
    }
    void fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: useBeacon,
    }).catch(() => {});
  } catch {
    // fire and forget
  }
}

export function trackEvent(
  eventType: AnalyticsEventType | string,
  element?: string,
  metadata?: Record<string, unknown>,
  options?: { durationMs?: number; useBeacon?: boolean; page?: string },
) {
  if (typeof window === 'undefined') return;
  const payload: EventPayload = {
    session_id: getOrCreateSessionId(),
    event_type: eventType,
    page: options?.page ?? window.location.pathname ?? '/',
    element,
    metadata,
    duration_ms: options?.durationMs,
  };
  sendAnalyticsEvent(payload, options?.useBeacon ?? false);
}

export function useAnalytics() {
  const sessionId = useMemo(() => (typeof window === 'undefined' ? '' : getOrCreateSessionId()), []);

  const initializeSession = useCallback(async () => {
    if (typeof window === 'undefined' || !sessionId) return;
    const initialized = sessionStorage.getItem(SESSION_INIT_KEY);
    if (initialized) return;

    const isReturning = localStorage.getItem(RETURNING_KEY) === '1';
    localStorage.setItem(RETURNING_KEY, '1');
    sessionStorage.setItem(SESSION_INIT_KEY, '1');

    const sessionPayload = {
      id: sessionId,
      started_at: new Date().toISOString(),
      last_seen_at: new Date().toISOString(),
      page_count: 0,
      country: null,
      device: getDevice(),
      browser: getBrowser(navigator.userAgent),
      referrer: document.referrer || 'direct',
      is_returning: isReturning,
    };

    try {
      if (supabase) {
        await supabase.from('analytics_sessions').upsert(sessionPayload, { onConflict: 'id' });
      }
    } catch {
      // best effort only
    }
  }, [sessionId]);

  useEffect(() => {
    void initializeSession();
  }, [initializeSession]);

  return { sessionId, trackEvent };
}

