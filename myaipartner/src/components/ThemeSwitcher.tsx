"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "myaip-theme";
const THEMES = [
  { id: "theme-slateblue", label: "Slate blue" },
  { id: "theme-steel", label: "Steel" },
  { id: "theme-charcoal", label: "Charcoal" },
  { id: "theme-dark", label: "Dark" }
] as const;

type ThemeId = (typeof THEMES)[number]["id"];
const DEFAULT_THEME: ThemeId = "theme-slateblue";

const ALLOWED_THEME_IDS: ReadonlySet<string> = new Set(THEMES.map((t) => t.id));

export default function ThemeSwitcher() {
  const [activeTheme, setActiveTheme] = useState<ThemeId>(DEFAULT_THEME);
  const [expanded, setExpanded] = useState(false);

  const setTheme = (theme: ThemeId) => {
    const body = document.body;
    body.classList.forEach((c) => {
      if (c.startsWith("theme-")) body.classList.remove(c);
    });
    body.classList.add(theme);
    setActiveTheme(theme);
  };

  useEffect(() => {
    setTheme(DEFAULT_THEME);
    localStorage.setItem(STORAGE_KEY, DEFAULT_THEME);
  }, []);

  const applyTheme = (theme: ThemeId, x?: number, y?: number) => {
    setTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
    setExpanded(false);
    if (x !== undefined && y !== undefined) {
      const rippleColor = getComputedStyle(document.body).getPropertyValue("--color-bg").trim() || "var(--color-bg)";
      fireRipple(x, y, rippleColor);
    }
  };

  const fireRipple = (x: number, y: number, color: string) => {
    const rippleLayer = document.getElementById("ts-ripple-layer");
    if (!rippleLayer) return;
    const el = document.createElement("div");
    el.className = "ts-ripple";
    const size = 100;
    el.style.cssText = `width:${size}px;height:${size}px;left:${x - size / 2}px;top:${y - size / 2}px;background:${color};`;
    rippleLayer.appendChild(el);
    setTimeout(() => el.remove(), 800);
  };

  useEffect(() => {
    (window as Window & { fireThemeRipple?: (x: number, y: number, theme?: string) => void }).fireThemeRipple = (
      x: number,
      y: number
    ) => {
      const rippleColor = getComputedStyle(document.body).getPropertyValue("--color-bg").trim() || "var(--color-bg)";
      fireRipple(x, y, rippleColor);
    };
  }, []);

  return (
    <>
      <div id="theme-switcher">
        <div id="ts-inline">
          <button
            type="button"
            id="ts-label"
            aria-expanded={expanded}
            aria-controls="ts-row"
            onClick={() => setExpanded((prev) => !prev)}
          >
            Choose your look
          </button>
          <div id="ts-row" className={expanded ? "ts-row-expanded" : "ts-row-collapsed"}>
            {THEMES.map((theme) => (
              <button
                type="button"
                key={theme.id}
                className={`ts-btn ${activeTheme === theme.id ? "ts-active" : ""}`}
                data-theme={theme.id}
                title={theme.label}
                onClick={(e) => {
                  applyTheme(theme.id, e.clientX, e.clientY);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  const touch = e.changedTouches[0];
                  applyTheme(theme.id, touch.clientX, touch.clientY);
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <div id="ts-ripple-layer" />
    </>
  );
}
