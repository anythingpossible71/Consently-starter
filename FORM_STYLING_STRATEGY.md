# Form Styling Strategy - CSS Variables & Template System
## Based on ACTUAL Current Form Implementation

## Overview
This document outlines the complete CSS variable system and template structure for form styling isolation based on the **actual current form implementation**. Each form will have its own unique CSS scope based on the form ID.

## Current Form Elements (Based on FieldType)
1. **text** - Text input fields
2. **email** - Email input fields  
3. **phone** - Phone input with country selector
4. **textarea** - Multi-line text input
5. **multiple-choice** - Radio button groups
6. **checkboxes** - Checkbox groups
7. **agreement** - Single checkbox for terms
8. **date** - Date picker input
9. **file-upload** - Drag & drop file upload
10. **signature** - Electronic signature field
11. **heading** - Section headings
12. **text-block** - Rich text content blocks
13. **submit** - Submit button

## Current CSS Classes (From Actual Implementation)
- `.form-field` - Container for each form field
- `.form-input` - Input fields (text, email, textarea, date)
- `.form-button` - Button base class
- `.form-button-primary` - Primary button style
- `.form-button-secondary` - Secondary button style
- `.form-button-success` - Success button style
- `.form-content-container` - Main form container

## CSS Variables Structure (Based on Actual Elements)

### 1. Typography Variables
```css
--form-font-family: string; /* Currently: "Inter, system-ui, sans-serif" */
--form-font-size-base: string; /* Currently: "1rem" */
--form-font-size-small: string; /* Currently: "0.875rem" */
--form-font-size-large: string; /* Currently: "1.125rem" */
--form-font-size-heading: string; /* Currently: "1.25rem" (text-xl) */
--form-font-weight-normal: string; /* Currently: "400" */
--form-font-weight-medium: string; /* Currently: "500" */
--form-font-weight-semibold: string; /* Currently: "600" */
--form-font-weight-bold: string; /* Currently: "700" */
--form-line-height: string; /* Currently: "1.5" */
```

### 2. Color Variables (Based on Current Tailwind Classes)
```css
--form-primary-color: string; /* Currently: "#2563eb" (blue-600) */
--form-secondary-color: string; /* Currently: "#64748b" (slate-500) */
--form-success-color: string; /* Currently: "#10b981" (emerald-500) */
--form-error-color: string; /* Currently: "#ef4444" (red-500) */
--form-warning-color: string; /* Currently: "#f59e0b" (amber-500) */
--form-background-color: string; /* Currently: "#ffffff" (white) */
--form-surface-color: string; /* Currently: "#f8fafc" (slate-50) */
--form-text-color: string; /* Currently: "#1f2937" (gray-900) */
--form-text-secondary-color: string; /* Currently: "#6b7280" (gray-500) */
--form-border-color: string; /* Currently: "#e5e7eb" (gray-200) */
--form-border-light-color: string; /* Currently: "#f3f4f6" (gray-100) */
--form-blue-50: string; /* Currently: "#eff6ff" */
--form-blue-100: string; /* Currently: "#dbeafe" */
--form-blue-300: string; /* Currently: "#93c5fd" */
--form-blue-600: string; /* Currently: "#2563eb" */
--form-blue-700: string; /* Currently: "#1d4ed8" */
--form-blue-900: string; /* Currently: "#1e3a8a" */
--form-gray-50: string; /* Currently: "#f9fafb" */
--form-gray-100: string; /* Currently: "#f3f4f6" */
--form-gray-200: string; /* Currently: "#e5e7eb" */
--form-gray-300: string; /* Currently: "#d1d5db" */
--form-gray-400: string; /* Currently: "#9ca3af" */
--form-gray-500: string; /* Currently: "#6b7280" */
--form-gray-600: string; /* Currently: "#4b5563" */
--form-gray-700: string; /* Currently: "#374151" */
--form-gray-900: string; /* Currently: "#111827" */
--form-red-300: string; /* Currently: "#fca5a5" */
--form-red-500: string; /* Currently: "#ef4444" */
--form-green-500: string; /* Currently: "#10b981" */
```

### 3. Spacing Variables (Based on Current Tailwind Spacing)
```css
--form-spacing-1: string; /* Currently: "0.25rem" */
--form-spacing-2: string; /* Currently: "0.5rem" */
--form-spacing-3: string; /* Currently: "0.75rem" */
--form-spacing-4: string; /* Currently: "1rem" */
--form-spacing-6: string; /* Currently: "1.5rem" */
--form-spacing-8: string; /* Currently: "2rem" */
--form-spacing-12: string; /* Currently: "3rem" */
```

### 4. Border & Radius Variables (Based on Current Tailwind)
```css
--form-border-width: string; /* Currently: "1px" */
--form-border-width-2: string; /* Currently: "2px" */
--form-border-radius-sm: string; /* Currently: "0.125rem" */
--form-border-radius: string; /* Currently: "0.25rem" */
--form-border-radius-md: string; /* Currently: "0.375rem" */
--form-border-radius-lg: string; /* Currently: "0.5rem" */
--form-border-radius-xl: string; /* Currently: "0.75rem" */
```

