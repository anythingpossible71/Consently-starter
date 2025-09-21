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
import { getTranslation, isRTL, getDefaultPlaceholder } from "@/utils/form-builder/translations"
import { PhoneInput } from "@/components/ui/phone-input"
import { SignatureModal } from "./signature-modal"
import { FileUploadField } from "./file-upload-field"

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
          <PhoneInput
            value={value || ""}
            onChange={(val) => onChange?.(val)}
            placeholder={field.placeholder || getDefaultPlaceholder("phone", config.language)}
            disabled={!onChange}
            className="form-input"
            defaultCountry={field.phoneSettings?.defaultCountryCode as any || "US"}
            international={field.phoneSettings?.format === "international"}
            countrySelectProps={{
              disabled: !field.phoneSettings?.showCountrySelector || field.phoneSettings?.format === "national"
            }}
          />
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
              {field.placeholder || "I agree to the terms and conditions"}
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
          />
        )

      case "signature":
        const hasSignature = value && value.trim() !== ""
        return (
          <>
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50">
              {hasSignature ? (
                <div className="space-y-4">
                  <div className="w-full h-32 border border-gray-200 rounded bg-white flex items-center justify-center">
                    <img 
                      src={value} 
                      alt="Signature" 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-blue-300 text-blue-700 hover:bg-blue-100 bg-transparent"
                    onClick={() => setIsSignatureModalOpen(true)}
                  >
                    <PenTool className="w-4 h-4 mr-2" />
                    Edit Signature
                  </Button>
                </div>
              ) : (
                <>
                  <PenTool className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-blue-900 mb-2">Electronic Signature</h3>
                  <p className="text-sm text-blue-700 mb-4">Click to sign with your finger, mouse, or upload signature</p>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-blue-300 text-blue-700 hover:bg-blue-100 bg-transparent"
                    onClick={() => setIsSignatureModalOpen(true)}
                  >
                    Click to Sign
                  </Button>
                </>
              )}
              <div
                className={`flex justify-center mt-3 text-xs text-blue-600 ${isRTLLanguage ? "space-x-reverse space-x-4" : "space-x-4"}`}
              >
                <span>✓ High Resolution</span>
                <span>✓ Legally Compliant</span>
                <span>✓ Timestamped</span>
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
              {field.placeholder ||
                "This is a text block. You can add instructions, terms, or any other information here."}
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
            {field.buttonText || getTranslation("submitForm", config.language)}
          </Button>
        )

      default:
        return <div>Unknown field type</div>
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
