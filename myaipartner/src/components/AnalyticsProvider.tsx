'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent, useAnalytics } from '@/hooks/useAnalytics';

const SCROLL_MARKS = [25, 50, 75, 100];

function getElementName(target: HTMLElement | null) {
  if (!target) return 'unknown';
  const t =
    target.getAttribute('aria-label') ||
    target.getAttribute('id') ||
    target.textContent?.trim() ||
    target.getAttribute('name') ||
    target.getAttribute('data-track') ||
    'unknown';
  return t.slice(0, 120);
}

export default function AnalyticsProvider() {
  useAnalytics();
  const pathname = usePathname();
  const pageStartRef = useRef<number>(Date.now());
  const prevPathRef = useRef<string | null>(null);
  const depthSeenRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    const prevPath = prevPathRef.current;
    if (prevPath) {
      const durationMs = Date.now() - pageStartRef.current;
      trackEvent('time_on_page', prevPath, { from: prevPath, to: pathname }, { durationMs, page: prevPath });
    }
    prevPathRef.current = pathname;
    pageStartRef.current = Date.now();
    depthSeenRef.current = new Set();
    trackEvent('page_view', pathname, { page: pathname }, { page: pathname });
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const clickable = target.closest('button, a') as HTMLElement | null;
      if (!clickable) return;
      const elementName = getElementName(clickable);
      const lower = elementName.toLowerCase();
      const href = (clickable as HTMLAnchorElement).href || '';

      if (href.includes('wa.me') || lower.includes('whatsapp')) {
        trackEvent('whatsapp_share_click', elementName, { href });
      }

      if (lower.includes('submit') || lower.includes('send') || lower.includes('interest')) {
        trackEvent('form_submit', elementName, { autoDetected: true });
      } else {
        trackEvent('button_click', elementName, { tag: clickable.tagName.toLowerCase() });
      }
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const depth = Math.round((scrollTop / docHeight) * 100);

      for (const mark of SCROLL_MARKS) {
        if (depth >= mark && !depthSeenRef.current.has(mark)) {
          depthSeenRef.current.add(mark);
          trackEvent('scroll_depth', `scroll_${mark}`, { depth: mark });
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onBeforeUnload = () => {
      const currentPath = prevPathRef.current ?? pathname;
      const durationMs = Date.now() - pageStartRef.current;
      trackEvent('time_on_page', currentPath, { unload: true }, { durationMs, useBeacon: true, page: currentPath });
    };

    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [pathname]);

  return null;
}

