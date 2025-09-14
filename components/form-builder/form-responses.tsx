"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface FormResponsesProps {
  formId: string
  currentLanguage: string
  onBack: () => void
}

export function FormResponses({ formId, currentLanguage, onBack }: FormResponsesProps) {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-2xl font-bold">Form Responses</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-8">
          <p className="text-gray-600">Responses for form {formId} will be displayed here</p>
        </div>
      </div>
    </div>
  )
}
