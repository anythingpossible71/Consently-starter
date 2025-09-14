"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import type { FormField } from "@/types/form-builder/form-builder"
import type { FormConfig } from "@/types/form-builder/form-config"

interface FormPreviewProps {
  fields: FormField[]
  formTitle: string
  formDescription: string
  formConfig: FormConfig
  onExitPreview: () => void
}

export function FormPreview({
  fields,
  formTitle,
  formDescription,
  formConfig,
  onExitPreview
}: FormPreviewProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">{formTitle}</h1>
            <Button variant="outline" onClick={onExitPreview}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Editor
            </Button>
          </div>
          
          {formDescription && (
            <p className="text-gray-600 mb-6">{formDescription}</p>
          )}

          <div className="space-y-4">
            <p className="text-gray-500">Form preview will show here with {fields.length} fields</p>
          </div>
        </div>
      </div>
    </div>
  )
}
