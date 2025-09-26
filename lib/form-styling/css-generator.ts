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

  static generateFormCSSWithVariables(
    formId: string,
    tokens: Record<string, string>,
    variables: Record<string, string>
  ): string {
    return this.generateScopedCSS(formId, tokens, variables);
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

  private static generateScopedCSS(
    formId: string,
    tokens: Record<string, string>,
    variables: Record<string, string>
  ): string {
    const formSelector = `#${formId}`;
    const merged = new Map<string, string>();

    Object.entries(tokens).forEach(([name, value]) => merged.set(name, value));
    Object.entries(variables).forEach(([name, value]) => {
      if (!merged.has(name)) {
        merged.set(name, value);
      }
    });

    const formatValue = (name: string, value: string) => {
      if (name.includes("color") || name.includes("background") || name.includes("border")) {
        if (!value.startsWith('"') && !value.startsWith("'") && /^#[0-9a-fA-F]{3,6}$/.test(value)) {
          return `"${value}"`;
        }
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

    let css = `/* CSS Variables for Form ${formId} */\n`;
    css += `${formSelector} {\n${emitVariables()}}\n\n`;
    css += `${formSelector}.form-content-container {\n${emitVariables()}}\n\n`;
    css += this.generateFormElementStyles(formSelector, merged);
    return css;
  }

  private static generateFormElementStyles(
    formSelector: string,
    tokens: Map<string, string>
  ): string {
    const get = (token: string, fallback: string) => tokens.get(token) ?? fallback;

    return `/* Form Container Styles */\n${formSelector} .form-content-container {\n  max-width: var(--form-container-max-width, ${get("--form-container-max-width", "640px")});\n  margin: var(--form-container-margin, ${get("--form-container-margin", "20px auto")});\n  padding: var(--form-card-padding, ${get("--form-card-padding", "2rem")});\n  background: var(--form-card-background, ${get("--form-card-background", "#ffffff")}) !important;\n  font-family: var(--form-font-family, ${get("--form-font-family", '"Inter, system-ui, sans-serif"')});\n}\n\n/* Form Field Container */\n${formSelector} .form-field {\n  margin-bottom: var(--form-gap-field, ${get("--form-gap-field", "1.25rem")});\n}\n\n/* Form Label */\n${formSelector} .form-field label {\n  display: block;\n  font-size: var(--form-label-size, ${get("--form-label-size", "0.95rem")});\n  font-weight: var(--form-label-weight, ${get("--form-label-weight", "600")});\n  color: var(--form-label-color, ${get("--form-label-color", "#0f172a")});\n  margin-bottom: var(--form-gap-field, ${get("--form-gap-field", "1.25rem")});\n  line-height: var(--form-line-height, ${get("--form-line-height", "1.5")});\n  text-align: var(--form-text-align, ${get("--form-text-align", "left")});\n}\n\n/* Form Input Fields */\n${formSelector} .form-input {\n  width: 100%;\n  height: var(--form-input-height, ${get("--form-input-height", "3rem")});\n  padding: var(--form-input-padding, ${get("--form-input-padding", "0.75rem 1rem")});\n  border: var(--form-input-border, ${get("--form-input-border", "1px solid #cbd5f5")});\n  border-radius: var(--form-input-radius, ${get("--form-input-radius", "0.65rem")});\n  background: var(--form-input-background, ${get("--form-input-background", "#ffffff")});\n  font-size: var(--form-font-size-base, ${get("--form-font-size-base", "1rem")});\n  color: var(--form-input-text-color, ${get("--form-input-text-color", "#0f172a")});\n  line-height: var(--form-line-height, ${get("--form-line-height", "1.5")});\n  transition: var(--form-button-transition, ${get("--form-button-transition", "all 0.15s ease-in-out")});\n  direction: var(--form-direction, ${get("--form-direction", "ltr")});\n  text-align: var(--form-text-align, ${get("--form-text-align", "left")});\n}\n\n${formSelector} .form-input:focus {\n  outline: none;\n  border: var(--form-input-focus-border, ${get("--form-input-focus-border", "1px solid #2563eb")});\n  box-shadow: var(--form-input-focus-ring, ${get("--form-input-focus-ring", "0 0 0 3px rgba(37, 99, 235, 0.15)")});\n}\n\n${formSelector} .form-input.error,\n${formSelector} .form-input.border-red-500 {\n  border-color: var(--form-error-color, ${get("--form-error-color", "#ef4444")});\n}\n\n/* Form Buttons */\n${formSelector} .form-button {\n  padding: var(--form-button-padding, ${get("--form-button-padding", "0.75rem 1.5rem")});\n  border-radius: var(--form-button-radius, ${get("--form-button-radius", "9999px")});\n  font-size: var(--form-font-size-base, ${get("--form-font-size-base", "1rem")});\n  font-weight: var(--form-label-weight, ${get("--form-label-weight", "600")});\n  line-height: var(--form-line-height, ${get("--form-line-height", "1.5")});\n  transition: var(--form-button-transition, ${get("--form-button-transition", "all 0.15s ease-in-out")});\n  cursor: pointer;\n  border: none;\n}\n\n${formSelector} .form-button-primary {\n  background: var(--form-button-primary-bg, ${get("--form-button-primary-bg", "#2563eb")});\n  color: var(--form-button-primary-text, ${get("--form-button-primary-text", "#ffffff")});\n}\n\n${formSelector} .form-button-primary:hover {\n  background: var(--form-button-primary-hover-bg, ${get("--form-button-primary-hover-bg", "#1d4ed8")});\n}\n`;
  }
}
