"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FieldRenderer } from "./field-renderer"
import { Globe, CheckCircle } from "lucide-react"
import type { FormData } from "@/types/form-builder/app-types"
import type { FormConfig } from "@/types/form-builder/form-config"

interface FormViewerProps {
  form: FormData
  language: string
  supportedLanguages: string[]
}

// Available languages with flags
const AVAILABLE_LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "he", name: "עברית", flag: "🇮🇱" },
]

export function FormViewer({ form, language, supportedLanguages }: FormViewerProps) {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  
  const currentLanguageInfo = AVAILABLE_LANGUAGES.find(lang => lang.code === language)
  
  const handleLanguageChange = (newLanguage: string) => {
    const url = new URL(window.location.href)
    if (newLanguage === 'en') {
      url.searchParams.delete('lang')
    } else {
      url.searchParams.set('lang', newLanguage)
    }
    window.location.href = url.toString()
  }
  
  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }))
    
    // Clear validation error when user starts typing
    if (validationErrors[fieldId]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[fieldId]
        return newErrors
      })
    }
  }
  
  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    // Get all non-submit fields for validation
    const fieldsToValidate = form.fields.filter(field => field.type !== 'submit')
    
    fieldsToValidate.forEach(field => {
      const value = formData[field.id]
      
      // Check required fields
      if (field.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
        errors[field.id] = `${field.label || 'This field'} is required`
      }
      
      // Email validation
      if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors[field.id] = 'Please enter a valid email address'
      }
      
      // Phone validation (basic)
      if (field.type === 'phone' && value && !/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/\s/g, ''))) {
        errors[field.id] = 'Please enter a valid phone number'
      }
    })
    
    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch(`/api/forms/${form.id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData,
          language
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to submit form')
      }
      
      const result = await response.json()
      console.log('Form submitted successfully:', result)
      
      setIsSubmitted(true)
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Failed to submit form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Form Submitted!</h2>
              <p className="text-gray-600 mb-4">
                Thank you for your submission. We have received your response.
              </p>
              {form.config.redirectUrl && (
                <Button 
                  onClick={() => window.location.href = form.config.redirectUrl}
                  className="w-full"
                >
                  Continue
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Language Selector */}
        {supportedLanguages.length > 1 && (
          <div className="mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Language:</span>
                  </div>
                  <div className="flex gap-2">
                    {supportedLanguages.map((lang) => {
                      const langInfo = AVAILABLE_LANGUAGES.find(l => l.code === lang)
                      return (
                        <button
                          key={lang}
                          onClick={() => handleLanguageChange(lang)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            language === lang
                              ? 'bg-blue-100 text-blue-700 border border-blue-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <span>{langInfo?.flag}</span>
                          <span>{langInfo?.name}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {form.title}
            </CardTitle>
            {form.description && (
              <p className="text-gray-600 mt-2">
                {form.description}
              </p>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {form.fields
                .filter(field => field.type !== 'submit') // Filter out submit fields
                .map((field, index) => (
                  <div key={field.id || index} className="space-y-2">
                    <FieldRenderer
                      field={field}
                      formConfig={form.config as any}
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
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full px-8 py-3 ${
                    form.config.submitButton.style === "primary" ? "bg-blue-600 hover:bg-blue-700 text-white" :
                    form.config.submitButton.style === "secondary" ? "bg-gray-600 hover:bg-gray-700 text-white" :
                    "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {isSubmitting ? "Submitting..." : form.config.submitButton.text}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
