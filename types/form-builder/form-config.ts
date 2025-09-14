import type { ThemeConfig } from "./theme-config"

export interface LanguageTexts {
  [languageCode: string]: {
    formTitle?: { [key: string]: string }
    formDescription?: { [key: string]: string }
    fieldLabels?: { [fieldId: string]: string }
    fieldPlaceholders?: { [fieldId: string]: string }
    fieldOptions?: { [fieldId: string]: string[] }
    buttonTexts?: { [fieldId: string]: string }
  }
}

export interface FormConfig {
  // General Settings
  title: string
  description: string
  language: string

  // Multi-language Support
  supportedLanguages?: string[]
  languageTexts?: LanguageTexts

  // URL & Sharing Settings
  redirectUrl: string

  // Notifications
  enableNotifications: boolean
  notificationEmail: string
  notificationMessage: string

  // Theme & Styling
  selectedTheme: string
  customTheme: ThemeConfig | null
  customCSS: string
  showFrame: boolean
  showBackground: boolean
  backgroundColor: string

  // Form Layout
  formWidth: "narrow" | "medium" | "wide" | "full"
  showLogo: boolean
  logoUrl: string
  logoPosition: "left" | "center" | "right"
  logoSize: "small" | "medium" | "large"

  // Advanced Settings
  enableProgressBar: boolean
  enableSaveAndContinue: boolean
  enableAutoSave: boolean
  autoSaveInterval: number
  enableAnalytics: boolean
  trackingId: string
}

export const DEFAULT_FORM_CONFIG: FormConfig = {
  title: "",
  description: "",
  language: "en",
  supportedLanguages: ["en"],
  languageTexts: {},
  redirectUrl: "",
  enableNotifications: true,
  notificationEmail: "",
  notificationMessage:
    "You have received a new response to your form '[FORM_TITLE]'. Please log in to your dashboard to view the details.",
  selectedTheme: "default",
  customTheme: null,
  customCSS: "",
  showFrame: true,
  showBackground: true,
  backgroundColor: "#ffffff",
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
}
