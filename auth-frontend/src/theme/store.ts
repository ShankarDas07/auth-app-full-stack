import { create } from "zustand";

export type Theme = "light" | "dark";

const THEME_KEY = "app_theme";

// index.html already decided the theme (saved choice, else the OS setting)
// and put the "dark" class on <html> before the first paint. We just read it.
function readInitialTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

type ThemeState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const useTheme = create<ThemeState>((set, get) => ({
  theme: readInitialTheme(),

  setTheme: (theme) => {
    applyTheme(theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // storage can be blocked (private mode); the theme still works for this visit
    }
    set({ theme });
  },

  toggleTheme: () => get().setTheme(get().theme === "dark" ? "light" : "dark"),
}));

export default useTheme;
