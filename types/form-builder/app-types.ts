export interface User {
  id: string
  email: string
  name: string | null
  avatar?: string
}

export interface FormData {
  id: string
  title: string
  description?: string
  createdAt: Date
  updatedAt: Date
  status: "draft" | "published"
  responseCount: number
  fields: any[]
  config: {
    supportedLanguages?: string[]
    mainLanguage?: string
    [key: string]: any
  }
  shareUrl?: string
}

export interface FormResponse {
  id: string
  formId: string
  submittedAt: Date
  data: Record<string, any>
  ipAddress?: string
}

export type AppPage = "home" | "editor" | "responses"
