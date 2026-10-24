import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import type { WindowState, AppId } from "@/lib/types";

interface WindowManagerContextType {
  windows: Record<string, WindowState>;
  activeWindowId: string | null;
  openWindow: (appId: AppId, title: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updatePosition: (id: string, position: { x: number; y: number }) => void;
}

const WindowManagerContext = createContext<
  WindowManagerContextType | undefined
>(undefined);

// Counter global untuk z-index agar window yang baru dibuka/fokus selalu di atas
let zIndexCounter = 100;

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<Record<string, WindowState>>({});
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);

  const getNextZIndex = () => ++zIndexCounter;

  const openWindow = useCallback((appId: AppId, title: string) => {
    setWindows((prev) => {
      // Cek apakah window dengan appId yang sama sudah ada
      const existing = Object.values(prev).find((w) => w.appId === appId);

      if (existing) {
        // Jika sudah ada, cukup buka kembali, un-minimize, dan bawa ke depan
        const updated = {
          ...prev,
          [existing.id]: {
            ...existing,
            isOpen: true,
            isMinimized: false,
            zIndex: getNextZIndex(),
          },
        };
        setActiveWindowId(existing.id);
        return updated;
      }

      // Jika belum ada, buat window baru dengan posisi acak sedikit agar tidak menumpuk persis
      const id = `${appId}-${Date.now()}`;
      const newWindow: WindowState = {
        id,
        appId,
        title,
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        zIndex: getNextZIndex(),
        position: {
          x: 80 + Math.random() * 60,
          y: 60 + Math.random() * 40,
        },
        size: { width: 800, height: 550 }, // Default size, bisa dioverride nanti
      };

      setActiveWindowId(id);
      return { ...prev, [id]: newWindow };
    });
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
    setActiveWindowId((prev) => (prev === id ? null : prev));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: true },
    }));
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isMaximized: !prev[id].isMaximized },
    }));
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        zIndex: getNextZIndex(),
        isMinimized: false,
      },
    }));
    setActiveWindowId(id);
  }, []);

  const updatePosition = useCallback(
    (id: string, position: { x: number; y: number }) => {
      setWindows((prev) => ({
        ...prev,
        [id]: { ...prev[id], position },
      }));
    },
    [],
  );

  return (
    <WindowManagerContext.Provider
      value={{
        windows,
        activeWindowId,
        openWindow,
        closeWindow,
        minimizeWindow,
        maximizeWindow,
        focusWindow,
        updatePosition,
      }}
    >
      {children}
    </WindowManagerContext.Provider>
  );
}

export function useWindowManager() {
  const context = useContext(WindowManagerContext);
  if (!context) {
    throw new Error(
      "useWindowManager must be used within a WindowManagerProvider",
    );
  }
  return context;
}
