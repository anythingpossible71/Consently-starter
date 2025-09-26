import type { ThemeConfigInterface } from "./theme-config";

export interface LanguageTexts {
  [languageCode: string]: {
    formTitle?: Record<string, string>;
    formDescription?: Record<string, string>;
    fieldLabels?: Record<string, string>;
    fieldPlaceholders?: Record<string, string>;
    fieldOptions?: Record<string, string[]>;
    buttonTexts?: Record<string, string>;
  };
}

export interface FormConfig {
  title: string;
  description: string;
  language: string;
  supportedLanguages?: string[];
  languageTexts?: LanguageTexts;
  redirectUrl: string;
  redirectTarget: "same" | "new" | "parent";
  postSubmitSettings: {
    title: string;
    message: string;
    buttonText: string;
    buttonAction: "back" | "close" | "hidden";
  };
  enableNotifications: boolean;
  notificationEmail: string;
  notificationMessage: string;
  selectedTheme: string;
  customTheme: ThemeConfigInterface | null;
  customCSS: string;
  applyCustomCSS: boolean;
  showFrame: boolean;
  showBackground: boolean;
  backgroundColor: string;
  formFontFamily: string;
  submitButtonColor: string;
  formWidth: "narrow" | "medium" | "wide" | "full";
  showLogo: boolean;
  logoUrl: string;
  logoPosition: "left" | "center" | "right";
  logoSize: "small" | "medium" | "large";
  enableProgressBar: boolean;
  enableSaveAndContinue: boolean;
  enableAutoSave: boolean;
  autoSaveInterval: number;
  enableAnalytics: boolean;
  trackingId: string;
  submitButton: {
    text: string;
    style: "primary" | "secondary" | "success";
    icon: "send" | "check" | "arrow";
  };
}

export const DEFAULT_FORM_CONFIG: FormConfig = {
  title: "",
  description: "",
  language: "en",
  supportedLanguages: ["en"],
  languageTexts: {},
  redirectUrl: "",
  postSubmitSettings: {
    title: "Form Submitted!",
    message: "Thank you for your submission. We have received your response.",
    buttonText: "Go Back",
    buttonAction: "back",
  },
  redirectTarget: "same",
  enableNotifications: true,
  notificationEmail: "",
  notificationMessage:
    "You have received a new response to your form '[FORM_TITLE]'. Please log in to your dashboard to view the details.",
  selectedTheme: "default",
  customTheme: null,
  customCSS: "",
  applyCustomCSS: false,
  showFrame: true,
  showBackground: true,
  backgroundColor: "#ffffff",
  formFontFamily: "Inter, system-ui, sans-serif",
  submitButtonColor: "#2563eb",
  formWidth: "medium",
  showLogo: false,
  logoUrl: "",
  logoPosition: "center",
  logoSize: "medium",
  enableProgressBar: false,
  enableSaveAndContinue: false,
  enableAutoSave: false,
  autoSaveInterval: 30,
  enableAnalytics: false,
  trackingId: "",
  submitButton: {
    text: "",
    style: "primary",
    icon: "send",
  },
};
