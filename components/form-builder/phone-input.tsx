"use client"

import { Input } from "@/components/ui/input"
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
  return (
    <Input
      type="tel"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
    />
  )
}
