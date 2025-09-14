"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import type { FormField } from "@/types/form-builder/form-builder"

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  field: FormField
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function PhoneInput({ value, onChange, field, placeholder, disabled, className }: PhoneInputProps) {
  const [countryCode, setCountryCode] = useState(field.phoneSettings?.defaultCountryCode || "US")
  
  const countryOptions = [
    { code: "US", name: "United States", flag: "🇺🇸" },
    { code: "CA", name: "Canada", flag: "🇨🇦" },
    { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
    { code: "AU", name: "Australia", flag: "🇦🇺" },
    { code: "DE", name: "Germany", flag: "🇩🇪" },
    { code: "FR", name: "France", flag: "🇫🇷" },
    { code: "ES", name: "Spain", flag: "🇪🇸" },
    { code: "IT", name: "Italy", flag: "🇮🇹" },
    { code: "JP", name: "Japan", flag: "🇯🇵" },
    { code: "CN", name: "China", flag: "🇨🇳" },
  ]

  const formatPhoneNumber = (phone: string) => {
    if (!field.phoneSettings?.format) return phone
    
    if (field.phoneSettings.format === "national") {
      // Simple national formatting (US style)
      const cleaned = phone.replace(/\D/g, "")
      if (cleaned.length >= 6) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`
      } else if (cleaned.length >= 3) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`
      }
      return cleaned
    }
    
    // International format
    return phone
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "")
    const formatted = formatPhoneNumber(rawValue)
    onChange(formatted)
  }

  return (
    <div className="space-y-2">
      {field.phoneSettings?.showCountrySelector && (
        <Select value={countryCode} onValueChange={setCountryCode} disabled={disabled}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {countryOptions.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                <span className="flex items-center space-x-2">
                  <span>{country.flag}</span>
                  <span>{country.name}</span>
                  <span className="text-gray-500">({country.code})</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      
      <div className="flex">
        {field.phoneSettings?.format === "international" && (
          <div className="flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 rounded-l-md">
            <span className="text-sm text-gray-600">+1</span>
          </div>
        )}
        <Input
          type="tel"
          value={value}
          onChange={handlePhoneChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`${className} ${field.phoneSettings?.format === "international" ? "rounded-l-none" : ""}`}
        />
      </div>
      
      {field.phoneSettings?.enableValidation && value && (
        <p className="text-xs text-gray-500">
          {field.phoneSettings.validationMessage || "Please enter a valid phone number"}
        </p>
      )}
    </div>
  )
}