### 5. Shadow Variables (Based on Current Tailwind)
```css
--form-shadow-sm: string; /* Currently: "0 1px 2px 0 rgb(0 0 0 / 0.05)" */
--form-shadow: string; /* Currently: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)" */
--form-shadow-md: string; /* Currently: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)" */
--form-shadow-lg: string; /* Currently: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)" */
```

### 6. Form Container Variables
```css
--form-container-max-width: string; /* Based on formWidth setting */
--form-container-padding: string; /* Currently: "2rem" */
--form-container-margin: string; /* Currently: "20px auto" */
--form-container-background: string; /* Currently: backgroundColor from FormConfig */
--form-show-frame: string; /* Currently: showFrame from FormConfig */
--form-show-background: string; /* Currently: showBackground from FormConfig */
```

### 7. Input Field Variables (Based on Current .form-input Class)
```css
--form-input-padding: string; /* Currently: "0.5rem 0.75rem" */
--form-input-border-width: string; /* Currently: "1px" */
--form-input-border-color: string; /* Currently: "#e5e7eb" */
--form-input-border-radius: string; /* Currently: "0.375rem" */
--form-input-background: string; /* Currently: "#ffffff" */
--form-input-font-size: string; /* Currently: "1rem" */
--form-input-focus-border-color: string; /* Currently: "#2563eb" */
--form-input-focus-box-shadow: string; /* Currently: "0 0 0 3px rgba(37, 99, 235, 0.1)" */
--form-input-error-border-color: string; /* Currently: "#ef4444" */
--form-input-error-box-shadow: string; /* Currently: "0 0 0 3px rgba(239, 68, 68, 0.1)" */
```

### 8. Label Variables (Based on Current Label Implementation)
```css
--form-label-font-size: string; /* Currently: "1.125rem" (text-lg) */
--form-label-font-weight: string; /* Currently: "600" (font-semibold) */
--form-label-color: string; /* Currently: "#111827" (text-gray-900) */
--form-label-margin-bottom: string; /* Currently: "0.5rem" (mb-2) */
--form-label-line-height: string; /* Currently: "1.5" */
```

### 9. Button Variables (Based on Current .form-button Classes)
```css
--form-button-padding: string; /* Currently: "0.5rem 2rem" (px-8 py-3) */
--form-button-border-radius: string; /* Currently: "0.375rem" */
--form-button-font-size: string; /* Currently: "1rem" */
--form-button-font-weight: string; /* Currently: "500" */
--form-button-line-height: string; /* Currently: "1.5" */
--form-button-transition: string; /* Currently: "all 0.15s ease-in-out" */

/* Primary Button (Based on Current .form-button-primary) */
--form-button-primary-background: string; /* Currently: "#2563eb" */
--form-button-primary-color: string; /* Currently: "#ffffff" */
--form-button-primary-hover-background: string; /* Currently: "#1d4ed8" */
--form-button-primary-hover-color: string; /* Currently: "#ffffff" */

/* Secondary Button (Based on Current .form-button-secondary) */
--form-button-secondary-background: string; /* Currently: "transparent" */
--form-button-secondary-color: string; /* Currently: "#374151" */
--form-button-secondary-border: string; /* Currently: "1px solid #e5e7eb" */
--form-button-secondary-hover-background: string; /* Currently: "#f9fafb" */

/* Success Button (Based on Current .form-button-success) */
--form-button-success-background: string; /* Currently: "#10b981" */
--form-button-success-color: string; /* Currently: "#ffffff" */
--form-button-success-hover-background: string; /* Currently: "#059669" */
```

### 10. Checkbox/Radio Variables (Based on Current Implementation)
```css
--form-checkbox-size: string; /* Currently: "1rem" */
--form-checkbox-border-radius: string; /* Currently: "0.25rem" */
--form-checkbox-border-width: string; /* Currently: "1px" */
--form-checkbox-border-color: string; /* Currently: "#e5e7eb" */
--form-checkbox-background: string; /* Currently: "#ffffff" */
--form-checkbox-checked-background: string; /* Currently: "#2563eb" */
--form-checkbox-checked-border-color: string; /* Currently: "#2563eb" */
--form-checkbox-checked-color: string; /* Currently: "#ffffff" */
--form-checkbox-hover-border-color: string; /* Currently: "#2563eb" */
--form-checkbox-focus-box-shadow: string; /* Currently: "0 0 0 3px rgba(37, 99, 235, 0.1)" */
```

### 11. Phone Input Variables (Based on Current PhoneInput Component)
```css
--form-phone-input-background: string; /* Currently: "#ffffff" */
--form-phone-input-border: string; /* Currently: "1px solid #e5e7eb" */
--form-phone-input-border-radius: string; /* Currently: "0.375rem" */
--form-phone-input-padding: string; /* Currently: "0.5rem 0.75rem" */
--form-phone-input-focus-border-color: string; /* Currently: "#2563eb" */
--form-phone-input-focus-box-shadow: string; /* Currently: "0 0 0 3px rgba(37, 99, 235, 0.1)" */
```

