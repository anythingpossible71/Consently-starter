"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Code, Palette, RotateCcw, Play, AlertTriangle, Frame, Paintbrush, Type, MousePointer } from "lucide-react"
import { THEME_PRESETS, generateThemeCSS } from "@/types/form-builder/theme-config"
import type { FormConfig } from "@/types/form-builder/form-config"
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
}

const THEME_CSS_TEMPLATES = {
  default: `/* Default Theme - Clean and Professional */
.form-content-container {
  max-width: 640px;
  margin: 20px auto;
  padding: 2rem;
  background: var(--form-background);
  border-radius: 0.5rem;
  box-shadow: var(--form-box-shadow);
  border: var(--form-border);
  font-family: var(--form-font-family);
}

.form-field {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  background-color: var(--input-background);
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-button {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}

.form-button-primary {
  background: #2563eb;
  color: #ffffff;
}

.form-button-primary:hover {
  background: #1d4ed8;
}`,

  minimal: `/* Minimal Theme - Clean and Simple */
.form-content-container {
  max-width: 640px;
  margin: 20px auto;
  padding: 2rem;
  background: var(--form-background);
  border: var(--form-border);
  font-family: var(--form-font-family);
}

.form-field {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 400;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.5rem 0;
  border: none;
  border-bottom: 1px solid #d1d5db;
  background: var(--input-background);
  font-size: 1rem;
  transition: border-color 0.15s ease-in-out;
}

.form-input:focus {
  outline: none;
  border-bottom-color: #000000;
}

.form-button {
  padding: 0.5rem 1.5rem;
  border: none;
  font-size: 0.875rem;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}

.form-button-primary {
  background: #000000;
  color: #ffffff;
}

.form-button-primary:hover {
  background: #374151;
}`,

  modern: `/* Modern Theme - Contemporary with Gradients */
.form-content-container {
  max-width: 640px;
  margin: 20px auto;
  padding: 0px;
  background: var(--form-background);
  border-radius: 1rem;
  box-shadow: var(--form-box-shadow);
  font-family: var(--form-font-family);
}

.form-field {
  margin-bottom: 2rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  font-size: 1rem;
  background: var(--input-background);
  transition: all 0.2s ease-in-out;
}

.form-input:focus {
  outline: none;
  border-color: #7c3aed;
  background: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.15);
}

.form-button {
  padding: 1rem 2rem;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.form-button-primary {
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
  color: #ffffff;
}

.form-button-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(124, 58, 237, 0.3);
}`,

  classic: `/* Classic Theme - Traditional and Reliable */
.form-content-container {
  max-width: 640px;
  margin: 20px auto;
  padding: 2rem;
  background: var(--form-background);
  border: var(--form-border);
  border-radius: 0.25rem;
  font-family: var(--form-font-family);
}

.form-field {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #9ca3af;
  border-radius: 0.25rem;
  font-size: 1rem;
  background: var(--input-background);
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-input:focus {
  outline: none;
  border-color: #059669;
  box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2);
}

.form-button {
  padding: 0.75rem 1.5rem;
  border-radius: 0.25rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}

.form-button-primary {
  background: #059669;
  color: #ffffff;
  border: 1px solid #047857;
}

.form-button-primary:hover {
  background: #047857;
}`,
}

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

