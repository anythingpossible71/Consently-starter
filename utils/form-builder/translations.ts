import type { TranslationMap } from "@/types/form-builder/app-types";
import uiTranslations from "@/data/ui-translations.json";
import formTranslations from "@/data/form-translations.json";

export const translations: TranslationMap = {
  en: uiTranslations.en,
  es: uiTranslations.es,
  fr: uiTranslations.fr,
  de: uiTranslations.de,
  it: uiTranslations.it,
  pt: uiTranslations.pt,
  ru: uiTranslations.ru,
  ja: uiTranslations.ja,
  ko: uiTranslations.ko,
  zh: uiTranslations.zh,
  ar: uiTranslations.ar,
  he: uiTranslations.he,
};

export const formElementTranslations: TranslationMap = formTranslations;

export function getTranslation(key: string, language: string): string {
  const lang = language as keyof typeof translations;
  const translation = translations[lang]?.[key as keyof (typeof translations)["en"]];
  return translation || translations.en[key as keyof (typeof translations)["en"]] || key;
}

export function getUITranslation(key: string, language: string): string {
  const lang = language as keyof typeof uiTranslations;
  const translation = uiTranslations[lang]?.[key as keyof (typeof uiTranslations)["en"]];
  const fallbackTranslation = uiTranslations.en[key as keyof (typeof uiTranslations)["en"]];

  // Handle string translations
  if (typeof translation === "string") return translation;
  if (typeof fallbackTranslation === "string") return fallbackTranslation;

  return key;
}

export function getFormTranslation(category: string, key: string, language: string): string {
  const lang = language as keyof typeof formTranslations;
  const categoryTranslations =
    formTranslations[lang]?.[category as keyof (typeof formTranslations)["en"]];
  if (categoryTranslations && typeof categoryTranslations === "object") {
    const translation = categoryTranslations[key as keyof typeof categoryTranslations];
    if (translation) return translation;
  }

  // Fallback to English
  const enCategoryTranslations =
    formTranslations.en[category as keyof (typeof formTranslations)["en"]];
  if (enCategoryTranslations && typeof enCategoryTranslations === "object") {
    const enTranslation = enCategoryTranslations[key as keyof typeof enCategoryTranslations];
    if (enTranslation) return enTranslation;
  }

  return key;
}

export function getDefaultPlaceholder(fieldType: string, language: string): string {
  const lang = language as keyof typeof uiTranslations;
  const placeholders = uiTranslations[lang]?.defaultPlaceholders;
  if (placeholders && typeof placeholders === "object") {
    const placeholder = placeholders[fieldType as keyof typeof placeholders];
    if (placeholder) return placeholder;
  }

  // Fallback to English
  const enPlaceholders = uiTranslations.en.defaultPlaceholders;
  const enPlaceholder = enPlaceholders[fieldType as keyof typeof enPlaceholders];
  return enPlaceholder || "Enter value";
}

export function isRTL(language: string): boolean {
  return language === "he";
}
