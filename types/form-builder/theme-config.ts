export interface ThemeConfigInterface {
  id: string
  name: string
  description: string
  colors: {
    primary: string
    secondary: string
    background: string
    surface: string
    text: string
    textSecondary: string
    border: string
    borderLight: string
    success: string
    warning: string
    error: string
    info: string
  }
  typography: {
    fontFamily: string
    fontSize: {
      xs: string
      sm: string
      base: string
      lg: string
      xl: string
      "2xl": string
      "3xl": string
    }
    fontWeight: {
      normal: string
      medium: string
      semibold: string
      bold: string
    }
    lineHeight: {
      tight: string
      normal: string
      relaxed: string
    }
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
    "2xl": string
    "3xl": string
  }
  borderRadius: {
    none: string
    sm: string
    md: string
    lg: string
    xl: string
    full: string
  }
  shadows: {
    none: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  components: {
    form: {
      maxWidth: string
      padding: string
      background: string
      borderRadius: string
      boxShadow: string
      border: string
    }
    field: {
      marginBottom: string
      labelColor: string
      labelFontSize: string
      labelFontWeight: string
      labelMarginBottom: string
    }
    input: {
      padding: string
      fontSize: string
      borderWidth: string
      borderColor: string
      borderRadius: string
      backgroundColor: string
      focusBorderColor: string
      focusBoxShadow: string
      transition: string
    }
    button: {
      padding: string
      fontSize: string
      fontWeight: string
      borderRadius: string
      transition: string
      primary: {
        backgroundColor: string
        color: string
        hoverBackgroundColor: string
        border: string
      }
      secondary: {
        backgroundColor: string
        color: string
        hoverBackgroundColor: string
        border: string
      }
      success: {
        backgroundColor: string
        color: string
        hoverBackgroundColor: string
        border: string
      }
    }
  }
}

export const THEME_PRESETS: Record<string, ThemeConfigInterface> = {
  default: {
    id: "default",
    name: "Default",
    description: "Clean and professional design",
    colors: {
      primary: "#2563eb",
      secondary: "#64748b",
      background: "#ffffff",
      surface: "#f8fafc",
      text: "#1f2937",
      textSecondary: "#6b7280",
      border: "#e5e7eb",
      borderLight: "#f3f4f6",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",
    },
    typography: {
      fontFamily: "Inter, system-ui, sans-serif",
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
      },
      fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },
      lineHeight: {
        tight: "1.25",
        normal: "1.5",
        relaxed: "1.75",
      },
    },
    spacing: {
      xs: "0.5rem",
      sm: "0.75rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
      "2xl": "2.5rem",
      "3xl": "3rem",
    },
    borderRadius: {
      none: "0",
      sm: "0.25rem",
      md: "0.375rem",
      lg: "0.5rem",
      xl: "0.75rem",
      full: "9999px",
    },
    shadows: {
      none: "none",
      sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    },
    components: {
      form: {
        maxWidth: "640px",
        padding: "2rem",
        background: "#ffffff",
        borderRadius: "0.5rem",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        border: "1px solid #e5e7eb",
      },
      field: {
        marginBottom: "1.5rem",
        labelColor: "#374151",
        labelFontSize: "0.875rem",
        labelFontWeight: "500",
        labelMarginBottom: "0.5rem",
      },
      input: {
        padding: "0.75rem",
        fontSize: "1rem",
        borderWidth: "1px",
        borderColor: "#d1d5db",
        borderRadius: "0.375rem",
        backgroundColor: "#ffffff",
        focusBorderColor: "#2563eb",
        focusBoxShadow: "0 0 0 3px rgba(37, 99, 235, 0.1)",
        transition: "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
      },
      button: {
        padding: "0.75rem 2rem",
        fontSize: "1rem",
        fontWeight: "500",
        borderRadius: "0.375rem",
        transition: "all 0.15s ease-in-out",
        primary: {
          backgroundColor: "#2563eb",
          color: "#ffffff",
          hoverBackgroundColor: "#1d4ed8",
          border: "none",
        },
        secondary: {
          backgroundColor: "#6b7280",
          color: "#ffffff",
          hoverBackgroundColor: "#4b5563",
          border: "none",
        },
        success: {
          backgroundColor: "#10b981",
          color: "#ffffff",
          hoverBackgroundColor: "#059669",
          border: "none",
        },
      },
    },
  },
  minimal: {
    id: "minimal",
    name: "Minimal",
    description: "Clean and simple design",
    colors: {
      primary: "#000000",
      secondary: "#6b7280",
      background: "#fafafa",
      surface: "#ffffff",
      text: "#374151",
      textSecondary: "#9ca3af",
      border: "#e5e7eb",
      borderLight: "#f3f4f6",
      success: "#059669",
      warning: "#d97706",
      error: "#dc2626",
      info: "#0284c7",
    },
    typography: {
      fontFamily: "system-ui, sans-serif",
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
      },
      fontWeight: {
        normal: "400",
        medium: "400",
        semibold: "500",
        bold: "600",
      },
      lineHeight: {
        tight: "1.25",
        normal: "1.5",
        relaxed: "1.75",
      },
    },
    spacing: {
      xs: "0.5rem",
      sm: "0.75rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
      "2xl": "2.5rem",
      "3xl": "3rem",
    },
    borderRadius: {
      none: "0",
      sm: "0",
      md: "0",
      lg: "0",
      xl: "0",
      full: "0",
    },
    shadows: {
      none: "none",
      sm: "none",
      md: "none",
      lg: "none",
      xl: "none",
    },
    components: {
      form: {
        maxWidth: "640px",
        padding: "2rem",
        background: "#fafafa",
        borderRadius: "0",
        boxShadow: "none",
        border: "1px solid #e5e7eb",
      },
      field: {
        marginBottom: "1.5rem",
        labelColor: "#374151",
        labelFontSize: "0.875rem",
        labelFontWeight: "400",
        labelMarginBottom: "0.5rem",
      },
      input: {
        padding: "0.5rem 0",
        fontSize: "1rem",
        borderWidth: "0 0 1px 0",
        borderColor: "#d1d5db",
        borderRadius: "0",
        backgroundColor: "transparent",
        focusBorderColor: "#000000",
        focusBoxShadow: "none",
        transition: "border-color 0.15s ease-in-out",
      },
      button: {
        padding: "0.5rem 1.5rem",
        fontSize: "0.875rem",
        fontWeight: "400",
        borderRadius: "0",
        transition: "all 0.15s ease-in-out",
        primary: {
          backgroundColor: "#000000",
          color: "#ffffff",
          hoverBackgroundColor: "#374151",
          border: "none",
        },
        secondary: {
          backgroundColor: "#6b7280",
          color: "#ffffff",
          hoverBackgroundColor: "#4b5563",
          border: "none",
        },
        success: {
          backgroundColor: "#059669",
          color: "#ffffff",
          hoverBackgroundColor: "#047857",
          border: "none",
        },
      },
    },
  },
  modern: {
    id: "modern",
    name: "Modern",
    description: "Contemporary design with gradients",
    colors: {
      primary: "#7c3aed",
      secondary: "#a855f7",
      background: "#ffffff",
      surface: "#f8fafc",
      text: "#111827",
      textSecondary: "#6b7280",
      border: "#e5e7eb",
      borderLight: "#f3f4f6",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",
    },
    typography: {
      fontFamily: "Inter, system-ui, sans-serif",
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
      },
      fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },
      lineHeight: {
        tight: "1.25",
        normal: "1.5",
        relaxed: "1.75",
      },
    },
    spacing: {
      xs: "0.5rem",
      sm: "0.75rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
      "2xl": "2.5rem",
      "3xl": "3rem",
    },
    borderRadius: {
      none: "0",
      sm: "0.5rem",
      md: "0.75rem",
      lg: "1rem",
      xl: "1.25rem",
      full: "9999px",
    },
    shadows: {
      none: "none",
      sm: "0 4px 6px rgba(0, 0, 0, 0.05)",
      md: "0 8px 15px rgba(0, 0, 0, 0.1)",
      lg: "0 15px 25px rgba(0, 0, 0, 0.1)",
      xl: "0 25px 35px rgba(0, 0, 0, 0.15)",
    },
    components: {
      form: {
        maxWidth: "640px",
        padding: "0px",
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        borderRadius: "1rem",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
        border: "none",
      },
      field: {
        marginBottom: "2rem",
        labelColor: "#111827",
        labelFontSize: "0.875rem",
        labelFontWeight: "600",
        labelMarginBottom: "0.75rem",
      },
      input: {
        padding: "1rem",
        fontSize: "1rem",
        borderWidth: "2px",
        borderColor: "#e5e7eb",
        borderRadius: "0.75rem",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        focusBorderColor: "#7c3aed",
        focusBoxShadow: "0 4px 12px rgba(124, 58, 237, 0.15)",
        transition: "all 0.2s ease-in-out",
      },
      button: {
        padding: "1rem 2rem",
        fontSize: "1rem",
        fontWeight: "600",
        borderRadius: "0.75rem",
        transition: "all 0.2s ease-in-out",
        primary: {
          backgroundColor: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
          color: "#ffffff",
          hoverBackgroundColor: "linear-gradient(135deg, #6d28d9 0%, #9333ea 100%)",
          border: "none",
        },
        secondary: {
          backgroundColor: "#6b7280",
          color: "#ffffff",
          hoverBackgroundColor: "#4b5563",
          border: "none",
        },
        success: {
          backgroundColor: "#10b981",
          color: "#ffffff",
          hoverBackgroundColor: "#059669",
          border: "none",
        },
      },
    },
  },
  classic: {
    id: "classic",
    name: "Classic",
    description: "Traditional and reliable design",
    colors: {
      primary: "#059669",
      secondary: "#6b7280",
      background: "#f9fafb",
      surface: "#ffffff",
      text: "#374151",
      textSecondary: "#6b7280",
      border: "#d1d5db",
      borderLight: "#e5e7eb",
      success: "#059669",
      warning: "#d97706",
      error: "#dc2626",
      info: "#0284c7",
    },
    typography: {
      fontFamily: "Georgia, serif",
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
      },
      fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },
      lineHeight: {
        tight: "1.25",
        normal: "1.5",
        relaxed: "1.75",
      },
    },
    spacing: {
      xs: "0.5rem",
      sm: "0.75rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
      "2xl": "2.5rem",
      "3xl": "3rem",
    },
    borderRadius: {
      none: "0",
      sm: "0.125rem",
      md: "0.25rem",
      lg: "0.375rem",
      xl: "0.5rem",
      full: "9999px",
    },
    shadows: {
      none: "none",
      sm: "0 1px 3px rgba(0, 0, 0, 0.1)",
      md: "0 4px 6px rgba(0, 0, 0, 0.1)",
      lg: "0 10px 15px rgba(0, 0, 0, 0.1)",
      xl: "0 20px 25px rgba(0, 0, 0, 0.1)",
    },
    components: {
      form: {
        maxWidth: "640px",
        padding: "2rem",
        background: "#f9fafb",
        borderRadius: "0.25rem",
        boxShadow: "none",
        border: "2px solid #d1d5db",
      },
      field: {
        marginBottom: "1.5rem",
        labelColor: "#374151",
        labelFontSize: "0.875rem",
        labelFontWeight: "500",
        labelMarginBottom: "0.5rem",
      },
      input: {
        padding: "0.75rem",
        fontSize: "1rem",
        borderWidth: "1px",
        borderColor: "#9ca3af",
        borderRadius: "0.25rem",
        backgroundColor: "#ffffff",
        focusBorderColor: "#059669",
        focusBoxShadow: "0 0 0 2px rgba(5, 150, 105, 0.2)",
        transition: "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
      },
      button: {
        padding: "0.75rem 1.5rem",
        fontSize: "1rem",
        fontWeight: "500",
        borderRadius: "0.25rem",
        transition: "all 0.15s ease-in-out",
        primary: {
          backgroundColor: "#059669",
          color: "#ffffff",
          hoverBackgroundColor: "#047857",
          border: "1px solid #047857",
        },
        secondary: {
          backgroundColor: "#6b7280",
          color: "#ffffff",
          hoverBackgroundColor: "#4b5563",
          border: "1px solid #4b5563",
        },
        success: {
          backgroundColor: "#059669",
          color: "#ffffff",
          hoverBackgroundColor: "#047857",
          border: "1px solid #047857",
        },
      },
    },
  },
}