export function ThemeEditor({ formConfig, onFormConfigChange, onThemeApply }: ThemeEditorProps) {
  const [activeTab, setActiveTab] = useState("presets")
  const [customCSS, setCustomCSS] = useState(formConfig.customCSS)
  const [showApplyDialog, setShowApplyDialog] = useState(false)
  const [showClearDialog, setShowClearDialog] = useState(false)
  const [savedState, setSavedState] = useState({
    selectedTheme: formConfig.selectedTheme,
    customCSS: formConfig.customCSS,
    showFrame: formConfig.showFrame,
    showBackground: formConfig.showBackground,
    backgroundColor: formConfig.backgroundColor,
    formFontFamily: formConfig.formFontFamily,
    submitButtonColor: formConfig.submitButtonColor,
  })

  const handleThemeSelect = (themeId: string) => {
    onFormConfigChange({ selectedTheme: themeId })
    // Load the CSS template for the selected theme
    const template = THEME_CSS_TEMPLATES[themeId as keyof typeof THEME_CSS_TEMPLATES] || THEME_CSS_TEMPLATES.default
    setCustomCSS(template)
  }

  const handleCSSChange = (css: string) => {
    setCustomCSS(css)
  }

  const handleFrameToggle = (checked: boolean) => {
    onFormConfigChange({ showFrame: checked })
    // Auto-apply changes
    applyCurrentSettings({ showFrame: checked })
  }

  const handleBackgroundToggle = (checked: boolean) => {
    onFormConfigChange({ showBackground: checked })
    // Auto-apply changes
    applyCurrentSettings({ showBackground: checked })
  }

  const handleBackgroundColorChange = (color: string) => {
    onFormConfigChange({ backgroundColor: color })
    // Auto-apply changes
    applyCurrentSettings({ backgroundColor: color })
  }

  const handleFontFamilyChange = (fontFamily: string) => {
    onFormConfigChange({ formFontFamily: fontFamily })
    // Auto-apply changes
    applyCurrentSettings({ formFontFamily: fontFamily })
  }

  const handleSubmitButtonColorChange = (color: string) => {
    onFormConfigChange({ submitButtonColor: color })
    // Auto-apply changes
    applyCurrentSettings({ submitButtonColor: color })
  }

  const applyCurrentSettings = (overrides: any = {}) => {
    const currentConfig = { ...formConfig, ...overrides }
    const theme = THEME_PRESETS[currentConfig.selectedTheme] || THEME_PRESETS.default
    const css = generateThemeCSS(theme, customCSS, currentConfig)
    onThemeApply(css)
  }

  const handleApply = () => {
    setShowApplyDialog(true)
  }

  const confirmApply = () => {
    // Update the form config
    onFormConfigChange({ customCSS: customCSS })

    // Generate and apply CSS
    const theme = THEME_PRESETS[formConfig.selectedTheme] || THEME_PRESETS.default
    const css = generateThemeCSS(theme, customCSS, formConfig)
    onThemeApply(css)

    // Update saved state
    setSavedState({
      selectedTheme: formConfig.selectedTheme,
      customCSS: customCSS,
      showFrame: formConfig.showFrame,
      showBackground: formConfig.showBackground,
      backgroundColor: formConfig.backgroundColor,
      formFontFamily: formConfig.formFontFamily,
      submitButtonColor: formConfig.submitButtonColor,
    })

    setShowApplyDialog(false)
  }

  const handleClear = () => {
    setShowClearDialog(true)
  }

  const confirmClear = () => {
    // Restore to saved state
    onFormConfigChange({
      selectedTheme: savedState.selectedTheme,
      customCSS: savedState.customCSS,
      showFrame: savedState.showFrame,
      showBackground: savedState.showBackground,
      backgroundColor: savedState.backgroundColor,
      formFontFamily: savedState.formFontFamily,
      submitButtonColor: savedState.submitButtonColor,
    })
    setCustomCSS(savedState.customCSS)

    // Apply saved state
    const theme = THEME_PRESETS[savedState.selectedTheme] || THEME_PRESETS.default
    const css = generateThemeCSS(theme, savedState.customCSS, savedState)
    onThemeApply(css)

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
              <div className="grid grid-cols-2 gap-3">
                {Object.values(THEME_PRESETS).map((theme) => (
                  <Card
                    key={theme.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      formConfig.selectedTheme === theme.id ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => handleThemeSelect(theme.id)}
                  >
                    <CardContent className="p-3">
                      <div className="relative">
                        {/* Theme Preview */}
                        <div
                          className="w-full h-16 rounded border-2 mb-2 relative overflow-hidden"
                          style={{
                            backgroundColor: formConfig.showBackground
                              ? formConfig.backgroundColor || theme.colors.background
                              : "transparent",
                            borderColor: formConfig.showFrame ? theme.colors.border : "transparent",
                            boxShadow: formConfig.showFrame ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                          }}
                        >
                          {/* Header */}
                          <div className="h-3 w-full" style={{ backgroundColor: theme.colors.primary, opacity: 0.1 }} />
                          {/* Form elements */}
                          <div className="p-2 space-y-1">
                            <div className="h-2 w-3/4 rounded" style={{ backgroundColor: theme.colors.border }} />
                            <div className="h-2 w-1/2 rounded" style={{ backgroundColor: theme.colors.border }} />
                            <div className="h-3 w-1/3 rounded mt-2" style={{ backgroundColor: theme.colors.primary }} />
                          </div>
                        </div>

                        <div className="text-center">
                          <span className="text-xs font-medium text-gray-700">{theme.name}</span>
                          <p className="text-xs text-gray-500 mt-1">{theme.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="css" className="space-y-3">
              <div className="text-xs text-gray-600">Edit the CSS template for your form</div>
              <Textarea
                value={customCSS}
                onChange={(e) => handleCSSChange(e.target.value)}
                placeholder="/* Your form CSS will appear here */&#10;.form-container {&#10;  /* Container styles */&#10;}"
                className="font-mono text-xs min-h-[300px] resize-none"
                style={{ fontFamily: "Monaco, Consolas, 'Courier New', monospace" }}
              />
              <div className="text-xs text-gray-500">
                This CSS template uses CSS variables (--form-background, --form-border, --form-box-shadow,
                --input-background) that are automatically controlled by the Frame and Background toggles above.
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons - Separate Rows */}
          <div className="space-y-2 pt-2 border-t border-gray-200">
            <Button variant="outline" size="sm" onClick={handleClear} className="w-full bg-transparent">
              <RotateCcw className="w-3 h-3 mr-2" />
              Clear Changes
            </Button>
            <Button variant="default" size="sm" onClick={handleApply} className="w-full bg-blue-600 hover:bg-blue-700">
              <Play className="w-3 h-3 mr-2" />
              Apply Theme
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Apply Confirmation Dialog */}
      <AlertDialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Apply Theme Changes
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will apply your current theme and CSS changes to the form. Any previous styling will be overridden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmApply}>Apply Changes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
