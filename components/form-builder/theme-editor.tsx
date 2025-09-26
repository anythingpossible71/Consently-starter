"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// Textarea import removed - CSS editing is disabled
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Code, Palette, RotateCcw, AlertTriangle, Frame, Paintbrush, Type, MousePointer } from "lucide-react"
// Removed old theme system imports - now using database-driven styling
import type { FormConfig } from "@/types/form-builder/form-config"
import { FormStylingService } from "@/lib/form-styling/form-styling"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ThemeEditorProps {
  formConfig: FormConfig
  onFormConfigChange: (updates: Partial<FormConfig>) => void
  onThemeApply: (css: string) => void
  formId?: string
}

// Theme presets are now handled via database CSS variables
// Individual styling controls (font, colors, etc.) are used instead

// Available font families
const FONT_OPTIONS = [
  { value: "Inter, system-ui, sans-serif", label: "Inter (Modern)" },
  { value: "system-ui, -apple-system, sans-serif", label: "System UI" },
  { value: "Helvetica, Arial, sans-serif", label: "Helvetica" },
  { value: "Georgia, serif", label: "Georgia (Serif)" },
  { value: "Times New Roman, serif", label: "Times New Roman" },
  { value: "Monaco, Consolas, monospace", label: "Monaco (Monospace)" },
  { value: "Roboto, sans-serif", label: "Roboto" },
  { value: "Open Sans, sans-serif", label: "Open Sans" },
]

