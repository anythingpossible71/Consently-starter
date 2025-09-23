import type { ThemeConfigInterface } from "./theme-config"

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
  redirectTarget: "same" | "new" | "parent"

  // Post-Submit Settings
  postSubmitSettings: {
    title: string
    message: string
    buttonText: string
    buttonAction: "back" | "close" | "hidden"
  }

  // Notifications
  enableNotifications: boolean
  notificationEmail: string
  notificationMessage: string

  // Theme & Styling
  selectedTheme: string
  customTheme: ThemeConfigInterface | null
  customCSS: string
  applyCustomCSS: boolean
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

  // Submit Button Settings
  submitButton: {
    text: string
    style: "primary" | "secondary" | "success"
    icon: string
  }
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
    buttonAction: "back"
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
    text: "Submit",
    style: "primary",
    icon: "send",
  },
}
