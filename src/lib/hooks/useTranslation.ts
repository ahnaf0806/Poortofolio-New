import { useState, useEffect, useCallback } from "react";
import id from "@/data/translations/id.json";
import en from "@/data/translations/en.json";

type Lang = "id" | "en";
type Translations = typeof id;

const translations: Record<Lang, Translations> = { id, en };

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  return typeof current === "string" ? current : path;
}

export function useTranslation() {
  const [lang, setLang] = useState<Lang>(() => {
    const params = new URLSearchParams(window.location.search);
    const stored = params.get("lang") as Lang | null;
    const saved = localStorage.getItem("devos-lang") as Lang | null;
    return stored || saved || "id";
  });

  useEffect(() => {
    localStorage.setItem("devos-lang", lang);
    const url = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    window.history.replaceState({}, "", url.toString());
  }, [lang]);

  const t = useCallback(
    (key: string): string => {
      return getNestedValue(translations[lang], key);
    },
    [lang],
  );

  const toggleLang = () => {
    setLang((prev) => (prev === "id" ? "en" : "id"));
  };

  return { t, lang, setLang, toggleLang };
}
