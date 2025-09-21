export type FieldType =
  | "text"
  | "email"
  | "phone"
  | "textarea"
  | "multiple-choice"
  | "checkboxes"
  | "agreement"
  | "date"
  | "file-upload"
  | "signature"
  | "heading"
  | "text-block"
  | "submit"

export interface FormField {
  id: string
  type: FieldType
  label: string
  placeholder?: string
  helpText?: string
  required: boolean
  showLabel?: boolean
  options?: string[]
  // Submit button specific properties
  buttonText?: string
  buttonIcon?: string
  buttonStyle?: "primary" | "secondary" | "success"
  // Signature specific properties
  signatureMethods?: {
    draw: boolean
    upload: boolean
  }
  signatureSettings?: {
    showColorPicker: boolean
    defaultColor: "black" | "blue" | "red"
  }
  // Phone specific properties
  phoneSettings?: {
    format: "national" | "international"
    defaultCountryCode: string // Country code like "US", "GB", "CA", etc.
    showCountrySelector: boolean
    enableValidation: boolean
    validationMessage: string
  }
  // Required field error message
  requiredErrorMessage?: string
  // File upload specific properties
  acceptedFileTypes?: string
  maxFileSize?: number
  maxFiles?: number
  allowMultipleFiles?: boolean
  // Rich text content for text-block fields
  richTextContent?: string
  // Translations for multi-language support
  translations?: Record<string, Record<string, string>>
}

export interface ValidationError {
  fieldId: string
  message: string
}
