"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import type { FormField } from "@/types/form-builder/form-builder"
import type { FormConfig } from "@/types/form-builder/form-config"
import { FieldRenderer } from "./field-renderer"

interface FormPreviewProps {
  fields: FormField[]
  formTitle: string
  formConfig: FormConfig
  onExitPreview: () => void
}

export function FormPreview({
  fields,
  formTitle,
  formConfig,
  onExitPreview
}: FormPreviewProps) {
  return (
    <div className="h-full bg-gray-50 p-4 overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">{formTitle}</h1>
            <Button variant="outline" onClick={onExitPreview}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Editor
            </Button>
          </div>
          
          {formConfig.description && (
            <p className="text-gray-600 mb-6">{formConfig.description}</p>
          )}

          <div className="space-y-6 pb-16">
            {fields.map((field, index) => (
              <FieldRenderer
                key={field.id || index}
                field={field}
                formConfig={formConfig}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
