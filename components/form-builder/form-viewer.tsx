"use client";

import { useState, useEffect } from "react";
import { Globe, CheckCircle } from "lucide-react";
import { FieldRenderer } from "./field-renderer";
import type { FormData } from "@/types/form-builder/app-types";
import type { FormConfig } from "@/types/form-builder/form-config";
import { getFormTranslation, isRTL } from "@/utils/form-builder/translations";

interface FormViewerProps {
  form: FormData;
  language: string;
  supportedLanguages: string[];
}

const AVAILABLE_LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Português", flag: "🇧🇷" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "he", name: "עברית", flag: "🇮🇱" },
];

export function FormViewer({ form, language, supportedLanguages }: FormViewerProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  // Check if form was already submitted (from URL parameter)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("submitted") === "true") {
      setIsSubmitted(true);
    }
  }, []);

  const currentLanguageInfo = AVAILABLE_LANGUAGES.find((lang) => lang.code === language);

  const handleLanguageChange = (newLanguage: string) => {
    const url = new URL(window.location.href);
    if (newLanguage === "en") {
      url.searchParams.delete("lang");
    } else {
      url.searchParams.set("lang", newLanguage);
    }
    window.location.href = url.toString();
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));

    if (validationErrors[fieldId]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    const fieldsToValidate = form.fields.filter((field) => field.type !== "submit");

    fieldsToValidate.forEach((field) => {
      const value = formData[field.id];

      if (field.required && (!value || (typeof value === "string" && value.trim() === ""))) {
        errors[field.id] = `${field.label || "This field"} is required`;
      }

      if (field.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors[field.id] = "Please enter a valid email address";
      }

      if (
        field.type === "phone" &&
        value &&
        !/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/\s/g, ""))
      ) {
        errors[field.id] = "Please enter a valid phone number";
      }
    });

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/forms/${form.id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      const result = await response.json();
      console.log("Form submitted successfully:", result);

      if (form.config.redirectUrl && form.config.redirectUrl.trim()) {
        const redirectTarget = form.config.redirectTarget || "same";

        if (redirectTarget === "new") {
          window.open(form.config.redirectUrl, "_blank");
        } else if (redirectTarget === "parent") {
          if (window.parent && window.parent !== window) {
            try {
              window.parent.location.href = form.config.redirectUrl;
              console.log("Parent redirect attempted");
            } catch (error) {
              console.error("Parent redirect failed:", error);
              window.location.href = form.config.redirectUrl;
            }
          } else {
            window.location.href = form.config.redirectUrl;
          }
        } else {
          window.location.href = form.config.redirectUrl;
        }
      } else {
        setIsSubmitted(true);
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set("submitted", "true");
        window.history.replaceState({}, "", currentUrl.toString());
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    const postSubmitSettings = form.config.postSubmitSettings || {
      title: "Form Submitted!",
      message: "Thank you for your submission. We have received your response.",
      buttonText: "Go Back",
      buttonAction: "back",
    };

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white shadow-sm p-6">
          <div className="text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">{postSubmitSettings.title}</h2>
            <p className="text-gray-600">{postSubmitSettings.message}</p>
            {postSubmitSettings.buttonAction !== "hidden" && !form.config.redirectUrl && (
              <button
                type="button"
                onClick={() => {
                  if (postSubmitSettings.buttonAction === "close") {
                    window.close();
                    setTimeout(() => {
                      if (!window.closed) {
                        window.history.back();
                      }
                    }, 100);
                  } else {
                    window.history.back();
                  }
                }}
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                {postSubmitSettings.buttonText}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const isRTLLanguage = isRTL(language);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div
        data-public-form-id={form.id}
        id={form.id}
        className="max-w-2xl mx-auto px-4"
        dir={isRTLLanguage ? "rtl" : "ltr"}
      >
        {supportedLanguages.length > 1 && (
          <div className="mb-6 rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Globe className="w-5 h-5" />
                <span>Language:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {supportedLanguages.map((lang) => {
                  const langInfo = AVAILABLE_LANGUAGES.find((l) => l.code === lang);
                  return (
                    <button
                      type="button"
                      key={lang}
                      onClick={() => handleLanguageChange(lang)}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                        language === lang
                          ? "border-blue-200 bg-blue-100 text-blue-700"
                          : "border-transparent bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <span>{langInfo?.flag}</span>
                      <span>{langInfo?.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <section className="form-content-container">
          <header className="space-y-3">
            <h1
              style={{
                color: "var(--form-heading-color, #0f172a)",
                fontSize: "var(--form-heading-size, 1.875rem)",
                fontWeight: "var(--form-heading-weight, 700)",
                lineHeight: "var(--form-line-height, 1.5)",
              }}
            >
              {form.title}
            </h1>
            {form.description && (
              <p
                style={{
                  color: "var(--form-description-color, #475569)",
                  lineHeight: "var(--form-line-height, 1.5)",
                }}
              >
                {form.description}
              </p>
            )}
          </header>

          <div style={{ marginTop: "var(--form-gap-field, 1.25rem)" }}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {form.fields
                .filter((field) => field.type !== "submit")
                .map((field, index) => (
                  <div key={field.id || index} className="form-field space-y-2">
                    <FieldRenderer
                      field={field}
                      formConfig={form.config as FormConfig}
                      currentLanguage={language}
                      value={formData[field.id]}
                      onChange={(value) => handleFieldChange(field.id, value)}
                      error={validationErrors[field.id]}
                    />
                    {validationErrors[field.id] && (
                      <p className="text-sm text-red-600">{validationErrors[field.id]}</p>
                    )}
                  </div>
                ))}

              <div className="pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="form-button form-button-primary w-full disabled:opacity-50"
                >
                  {isSubmitting
                    ? getFormTranslation("formElements", "submitting", language)
                    : form.config.submitButton.text ||
                      getFormTranslation("formElements", "submitForm", language)}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
