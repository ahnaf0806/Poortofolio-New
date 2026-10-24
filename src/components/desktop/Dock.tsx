import React from "react";
import {
  User,
  FolderKanban,
  GraduationCap,
  Terminal,
  Mail,
} from "lucide-react";
import { motion } from "framer-motion";
import { useWindowManager } from "@/lib/contexts/WindowManagerContext";
import { useTranslation } from "@/lib/hooks/useTranslation";
import type { AppId } from "@/lib/types";

const APPS: { id: AppId; icon: React.ElementType; titleKey: string }[] = [
  { id: "profile", icon: User, titleKey: "nav.profile" },
  { id: "projects", icon: FolderKanban, titleKey: "nav.projects" },
  { id: "academic", icon: GraduationCap, titleKey: "nav.academic" },
  { id: "terminal", icon: Terminal, titleKey: "nav.terminal" },
  { id: "contact", icon: Mail, titleKey: "nav.contact" },
];

export function Dock() {
  const { openWindow, windows } = useWindowManager();
  const { t } = useTranslation();

  const isOpen = (appId: AppId) =>
    Object.values(windows).some((w) => w.appId === appId && w.isOpen);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div
        className="flex items-center gap-2 p-2"
        style={{
          backgroundColor: "var(--color-surface-soft)",
          borderRadius: "var(--radius-2xl)",
          border: "1px solid var(--color-hairline-soft)",
          backdropFilter: "blur(24px)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        {APPS.map((app) => {
          const Icon = app.icon;
          const open = isOpen(app.id);

          return (
            <div key={app.id} className="relative group">
              <motion.button
                onClick={() => openWindow(app.id, t(app.titleKey))}
                className="w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200"
                style={{
                  backgroundColor: open ? "var(--color-accent)" : "transparent",
                  color: open ? "var(--color-on-accent)" : "var(--color-ink)",
                }}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={24} />
              </motion.button>

              {/* Active indicator */}
              {open && (
                <div
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: "var(--color-accent)" }}
                />
              )}

              {/* Tooltip */}
              <div
                className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg text-caption-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap"
                style={{
                  backgroundColor: "var(--color-ink-deep)",
                  color: "var(--color-canvas)",
                }}
              >
                {t(app.titleKey)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