### 12. File Upload Variables (Based on Current FileUploadField)
```css
--form-file-upload-border: string; /* Currently: "2px dashed #d1d5db" */
--form-file-upload-border-radius: string; /* Currently: "0.5rem" */
--form-file-upload-padding: string; /* Currently: "1.5rem" */
--form-file-upload-background: string; /* Currently: "#f9fafb" */
--form-file-upload-hover-background: string; /* Currently: "#f3f4f6" */
--form-file-upload-drag-active-border: string; /* Currently: "2px dashed #60a5fa" */
--form-file-upload-drag-active-background: string; /* Currently: "#eff6ff" */
--form-file-upload-error-border: string; /* Currently: "2px dashed #fca5a5" */
--form-file-upload-error-background: string; /* Currently: "#fef2f2" */
```

### 13. Signature Field Variables (Based on Current Signature Implementation)
```css
--form-signature-border: string; /* Currently: "2px dashed #93c5fd" */
--form-signature-border-radius: string; /* Currently: "0.5rem" */
--form-signature-padding: string; /* Currently: "2rem" */
--form-signature-background: string; /* Currently: "#eff6ff" */
--form-signature-button-border: string; /* Currently: "1px solid #93c5fd" */
--form-signature-button-color: string; /* Currently: "#1d4ed8" */
--form-signature-button-hover-background: string; /* Currently: "#dbeafe" */
--form-signature-button-hover-border: string; /* Currently: "1px solid #93c5fd" */
--form-signature-preview-border: string; /* Currently: "1px solid #e5e7eb" */
--form-signature-preview-background: string; /* Currently: "#ffffff" */
```

### 14. Heading Variables (Based on Current Heading Implementation)
```css
--form-heading-font-size: string; /* Currently: "1.25rem" (text-xl) */
--form-heading-font-weight: string; /* Currently: "600" (font-semibold) */
--form-heading-color: string; /* Currently: "#111827" (text-gray-900) */
--form-heading-margin-bottom: string; /* Currently: "1.5rem" */
--form-heading-line-height: string; /* Currently: "1.5" */
```

### 15. Text Block Variables (Based on Current Text Block Implementation)
```css
--form-text-block-font-size: string; /* Currently: "1rem" */
--form-text-block-color: string; /* Currently: "#374151" (text-gray-700) */
--form-text-block-line-height: string; /* Currently: "1.5" */
--form-text-block-margin-bottom: string; /* Currently: "1.5rem" */
```

### 16. Help Text Variables (Based on Current Help Text Implementation)
```css
--form-help-text-font-size: string; /* Currently: "0.75rem" (text-xs) */
--form-help-text-color: string; /* Currently: "#6b7280" (text-gray-500) */
--form-help-text-margin-top: string; /* Currently: "0.25rem" (mt-1) */
--form-help-text-line-height: string; /* Currently: "1.5" */
```

### 17. Error Message Variables (Based on Current Error Implementation)
```css
--form-error-color: string; /* Currently: "#ef4444" (text-red-500) */
--form-error-font-size: string; /* Currently: "0.875rem" (text-sm) */
--form-error-margin-top: string; /* Currently: "0.25rem" */
--form-error-line-height: string; /* Currently: "1.5" */
```

### 18. RTL/LTR Direction Variables
```css
--form-direction: string; /* "ltr" or "rtl" based on language */
--form-text-align: string; /* "left" or "right" based on direction */
--form-flex-direction: string; /* "row" or "row-reverse" based on direction */
--form-margin-start: string; /* "margin-left" or "margin-right" based on direction */
--form-margin-end: string; /* "margin-right" or "margin-left" based on direction */
--form-padding-start: string; /* "padding-left" or "padding-right" based on direction */
--form-padding-end: string; /* "padding-right" or "padding-left" based on direction */
```

## CSS Template Structure

