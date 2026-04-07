'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

export interface Language {
  code: string;
  name: string;
}

interface TranslationContextValue {
  language: string;
  languageName: string;
  setLanguage: (code: string) => void;
  t: (text: string) => string;
  isTranslating: boolean;
  availableLanguages: Language[];
  loadLanguages: () => Promise<void>;
}

const TranslationContext = createContext<TranslationContextValue>({
  language: 'en',
  languageName: 'English',
  setLanguage: () => {},
  t: (text) => text,
  isTranslating: false,
  availableLanguages: [],
  loadLanguages: async () => {},
});

export function useTranslation() {
  return useContext(TranslationContext);
}

const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'zh-CN', name: 'Chinese (Simplified)' },
  { code: 'zh-TW', name: 'Chinese (Traditional)' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'it', name: 'Italian' },
  { code: 'th', name: 'Thai' },
  { code: 'tl', name: 'Filipino' },
  { code: 'id', name: 'Indonesian' },
  { code: 'ms', name: 'Malay' },
  { code: 'tr', name: 'Turkish' },
  { code: 'pl', name: 'Polish' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'nl', name: 'Dutch' },
  { code: 'sv', name: 'Swedish' },
  { code: 'el', name: 'Greek' },
  { code: 'cs', name: 'Czech' },
  { code: 'ro', name: 'Romanian' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'he', name: 'Hebrew' },
  { code: 'bn', name: 'Bengali' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'ur', name: 'Urdu' },
  { code: 'fa', name: 'Persian' },
  { code: 'sw', name: 'Swahili' },
];

const TRANSLATE_TIMEOUT_MS = 5000;

async function translateSingle(text: string, targetLang: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TRANSLATE_TIMEOUT_MS);

  try {
    const url =
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(targetLang)}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return text;
    const data = await res.json();
    if (!data?.[0]) return text;
    const segments: string[] = data[0].map((seg: unknown[]) => seg[0] as string);
    return segments.join('');
  } catch {
    return text;
  } finally {
    clearTimeout(timer);
  }
}

const CONCURRENCY = 5;

async function translatePool(
  items: string[],
  targetLang: string,
  onTranslated: (original: string, translated: string) => void,
): Promise<void> {
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const i = index++;
      const original = items[i];
      const translated = await translateSingle(original, targetLang);
      onTranslated(original, translated);
    }
  }

  const workers = Array.from({ length: Math.min(CONCURRENCY, items.length) }, () => worker());
  await Promise.all(workers);
}

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState('en');
  const [languageName, setLanguageName] = useState('English');
  const [isTranslating, setIsTranslating] = useState(false);
  const [availableLanguages] = useState<Language[]>(SUPPORTED_LANGUAGES);
  const [translationVersion, setTranslationVersion] = useState(0);

  const cacheRef = useRef<Map<string, Map<string, string>>>(new Map());
  const registeredStringsRef = useRef<Set<string>>(new Set());
  const pendingRef = useRef<Set<string>>(new Set());

  const loadLanguages = useCallback(async () => {}, []);

  const translateAndCache = useCallback(async (texts: string[], targetLang: string) => {
    const langCache = cacheRef.current.get(targetLang) || new Map<string, string>();
    cacheRef.current.set(targetLang, langCache);

    const uncached = texts.filter((t) => !langCache.has(t) && t.trim().length > 0);
    if (uncached.length === 0) return;

    await translatePool(uncached, targetLang, (original, translated) => {
      langCache.set(original, translated);
    });
  }, []);

  const setLanguage = useCallback(async (code: string) => {
    const match = SUPPORTED_LANGUAGES.find((l) => l.code === code);
    setLanguageName(match?.name ?? code);
    setLanguageState(code);

    if (code === 'en') {
      setIsTranslating(false);
      setTranslationVersion((n) => n + 1);
      return;
    }

    setIsTranslating(true);

    const strings = Array.from(registeredStringsRef.current).filter((s) => s.trim().length > 0);
    if (strings.length > 0) {
      await translateAndCache(strings, code);
    }

    setIsTranslating(false);
    setTranslationVersion((n) => n + 1);
  }, [translateAndCache]);

  const t = useCallback((text: string): string => {
    void translationVersion;

    registeredStringsRef.current.add(text);

    if (language === 'en' || !text.trim()) return text;

    const langCache = cacheRef.current.get(language);
    if (langCache) {
      const cached = langCache.get(text);
      if (cached !== undefined) return cached;
    }

    if (!pendingRef.current.has(`${language}:${text}`)) {
      pendingRef.current.add(`${language}:${text}`);
      translateSingle(text, language)
        .then((translated) => {
          const lc = cacheRef.current.get(language) || new Map<string, string>();
          lc.set(text, translated);
          cacheRef.current.set(language, lc);
          pendingRef.current.delete(`${language}:${text}`);
          setTranslationVersion((n) => n + 1);
        })
        .catch(() => {
          pendingRef.current.delete(`${language}:${text}`);
        });
    }

    return text;
  }, [language, translationVersion]);

  return (
    <TranslationContext.Provider
      value={{
        language,
        languageName,
        setLanguage,
        t,
        isTranslating,
        availableLanguages,
        loadLanguages,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
}
