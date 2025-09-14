"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"
import type { FormField } from "@/types/form-builder/form-builder"
import type { FormConfig } from "@/types/form-builder/form-config"

interface PropertiesPanelProps {
  selectedField: FormField | null
  onUpdateField: (fieldId: string, updates: Partial<FormField>) => void
  formConfig: FormConfig
  onFormConfigChange: (updates: Partial<FormConfig>) => void
  panelMode: "field" | "form"
  onClose: () => void
  fields: FormField[]
  onThemeApply?: (css: string) => void
  onSaveChanges?: () => void
}

export function PropertiesPanel({
  selectedField,
  onUpdateField,
  formConfig,
  onFormConfigChange,
  panelMode,
  onClose,
  fields,
  onThemeApply,
  onSaveChanges
}: PropertiesPanelProps) {
  return (
    <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {panelMode === "field" ? "Field Properties" : "Form Settings"}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">
              {panelMode === "field" 
                ? "Select a field to edit its properties"
                : "Configure your form settings and appearance"
              }
            </p>
            {onSaveChanges && (
              <Button 
                className="w-full mt-4" 
                onClick={onSaveChanges}
              >
                Save Changes
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
