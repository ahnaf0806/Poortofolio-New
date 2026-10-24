import React from "react";
import { useWindowManager } from "@/lib/contexts/WindowManagerContext";
import { Window } from "@/components/windows/Window";
import { Taskbar } from "./Taskbar";
import { Dock } from "./Dock";

// Placeholder apps (akan diisi di tahap selanjutnya)
function ProfileApp() {
  return (
    <div className="p-8">
      <h2 className="text-heading-md text-[var(--color-ink-deep)]">Profile</h2>
      <p className="mt-2 text-body-md text-[var(--color-ink-secondary)]">
        Konten profil akan ditampilkan di sini.
      </p>
    </div>
  );
}

function ProjectsApp() {
  return (
    <div className="p-8">
      <h2 className="text-heading-md text-[var(--color-ink-deep)]">Projects</h2>
      <p className="mt-2 text-body-md text-[var(--color-ink-secondary)]">
        Daftar proyek akan ditampilkan di sini.
      </p>
    </div>
  );
}

function AcademicApp() {
  return (
    <div className="p-8">
      <h2 className="text-heading-md text-[var(--color-ink-deep)]">Academic</h2>
      <p className="mt-2 text-body-md text-[var(--color-ink-secondary)]">
        Data KHS akan ditampilkan di sini.
      </p>
    </div>
  );
}

function TerminalApp() {
  return (
    <div className="p-8 font-mono text-sm bg-[#0f172a] text-slate-200 h-full">
      <p>$ welcome</p>
      <p className="mt-2 opacity-70">DevOS Terminal v2.0</p>
    </div>
  );
}

function ContactApp() {
  return (
    <div className="p-8">
      <h2 className="text-heading-md text-[var(--color-ink-deep)]">Contact</h2>
      <p className="mt-2 text-body-md text-[var(--color-ink-secondary)]">
        Informasi kontak akan ditampilkan di sini.
      </p>
    </div>
  );
}

export function Desktop() {
  const { windows } = useWindowManager();

  const renderAppContent = (appId: string) => {
    switch (appId) {
      case "profile":
        return <ProfileApp />;
      case "projects":
        return <ProjectsApp />;
      case "academic":
        return <AcademicApp />;
      case "terminal":
        return <TerminalApp />;
      case "contact":
        return <ContactApp />;
      default:
        return <div>Unknown app</div>;
    }
  };

  return (
    <div
      className="h-full w-full relative"
      style={{ backgroundColor: "var(--color-canvas)" }}
    >
      {/* Background pattern (Subtle dot grid) */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Windows Layer */}
      <div className="absolute inset-0 pt-12">
        {Object.values(windows).map((w) => (
          <Window key={w.id} windowState={w}>
            {renderAppContent(w.appId)}
          </Window>
        ))}
      </div>

      {/* Taskbar */}
      <Taskbar />

      {/* Dock */}
      <Dock />
    </div>
  );
}
