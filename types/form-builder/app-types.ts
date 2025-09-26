import type { FormField } from "./form-builder";
import type { ThemeConfigInterface } from "./theme-config";

type LanguageCode = string;

type FormFieldTranslation = Record<string, string>;

export interface FormConfig {
  supportedLanguages?: LanguageCode[];
  mainLanguage?: LanguageCode;
  submitButton: {
    text: string;
    icon: "send" | "check" | "arrow";
    style: "primary" | "secondary" | "success";
  };
  [key: string]: unknown;
}

export interface FormData {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  status: "draft" | "published";
  responseCount: number;
  fields: FormField[];
  config: FormConfig;
  shareUrl?: string;
}

export interface FormResponse {
  id: string;
  formId: string;
  submittedAt: string;
  data: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export interface FormViewSettings {
  id: string;
  formId: string;
  userId: string;
  visibleFields: string[];
  tableSortField?: string;
  tableSortOrder?: "asc" | "desc";
}

export interface FormStylingPayload {
  tokens: Record<string, string>;
  variables: Record<string, string>;
}

export interface FormThemePreview {
  theme: ThemeConfigInterface;
  customCSS?: string;
  formConfig?: FormConfig;
}

export interface TranslationMap {
  [language: LanguageCode]: FormFieldTranslation;
}

export type AppPage = "home" | "editor" | "responses";
