import React, { useRef } from "react";
import { motion } from "framer-motion";
import { X, Minus, Square } from "lucide-react";
import type { WindowState } from "@/lib/types";
import { useWindowManager } from "@/lib/contexts/WindowManagerContext";

interface WindowProps {
  windowState: WindowState;
  children: React.ReactNode;
}

export function Window({ windowState, children }: WindowProps) {
  const {
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    updatePosition,
  } = useWindowManager();
  const windowRef = useRef<HTMLDivElement>(null);

  // Jika window ditutup atau di-minimize, jangan render sama sekali
  if (!windowState.isOpen || windowState.isMinimized) {
    return null;
  }

  const isActive =
    windowState.zIndex ===
    Math.max(
      ...Object.values(useWindowManager().windows).map((w) => w.zIndex),
      0,
    );

  // Style dinamis berdasarkan state
  const containerStyle = windowState.isMaximized
    ? {
        top: 48, // Di bawah taskbar
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "calc(100% - 48px)",
        borderRadius: 0,
      }
    : {
        top: windowState.position.y,
        left: windowState.position.x,
        width: windowState.size.width,
        height: windowState.size.height,
        borderRadius: "var(--radius-xl)",
      };

  return (
    <motion.div
      ref={windowRef}
      className="absolute flex flex-col overflow-hidden"
      style={{
        ...containerStyle,
        zIndex: windowState.zIndex,
        backgroundColor: "var(--color-surface-card)",
        border: isActive
          ? "1px solid var(--color-accent)"
          : "1px solid var(--color-hairline-soft)",
        boxShadow: isActive ? "var(--shadow-window)" : "var(--shadow-card)",
      }}
      // Animasi buka/tutup
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      // Fitur Drag (hanya jika tidak di-maximize)
      drag={!windowState.isMaximized}
      dragMomentum={false}
      dragElastic={0}
      onDragStart={() => focusWindow(windowState.id)}
      onDragEnd={(_, info) => {
        // Update posisi di state setelah drag selesai
        const newX = windowState.position.x + info.offset.x;
        const newY = windowState.position.y + info.offset.y;
        updatePosition(windowState.id, {
          x: Math.max(0, newX),
          y: Math.max(48, newY),
        });
      }}
      onMouseDown={() => focusWindow(windowState.id)}
    >
      {/* Window Header (Drag Handle) */}
      <div
        className="flex items-center justify-between px-4 shrink-0 select-none"
        style={{
          height: 44,
          backgroundColor: "var(--color-surface-soft)",
          borderBottom: "1px solid var(--color-hairline-soft)",
          cursor: windowState.isMaximized ? "default" : "grab",
        }}
      >
        {/* Title */}
        <span
          className="text-sm font-semibold truncate"
          style={{ color: "var(--color-accent)" }}
        >
          {windowState.title}
        </span>

        {/* Window Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(windowState.id);
            }}
            className="w-7 h-7 flex items-center justify-center rounded-md transition-colors hover:bg-black/5 active:scale-95"
            style={{ color: "var(--color-ink)" }}
            aria-label="Minimize"
          >
            <Minus size={14} strokeWidth={2.5} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              maximizeWindow(windowState.id);
            }}
            className="w-7 h-7 flex items-center justify-center rounded-md transition-colors hover:bg-black/5 active:scale-95"
            style={{ color: "var(--color-ink)" }}
            aria-label="Maximize"
          >
            <Square size={12} strokeWidth={2} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(windowState.id);
            }}
            className="w-7 h-7 flex items-center justify-center rounded-md transition-colors hover:bg-[var(--color-critical)]/10 hover:text-[var(--color-critical)] active:scale-95"
            style={{ color: "var(--color-ink)" }}
            aria-label="Close"
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div
        className="flex-1 overflow-auto"
        style={{ backgroundColor: "var(--color-canvas)" }}
      >
        {children}
      </div>
    </motion.div>
  );
}
