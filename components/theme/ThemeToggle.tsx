"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle({ variant = "on-band" }: { variant?: "on-band" | "on-page" }) {
  const { theme, setTheme } = useTheme();
  const idle =
    variant === "on-band"
      ? "text-on-band/70 hover:text-on-band"
      : "text-ink/70 hover:text-ink";
  const active =
    variant === "on-band"
      ? "bg-on-band/15 text-on-band"
      : "bg-ink/10 text-ink";

  return (
    <div
      className={
        variant === "on-band"
          ? "inline-flex rounded-full border border-on-band/25 p-1 text-xs"
          : "inline-flex rounded-full border border-ink/15 p-1 text-xs"
      }
      role="group"
      aria-label="Тема оформления"
    >
      <button
        type="button"
        className={`rounded-full px-3 py-1.5 ${theme === "light" ? active : idle}`}
        aria-pressed={theme === "light"}
        onClick={() => setTheme("light")}
      >
        Светлая
      </button>
      <button
        type="button"
        className={`rounded-full px-3 py-1.5 ${theme === "dark" ? active : idle}`}
        aria-pressed={theme === "dark"}
        onClick={() => setTheme("dark")}
      >
        Тёмная
      </button>
    </div>
  );
}
