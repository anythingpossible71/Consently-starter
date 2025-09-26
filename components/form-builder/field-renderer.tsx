"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import type { FormField } from "@/types/form-builder/form-builder"
import type { FormConfig } from "@/types/form-builder/form-config"
import { PenTool, Upload, Calendar, Send, Check, ArrowRight } from "lucide-react"
import { getTranslation, getUITranslation, getFormTranslation, isRTL, getDefaultPlaceholder } from "@/utils/form-builder/translations"
import { PhoneInput } from "@/components/ui/phone-input"
import { SignatureModal } from "./signature-modal"
import { FileUploadField } from "./file-upload-field"
import { cn } from "@/lib/utils"

interface FieldRendererProps {
  field: FormField
  formConfig?: FormConfig
  currentLanguage?: string // Keep for backward compatibility
  value?: any
  onChange?: (value: any) => void
  error?: string
}

export function FieldRenderer({ field, formConfig, currentLanguage = "en", value, onChange, error }: FieldRendererProps) {
  // Use formConfig if available, otherwise create a minimal config from currentLanguage
  const config = formConfig || {
    language: currentLanguage,
  }

  const isRTLLanguage = isRTL(config.language)
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false)

  const renderField = () => {
    switch (field.type) {
      case "text":
      case "email":
        return (
          <Input
            type={field.type === "email" ? "email" : "text"}
            placeholder={field.placeholder || getDefaultPlaceholder(field.type, config.language)}
            value={value || ""}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={!onChange}
            className={`form-input ${isRTLLanguage ? "text-right" : "text-left"} ${error ? "border-red-500" : ""}`}
            dir={isRTLLanguage ? "rtl" : "ltr"}
          />
        )

      case "phone":
        return (
          <div className={cn("form-input-group", error && "is-error")}>
            <PhoneInput
              value={value || ""}
              onChange={(val) => onChange?.(val)}
              placeholder={field.placeholder || getDefaultPlaceholder("phone", config.language)}
              disabled={!onChange}
              defaultCountry={field.phoneSettings?.defaultCountryCode as any || "US"}
              international={field.phoneSettings?.format === "international"}
              countrySelectProps={{
                disabled: !field.phoneSettings?.showCountrySelector || field.phoneSettings?.format === "national"
              }}
            />
          </div>
        )

      case "textarea":
        return (
          <Textarea
            placeholder={field.placeholder || getDefaultPlaceholder("textarea", config.language)}
            value={value || ""}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={!onChange}
            rows={4}
            className={`form-input ${isRTLLanguage ? "text-right" : "text-left"} ${error ? "border-red-500" : ""}`}
            dir={isRTLLanguage ? "rtl" : "ltr"}
          />
        )

      case "multiple-choice":
        return (
          <RadioGroup 
            value={value || ""} 
            onValueChange={(val) => onChange?.(val)}
            disabled={!onChange}
          >
            <div className="space-y-3">
              {field.options?.map((option, index) => (
                <div key={index} className={`flex items-center gap-2 ${isRTLLanguage ? "flex-row-reverse" : "flex-row"}`}>
                  <RadioGroupItem value={option} id={`${field.id}-${index}`} />
                  <Label
                    htmlFor={`${field.id}-${index}`}
                    className={`${isRTLLanguage ? "text-right mr-2" : "text-left ml-2"} flex-1`}
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        )

      case "checkboxes":
        return (
          <div className="space-y-3">
            {field.options?.map((option, index) => {
              const checkedValues = value || []
              const isChecked = checkedValues.includes(option)
              
              return (
                <div key={index} className={`flex items-center gap-2 ${isRTLLanguage ? "flex-row-reverse" : "flex-row"}`}>
                  <Checkbox 
                    id={`${field.id}-${index}`} 
                    checked={isChecked}
                    onCheckedChange={(checked) => {
                      if (!onChange) return
                      const newValues = checked 
                        ? [...checkedValues, option]
                        : checkedValues.filter((v: string) => v !== option)
                      onChange(newValues)
                    }}
                    disabled={!onChange}
                  />
                  <Label
                    htmlFor={`${field.id}-${index}`}
                    className={`${isRTLLanguage ? "text-right mr-2" : "text-left ml-2"} flex-1`}
                  >
                    {option}
                  </Label>
                </div>
              )
            })}
          </div>
        )

      case "agreement":
        return (
          <div className={`flex items-center gap-2 ${isRTLLanguage ? "flex-row-reverse" : "flex-row"}`}>
            <Checkbox 
              id={field.id} 
              checked={value || false}
              onCheckedChange={(checked) => onChange?.(checked)}
              disabled={!onChange}
            />
            <Label htmlFor={field.id} className={`${isRTLLanguage ? "text-right mr-2" : "text-left ml-2"} flex-1`}>
              {field.placeholder || getFormTranslation("formElements", "agreeToTerms", config.language)}
            </Label>
          </div>
        )

      case "date":
        return (
          <div className="relative">
            <Input
              type="date"
              value={value || ""}
              onChange={(e) => onChange?.(e.target.value)}
              disabled={!onChange}
              placeholder={getUITranslation("datePlaceholder", config.language)}
              className={`form-input ${isRTLLanguage ? "text-right" : "text-left"} ${error ? "border-red-500" : ""}`}
              dir={isRTLLanguage ? "rtl" : "ltr"}
            />
            <Calendar
              className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${
                isRTLLanguage ? "left-3" : "right-3"
              }`}
            />
          </div>
        )

      case "file-upload":
        return (
          <FileUploadField
            field={field}
            value={value}
            onChange={onChange}
            disabled={!onChange}
            error={error}
            language={config.language}
          />
        )

      case "signature":
        const hasSignature = value && value.trim() !== ""
        return (
          <>
            <div className="form-signature-block grid gap-4 rounded-xl border bg-background/90 px-6 py-6 text-center shadow-sm">
              {hasSignature ? (
                <div className="form-signature-preview flex flex-col items-center gap-4">
                  <img 
                    src={value} 
                    alt="Signature" 
                    className="form-signature-image w-full max-w-md rounded-lg border bg-white object-contain p-4"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="form-button form-button--secondary"
                    onClick={() => setIsSignatureModalOpen(true)}
                  >
                    <PenTool className="w-4 h-4 mr-2" />
                    {getFormTranslation("signature", "clickToSignButton", config.language)}
                  </Button>
                </div>
              ) : (
                <div className="form-signature-empty flex flex-col items-center gap-3">
                  <div className="form-signature-icon flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <PenTool className="w-6 h-6" />
                  </div>
                  <h3 className="form-signature-title text-lg font-semibold text-foreground">
                    {getFormTranslation("signature", "electronicSignature", config.language)}
                  </h3>
                  <p className="form-help-text max-w-md text-center text-sm text-muted-foreground">
                    {getFormTranslation("signature", "clickToSign", config.language)}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="form-button form-button--secondary"
                    onClick={() => setIsSignatureModalOpen(true)}
                  >
                    {getFormTranslation("signature", "clickToSignButton", config.language)}
                  </Button>
                </div>
              )}
              <div className="form-signature-benefits flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
                <span>✓ {getFormTranslation("signature", "highResolution", config.language)}</span>
                <span>✓ {getFormTranslation("signature", "legallyCompliant", config.language)}</span>
                <span>✓ {getFormTranslation("signature", "timestamped", config.language)}</span>
              </div>
            </div>
            
            <SignatureModal
              isOpen={isSignatureModalOpen}
              onClose={() => setIsSignatureModalOpen(false)}
              onSave={(signatureData) => {
                onChange?.(signatureData)
                setIsSignatureModalOpen(false)
              }}
              field={field}
              currentSignature={value}
            />
          </>
        )

      case "heading":
        return (
          <div>
            <h2
              className={`text-xl font-semibold text-gray-900 ${isRTLLanguage ? "text-right" : "text-left"}`}
              dir={isRTLLanguage ? "rtl" : "ltr"}
            >
              {field.placeholder || field.label}
            </h2>
          </div>
        )

      case "text-block":
        return (
          <div className="prose prose-sm">
            <p
              className={`text-gray-700 ${isRTLLanguage ? "text-right" : "text-left"}`}
              dir={isRTLLanguage ? "rtl" : "ltr"}
            >
              {field.richTextContent || field.placeholder ||
                getUITranslation("textBlockPlaceholder", config.language)}
            </p>
          </div>
        )

      case "submit":
        const buttonIcons = {
          send: Send,
          check: Check,
          arrow: ArrowRight,
        }
        const ButtonIcon = buttonIcons[field.buttonIcon as keyof typeof buttonIcons] || Send

        return (
          <Button
            className={`form-button form-button-${field.buttonStyle || "primary"} px-8 py-3`}
            disabled
            dir={isRTLLanguage ? "rtl" : "ltr"}
          >
            <ButtonIcon className={`w-4 h-4 ${isRTLLanguage ? "ml-2" : "mr-2"}`} />
            {field.buttonText || getFormTranslation("formElements", "submitForm", config.language)}
          </Button>
        )

      default:
        return <div>{getUITranslation("unknownFieldType", config.language)}</div>
    }
  }

  return (
    <div className="form-field">
      {field.showLabel && field.type !== "heading" && field.type !== "text-block" && field.type !== "submit" && (
        <Label
          className={`text-lg font-semibold text-gray-900 mb-2 block ${isRTLLanguage ? "text-right" : "text-left"}`}
          dir={isRTLLanguage ? "rtl" : "ltr"}
        >
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      {renderField()}
      {field.helpText && (
        <p
          className={`text-xs text-gray-500 mt-1 ${isRTLLanguage ? "text-right" : "text-left"}`}
          dir={isRTLLanguage ? "rtl" : "ltr"}
        >
          {field.helpText}
        </p>
      )}
    </div>
  )
}
