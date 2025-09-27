import { prisma } from "../prisma";

export class CSSGenerator {
  private static cssCache = new Map<string, { css: string; timestamp: number }>();
  private static readonly CACHE_DURATION = 5 * 60 * 1000;

  static async generateFormCSS(
    formId: string,
    mode: "legacy" | "tokens" = "tokens"
  ): Promise<string> {
    const cacheKey = `${mode}:${formId}`;
    const cached = this.cssCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.css;
    }

    const tokens = mode === "tokens" ? await this.getFormTokens(formId) : {};
    const variables = await this.getFormVariables(formId);
    const css = this.generateScopedCSS(formId, tokens, variables);

    this.cssCache.set(cacheKey, { css, timestamp: Date.now() });
    return css;
  }

  static async generatePublicFormCSS(formId: string): Promise<string> {
    const tokens = await this.getFormTokens(formId);
    const variables = await this.getFormVariables(formId);
    return this.generatePublicScopedCSS(formId, tokens, variables);
  }

  static generateFormCSSWithVariables(
    formId: string,
    tokens: Record<string, string>,
    variables: Record<string, string>
  ): string {
    return this.generateScopedCSS(formId, tokens, variables);
  }

  private static generatePublicScopedCSS(
    formId: string,
    tokens: Record<string, string>,
    variables: Record<string, string>
  ): string {
    const formSelector = `[data-public-form-id="${formId}"]`;
    const merged = new Map<string, string>();

    Object.entries(tokens).forEach(([name, value]) => merged.set(name, value));
    Object.entries(variables).forEach(([name, value]) => {
      if (!merged.has(name)) {
        merged.set(name, value);
      }
    });

    const formatValue = (_name: string, value: string) => {
      if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
        return value.slice(1, -1);
      }
      return value;
    };

    const emitVariables = () => {
      let result = "";
      merged.forEach((value, name) => {
        result += `  ${name}: ${formatValue(name, value)};\n`;
      });
      return result;
    };

    let css = `@layer forms {\n`;
    css += `${formSelector} {\n${emitVariables()}}\n\n`;
    css += `${formSelector} .form-content-container {\n${emitVariables()}}\n\n`;
    css += this.generateFormElementStyles(formSelector, merged);
    css += `}\n`;
    return css;
  }

  static async getFormTokens(formId: string): Promise<Record<string, string>> {
    const defaults = await prisma.formStyleTokenDefault.findMany({ where: { deleted_at: null } });
    const overrides = await prisma.formStyleToken.findMany({
      where: { form_id: formId, deleted_at: null },
    });

    const tokens: Record<string, string> = {};
    defaults.forEach((token) => {
      tokens[token.token_name] = token.default_value;
    });
    overrides.forEach((token) => {
      tokens[token.token_name] = token.token_value;
    });
    return tokens;
  }

  static async getFormVariables(formId: string): Promise<Record<string, string>> {
    const formVariables = await prisma.formStylingVariable.findMany({
      where: { form_id: formId, deleted_at: null },
    });
    const defaultVariables = await prisma.formStylingDefault.findMany({
      where: { deleted_at: null },
    });

    const variables: Record<string, string> = {};
    defaultVariables.forEach((item) => {
      variables[item.variable_name] = item.default_value;
    });
    formVariables.forEach((item) => {
      variables[item.variable_name] = item.variable_value;
    });
    return variables;
  }

  static clearCache(formId?: string) {
    if (!formId) {
      this.cssCache.clear();
      return;
    }

    for (const key of Array.from(this.cssCache.keys())) {
      if (key.endsWith(`:${formId}`)) {
        this.cssCache.delete(key);
      }
    }
  }

  static getCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.cssCache.size,
      entries: Array.from(this.cssCache.keys()),
    };
  }

  private static generateScopedCSS(
    formId: string,
    tokens: Record<string, string>,
    variables: Record<string, string>
  ): string {
    const formSelector = `[data-public-form-id="${formId}"]`;
    const merged = new Map<string, string>();

    Object.entries(tokens).forEach(([name, value]) => merged.set(name, value));
    Object.entries(variables).forEach(([name, value]) => {
      if (!merged.has(name)) {
        merged.set(name, value);
      }
    });

    const formatValue = (_name: string, value: string) => {
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        return value.slice(1, -1)
      }
      return value
    }

    const emitVariables = () => {
      let result = ""
      merged.forEach((value, name) => {
        result += `  ${name}: ${formatValue(name, value)};\n`
      })
      return result
    }

    let css = `@layer forms {\n`;
    css += `${formSelector} {\n${emitVariables()}}\n\n`;
    css += `${formSelector} .form-content-container {\n${emitVariables()}}\n\n`;
    css += this.generateFormElementStyles(formSelector, merged);
    css += `}\n`;
    return css;
  }

  private static generateFormElementStyles(
    formSelector: string,
    tokens: Map<string, string>
  ): string {
    const formatValue = (_name: string, value: string) => {
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        return value.slice(1, -1)
      }
      return value
    }
    const get = (token: string, fallback: string) => {
      const value = tokens.get(token) ?? fallback;
      return formatValue(token, value);
    };

    return `/* Form Container Styles */
${formSelector} {
  background: var(--form-background, ${get("--form-background", "#f8fafc")});
}

${formSelector} .form-content-container {
  max-width: var(--form-container-max-width, ${get("--form-container-max-width", "640px")});
  margin: var(--form-container-margin, ${get("--form-container-margin", "20px auto")});
  padding: var(--form-card-padding, ${get("--form-card-padding", "2rem")});
  background: var(--form-card-background, ${get("--form-card-background", "#ffffff")});
  border-radius: var(--form-card-border-radius, ${get("--form-card-border-radius", "0.75rem")});
  box-shadow: var(--form-card-shadow, ${get("--form-card-shadow", "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)")});
  font-family: var(--form-font-family, ${get("--form-font-family", '"Inter, system-ui, sans-serif"')});
}

/* Form Field Container */
${formSelector} .form-field {
  margin-bottom: var(--form-gap-field, ${get("--form-gap-field", "1.25rem")});
}

/* Form Label */
${formSelector} .form-field label {
  display: block;
  font-size: var(--form-label-size, ${get("--form-label-size", "0.95rem")});
  font-weight: var(--form-label-weight, ${get("--form-label-weight", "600")});
  color: var(--form-label-color, ${get("--form-label-color", "#0f172a")});
  margin-bottom: var(--form-gap-field, ${get("--form-gap-field", "1.25rem")});
  line-height: var(--form-line-height, ${get("--form-line-height", "1.5")});
  text-align: var(--form-text-align, ${get("--form-text-align", "left")});
}

/* Form Input Fields */
${formSelector} .form-input {
  width: 100%;
  height: var(--form-input-height, ${get("--form-input-height", "3rem")});
  padding: var(--form-input-padding, ${get("--form-input-padding", "0.75rem 1rem")});
  border: var(--form-input-border, ${get("--form-input-border", "1px solid #cbd5f5")});
  border-radius: var(--form-input-radius, ${get("--form-input-radius", "0.65rem")});
  background: var(--form-input-background, ${get("--form-input-background", "#ffffff")});
  font-size: var(--form-font-size-base, ${get("--form-font-size-base", "1rem")});
  color: var(--form-input-text-color, ${get("--form-input-text-color", "#0f172a")});
  line-height: var(--form-line-height, ${get("--form-line-height", "1.5")});
  transition: var(--form-button-transition, ${get("--form-button-transition", "all 0.15s ease-in-out")});
  direction: var(--form-direction, ${get("--form-direction", "ltr")});
  text-align: var(--form-text-align, ${get("--form-text-align", "left")});
}

${formSelector} .form-input:focus {
  outline: none;
  border: var(--form-input-focus-border, ${get("--form-input-focus-border", "1px solid #2563eb")});
  box-shadow: var(--form-input-focus-ring, ${get("--form-input-focus-ring", "0 0 0 3px rgba(37, 99, 235, 0.15)")});
}

${formSelector} .form-input.error,
${formSelector} .form-input.border-red-500 {
  border-color: var(--form-error-color, ${get("--form-error-color", "#ef4444")});
}

/* Form Buttons */
${formSelector} .form-button {
  padding: var(--form-button-padding, ${get("--form-button-padding", "0.75rem 1.5rem")}) !important;
  border-radius: var(--form-button-radius, ${get("--form-button-radius", "9999px")}) !important;
  font-size: var(--form-font-size-base, ${get("--form-font-size-base", "1rem")}) !important;
  font-weight: var(--form-label-weight, ${get("--form-label-weight", "600")}) !important;
  line-height: var(--form-line-height, ${get("--form-line-height", "1.5")}) !important;
  transition: var(--form-button-transition, ${get("--form-button-transition", "all 0.15s ease-in-out")}) !important;
  cursor: pointer !important;
  border: none !important;
}

${formSelector} .form-button-primary {
  background: var(--form-button-primary-bg, ${get("--form-button-primary-bg", "#2563eb")}) !important;
  color: var(--form-button-primary-text, ${get("--form-button-primary-text", "#ffffff")}) !important;
}

${formSelector} .form-button-primary:hover {
  background: var(--form-button-primary-hover-bg, ${get("--form-button-primary-hover-bg", "#1d4ed8")}) !important;
}

/* Override Tailwind button styles with higher specificity */
${formSelector} button.form-button-primary {
  background: var(--form-button-primary-bg, ${get("--form-button-primary-bg", "#2563eb")}) !important;
  color: var(--form-button-primary-text, ${get("--form-button-primary-text", "#ffffff")}) !important;
}
`;
  }
}
