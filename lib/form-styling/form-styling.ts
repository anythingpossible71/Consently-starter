import { prisma } from "../prisma";
import { CSSGenerator } from "./css-generator";

/**
 * Form Styling Service for managing form-specific styling variables
 */
export class FormStylingService {
  static async getLegacyStyles(formId: string): Promise<Record<string, string>> {
    return CSSGenerator.getFormVariables(formId);
  }

  static async getTokenStyles(formId: string): Promise<Record<string, string>> {
    return CSSGenerator.getFormTokens(formId);
  }

  static async getFormStyles(
    formId: string
  ): Promise<{ tokens: Record<string, string>; variables: Record<string, string> }> {
    const tokens = await CSSGenerator.getFormTokens(formId);
    const variables = await CSSGenerator.getFormVariables(formId);
    return { tokens, variables };
  }

  /**
   * Update styling variables for a form
   */
  static async updateFormStyles(formId: string, variables: Record<string, string>): Promise<void> {
    // Validate that the form exists
    const form = await prisma.form.findUnique({
      where: { id: formId, deleted_at: null },
    });

    if (!form) {
      throw new Error(`Form with ID ${formId} not found`);
    }

    // Validate variables against defaults
    const defaultVariables = await prisma.formStylingDefault.findMany({
      where: { deleted_at: null },
    });

    const validVariableNames = new Set(defaultVariables.map((v) => v.variable_name));

    // Update or create variables
    for (const [variableName, value] of Object.entries(variables)) {
      if (!validVariableNames.has(variableName)) {
        console.warn(`Invalid variable name: ${variableName}`);
        continue;
      }

      await prisma.formStylingVariable.upsert({
        where: {
          form_id_variable_name: {
            form_id: formId,
            variable_name: variableName,
          },
        },
        update: {
          variable_value: value,
          updated_at: new Date(),
        },
        create: {
          form_id: formId,
          variable_name: variableName,
          variable_value: value,
        },
      });
    }

    // Clear CSS cache for this form
    CSSGenerator.clearCache(formId);
  }

  /**
   * Reset form styles to default values
   */
  static async resetFormStyles(formId: string): Promise<void> {
    // Validate that the form exists
    const form = await prisma.form.findUnique({
      where: { id: formId, deleted_at: null },
    });

    if (!form) {
      throw new Error(`Form with ID ${formId} not found`);
    }

    // Delete all custom variables for this form
    await prisma.formStylingVariable.deleteMany({
      where: {
        form_id: formId,
        deleted_at: null,
      },
    });

    // Clear CSS cache for this form
    CSSGenerator.clearCache(formId);
  }

  /**
   * Initialize form with default styling variables (if not already initialized)
   */
  static async initializeFormStyles(formId: string): Promise<void> {
    // Check if form already has styling variables
    const existingVariables = await prisma.formStylingVariable.findFirst({
      where: {
        form_id: formId,
        deleted_at: null,
      },
    });

    if (existingVariables) {
      // Form already initialized
      return;
    }

    // Get all default variables
    const defaultVariables = await prisma.formStylingDefault.findMany({
      where: {
        is_user_editable: true,
        deleted_at: null,
      },
    });

    // Create form-specific variables with default values
    for (const defaultVar of defaultVariables) {
      await prisma.formStylingVariable.create({
        data: {
          form_id: formId,
          variable_name: defaultVar.variable_name,
          variable_value: defaultVar.default_value,
        },
      });
    }
  }

  static async getFormCSS(formId: string, mode: "legacy" | "tokens" = "tokens"): Promise<string> {
    return CSSGenerator.generateFormCSS(formId, mode);
  }

  static getFormCSSWithOverrides(
    formId: string,
    tokens: Record<string, string>,
    variables: Record<string, string>
  ): string {
    return CSSGenerator.generateFormCSSWithVariables(formId, tokens, variables);
  }

  /**
   * Get available styling variables with metadata
   */
  static async getAvailableVariables(): Promise<
    Array<{
      variable_name: string;
      default_value: string;
      description: string | null;
      category: string;
      data_type: string;
      display_name: string | null;
      is_user_editable: boolean;
    }>
  > {
    const variables = await prisma.formStylingDefault.findMany({
      where: { deleted_at: null },
      orderBy: [{ category: "asc" }, { variable_name: "asc" }],
    });

    return variables.map((v) => ({
      variable_name: v.variable_name,
      default_value: v.default_value,
      description: v.description,
      category: v.category,
      data_type: v.data_type,
      display_name: v.display_name,
      is_user_editable: v.is_user_editable,
    }));
  }

  /**
   * Get variables by category
   */
  static async getVariablesByCategory(): Promise<
    Record<
      string,
      Array<{
        variable_name: string;
        default_value: string;
        description: string | null;
        data_type: string;
        display_name: string | null;
        is_user_editable: boolean;
      }>
    >
  > {
    const variables = await this.getAvailableVariables();

    const grouped: Record<string, typeof variables> = {};

    for (const variable of variables) {
      if (!grouped[variable.category]) {
        grouped[variable.category] = [];
      }
      grouped[variable.category].push(variable);
    }

    return grouped;
  }

