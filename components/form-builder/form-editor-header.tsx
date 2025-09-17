"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Settings, Eye, ArrowLeft, Save, Loader2 } from "lucide-react"

interface FormEditorHeaderProps {
  formTitle: string
  onTitleChange: (title: string) => void
  onSettingsToggle: () => void
  isSettingsActive: boolean
  onPreviewToggle: () => void
  onBackToHome: () => void
  currentLanguage: string
  onPublish: () => void
  isPublishing: boolean
  isPreview?: boolean
}

export function FormEditorHeader({
  formTitle,
  onTitleChange,
  onSettingsToggle,
  isSettingsActive,
  onPreviewToggle,
  onBackToHome,
  currentLanguage,
  onPublish,
  isPublishing,
  isPreview = false
}: FormEditorHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBackToHome}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <Input
            value={formTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            className="text-xl font-semibold border-none shadow-none px-0 focus-visible:ring-0"
            placeholder="Untitled Form"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onPreviewToggle}>
            <Eye className="w-4 h-4 mr-2" />
            {isPreview ? "Exit Preview" : "Preview"}
          </Button>
          <Button 
            variant={isSettingsActive ? "default" : "outline"} 
            onClick={onSettingsToggle}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button 
            onClick={onPublish}
            disabled={isPublishing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isPublishing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isPublishing ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </div>
    </div>
  )
}
