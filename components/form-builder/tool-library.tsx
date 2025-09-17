"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Type, 
  Mail, 
  Phone, 
  FileText, 
  CircleDot, 
  CheckSquare, 
  Check, 
  Calendar, 
  Upload, 
  PenTool, 
  Heading, 
  AlignLeft
} from "lucide-react"
import type { FieldType } from "@/types/form-builder/form-builder"
import { getTranslation } from "@/utils/form-builder/translations"

interface ToolLibraryProps {
  onAddField: (fieldType: FieldType) => void
  currentLanguage: string
}

export function ToolLibrary({ onAddField, currentLanguage }: ToolLibraryProps) {
  const fieldTypes = [
    { type: "text" as FieldType, icon: Type, label: "textInput", desc: "textInputDesc" },
    { type: "email" as FieldType, icon: Mail, label: "email", desc: "emailDesc" },
    { type: "phone" as FieldType, icon: Phone, label: "phone", desc: "phoneDesc" },
    { type: "textarea" as FieldType, icon: FileText, label: "longText", desc: "longTextDesc" },
    { type: "multiple-choice" as FieldType, icon: CircleDot, label: "multipleChoice", desc: "multipleChoiceDesc" },
    { type: "checkboxes" as FieldType, icon: CheckSquare, label: "checkboxes", desc: "checkboxesDesc" },
    { type: "agreement" as FieldType, icon: Check, label: "agreement", desc: "agreementDesc" },
    { type: "date" as FieldType, icon: Calendar, label: "dateTime", desc: "dateTimeDesc" },
    { type: "file-upload" as FieldType, icon: Upload, label: "fileUpload", desc: "fileUploadDesc" },
    { type: "signature" as FieldType, icon: PenTool, label: "signature", desc: "signatureDesc" },
    { type: "heading" as FieldType, icon: Heading, label: "heading", desc: "headingDesc" },
    { type: "text-block" as FieldType, icon: AlignLeft, label: "textBlock", desc: "textBlockDesc" },
  ]

  return (
    <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4 pb-[50px]">
        <h2 className="text-lg font-semibold mb-4">Add Fields</h2>
        
        <div className="space-y-2">
          {fieldTypes.map((fieldType) => {
            const Icon = fieldType.icon
            return (
              <Card key={fieldType.type} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4" onClick={() => onAddField(fieldType.type)}>
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-gray-600" />
                    <div>
                      <h3 className="font-medium text-sm">
                        {getTranslation(fieldType.label, currentLanguage)}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {getTranslation(fieldType.desc, currentLanguage)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