  /**
   * Update a single styling variable
   */
  static async updateFormStyleVariable(
    formId: string,
    variableName: string,
    value: string
  ): Promise<void> {
    // Validate variable exists
    const defaultVariable = await prisma.formStylingDefault.findUnique({
      where: { variable_name: variableName },
    });

    if (!defaultVariable) {
      throw new Error(`Variable ${variableName} does not exist`);
    }

    // Validate that the form exists
    const form = await prisma.form.findUnique({
      where: { id: formId, deleted_at: null },
    });

    if (!form) {
      throw new Error(`Form with ID ${formId} not found`);
    }

    // Update or create the variable
    await prisma.formStylingVariable.upsert({
      where: {
        form_id_variable_name: {
          form_id: formId,
          variable_name: variableName,
        },
      },
      update: {
        variable_value: value,
        updated_at: new Date(),
      },
      create: {
        form_id: formId,
        variable_name: variableName,
        variable_value: value,
      },
    });

    // Clear CSS cache for this form
    CSSGenerator.clearCache(formId);
  }

  /**
   * Delete a styling variable (revert to default)
   */
  static async deleteFormStyleVariable(formId: string, variableName: string): Promise<void> {
    await prisma.formStylingVariable.deleteMany({
      where: {
        form_id: formId,
        variable_name: variableName,
        deleted_at: null,
      },
    });

    // Clear CSS cache for this form
    CSSGenerator.clearCache(formId);
  }

  /**
   * Get form styling summary (which variables are customized)
   */
  static async getFormStylingSummary(formId: string): Promise<{
    totalVariables: number;
    customizedVariables: number;
    categories: Record<
      string,
      {
        total: number;
        customized: number;
        variables: Array<{
          variable_name: string;
          current_value: string;
          default_value: string;
          is_customized: boolean;
        }>;
      }
    >;
  }> {
    // Get all default variables
    const defaultVariables = await prisma.formStylingDefault.findMany({
      where: { deleted_at: null },
    });

    // Get form-specific variables
    const formVariables = await prisma.formStylingVariable.findMany({
      where: {
        form_id: formId,
        deleted_at: null,
      },
    });

    const formVariableMap = new Map(formVariables.map((v) => [v.variable_name, v.variable_value]));

    const categories: Record<
      string,
      {
        total: number;
        customized: number;
        variables: Array<{
          variable_name: string;
          current_value: string;
          default_value: string;
          is_customized: boolean;
        }>;
      }
    > = {};

    let customizedCount = 0;

    for (const defaultVar of defaultVariables) {
      const currentValue =
        formVariableMap.get(defaultVar.variable_name) || defaultVar.default_value;
      const isCustomized = formVariableMap.has(defaultVar.variable_name);

      if (isCustomized) {
        customizedCount++;
      }

      if (!categories[defaultVar.category]) {
        categories[defaultVar.category] = {
          total: 0,
          customized: 0,
          variables: [],
        };
      }

      categories[defaultVar.category].total++;
      if (isCustomized) {
        categories[defaultVar.category].customized++;
      }

      categories[defaultVar.category].variables.push({
        variable_name: defaultVar.variable_name,
        current_value: currentValue,
        default_value: defaultVar.default_value,
        is_customized: isCustomized,
      });
    }

    return {
      totalVariables: defaultVariables.length,
      customizedVariables: customizedCount,
      categories,
    };
  }

  static async resetFormTokens(formId: string): Promise<void> {
    await prisma.formStyleToken.deleteMany({
      where: {
        form_id: formId,
        deleted_at: null,
      },
    });
    CSSGenerator.clearCache(formId);
  }

  static async initializeFormTokens(formId: string): Promise<void> {
    const existing = await prisma.formStyleToken.findFirst({
      where: { form_id: formId, deleted_at: null },
    });
    if (existing) return;

    const defaults = await prisma.formStyleTokenDefault.findMany({ where: { deleted_at: null } });
    for (const token of defaults) {
      await prisma.formStyleToken.create({
        data: {
          form_id: formId,
          token_name: token.token_name,
          token_value: token.default_value,
        },
      });
    }
  }

  static async updateFormTokens(formId: string, tokens: Record<string, string>): Promise<void> {
    const form = await prisma.form.findUnique({
      where: { id: formId, deleted_at: null },
    });

    if (!form) {
      throw new Error(`Form with ID ${formId} not found`);
    }

    const defaultTokens = await prisma.formStyleTokenDefault.findMany({
      where: { deleted_at: null },
    });

    const validTokenNames = new Set(defaultTokens.map((t) => t.token_name));

    for (const [tokenName, value] of Object.entries(tokens)) {
      if (!validTokenNames.has(tokenName)) {
        console.warn(`Invalid token name: ${tokenName}`);
        continue;
      }

      await prisma.formStyleToken.upsert({
        where: {
          form_id_token_name: {
            form_id: formId,
            token_name: tokenName,
          },
        },
        update: {
          token_value: value,
          updated_at: new Date(),
        },
        create: {
          form_id: formId,
          token_name: tokenName,
          token_value: value,
        },
      });
    }

    CSSGenerator.clearCache(formId);
  }

  /**
   * Clear all CSS caches
   */
  static clearAllCaches(): void {
    CSSGenerator.clearCache();
  }

  /**
   * Get cache statistics
   */
  static getCacheStats(): { size: number; entries: string[] } {
    return CSSGenerator.getCacheStats();
  }
}
