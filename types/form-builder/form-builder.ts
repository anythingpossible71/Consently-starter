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
  | "submit";

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  showLabel?: boolean;
  options?: string[];
  buttonText?: string;
  buttonIcon?: "send" | "check" | "arrow";
  buttonStyle?: "primary" | "secondary" | "success";
  signatureMethods?: {
    draw: boolean;
    upload: boolean;
  };
  signatureSettings?: {
    showColorPicker: boolean;
    defaultColor: "black" | "blue" | "red";
  };
  phoneSettings?: {
    format: "national" | "international";
    defaultCountryCode: string;
    showCountrySelector: boolean;
    enableValidation: boolean;
    validationMessage: string;
  };
  requiredErrorMessage?: string;
  acceptedFileTypes?: string;
  maxFileSize?: number;
  maxFiles?: number;
  allowMultipleFiles?: boolean;
  richTextContent?: string;
  translations?: Record<string, Record<string, string>>;
  stylingOverrides?: Record<string, string>;
}

export interface ValidationError {
  fieldId: string;
  message: string;
}
