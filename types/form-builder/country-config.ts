export interface Country {
  code: string
  name: string
  flag: string
  dialCode: string
  format: string
  priority: number
}

export const COUNTRIES: Country[] = [
  { code: "US", name: "United States", flag: "🇺🇸", dialCode: "+1", format: "(###) ###-####", priority: 1 },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", dialCode: "+44", format: "#### ### ####", priority: 2 },
  { code: "CA", name: "Canada", flag: "🇨🇦", dialCode: "+1", format: "(###) ###-####", priority: 3 },
  { code: "AU", name: "Australia", flag: "🇦🇺", dialCode: "+61", format: "#### ### ###", priority: 4 },
  { code: "DE", name: "Germany", flag: "🇩🇪", dialCode: "+49", format: "### ########", priority: 5 },
  { code: "FR", name: "France", flag: "🇫🇷", dialCode: "+33", format: "## ## ## ## ##", priority: 6 },
  { code: "ES", name: "Spain", flag: "🇪🇸", dialCode: "+34", format: "### ### ###", priority: 7 },
  { code: "IT", name: "Italy", flag: "🇮🇹", dialCode: "+39", format: "### ### ####", priority: 8 },
  { code: "JP", name: "Japan", flag: "🇯🇵", dialCode: "+81", format: "##-####-####", priority: 9 },
  { code: "BR", name: "Brazil", flag: "🇧🇷", dialCode: "+55", format: "(##) #####-####", priority: 10 },
  { code: "IN", name: "India", flag: "🇮🇳", dialCode: "+91", format: "##### #####", priority: 11 },
  { code: "CN", name: "China", flag: "🇨🇳", dialCode: "+86", format: "### #### ####", priority: 12 },
  { code: "MX", name: "Mexico", flag: "🇲🇽", dialCode: "+52", format: "## #### ####", priority: 13 },
  { code: "RU", name: "Russia", flag: "🇷🇺", dialCode: "+7", format: "(###) ###-##-##", priority: 14 },
  { code: "ZA", name: "South Africa", flag: "🇿🇦", dialCode: "+27", format: "## ### ####", priority: 15 },
  { code: "AR", name: "Argentina", flag: "🇦🇷", dialCode: "+54", format: "## ####-####", priority: 16 },
  { code: "CL", name: "Chile", flag: "🇨🇱", dialCode: "+56", format: "# #### ####", priority: 17 },
  { code: "CO", name: "Colombia", flag: "🇨🇴", dialCode: "+57", format: "### ### ####", priority: 18 },
  { code: "PE", name: "Peru", flag: "🇵🇪", dialCode: "+51", format: "### ### ###", priority: 19 },
  { code: "VE", name: "Venezuela", flag: "🇻🇪", dialCode: "+58", format: "###-#######", priority: 20 },
  { code: "EG", name: "Egypt", flag: "🇪🇬", dialCode: "+20", format: "### ### ####", priority: 21 },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", dialCode: "+966", format: "## ### ####", priority: 22 },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪", dialCode: "+971", format: "## ### ####", priority: 23 },
  { code: "IL", name: "Israel", flag: "🇮🇱", dialCode: "+972", format: "##-###-####", priority: 24 },
  { code: "TR", name: "Turkey", flag: "🇹🇷", dialCode: "+90", format: "(###) ### ## ##", priority: 25 },
  { code: "GR", name: "Greece", flag: "🇬🇷", dialCode: "+30", format: "### ### ####", priority: 26 },
  { code: "PT", name: "Portugal", flag: "🇵🇹", dialCode: "+351", format: "### ### ###", priority: 27 },
  { code: "NL", name: "Netherlands", flag: "🇳🇱", dialCode: "+31", format: "## ########", priority: 28 },
  { code: "BE", name: "Belgium", flag: "🇧🇪", dialCode: "+32", format: "### ## ## ##", priority: 29 },
  { code: "CH", name: "Switzerland", flag: "🇨🇭", dialCode: "+41", format: "## ### ## ##", priority: 30 },
  { code: "AT", name: "Austria", flag: "🇦🇹", dialCode: "+43", format: "### ######", priority: 31 },
  { code: "SE", name: "Sweden", flag: "🇸🇪", dialCode: "+46", format: "##-### ## ##", priority: 32 },
  { code: "NO", name: "Norway", flag: "🇳🇴", dialCode: "+47", format: "### ## ###", priority: 33 },
  { code: "DK", name: "Denmark", flag: "🇩🇰", dialCode: "+45", format: "## ## ## ##", priority: 34 },
  { code: "FI", name: "Finland", flag: "🇫🇮", dialCode: "+358", format: "## ### ####", priority: 35 },
  { code: "PL", name: "Poland", flag: "🇵🇱", dialCode: "+48", format: "### ### ###", priority: 36 },
  { code: "CZ", name: "Czech Republic", flag: "🇨🇿", dialCode: "+420", format: "### ### ###", priority: 37 },
  { code: "HU", name: "Hungary", flag: "🇭🇺", dialCode: "+36", format: "## ### ####", priority: 38 },
  { code: "RO", name: "Romania", flag: "🇷🇴", dialCode: "+40", format: "### ### ###", priority: 39 },
  { code: "BG", name: "Bulgaria", flag: "🇧🇬", dialCode: "+359", format: "## ### ####", priority: 40 },
  { code: "HR", name: "Croatia", flag: "🇭🇷", dialCode: "+385", format: "## ### ####", priority: 41 },
  { code: "SI", name: "Slovenia", flag: "🇸🇮", dialCode: "+386", format: "## ### ###", priority: 42 },
  { code: "SK", name: "Slovakia", flag: "🇸🇰", dialCode: "+421", format: "### ### ###", priority: 43 },
  { code: "LT", name: "Lithuania", flag: "🇱🇹", dialCode: "+370", format: "### #####", priority: 44 },
  { code: "LV", name: "Latvia", flag: "🇱🇻", dialCode: "+371", format: "## ### ###", priority: 45 },
  { code: "EE", name: "Estonia", flag: "🇪🇪", dialCode: "+372", format: "#### ####", priority: 46 },
  { code: "IE", name: "Ireland", flag: "🇮🇪", dialCode: "+353", format: "## ### ####", priority: 47 },
  { code: "IS", name: "Iceland", flag: "🇮🇸", dialCode: "+354", format: "### ####", priority: 48 },
  { code: "LU", name: "Luxembourg", flag: "🇱🇺", dialCode: "+352", format: "### ###", priority: 49 },
  { code: "MT", name: "Malta", flag: "🇲🇹", dialCode: "+356", format: "#### ####", priority: 50 },
]

export function getCountryByCode(code: string): Country | undefined {
  return COUNTRIES.find((country) => country.code === code)
}

export function getCountriesByPriority(): Country[] {
  return COUNTRIES.sort((a, b) => a.priority - b.priority)
}

export function formatPhoneNumber(
  phone: string,
  country: Country,
  format: "international" | "national" | "e164",
): string {
  const cleanPhone = phone.replace(/\D/g, "")

  switch (format) {
    case "international":
      return `${country.dialCode} ${cleanPhone}`
    case "national":
      return cleanPhone
    case "e164":
      return `${country.dialCode}${cleanPhone}`
    default:
      return phone
  }
}
