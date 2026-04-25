"use client";

import { useEffect } from "react";

const STORAGE_KEY = "myaip-theme";
const DEFAULT_THEME = "theme-slateblue";

/** Applies saved theme to <body> on every route — CSS vars only exist on body.theme-*. */
export default function ThemeBoot() {
  useEffect(() => {
    const body = document.body;
    body.classList.forEach((c) => {
      if (c.startsWith("theme-")) body.classList.remove(c);
    });
    body.classList.add(DEFAULT_THEME);
    localStorage.setItem(STORAGE_KEY, DEFAULT_THEME);
  }, []);
  return null;
}
