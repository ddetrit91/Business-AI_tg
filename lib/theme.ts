export const THEME_KEY = "signal-theme";
export type Theme = "light" | "dark";

export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}
