import { useState, useEffect } from "react";

type Theme = "light" | "dark" | "system";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("devos-theme") as Theme | null;
    return stored || "system";
  });

  useEffect(() => {
    const root = document.documentElement;
    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const resolved =
      theme === "system" ? (systemDark ? "dark" : "light") : theme;

    root.setAttribute("data-theme", resolved);
    localStorage.setItem("devos-theme", theme);

    // Opsional: update URL param agar bisa di-share
    const url = new URL(window.location.href);
    url.searchParams.set("theme", resolved);
    window.history.replaceState({}, "", url.toString());
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      if (prev === "light") return "dark";
      if (prev === "dark") return "system";
      return "light";
    });
  };

  return { theme, setTheme, toggleTheme };
}
