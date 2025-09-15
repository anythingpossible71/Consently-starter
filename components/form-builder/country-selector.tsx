"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface CountrySelectorProps {
  selectedCountry: string
  onCountryChange: (country: string) => void
  showLabel?: boolean
}

const countries = [
  { code: "US", name: "United States", flag: "🇺🇸", dialCode: "+1" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", dialCode: "+44" },
  { code: "CA", name: "Canada", flag: "🇨🇦", dialCode: "+1" },
  { code: "AU", name: "Australia", flag: "🇦🇺", dialCode: "+61" },
  { code: "DE", name: "Germany", flag: "🇩🇪", dialCode: "+49" },
  { code: "FR", name: "France", flag: "🇫🇷", dialCode: "+33" },
  { code: "ES", name: "Spain", flag: "🇪🇸", dialCode: "+34" },
  { code: "IT", name: "Italy", flag: "🇮🇹", dialCode: "+39" },
  { code: "JP", name: "Japan", flag: "🇯🇵", dialCode: "+81" },
  { code: "BR", name: "Brazil", flag: "🇧🇷", dialCode: "+55" },
  { code: "IN", name: "India", flag: "🇮🇳", dialCode: "+91" },
  { code: "CN", name: "China", flag: "🇨🇳", dialCode: "+86" },
  { code: "MX", name: "Mexico", flag: "🇲🇽", dialCode: "+52" },
  { code: "RU", name: "Russia", flag: "🇷🇺", dialCode: "+7" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦", dialCode: "+27" },
]

export function CountrySelector({ selectedCountry, onCountryChange, showLabel = true }: CountrySelectorProps) {
  const selectedCountryData = countries.find((c) => c.code === selectedCountry)

  return (
    <div>
      {showLabel && <Label className="text-xs font-medium text-gray-700">Default Country</Label>}
      <Select value={selectedCountry} onValueChange={onCountryChange}>
        <SelectTrigger className={showLabel ? "mt-1" : ""}>
          <SelectValue>
            {selectedCountryData && (
              <div className="flex items-center gap-2">
                <span>{selectedCountryData.flag}</span>
                <span className="text-xs text-gray-500">{selectedCountryData.dialCode}</span>
                <span>{selectedCountryData.name}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {countries.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              <div className="flex items-center gap-2">
                <span>{country.flag}</span>
                <span className="text-xs text-gray-500 w-8">{country.dialCode}</span>
                <span>{country.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
