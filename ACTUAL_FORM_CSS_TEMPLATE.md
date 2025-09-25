# Actual Form CSS Template - Based on Current Implementation

## Overview
This document contains the **actual CSS template** based on the current form implementation, with variables for all the real form elements we support.

## CSS Template with Form ID Scoping

```css
/* Form Styles for Form ID: [FORM_ID] */
#[FORM_ID] {
  /* CSS Variables - Form Scoped with Current Values */
  
  /* Typography Variables */
  --form-font-family: "Inter, system-ui, sans-serif";
  --form-font-size-base: "1rem";
  --form-font-size-small: "0.875rem";
  --form-font-size-large: "1.125rem";
  --form-font-size-heading: "1.25rem";
  --form-font-weight-normal: "400";
  --form-font-weight-medium: "500";
  --form-font-weight-semibold: "600";
  --form-font-weight-bold: "700";
  --form-line-height: "1.5";

  /* Color Variables (Current Tailwind Values) */
  --form-primary-color: "#2563eb";
  --form-secondary-color: "#64748b";
  --form-success-color: "#10b981";
  --form-error-color: "#ef4444";
  --form-warning-color: "#f59e0b";
  --form-background-color: "#ffffff";
  --form-surface-color: "#f8fafc";
  --form-text-color: "#1f2937";
  --form-text-secondary-color: "#6b7280";
  --form-border-color: "#e5e7eb";
  --form-border-light-color: "#f3f4f6";
  
  /* Extended Color Palette */
  --form-blue-50: "#eff6ff";
  --form-blue-100: "#dbeafe";
  --form-blue-300: "#93c5fd";
  --form-blue-600: "#2563eb";
  --form-blue-700: "#1d4ed8";
  --form-blue-900: "#1e3a8a";
  --form-gray-50: "#f9fafb";
  --form-gray-100: "#f3f4f6";
  --form-gray-200: "#e5e7eb";
  --form-gray-300: "#d1d5db";
  --form-gray-400: "#9ca3af";
  --form-gray-500: "#6b7280";
  --form-gray-600: "#4b5563";
  --form-gray-700: "#374151";
  --form-gray-900: "#111827";
  --form-red-300: "#fca5a5";
  --form-red-500: "#ef4444";
  --form-green-500: "#10b981";

  /* Spacing Variables */
  --form-spacing-1: "0.25rem";
  --form-spacing-2: "0.5rem";
  --form-spacing-3: "0.75rem";
  --form-spacing-4: "1rem";
  --form-spacing-6: "1.5rem";
  --form-spacing-8: "2rem";
  --form-spacing-12: "3rem";

  /* Border & Radius Variables */
  --form-border-width: "1px";
  --form-border-width-2: "2px";
  --form-border-radius-sm: "0.125rem";
  --form-border-radius: "0.25rem";
  --form-border-radius-md: "0.375rem";
  --form-border-radius-lg: "0.5rem";
  --form-border-radius-xl: "0.75rem";

  /* Shadow Variables */
  --form-shadow-sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)";
  --form-shadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)";
  --form-shadow-md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)";
  --form-shadow-lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)";

  /* Form Container Variables */
  --form-container-max-width: "640px"; /* medium width default */
  --form-container-padding: "2rem";
  --form-container-margin: "20px auto";
  --form-container-background: "#ffffff";
  --form-show-frame: "true";
  --form-show-background: "true";

  /* Input Field Variables */
  --form-input-padding: "0.5rem 0.75rem";
  --form-input-border-width: "1px";
  --form-input-border-color: "#e5e7eb";
  --form-input-border-radius: "0.375rem";
  --form-input-background: "#ffffff";
  --form-input-font-size: "1rem";
  --form-input-focus-border-color: "#2563eb";
  --form-input-focus-box-shadow: "0 0 0 3px rgba(37, 99, 235, 0.1)";
  --form-input-error-border-color: "#ef4444";
  --form-input-error-box-shadow: "0 0 0 3px rgba(239, 68, 68, 0.1)";

  /* Label Variables */
  --form-label-font-size: "1.125rem";
  --form-label-font-weight: "600";
  --form-label-color: "#111827";
  --form-label-margin-bottom: "0.5rem";
  --form-label-line-height: "1.5";

  /* Button Variables */
  --form-button-padding: "0.5rem 2rem";
  --form-button-border-radius: "0.375rem";
  --form-button-font-size: "1rem";
  --form-button-font-weight: "500";
  --form-button-line-height: "1.5";
  --form-button-transition: "all 0.15s ease-in-out";

  /* Primary Button */
  --form-button-primary-background: "#2563eb";
  --form-button-primary-color: "#ffffff";
  --form-button-primary-hover-background: "#1d4ed8";
  --form-button-primary-hover-color: "#ffffff";

  /* Secondary Button */
  --form-button-secondary-background: "transparent";
  --form-button-secondary-color: "#374151";
  --form-button-secondary-border: "1px solid #e5e7eb";
  --form-button-secondary-hover-background: "#f9fafb";

  /* Success Button */
  --form-button-success-background: "#10b981";
  --form-button-success-color: "#ffffff";
  --form-button-success-hover-background: "#059669";

  /* Checkbox/Radio Variables */
  --form-checkbox-size: "1rem";
  --form-checkbox-border-radius: "0.25rem";
  --form-checkbox-border-width: "1px";
  --form-checkbox-border-color: "#e5e7eb";
  --form-checkbox-background: "#ffffff";
  --form-checkbox-checked-background: "#2563eb";
  --form-checkbox-checked-border-color: "#2563eb";
  --form-checkbox-checked-color: "#ffffff";
  --form-checkbox-hover-border-color: "#2563eb";
  --form-checkbox-focus-box-shadow: "0 0 0 3px rgba(37, 99, 235, 0.1)";

  /* Phone Input Variables */
  --form-phone-input-background: "#ffffff";
  --form-phone-input-border: "1px solid #e5e7eb";
  --form-phone-input-border-radius: "0.375rem";
  --form-phone-input-padding: "0.5rem 0.75rem";
  --form-phone-input-focus-border-color: "#2563eb";
  --form-phone-input-focus-box-shadow: "0 0 0 3px rgba(37, 99, 235, 0.1)";

  /* File Upload Variables */
  --form-file-upload-border: "2px dashed #d1d5db";
  --form-file-upload-border-radius: "0.5rem";
  --form-file-upload-padding: "1.5rem";
  --form-file-upload-background: "#f9fafb";
  --form-file-upload-hover-background: "#f3f4f6";
  --form-file-upload-drag-active-border: "2px dashed #60a5fa";
  --form-file-upload-drag-active-background: "#eff6ff";
  --form-file-upload-error-border: "2px dashed #fca5a5";
  --form-file-upload-error-background: "#fef2f2";

  /* Signature Field Variables */
  --form-signature-border: "2px dashed #93c5fd";
  --form-signature-border-radius: "0.5rem";
  --form-signature-padding: "2rem";
  --form-signature-background: "#eff6ff";
  --form-signature-button-border: "1px solid #93c5fd";
  --form-signature-button-color: "#1d4ed8";
  --form-signature-button-hover-background: "#dbeafe";
  --form-signature-button-hover-border: "1px solid #93c5fd";
  --form-signature-preview-border: "1px solid #e5e7eb";
  --form-signature-preview-background: "#ffffff";

  /* Heading Variables */
  --form-heading-font-size: "1.25rem";
  --form-heading-font-weight: "600";
  --form-heading-color: "#111827";
  --form-heading-margin-bottom: "1.5rem";
  --form-heading-line-height: "1.5";

  /* Text Block Variables */
  --form-text-block-font-size: "1rem";
  --form-text-block-color: "#374151";
  --form-text-block-line-height: "1.5";
  --form-text-block-margin-bottom: "1.5rem";

  /* Help Text Variables */
  --form-help-text-font-size: "0.75rem";
  --form-help-text-color: "#6b7280";
  --form-help-text-margin-top: "0.25rem";
  --form-help-text-line-height: "1.5";

  /* Error Message Variables */
  --form-error-color: "#ef4444";
  --form-error-font-size: "0.875rem";
  --form-error-margin-top: "0.25rem";
  --form-error-line-height: "1.5";

  /* RTL/LTR Direction Variables */
  --form-direction: "ltr"; /* Will be "rtl" for RTL languages */
  --form-text-align: "left"; /* Will be "right" for RTL */
  --form-flex-direction: "row"; /* Will be "row-reverse" for RTL */
}

/* Form Container Styles - Based on Current .form-content-container */
#[FORM_ID] .form-content-container {
  max-width: var(--form-container-max-width);
  margin: var(--form-container-margin);
  padding: var(--form-container-padding);
  background: var(--form-container-background);
  font-family: var(--form-font-family);
}

/* Form Field Container - Based on Current .form-field */
#[FORM_ID] .form-field {
  margin-bottom: var(--form-spacing-6);
}

/* Form Label - Based on Current Label Implementation */
#[FORM_ID] .form-field label {
  display: block;
  font-size: var(--form-label-font-size);
  font-weight: var(--form-label-font-weight);
  color: var(--form-label-color);
  margin-bottom: var(--form-label-margin-bottom);
  line-height: var(--form-label-line-height);
  text-align: var(--form-text-align);
}

/* Form Input Fields - Based on Current .form-input */
#[FORM_ID] .form-input {
  width: 100%;
  padding: var(--form-input-padding);
  border: var(--form-input-border-width) solid var(--form-input-border-color);
  border-radius: var(--form-input-border-radius);
  background: var(--form-input-background);
  font-size: var(--form-input-font-size);
  line-height: var(--form-line-height);
  transition: var(--form-button-transition);
  direction: var(--form-direction);
  text-align: var(--form-text-align);
}

#[FORM_ID] .form-input:focus {
  outline: none;
  border-color: var(--form-input-focus-border-color);
  box-shadow: var(--form-input-focus-box-shadow);
}

#[FORM_ID] .form-input.error,
#[FORM_ID] .form-input.border-red-500 {
  border-color: var(--form-input-error-border-color);
  box-shadow: var(--form-input-error-box-shadow);
}

/* Form Buttons - Based on Current .form-button Classes */
#[FORM_ID] .form-button {
  padding: var(--form-button-padding);
  border-radius: var(--form-button-border-radius);
  font-size: var(--form-button-font-size);
  font-weight: var(--form-button-font-weight);
  line-height: var(--form-button-line-height);
  transition: var(--form-button-transition);
  cursor: pointer;
  border: none;
  direction: var(--form-direction);
}

#[FORM_ID] .form-button-primary {
  background: var(--form-button-primary-background);
  color: var(--form-button-primary-color);
}

#[FORM_ID] .form-button-primary:hover {
  background: var(--form-button-primary-hover-background);
  color: var(--form-button-primary-hover-color);
}

#[FORM_ID] .form-button-secondary {
  background: var(--form-button-secondary-background);
  color: var(--form-button-secondary-color);
  border: var(--form-button-secondary-border);
}

#[FORM_ID] .form-button-secondary:hover {
  background: var(--form-button-secondary-hover-background);
}

#[FORM_ID] .form-button-success {
  background: var(--form-button-success-background);
  color: var(--form-button-success-color);
}

#[FORM_ID] .form-button-success:hover {
  background: var(--form-button-success-hover-background);
}

/* Checkbox and Radio Styles - Based on Current Implementation */
#[FORM_ID] input[type="checkbox"],
#[FORM_ID] input[type="radio"] {
  width: var(--form-checkbox-size);
  height: var(--form-checkbox-size);
  border: var(--form-checkbox-border-width) solid var(--form-checkbox-border-color);
  border-radius: var(--form-checkbox-border-radius);
  background: var(--form-checkbox-background);
  transition: var(--form-button-transition);
}

#[FORM_ID] input[type="checkbox"]:checked,
#[FORM_ID] input[type="radio"]:checked {
  background: var(--form-checkbox-checked-background);
  border-color: var(--form-checkbox-checked-border-color);
  color: var(--form-checkbox-checked-color);
}

#[FORM_ID] input[type="checkbox"]:hover,
#[FORM_ID] input[type="radio"]:hover {
  border-color: var(--form-checkbox-hover-border-color);
}

#[FORM_ID] input[type="checkbox"]:focus,
#[FORM_ID] input[type="radio"]:focus {
  box-shadow: var(--form-checkbox-focus-box-shadow);
}

/* Radio Button Specific */
#[FORM_ID] input[type="radio"] {
  border-radius: var(--form-border-radius-xl);
}

/* Multiple Choice and Checkbox Groups - Based on Current Implementation */
#[FORM_ID] .space-y-3 > div {
  display: flex;
  align-items: center;
  gap: var(--form-spacing-2);
  flex-direction: var(--form-flex-direction);
}

#[FORM_ID] .space-y-3 > div label {
  flex: 1;
  margin-bottom: 0;
  font-size: var(--form-font-size-base);
  font-weight: var(--form-font-weight-normal);
}

/* Phone Input - Based on Current PhoneInput Component */
#[FORM_ID] .form-phone-input {
  background: var(--form-phone-input-background);
  border: var(--form-phone-input-border);
  border-radius: var(--form-phone-input-border-radius);
  padding: var(--form-phone-input-padding);
  transition: var(--form-button-transition);
}

#[FORM_ID] .form-phone-input:focus-within {
  border-color: var(--form-phone-input-focus-border-color);
  box-shadow: var(--form-phone-input-focus-box-shadow);
}

/* File Upload - Based on Current FileUploadField */
#[FORM_ID] .file-upload-area {
  border: var(--form-file-upload-border);
  border-radius: var(--form-file-upload-border-radius);
  padding: var(--form-file-upload-padding);
  background: var(--form-file-upload-background);
  text-align: center;
  transition: var(--form-button-transition);
  cursor: pointer;
}

#[FORM_ID] .file-upload-area:hover {
  background: var(--form-file-upload-hover-background);
}

#[FORM_ID] .file-upload-area.drag-active {
  border: var(--form-file-upload-drag-active-border);
  background: var(--form-file-upload-drag-active-background);
}

#[FORM_ID] .file-upload-area.error {
  border: var(--form-file-upload-error-border);
  background: var(--form-file-upload-error-background);
}

/* Signature Field - Based on Current Signature Implementation */
#[FORM_ID] .signature-area {
  border: var(--form-signature-border);
  border-radius: var(--form-signature-border-radius);
  padding: var(--form-signature-padding);
  background: var(--form-signature-background);
  text-align: center;
}

#[FORM_ID] .signature-button {
  border: var(--form-signature-button-border);
  color: var(--form-signature-button-color);
  background: transparent;
}

#[FORM_ID] .signature-button:hover {
  background: var(--form-signature-button-hover-background);
  border: var(--form-signature-button-hover-border);
}

#[FORM_ID] .signature-preview {
  border: var(--form-signature-preview-border);
  background: var(--form-signature-preview-background);
}

/* Heading - Based on Current Heading Implementation */
#[FORM_ID] .form-heading {
  font-size: var(--form-heading-font-size);
  font-weight: var(--form-heading-font-weight);
  color: var(--form-heading-color);
  margin-bottom: var(--form-heading-margin-bottom);
  line-height: var(--form-heading-line-height);
  text-align: var(--form-text-align);
  direction: var(--form-direction);
}

/* Text Block - Based on Current Text Block Implementation */
#[FORM_ID] .form-text-block {
  font-size: var(--form-text-block-font-size);
  color: var(--form-text-block-color);
  line-height: var(--form-text-block-line-height);
  margin-bottom: var(--form-text-block-margin-bottom);
  text-align: var(--form-text-align);
  direction: var(--form-direction);
}

/* Help Text - Based on Current Help Text Implementation */
#[FORM_ID] .form-help-text {
  font-size: var(--form-help-text-font-size);
  color: var(--form-help-text-color);
  margin-top: var(--form-help-text-margin-top);
  line-height: var(--form-help-text-line-height);
  text-align: var(--form-text-align);
  direction: var(--form-direction);
}

/* Error Messages - Based on Current Error Implementation */
#[FORM_ID] .form-error {
  color: var(--form-error-color);
  font-size: var(--form-error-font-size);
  margin-top: var(--form-error-margin-top);
  line-height: var(--form-error-line-height);
  text-align: var(--form-text-align);
  direction: var(--form-direction);
}

/* Required Field Asterisk */
#[FORM_ID] .form-field label .text-red-500 {
  color: var(--form-error-color);
}

/* Date Input Icon - Based on Current Calendar Icon Implementation */
#[FORM_ID] .date-input-icon {
  color: var(--form-gray-400);
}

/* File List Items - Based on Current File Upload Implementation */
#[FORM_ID] .file-item {
  border: 1px solid var(--form-border-color);
  border-radius: var(--form-border-radius-lg);
  padding: var(--form-spacing-3);
  display: flex;
  align-items: center;
  gap: var(--form-spacing-3);
}

#[FORM_ID] .file-item img {
  border-radius: var(--form-border-radius);
  border: 1px solid var(--form-border-color);
}

/* Responsive Design - Based on Current Implementation */
@media (max-width: 768px) {
  #[FORM_ID] .form-content-container {
    margin: var(--form-spacing-4) auto;
    padding: var(--form-spacing-4);
  }
  
  #[FORM_ID] .form-input {
    font-size: 16px; /* Prevents zoom on iOS */
  }
}

/* RTL Language Support */
#[FORM_ID][dir="rtl"] {
  --form-direction: "rtl";
  --form-text-align: "right";
  --form-flex-direction: "row-reverse";
}

#[FORM_ID][dir="ltr"] {
  --form-direction: "ltr";
  --form-text-align: "left";
  --form-flex-direction: "row";
}
```

