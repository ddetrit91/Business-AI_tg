"use client";

import { applyTheme, isTheme, THEME_KEY, type Theme } from "@/lib/theme";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
} | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY);
    const current = document.documentElement.dataset.theme;
    const next = isTheme(stored) ? stored : isTheme(current) ? current : "light";
    setThemeState(next);
    applyTheme(next);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      setTheme: (next: Theme) => {
        setThemeState(next);
        localStorage.setItem(THEME_KEY, next);
        applyTheme(next);
      },
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