### Base Template with Form ID Scoping
```css
/* Form Styles for Form ID: [FORM_ID] */
#[FORM_ID] {
  /* CSS Variables - Form Scoped */
  --form-font-family: var(--form-font-family, "Inter, system-ui, sans-serif");
  --form-font-size-base: var(--form-font-size-base, "1rem");
  --form-font-size-small: var(--form-font-size-small, "0.875rem");
  --form-font-size-large: var(--form-font-size-large, "1.125rem");
  --form-font-size-heading: var(--form-font-size-heading, "1.5rem");
  --form-font-weight-normal: var(--form-font-weight-normal, "400");
  --form-font-weight-medium: var(--form-font-weight-medium, "500");
  --form-font-weight-bold: var(--form-font-weight-bold, "700");
  --form-line-height: var(--form-line-height, "1.5");
  --form-letter-spacing: var(--form-letter-spacing, "0");

  /* Color Variables */
  --form-primary-color: var(--form-primary-color, "#2563eb");
  --form-secondary-color: var(--form-secondary-color, "#64748b");
  --form-success-color: var(--form-success-color, "#10b981");
  --form-warning-color: var(--form-warning-color, "#f59e0b");
  --form-error-color: var(--form-error-color, "#ef4444");
  --form-info-color: var(--form-info-color, "#3b82f6");
  --form-background-color: var(--form-background-color, "#ffffff");
  --form-surface-color: var(--form-surface-color, "#f8fafc");
  --form-text-color: var(--form-text-color, "#1f2937");
  --form-text-secondary-color: var(--form-text-secondary-color, "#6b7280");
  --form-border-color: var(--form-border-color, "#e5e7eb");
  --form-border-light-color: var(--form-border-light-color, "#f3f4f6");

  /* Spacing Variables */
  --form-padding-xs: var(--form-padding-xs, "0.25rem");
  --form-padding-sm: var(--form-padding-sm, "0.5rem");
  --form-padding-md: var(--form-padding-md, "1rem");
  --form-padding-lg: var(--form-padding-lg, "1.5rem");
  --form-padding-xl: var(--form-padding-xl, "2rem");
  --form-margin-xs: var(--form-margin-xs, "0.25rem");
  --form-margin-sm: var(--form-margin-sm, "0.5rem");
  --form-margin-md: var(--form-margin-md, "1rem");
  --form-margin-lg: var(--form-margin-lg, "1.5rem");
  --form-margin-xl: var(--form-margin-xl, "2rem");
  --form-gap-xs: var(--form-gap-xs, "0.25rem");
  --form-gap-sm: var(--form-gap-sm, "0.5rem");
  --form-gap-md: var(--form-gap-md, "1rem");
  --form-gap-lg: var(--form-gap-lg, "1.5rem");

  /* Border & Radius Variables */
  --form-border-width: var(--form-border-width, "1px");
  --form-border-radius-none: var(--form-border-radius-none, "0");
  --form-border-radius-sm: var(--form-border-radius-sm, "0.25rem");
  --form-border-radius-md: var(--form-border-radius-md, "0.375rem");
  --form-border-radius-lg: var(--form-border-radius-lg, "0.5rem");
  --form-border-radius-xl: var(--form-border-radius-xl, "0.75rem");
  --form-border-radius-full: var(--form-border-radius-full, "9999px");

  /* Shadow Variables */
  --form-shadow-none: var(--form-shadow-none, "none");
  --form-shadow-sm: var(--form-shadow-sm, "0 1px 2px 0 rgba(0, 0, 0, 0.05)");
  --form-shadow-md: var(--form-shadow-md, "0 4px 6px -1px rgba(0, 0, 0, 0.1)");
  --form-shadow-lg: var(--form-shadow-lg, "0 10px 15px -3px rgba(0, 0, 0, 0.1)");
  --form-shadow-xl: var(--form-shadow-xl, "0 20px 25px -5px rgba(0, 0, 0, 0.1)");
  --form-shadow-inner: var(--form-shadow-inner, "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)");

  /* Form Container Variables */
  --form-container-max-width: var(--form-container-max-width, "640px");
  --form-container-padding: var(--form-container-padding, "2rem");
  --form-container-margin: var(--form-container-margin, "20px auto");
  --form-container-border: var(--form-container-border, "var(--form-border-width) solid var(--form-border-color)");
  --form-container-border-radius: var(--form-container-border-radius, "var(--form-border-radius-lg)");
  --form-container-box-shadow: var(--form-container-box-shadow, "var(--form-shadow-md)");
  --form-container-background: var(--form-container-background, "var(--form-background-color)");

  /* Input Field Variables */
  --form-input-padding: var(--form-input-padding, "var(--form-padding-sm) var(--form-padding-md)");
  --form-input-border-width: var(--form-input-border-width, "var(--form-border-width)");
  --form-input-border-color: var(--form-input-border-color, "var(--form-border-color)");
  --form-input-border-radius: var(--form-input-border-radius, "var(--form-border-radius-md)");
  --form-input-background: var(--form-input-background, "var(--form-background-color)");
  --form-input-font-size: var(--form-input-font-size, "var(--form-font-size-base)");
  --form-input-line-height: var(--form-input-line-height, "var(--form-line-height)");
  --form-input-focus-border-color: var(--form-input-focus-border-color, "var(--form-primary-color)");
  --form-input-focus-box-shadow: var(--form-input-focus-box-shadow, "0 0 0 3px rgba(37, 99, 235, 0.1)");
  --form-input-focus-outline: var(--form-input-focus-outline, "none");
  --form-input-error-border-color: var(--form-input-error-border-color, "var(--form-error-color)");
  --form-input-error-box-shadow: var(--form-input-error-box-shadow, "0 0 0 3px rgba(239, 68, 68, 0.1)");

  /* Label Variables */
  --form-label-font-size: var(--form-label-font-size, "var(--form-font-size-small)");
  --form-label-font-weight: var(--form-label-font-weight, "var(--form-font-weight-medium)");
  --form-label-color: var(--form-label-color, "var(--form-text-color)");
  --form-label-margin-bottom: var(--form-label-margin-bottom, "var(--form-margin-sm)");
  --form-label-line-height: var(--form-label-line-height, "var(--form-line-height)");

  /* Button Variables */
  --form-button-padding: var(--form-button-padding, "var(--form-padding-sm) var(--form-padding-lg)");
  --form-button-border-radius: var(--form-button-border-radius, "var(--form-border-radius-md)");
  --form-button-font-size: var(--form-button-font-size, "var(--form-font-size-base)");
  --form-button-font-weight: var(--form-button-font-weight, "var(--form-font-weight-medium)");
  --form-button-line-height: var(--form-button-line-height, "var(--form-line-height)");
  --form-button-transition: var(--form-button-transition, "all 0.15s ease-in-out");
  --form-button-cursor: var(--form-button-cursor, "pointer");

  /* Primary Button */
  --form-button-primary-background: var(--form-button-primary-background, "var(--form-primary-color)");
  --form-button-primary-color: var(--form-button-primary-color, "#ffffff");
  --form-button-primary-border: var(--form-button-primary-border, "none");
  --form-button-primary-hover-background: var(--form-button-primary-hover-background, "#1d4ed8");
  --form-button-primary-hover-color: var(--form-button-primary-hover-color, "#ffffff");
  --form-button-primary-hover-border: var(--form-button-primary-hover-border, "none");
  --form-button-primary-active-background: var(--form-button-primary-active-background, "#1e40af");
  --form-button-primary-disabled-background: var(--form-button-primary-disabled-background, "#9ca3af");
  --form-button-primary-disabled-color: var(--form-button-primary-disabled-color, "#ffffff");

  /* Secondary Button */
  --form-button-secondary-background: var(--form-button-secondary-background, "var(--form-surface-color)");
  --form-button-secondary-color: var(--form-button-secondary-color, "var(--form-text-color)");
  --form-button-secondary-border: var(--form-button-secondary-border, "var(--form-border-width) solid var(--form-border-color)");
  --form-button-secondary-hover-background: var(--form-button-secondary-hover-background, "var(--form-border-light-color)");
  --form-button-secondary-hover-color: var(--form-button-secondary-hover-color, "var(--form-text-color)");
  --form-button-secondary-hover-border: var(--form-button-secondary-hover-border, "var(--form-border-width) solid var(--form-border-color)");

  /* Success Button */
  --form-button-success-background: var(--form-button-success-background, "var(--form-success-color)");
  --form-button-success-color: var(--form-button-success-color, "#ffffff");
  --form-button-success-border: var(--form-button-success-border, "none");
  --form-button-success-hover-background: var(--form-button-success-hover-background, "#059669");
  --form-button-success-hover-color: var(--form-button-success-hover-color, "#ffffff");
  --form-button-success-hover-border: var(--form-button-success-hover-border, "none");

  /* Checkbox/Radio Variables */
  --form-checkbox-size: var(--form-checkbox-size, "1rem");
  --form-checkbox-border-radius: var(--form-checkbox-border-radius, "var(--form-border-radius-sm)");
  --form-checkbox-border-width: var(--form-checkbox-border-width, "var(--form-border-width)");
  --form-checkbox-border-color: var(--form-checkbox-border-color, "var(--form-border-color)");
  --form-checkbox-background: var(--form-checkbox-background, "var(--form-background-color)");
  --form-checkbox-checked-background: var(--form-checkbox-checked-background, "var(--form-primary-color)");
  --form-checkbox-checked-border-color: var(--form-checkbox-checked-border-color, "var(--form-primary-color)");
  --form-checkbox-checked-color: var(--form-checkbox-checked-color, "#ffffff");
  --form-checkbox-hover-border-color: var(--form-checkbox-hover-border-color, "var(--form-primary-color)");
  --form-checkbox-focus-box-shadow: var(--form-checkbox-focus-box-shadow, "0 0 0 3px rgba(37, 99, 235, 0.1)");

  /* Select/Dropdown Variables */
  --form-select-padding: var(--form-select-padding, "var(--form-padding-sm) var(--form-padding-md)");
  --form-select-border-width: var(--form-select-border-width, "var(--form-border-width)");
  --form-select-border-color: var(--form-select-border-color, "var(--form-border-color)");
  --form-select-border-radius: var(--form-select-border-radius, "var(--form-border-radius-md)");
  --form-select-background: var(--form-select-background, "var(--form-background-color)");
  --form-select-font-size: var(--form-select-font-size, "var(--form-font-size-base)");
  --form-select-focus-border-color: var(--form-select-focus-border-color, "var(--form-primary-color)");
  --form-select-focus-box-shadow: var(--form-select-focus-box-shadow, "0 0 0 3px rgba(37, 99, 235, 0.1)");
  --form-select-option-background: var(--form-select-option-background, "var(--form-background-color)");
  --form-select-option-color: var(--form-select-option-color, "var(--form-text-color)");
  --form-select-option-hover-background: var(--form-select-option-hover-background, "var(--form-surface-color)");

  /* Textarea Variables */
  --form-textarea-padding: var(--form-textarea-padding, "var(--form-padding-md)");
  --form-textarea-border-width: var(--form-textarea-border-width, "var(--form-border-width)");
  --form-textarea-border-color: var(--form-textarea-border-color, "var(--form-border-color)");
  --form-textarea-border-radius: var(--form-textarea-border-radius, "var(--form-border-radius-md)");
  --form-textarea-background: var(--form-textarea-background, "var(--form-background-color)");
  --form-textarea-font-size: var(--form-textarea-font-size, "var(--form-font-size-base)");
  --form-textarea-line-height: var(--form-textarea-line-height, "var(--form-line-height)");
  --form-textarea-min-height: var(--form-textarea-min-height, "6rem");
  --form-textarea-resize: var(--form-textarea-resize, "vertical");
  --form-textarea-focus-border-color: var(--form-textarea-focus-border-color, "var(--form-primary-color)");
  --form-textarea-focus-box-shadow: var(--form-textarea-focus-box-shadow, "0 0 0 3px rgba(37, 99, 235, 0.1)");

  /* Validation Variables */
  --form-error-color: var(--form-error-color, "var(--form-error-color)");
  --form-error-font-size: var(--form-error-font-size, "var(--form-font-size-small)");
  --form-error-margin-top: var(--form-error-margin-top, "var(--form-margin-xs)");
  --form-success-color: var(--form-success-color, "var(--form-success-color)");
  --form-success-font-size: var(--form-success-font-size, "var(--form-font-size-small)");
  --form-success-margin-top: var(--form-success-margin-top, "var(--form-margin-xs)");
  --form-warning-color: var(--form-warning-color, "var(--form-warning-color)");
  --form-warning-font-size: var(--form-warning-font-size, "var(--form-font-size-small)");
  --form-warning-margin-top: var(--form-warning-margin-top, "var(--form-margin-xs)");

  /* Animation Variables */
  --form-transition-duration: var(--form-transition-duration, "0.15s");
  --form-transition-timing: var(--form-transition-timing, "ease-in-out");
  --form-transition-property: var(--form-transition-property, "all");
  --form-hover-transition: var(--form-hover-transition, "var(--form-transition-property) var(--form-transition-duration) var(--form-transition-timing)");
  --form-focus-transition: var(--form-focus-transition, "var(--form-transition-property) var(--form-transition-duration) var(--form-transition-timing)");
}

/* Form Container Styles */
#[FORM_ID] .form-container {
  max-width: var(--form-container-max-width);
  margin: var(--form-container-margin);
  padding: var(--form-container-padding);
  background: var(--form-container-background);
  border: var(--form-container-border);
  border-radius: var(--form-container-border-radius);
  box-shadow: var(--form-container-box-shadow);
  font-family: var(--form-font-family);
}

/* Form Field Styles */
#[FORM_ID] .form-field {
  margin-bottom: var(--form-margin-lg);
}

/* Form Label Styles */
#[FORM_ID] .form-label {
  display: block;
  font-size: var(--form-label-font-size);
  font-weight: var(--form-label-font-weight);
  color: var(--form-label-color);
  margin-bottom: var(--form-label-margin-bottom);
  line-height: var(--form-label-line-height);
}

/* Form Input Styles */
#[FORM_ID] .form-input {
  width: 100%;
  padding: var(--form-input-padding);
  border: var(--form-input-border-width) solid var(--form-input-border-color);
  border-radius: var(--form-input-border-radius);
  background: var(--form-input-background);
  font-size: var(--form-input-font-size);
  line-height: var(--form-input-line-height);
  transition: var(--form-focus-transition);
}

#[FORM_ID] .form-input:focus {
  outline: var(--form-input-focus-outline);
  border-color: var(--form-input-focus-border-color);
  box-shadow: var(--form-input-focus-box-shadow);
}

#[FORM_ID] .form-input.error {
  border-color: var(--form-input-error-border-color);
  box-shadow: var(--form-input-error-box-shadow);
}

/* Form Button Styles */
#[FORM_ID] .form-button {
  padding: var(--form-button-padding);
  border-radius: var(--form-button-border-radius);
  font-size: var(--form-button-font-size);
  font-weight: var(--form-button-font-weight);
  line-height: var(--form-button-line-height);
  transition: var(--form-button-transition);
  cursor: var(--form-button-cursor);
  border: none;
}

#[FORM_ID] .form-button-primary {
  background: var(--form-button-primary-background);
  color: var(--form-button-primary-color);
  border: var(--form-button-primary-border);
}

#[FORM_ID] .form-button-primary:hover {
  background: var(--form-button-primary-hover-background);
  color: var(--form-button-primary-hover-color);
  border: var(--form-button-primary-hover-border);
}

#[FORM_ID] .form-button-primary:active {
  background: var(--form-button-primary-active-background);
}

#[FORM_ID] .form-button-primary:disabled {
  background: var(--form-button-primary-disabled-background);
  color: var(--form-button-primary-disabled-color);
  cursor: not-allowed;
}

#[FORM_ID] .form-button-secondary {
  background: var(--form-button-secondary-background);
  color: var(--form-button-secondary-color);
  border: var(--form-button-secondary-border);
}

#[FORM_ID] .form-button-secondary:hover {
  background: var(--form-button-secondary-hover-background);
  color: var(--form-button-secondary-hover-color);
  border: var(--form-button-secondary-hover-border);
}

#[FORM_ID] .form-button-success {
  background: var(--form-button-success-background);
  color: var(--form-button-success-color);
  border: var(--form-button-success-border);
}

#[FORM_ID] .form-button-success:hover {
  background: var(--form-button-success-hover-background);
  color: var(--form-button-success-hover-color);
  border: var(--form-button-success-hover-border);
}

/* Form Checkbox Styles */
#[FORM_ID] .form-checkbox {
  width: var(--form-checkbox-size);
  height: var(--form-checkbox-size);
  border: var(--form-checkbox-border-width) solid var(--form-checkbox-border-color);
  border-radius: var(--form-checkbox-border-radius);
  background: var(--form-checkbox-background);
  transition: var(--form-focus-transition);
}

#[FORM_ID] .form-checkbox:checked {
  background: var(--form-checkbox-checked-background);
  border-color: var(--form-checkbox-checked-border-color);
  color: var(--form-checkbox-checked-color);
}

#[FORM_ID] .form-checkbox:hover {
  border-color: var(--form-checkbox-hover-border-color);
}

#[FORM_ID] .form-checkbox:focus {
  box-shadow: var(--form-checkbox-focus-box-shadow);
}

/* Form Select Styles */
#[FORM_ID] .form-select {
  width: 100%;
  padding: var(--form-select-padding);
  border: var(--form-select-border-width) solid var(--form-select-border-color);
  border-radius: var(--form-select-border-radius);
  background: var(--form-select-background);
  font-size: var(--form-select-font-size);
  transition: var(--form-focus-transition);
}

#[FORM_ID] .form-select:focus {
  outline: none;
  border-color: var(--form-select-focus-border-color);
  box-shadow: var(--form-select-focus-box-shadow);
}

#[FORM_ID] .form-select option {
  background: var(--form-select-option-background);
  color: var(--form-select-option-color);
}

/* Form Textarea Styles */
#[FORM_ID] .form-textarea {
  width: 100%;
  padding: var(--form-textarea-padding);
  border: var(--form-textarea-border-width) solid var(--form-textarea-border-color);
  border-radius: var(--form-textarea-border-radius);
  background: var(--form-textarea-background);
  font-size: var(--form-textarea-font-size);
  line-height: var(--form-textarea-line-height);
  min-height: var(--form-textarea-min-height);
  resize: var(--form-textarea-resize);
  transition: var(--form-focus-transition);
}

#[FORM_ID] .form-textarea:focus {
  outline: none;
  border-color: var(--form-textarea-focus-border-color);
  box-shadow: var(--form-textarea-focus-box-shadow);
}

/* Form Validation Styles */
#[FORM_ID] .form-error {
  color: var(--form-error-color);
  font-size: var(--form-error-font-size);
  margin-top: var(--form-error-margin-top);
}

#[FORM_ID] .form-success {
  color: var(--form-success-color);
  font-size: var(--form-success-font-size);
  margin-top: var(--form-success-margin-top);
}

#[FORM_ID] .form-warning {
  color: var(--form-warning-color);
  font-size: var(--form-warning-font-size);
  margin-top: var(--form-warning-margin-top);
}

/* Form Radio Button Styles */
#[FORM_ID] .form-radio {
  width: var(--form-checkbox-size);
  height: var(--form-checkbox-size);
  border: var(--form-checkbox-border-width) solid var(--form-checkbox-border-color);
  border-radius: var(--form-border-radius-full);
  background: var(--form-checkbox-background);
  transition: var(--form-focus-transition);
}

#[FORM_ID] .form-radio:checked {
  background: var(--form-checkbox-checked-background);
  border-color: var(--form-checkbox-checked-border-color);
}

#[FORM_ID] .form-radio:hover {
  border-color: var(--form-checkbox-hover-border-color);
}

#[FORM_ID] .form-radio:focus {
  box-shadow: var(--form-checkbox-focus-box-shadow);
}

/* Form Phone Input Styles */
#[FORM_ID] .form-phone-input {
  display: flex;
  align-items: center;
  border: var(--form-input-border-width) solid var(--form-input-border-color);
  border-radius: var(--form-input-border-radius);
  background: var(--form-input-background);
  transition: var(--form-focus-transition);
}

#[FORM_ID] .form-phone-input:focus-within {
  border-color: var(--form-input-focus-border-color);
  box-shadow: var(--form-input-focus-box-shadow);
}

#[FORM_ID] .form-phone-input input {
  border: none;
  background: transparent;
  padding: var(--form-input-padding);
  font-size: var(--form-input-font-size);
  line-height: var(--form-input-line-height);
  outline: none;
}

/* Form File Upload Styles */
#[FORM_ID] .form-file-upload {
  width: 100%;
  padding: var(--form-padding-lg);
  border: 2px dashed var(--form-border-color);
  border-radius: var(--form-border-radius-lg);
  background: var(--form-surface-color);
  text-align: center;
  transition: var(--form-hover-transition);
  cursor: pointer;
}

#[FORM_ID] .form-file-upload:hover {
  border-color: var(--form-primary-color);
  background: var(--form-background-color);
}

#[FORM_ID] .form-file-upload input[type="file"] {
  display: none;
}

/* Form Date Input Styles */
#[FORM_ID] .form-date-input {
  width: 100%;
  padding: var(--form-input-padding);
  border: var(--form-input-border-width) solid var(--form-input-border-color);
  border-radius: var(--form-input-border-radius);
  background: var(--form-input-background);
  font-size: var(--form-input-font-size);
  line-height: var(--form-input-line-height);
  transition: var(--form-focus-transition);
}

#[FORM_ID] .form-date-input:focus {
  outline: var(--form-input-focus-outline);
  border-color: var(--form-input-focus-border-color);
  box-shadow: var(--form-input-focus-box-shadow);
}

/* Form Signature Styles */
#[FORM_ID] .form-signature {
  width: 100%;
  border: var(--form-input-border-width) solid var(--form-input-border-color);
  border-radius: var(--form-input-border-radius);
  background: var(--form-input-background);
  min-height: 200px;
  transition: var(--form-focus-transition);
}

#[FORM_ID] .form-signature:focus-within {
  border-color: var(--form-input-focus-border-color);
  box-shadow: var(--form-input-focus-box-shadow);
}

/* Form Heading Styles */
#[FORM_ID] .form-heading {
  font-size: var(--form-font-size-heading);
  font-weight: var(--form-font-weight-bold);
  color: var(--form-text-color);
  margin-bottom: var(--form-margin-lg);
  line-height: var(--form-line-height);
}

/* Form Description Styles */
#[FORM_ID] .form-description {
  font-size: var(--form-font-size-base);
  color: var(--form-text-secondary-color);
  margin-bottom: var(--form-margin-lg);
  line-height: var(--form-line-height);
}

/* Form Text Block Styles */
#[FORM_ID] .form-text-block {
  font-size: var(--form-font-size-base);
  color: var(--form-text-color);
  line-height: var(--form-line-height);
  margin-bottom: var(--form-margin-lg);
}

/* Form Progress Bar Styles */
#[FORM_ID] .form-progress-bar {
  width: 100%;
  height: 4px;
  background: var(--form-border-light-color);
  border-radius: var(--form-border-radius-full);
  overflow: hidden;
  margin-bottom: var(--form-margin-lg);
}

#[FORM_ID] .form-progress-bar-fill {
  height: 100%;
  background: var(--form-primary-color);
  transition: width 0.3s ease-in-out;
}

/* Form Loading States */
#[FORM_ID] .form-loading {
  opacity: 0.6;
  pointer-events: none;
}

#[FORM_ID] .form-loading::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  border: 2px solid var(--form-border-color);
  border-top-color: var(--form-primary-color);
  border-radius: var(--form-border-radius-full);
  animation: form-spin 1s linear infinite;
}

@keyframes form-spin {
  to {
    transform: rotate(360deg);
  }
}

/* Form Responsive Styles */
@media (max-width: 768px) {
  #[FORM_ID] .form-container {
    margin: var(--form-margin-md) auto;
    padding: var(--form-padding-md);
  }
  
  #[FORM_ID] .form-input,
  #[FORM_ID] .form-select,
  #[FORM_ID] .form-textarea {
    font-size: 16px; /* Prevents zoom on iOS */
  }
}

/* Form Dark Mode Support (Optional) */
@media (prefers-color-scheme: dark) {
  #[FORM_ID] {
    --form-background-color: var(--form-background-color-dark, "#1f2937");
    --form-surface-color: var(--form-surface-color-dark, "#374151");
    --form-text-color: var(--form-text-color-dark, "#f9fafb");
    --form-text-secondary-color: var(--form-text-secondary-color-dark, "#d1d5db");
    --form-border-color: var(--form-border-color-dark, "#4b5563");
    --form-border-light-color: var(--form-border-light-color-dark, "#374151");
  }
}
```

## Database Schema Structure

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

## Implementation Notes

1. **Form ID Scoping**: Each form gets a unique CSS scope using `#[FORM_ID]` selector
2. **Variable Inheritance**: Variables fallback to defaults using CSS `var()` function
3. **Dynamic Generation**: CSS is generated on-demand based on form ID and stored variables
4. **Template Evolution**: The CSS template can be updated without affecting existing forms
5. **Performance**: CSS is cached and only regenerated when variables change
6. **Isolation**: Complete isolation between forms and editor interface

## User-Editable Variables Summary

**Total Variables: 89**
- Typography: 9 variables
- Colors: 12 variables  
- Spacing: 15 variables
- Borders & Radius: 7 variables
- Shadows: 6 variables
- Container: 7 variables
- Input Fields: 13 variables
- Labels: 5 variables
- Buttons: 20 variables
- Checkboxes/Radio: 9 variables
- Select/Dropdown: 10 variables
- Textarea: 10 variables
- Validation: 9 variables
- Animation: 5 variables

This comprehensive system provides complete control over form styling while maintaining perfect isolation between forms and the editor interface.
