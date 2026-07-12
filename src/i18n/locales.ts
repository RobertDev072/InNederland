export const LOCALES = ["nl", "en", "pt", "es", "ar", "zh"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "nl";

export const LOCALE_LABELS: Record<Locale, string> = {
  nl: "Nederlands",
  en: "English",
  pt: "Português",
  es: "Español",
  ar: "العربية",
  zh: "中文",
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  nl: "🇳🇱",
  en: "🇬🇧",
  pt: "🇵🇹",
  es: "🇪🇸",
  ar: "🇸🇦",
  zh: "🇨🇳",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