export function generateThemeCSS(theme: ThemeConfigInterface, customCSS?: string, formConfig?: any): string {
  // Apply frame and background overrides if formConfig is provided
  let formBackground = theme.components.form.background
  let formBorder = theme.components.form.border
  let formBoxShadow = theme.components.form.boxShadow
  let inputBackground = theme.components.input.backgroundColor

  if (formConfig) {
    // Override background color if specified and background is enabled
    if (formConfig.showBackground !== false && formConfig.backgroundColor && formConfig.backgroundColor !== "#ffffff") {
      formBackground = formConfig.backgroundColor
    }

    // Handle background toggle - this should be checked first
    if (formConfig.showBackground === false) {
      formBackground = "transparent"
      inputBackground = "transparent"
    }

    // Handle frame toggle - this only affects border and shadow, not background
    if (formConfig.showFrame === false) {
      formBorder = "none"
      formBoxShadow = "none"
      // Don't override formBackground here - let background toggle handle it
    }
  }

  const baseCSS = `
/* ${theme.name} Theme - Generated CSS - Scoped to form elements only */
.form-content-container, .form-content-container .form-field, .form-content-container .form-label, .form-content-container .form-input, .form-content-container .form-button, .form-content-container .form-button-primary, .form-content-container .form-button-secondary, .form-content-container .form-button-success {
  /* Form-scoped CSS variables */
  --form-color-primary: ${theme.colors.primary};
  --form-color-secondary: ${theme.colors.secondary};
  --form-color-background: ${theme.colors.background};
  --form-color-surface: ${theme.colors.surface};
  --form-color-text: ${theme.colors.text};
  --form-color-text-secondary: ${theme.colors.textSecondary};
  --form-color-border: ${theme.colors.border};
  --form-color-border-light: ${theme.colors.borderLight};
  --form-color-success: ${theme.colors.success};
  --form-color-warning: ${theme.colors.warning};
  --form-color-error: ${theme.colors.error};
  --form-color-info: ${theme.colors.info};
  
  --form-font-family: ${formConfig?.formFontFamily || theme.typography.fontFamily};
  --form-font-size-xs: ${theme.typography.fontSize.xs};
  --form-font-size-sm: ${theme.typography.fontSize.sm};
  --form-font-size-base: ${theme.typography.fontSize.base};
  --form-font-size-lg: ${theme.typography.fontSize.lg};
  --form-font-size-xl: ${theme.typography.fontSize.xl};
  --form-font-size-2xl: ${theme.typography.fontSize["2xl"]};
  --form-font-size-3xl: ${theme.typography.fontSize["3xl"]};
  
  --form-font-weight-normal: ${theme.typography.fontWeight.normal};
  --form-font-weight-medium: ${theme.typography.fontWeight.medium};
  --form-font-weight-semibold: ${theme.typography.fontWeight.semibold};
  --form-font-weight-bold: ${theme.typography.fontWeight.bold};
  
  --form-spacing-xs: ${theme.spacing.xs};
  --form-spacing-sm: ${theme.spacing.sm};
  --form-spacing-md: ${theme.spacing.md};
  --form-spacing-lg: ${theme.spacing.lg};
  --form-spacing-xl: ${theme.spacing.xl};
  --form-spacing-2xl: ${theme.spacing["2xl"]};
  --form-spacing-3xl: ${theme.spacing["3xl"]};
  
  --form-border-radius-none: ${theme.borderRadius.none};
  --form-border-radius-sm: ${theme.borderRadius.sm};
  --form-border-radius-md: ${theme.borderRadius.md};
  --form-border-radius-lg: ${theme.borderRadius.lg};
  --form-border-radius-xl: ${theme.borderRadius.xl};
  --form-border-radius-full: ${theme.borderRadius.full};
  
  --form-shadow-none: ${theme.shadows.none};
  --form-shadow-sm: ${theme.shadows.sm};
  --form-shadow-md: ${theme.shadows.md};
  --form-shadow-lg: ${theme.shadows.lg};
  --form-shadow-xl: ${theme.shadows.xl};
  
  /* Dynamic form variables */
  --form-background: ${formBackground};
  --form-border: ${formBorder};
  --form-box-shadow: ${formBoxShadow};
  --input-background: ${inputBackground};
}

.form-content-container {
  max-width: ${theme.components.form.maxWidth};
  margin: 20px auto;
  padding: ${theme.components.form.padding};
  background: var(--form-background);
  border-radius: ${theme.components.form.borderRadius};
  box-shadow: var(--form-box-shadow);
  border: var(--form-border);
  font-family: var(--form-font-family);
}

.form-content-container .form-field {
  margin-bottom: ${theme.components.field.marginBottom};
}

.form-content-container .form-label {
  display: block;
  font-size: ${theme.components.field.labelFontSize};
  font-weight: ${theme.components.field.labelFontWeight};
  color: ${theme.components.field.labelColor};
  margin-bottom: ${theme.components.field.labelMarginBottom};
}

.form-content-container .form-input {
  width: 100%;
  padding: ${theme.components.input.padding};
  border: ${theme.components.input.borderWidth} solid ${theme.components.input.borderColor};
  border-radius: ${theme.components.input.borderRadius};
  font-size: ${theme.components.input.fontSize};
  background-color: var(--input-background);
  transition: ${theme.components.input.transition};
  font-family: var(--form-font-family);
}

.form-content-container .form-input:focus {
  outline: none;
  border-color: ${theme.components.input.focusBorderColor};
  box-shadow: ${theme.components.input.focusBoxShadow};
}

.form-content-container .form-button {
  padding: ${theme.components.button.padding};
  border: none;
  border-radius: ${theme.components.button.borderRadius};
  font-size: ${theme.components.button.fontSize};
  font-weight: ${theme.components.button.fontWeight};
  cursor: pointer;
  transition: ${theme.components.button.transition};
  font-family: var(--form-font-family);
}

.form-content-container .form-button-primary {
  background: ${formConfig?.submitButtonColor || theme.components.button.primary.backgroundColor};
  color: ${theme.components.button.primary.color};
  border: ${theme.components.button.primary.border};
}

.form-content-container .form-button-primary:hover {
  background: ${formConfig?.submitButtonColor || theme.components.button.primary.hoverBackgroundColor};
  opacity: 0.9;
}

.form-content-container .form-button-secondary {
  background: ${theme.components.button.secondary.backgroundColor};
  color: ${theme.components.button.secondary.color};
  border: ${theme.components.button.secondary.border};
}

.form-content-container .form-button-secondary:hover {
  background: ${theme.components.button.secondary.hoverBackgroundColor};
}

.form-content-container .form-button-success {
  background: ${theme.components.button.success.backgroundColor};
  color: ${theme.components.button.success.color};
  border: ${theme.components.button.success.border};
}

.form-content-container .form-button-success:hover {
  background: ${theme.components.button.success.hoverBackgroundColor};
}

/* Form-specific component styling */

.form-content-container .form-field-card {
  background: var(--form-background) !important;
  border-color: var(--form-color-border);
}

.form-content-container .form-field-content {
  background: var(--form-background) !important;
}

.form-content-container .form-empty-state {
  background: var(--form-background) !important;
}

.form-content-container .form-empty-content {
  background: var(--form-background) !important;
}

.form-content-container .form-control-button {
  background: var(--form-background) !important;
}

.form-content-container .form-title-input {
  background: var(--input-background) !important;
}

.form-content-container .form-description-input {
  background: var(--input-background) !important;
}

/* Override any hardcoded bg-white classes within form containers */
.form-content-container .bg-white,
.form-content-container [class*="bg-white"] {
  background: var(--form-background) !important;
}
`

  return customCSS ? `${baseCSS}\n\n/* Custom CSS */\n${customCSS}` : baseCSS
}
