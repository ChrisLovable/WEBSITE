"use client";

import { useEffect } from "react";

const STORAGE_KEY = "myaip-theme";
const DEFAULT_THEME = "theme-slateblue";
const ALLOWED = new Set(["theme-slateblue", "theme-steel", "theme-charcoal", "theme-dark"]);

/** Applies saved theme to <body> on every route — CSS vars only exist on body.theme-*. */
export default function ThemeBoot() {
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const theme = raw && ALLOWED.has(raw) ? raw : DEFAULT_THEME;
    const body = document.body;
    body.classList.forEach((c) => {
      if (c.startsWith("theme-")) body.classList.remove(c);
    });
    body.classList.add(theme);
  }, []);
  return null;
}