export function ThemeEditor({ formConfig, onFormConfigChange, onThemeApply, formId }: ThemeEditorProps) {
  const [activeTab, setActiveTab] = useState("presets")
  const [showClearDialog, setShowClearDialog] = useState(false)
  const [savedState, setSavedState] = useState({
    selectedTheme: formConfig.selectedTheme,
    showFrame: formConfig.showFrame,
    showBackground: formConfig.showBackground,
    backgroundColor: formConfig.backgroundColor,
    formFontFamily: formConfig.formFontFamily,
    submitButtonColor: formConfig.submitButtonColor,
  })

  const handleThemeSelect = (themeId: string) => {
    onFormConfigChange({ selectedTheme: themeId })
    // Note: Themes are now handled via individual CSS variables in the database
    // The theme selection is kept for UI consistency but styling is database-driven
  }

  // CSS editing removed - now using database-driven styling

  const handleFrameToggle = async (checked: boolean) => {
    onFormConfigChange({ showFrame: checked })
    // Auto-apply changes
    await applyCurrentSettings({ showFrame: checked })
  }

  const handleBackgroundToggle = async (checked: boolean) => {
    onFormConfigChange({ showBackground: checked })
    // Auto-apply changes
    await applyCurrentSettings({ showBackground: checked })
  }

  const handleBackgroundColorChange = async (color: string) => {
    onFormConfigChange({ backgroundColor: color })
    // Auto-apply changes
    await applyCurrentSettings({ backgroundColor: color })
  }

  const handleFontFamilyChange = async (fontFamily: string) => {
    onFormConfigChange({ formFontFamily: fontFamily })
    // Auto-apply changes
    await applyCurrentSettings({ formFontFamily: fontFamily })
  }

  const handleSubmitButtonColorChange = async (color: string) => {
    onFormConfigChange({ submitButtonColor: color })
    // Auto-apply changes
    await applyCurrentSettings({ submitButtonColor: color })
  }

  const applyCurrentSettings = async (overrides: any = {}) => {
    const currentConfig = { ...formConfig, ...overrides }
    
    // Save to database if formId is available - this will trigger CSS regeneration
    if (formId) {
      try {
        // Convert form config to CSS variables and save to database
        const stylingVariables = {
          '--form-font-family': `"${currentConfig.formFontFamily || 'Inter, system-ui, sans-serif'}"`,
          '--form-button-primary-background': `"${currentConfig.submitButtonColor || '#2563eb'}"`,
          '--form-container-background': `"${currentConfig.backgroundColor || '#ffffff'}"`,
          '--form-show-frame': currentConfig.showFrame ? '"true"' : '"false"',
          '--form-show-background': currentConfig.showBackground ? '"true"' : '"false"'
        }
        
        const response = await fetch(`/api/forms/${formId}/styles`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ styles: stylingVariables })
        })
        
        if (!response.ok) {
          throw new Error('Failed to save styles')
        }
        
        // The CSS will be automatically regenerated and applied via the form canvas/viewer
        // No need to call onThemeApply() as the dynamic CSS system handles this
        
      } catch (error) {
        console.error('Failed to save styling to database:', error)
      }
    }
  }

  // Apply dialog removed - changes are saved automatically

  // confirmApply function removed - changes are saved automatically

  const handleClear = () => {
    setShowClearDialog(true)
  }

  const confirmClear = async () => {
    // Restore to saved state
    onFormConfigChange({
      selectedTheme: savedState.selectedTheme,
      showFrame: savedState.showFrame,
      showBackground: savedState.showBackground,
      backgroundColor: savedState.backgroundColor,
      formFontFamily: savedState.formFontFamily,
      submitButtonColor: savedState.submitButtonColor,
    })

    // Reset to database defaults if formId is available
    if (formId) {
      try {
        const response = await fetch(`/api/forms/${formId}/styles/reset`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        })
        
        if (!response.ok) {
          throw new Error('Failed to reset styles')
        }
      } catch (error) {
        console.error('Failed to reset styling in database:', error)
      }
    }

    setShowClearDialog(false)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center">
            <Palette className="w-4 h-4 text-indigo-600 mr-2" />
            Theme Editor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Top Level Controls */}
          <div className="space-y-4 pb-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Frame className="w-4 h-4 text-gray-600" />
                <Label className="text-sm font-medium text-gray-700">Frame</Label>
              </div>
              <Switch checked={formConfig.showFrame} onCheckedChange={handleFrameToggle} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Paintbrush className="w-4 h-4 text-gray-600" />
                <Label className="text-sm font-medium text-gray-700">Background</Label>
              </div>
              <Switch checked={formConfig.showBackground} onCheckedChange={handleBackgroundToggle} />
            </div>

            {formConfig.showBackground && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Background Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formConfig.backgroundColor}
                    onChange={(e) => handleBackgroundColorChange(e.target.value)}
                    className="w-10 h-8 rounded border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formConfig.backgroundColor}
                    onChange={(e) => handleBackgroundColorChange(e.target.value)}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            )}

            {/* Font Family Control */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-gray-600" />
                <Label className="text-sm font-medium text-gray-700">Font Family</Label>
              </div>
              <Select value={formConfig.formFontFamily} onValueChange={handleFontFamilyChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  {FONT_OPTIONS.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      <span style={{ fontFamily: font.value }}>{font.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button Color Control */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MousePointer className="w-4 h-4 text-gray-600" />
                <Label className="text-sm font-medium text-gray-700">Submit Button Color</Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formConfig.submitButtonColor}
                  onChange={(e) => handleSubmitButtonColorChange(e.target.value)}
                  className="w-10 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={formConfig.submitButtonColor}
                  onChange={(e) => handleSubmitButtonColorChange(e.target.value)}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                  placeholder="#2563eb"
                />
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="presets" className="text-xs">
                <Palette className="w-3 h-3 mr-1" />
                Presets
              </TabsTrigger>
              <TabsTrigger value="css" className="text-xs">
                <Code className="w-3 h-3 mr-1" />
                CSS
              </TabsTrigger>
            </TabsList>

            <TabsContent value="presets" className="space-y-3">
              <div className="text-center py-8">
                <div className="text-sm text-gray-600 mb-4">
                  🎨 <strong>New Styling System</strong>
                </div>
                <p className="text-xs text-gray-500 mb-4">
                  Form styling is now controlled individually using the controls above.
                  Each setting is saved to the database and applied automatically.
                </p>
                <div className="text-xs text-gray-400">
                  Font Family • Button Colors • Background Colors • Frame Settings
                </div>
              </div>
            </TabsContent>

            <TabsContent value="css" className="space-y-3">
              <div className="text-center py-8">
                <div className="text-sm text-gray-600 mb-4">
                  🔧 <strong>Advanced CSS (Coming Soon)</strong>
                </div>
                <p className="text-xs text-gray-500 mb-4">
                  Custom CSS editing will be available in a future update.
                  For now, use the styling controls above to customize your form.
                </p>
                <div className="text-xs text-gray-400">
                  Form styles are now generated automatically from database variables
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons - Separate Rows */}
          <div className="space-y-2 pt-2 border-t border-gray-200">
            <Button variant="outline" size="sm" onClick={handleClear} className="w-full bg-transparent">
              <RotateCcw className="w-3 h-3 mr-2" />
              Reset to Defaults
            </Button>
            <div className="text-xs text-gray-500 text-center">
              Changes are saved automatically as you adjust the settings above
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Apply Dialog removed - changes are now saved automatically */}

      {/* Clear Confirmation Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              Clear Changes
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will discard all unsaved changes and restore the theme to the last saved state. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmClear} className="bg-orange-600 hover:bg-orange-700">
              Clear Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
