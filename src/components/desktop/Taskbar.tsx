import React from "react";
import { Sun, Moon, Monitor, Globe } from "lucide-react";
import { useWindowManager } from "@/lib/contexts/WindowManagerContext";
import { useTheme } from "@/lib/hooks/useTheme";
import { useTranslation } from "@/lib/hooks/useTranslation";

export function Taskbar() {
  const { windows, activeWindowId, focusWindow } = useWindowManager();
  const { theme, toggleTheme } = useTheme();
  const { t, lang, toggleLang } = useTranslation();

  const openWindows = Object.values(windows).filter((w) => w.isOpen);

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun size={16} />;
      case "dark":
        return <Moon size={16} />;
      default:
        return <Monitor size={16} />;
    }
  };

  return (
    <div
      className="fixed top-0 left-0 right-0 flex items-center justify-between px-4 z-50"
      style={{
        height: 48,
        backgroundColor: "var(--color-canvas)",
        borderBottom: "1px solid var(--color-hairline-soft)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Left: Logo + Open Windows */}
      <div className="flex items-center gap-2">
        <span
          className="text-body-sm-bold"
          style={{ color: "var(--color-accent)", fontWeight: 800 }}
        >
          {t("app.name")}
        </span>

        <div className="flex items-center gap-1 ml-4">
          {openWindows.map((w) => (
            <button
              key={w.id}
              onClick={() => focusWindow(w.id)}
              className="text-body-sm-bold px-3 py-1 rounded-full transition-all duration-200"
              style={{
                backgroundColor:
                  activeWindowId === w.id
                    ? "var(--color-ink-deep)"
                    : "var(--color-canvas)",
                color:
                  activeWindowId === w.id
                    ? "var(--color-canvas)"
                    : "var(--color-ink)",
                border:
                  activeWindowId === w.id
                    ? "none"
                    : "1px solid var(--color-hairline)",
              }}
            >
              {w.title}
            </button>
          ))}
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-2">
        {/* Language Toggle */}
        <button
          onClick={toggleLang}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-body-sm-bold transition-colors hover:bg-[var(--color-surface-soft)]"
          style={{ color: "var(--color-ink)" }}
        >
          <Globe size={14} />
          {lang.toUpperCase()}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-8 h-8 rounded-full transition-colors hover:bg-[var(--color-surface-soft)]"
          style={{ color: "var(--color-ink)" }}
          aria-label="Toggle theme"
        >
          {getThemeIcon()}
        </button>
      </div>
    </div>
  );
}