## Database Schema for Variables

### Form Styling Variables Table
```sql
CREATE TABLE form_styling_variables (
  id TEXT PRIMARY KEY,
  form_id TEXT NOT NULL,
  variable_name TEXT NOT NULL,
  variable_value TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(form_id, variable_name),
  FOREIGN KEY (form_id) REFERENCES Form(id) ON DELETE CASCADE
);
```

### Default Variables Table
```sql
CREATE TABLE form_styling_defaults (
  id TEXT PRIMARY KEY,
  variable_name TEXT UNIQUE NOT NULL,
  default_value TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  data_type TEXT NOT NULL, -- 'color', 'size', 'font', 'spacing', 'border', 'shadow'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Total Variables Count
**Total User-Editable Variables: 89**
- Typography: 10 variables
- Colors: 27 variables (including extended palette)
- Spacing: 7 variables
- Borders & Radius: 7 variables
- Shadows: 4 variables
- Form Container: 6 variables
- Input Fields: 11 variables
- Labels: 5 variables
- Buttons: 14 variables
- Checkboxes/Radio: 10 variables
- Phone Input: 6 variables
- File Upload: 8 variables
- Signature: 9 variables
- Heading: 5 variables
- Text Block: 4 variables
- Help Text: 4 variables
- Error Messages: 4 variables
- RTL/LTR: 7 variables

## Key Features
1. **Complete Isolation**: Each form has unique CSS scope `#[FORM_ID]`
2. **RTL/LTR Support**: Direction variables for language switching
3. **Real Implementation**: Based on actual current form elements and classes
4. **Comprehensive Coverage**: All 13 supported field types included
5. **Current Values**: All default values match existing implementation
6. **Responsive Design**: Mobile-friendly breakpoints included
7. **Performance**: CSS generated only when needed, cached efficiently
