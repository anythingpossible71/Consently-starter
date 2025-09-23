"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { FormField } from "@/types/form-builder/form-builder"
import type { FormConfig } from "@/types/form-builder/form-config"
import {
  Settings,
  Plus,
  Trash2,
  X,
  HelpCircle,
  Share2,
  Palette,
  GripVertical,
  Mail,
  Bell,
  QrCode,
  Save,
  Languages,
  Globe,
  Maximize2,
} from "lucide-react"
import { getUITranslation, getFormTranslation, isRTL, getDefaultPlaceholder } from "@/utils/form-builder/translations"
import { useState, useRef } from "react"
import { ThemeEditor } from "./theme-editor"
import { CountrySelector } from "./country-selector"
import { RichTextEditor, RichTextModal } from "./rich-text-editor"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

interface DraggableOptionProps {
  option: string
  index: number
  moveOption: (dragIndex: number, hoverIndex: number) => void
  updateOption: (index: number, value: string) => void
  removeOption: (index: number) => void
  isRTL: boolean
}

function DraggableOption({ option, index, moveOption, updateOption, removeOption, isRTL }: DraggableOptionProps) {
  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag] = useDrag({
    type: "option",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: "option",
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveOption(item.index, index)
        item.index = index
      }
    },
  })

  drag(drop(ref))

  return (
    <div
      ref={ref}
      className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""} ${
        isDragging ? "opacity-50" : ""
      } cursor-move`}
    >
      <div className="flex-shrink-0">
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>
      <Input
        value={option}
        onChange={(e) => updateOption(index, e.target.value)}
        className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}
        dir={isRTL ? "rtl" : "ltr"}
      />
      <Button size="sm" variant="outline" onClick={() => removeOption(index)} className="p-2 flex-shrink-0">
        <Trash2 className="w-3 h-3" />
      </Button>
    </div>
  )
}

interface PropertiesPanelProps {
  selectedField: FormField | null
  onUpdateField: (fieldId: string, updates: Partial<FormField>) => void
  formConfig: FormConfig
  onFormConfigChange: (updates: Partial<FormConfig>) => void
  panelMode: "form" | "field"
  onClose: () => void
  fields: FormField[]
  onThemeApply: (css: string) => void
  onSaveChanges?: () => void
  formId?: string
}

const AVAILABLE_LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "he", name: "עברית", flag: "🇮🇱" },
]

export function PropertiesPanel({
  selectedField,
  onUpdateField,
  formConfig,
  onFormConfigChange,
  panelMode,
  onClose,
  fields,
  onThemeApply,
  onSaveChanges,
  formId,
}: PropertiesPanelProps) {
  const [isLanguageSelectOpen, setIsLanguageSelectOpen] = useState(false)
  const [selectedLanguageTab, setSelectedLanguageTab] = useState(formConfig.language)
  const [languageToAdd, setLanguageToAdd] = useState("")
  const [isRichTextModalOpen, setIsRichTextModalOpen] = useState(false)

  const updateFieldOption = (index: number, value: string) => {
    if (!selectedField?.options) return
    const newOptions = [...selectedField.options]
    newOptions[index] = value
    onUpdateField(selectedField.id, { options: newOptions })
  }

  const moveFieldOption = (dragIndex: number, hoverIndex: number) => {
    if (!selectedField?.options) return
    const newOptions = [...selectedField.options]
    const draggedOption = newOptions[dragIndex]
    newOptions.splice(dragIndex, 1)
    newOptions.splice(hoverIndex, 0, draggedOption)
    onUpdateField(selectedField.id, { options: newOptions })
  }

  const addFieldOption = () => {
    if (!selectedField) return
    const newOptions = [
      ...(selectedField.options || []),
      `${getFormTranslation("formElements", "option", formConfig.language)} ${(selectedField.options?.length || 0) + 1}`,
    ]
    onUpdateField(selectedField.id, { options: newOptions })
  }

  const removeFieldOption = (index: number) => {
    if (!selectedField?.options) return
    const newOptions = selectedField.options.filter((_, i) => i !== index)
    onUpdateField(selectedField.id, { options: newOptions })
  }

  const isRTLLanguage = isRTL(formConfig.language)

  // Generate form URL based on formId or use default
  const formUrl = formId 
    ? `${window.location.origin}/forms/public/${formId}`
    : `https://forms.app/${(formConfig.title || "untitled-form").toLowerCase().replace(/\s+/g, "-")}`

  // Language management functions
  const addLanguage = () => {
    if (!languageToAdd || formConfig.supportedLanguages?.includes(languageToAdd)) return

    const newSupportedLanguages = [...(formConfig.supportedLanguages || [formConfig.language]), languageToAdd]
    const newLanguageTexts = {
      ...formConfig.languageTexts,
      [languageToAdd]: {
        formTitle: {},
        formDescription: {},
        fieldLabels: {},
        fieldPlaceholders: {},
        fieldOptions: {},
        buttonTexts: {},
      },
    }

    onFormConfigChange({
      supportedLanguages: newSupportedLanguages,
      languageTexts: newLanguageTexts,
    })
    setLanguageToAdd("")
  }

  const removeLanguage = (langCode: string) => {
    if (langCode === formConfig.language) return // Can't remove main language

    const newSupportedLanguages = formConfig.supportedLanguages?.filter((lang) => lang !== langCode) || []
    const newLanguageTexts = { ...formConfig.languageTexts }
    delete newLanguageTexts[langCode]

    onFormConfigChange({
      supportedLanguages: newSupportedLanguages,
      languageTexts: newLanguageTexts,
    })

    if (selectedLanguageTab === langCode) {
      setSelectedLanguageTab(formConfig.language)
    }
  }

  const updateLanguageText = (langCode: string, category: string, key: string, value: string) => {
    const currentLangTexts = formConfig.languageTexts?.[langCode] as any || {}
    const currentCategoryTexts = currentLangTexts[category] as any || {}

    const newLanguageTexts = {
      ...formConfig.languageTexts,
      [langCode]: {
        ...currentLangTexts,
        [category]: {
          ...currentCategoryTexts,
          [key]: value,
        },
      },
    }
    onFormConfigChange({ languageTexts: newLanguageTexts })
  }

  const getLanguageText = (langCode: string, category: string, key: string): string => {
    const langTexts = formConfig.languageTexts?.[langCode] as any
    return langTexts?.[category]?.[key] || ""
  }

  const supportedLanguages = formConfig.supportedLanguages || [formConfig.language]
  const availableToAdd = AVAILABLE_LANGUAGES.filter((lang) => !supportedLanguages.includes(lang.code))

  // Full-screen form settings
  if (panelMode === "form") {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col" dir="ltr">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
                <X className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {getUITranslation("formSettings", formConfig.language)}
                </h1>
                <p className="text-sm text-gray-500">Configure your form settings and sharing options</p>
              </div>
            </div>
            <Button onClick={onSaveChanges} className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-4xl mx-auto p-6">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8 max-w-lg">
                <TabsTrigger value="general" className="text-sm">
                  <Settings className="w-4 h-4 mr-2" />
                  General
                </TabsTrigger>
                <TabsTrigger value="languages" className="text-sm">
                  <Languages className="w-4 h-4 mr-2" />
                  Languages
                </TabsTrigger>
                <TabsTrigger value="sharing" className="text-sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Sharing
                </TabsTrigger>
                <TabsTrigger value="styling" className="text-sm">
                  <Palette className="w-4 h-4 mr-2" />
                  Style
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Form Configuration */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-medium flex items-center">
                        <Settings className="w-5 h-5 text-blue-600 mr-3" />
                        {getUITranslation("formConfiguration", formConfig.language)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">
                          {getUITranslation("formTitle", formConfig.language)}
                        </Label>
                        <Input
                          value={formConfig.title}
                          onChange={(e) => onFormConfigChange({ title: e.target.value })}
                          placeholder={getFormTranslation("formElements", "enterFormTitle", formConfig.language)}
                          className="text-left"
                          dir={isRTLLanguage ? "rtl" : "ltr"}
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">
                          {getUITranslation("description", formConfig.language)}
                        </Label>
                        <Textarea
                          value={formConfig.description}
                          onChange={(e) => onFormConfigChange({ description: e.target.value })}
                          placeholder={getFormTranslation("formElements", "enterFormDescription", formConfig.language)}
                          className="text-left"
                          dir={isRTLLanguage ? "rtl" : "ltr"}
                          rows={4}
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">Main Language</Label>
                        <Select
                          value={formConfig.language}
                          onValueChange={(value) => onFormConfigChange({ language: value })}
                          open={isLanguageSelectOpen}
                          onOpenChange={setIsLanguageSelectOpen}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">🇺🇸 English</SelectItem>
                            <SelectItem value="es">🇪🇸 Español</SelectItem>
                            <SelectItem value="fr">🇫🇷 Français</SelectItem>
                            <SelectItem value="ar">🇸🇦 العربية</SelectItem>
                            <SelectItem value="he">🇮🇱 עברית</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Notifications */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-medium flex items-center">
                        <Bell className="w-5 h-5 text-green-600 mr-3" />
                        {getUITranslation("notifications", formConfig.language)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-gray-700">
                          {getUITranslation("enableEmailNotifications", formConfig.language)}
                        </Label>
                        <Switch
                          checked={formConfig.enableNotifications}
                          onCheckedChange={(checked) => onFormConfigChange({ enableNotifications: checked })}
                        />
                      </div>

                      {formConfig.enableNotifications && (
                        <>
                          <div>
                            <Label className="text-sm font-medium text-gray-700 mb-2 block">
                              {getUITranslation("notificationEmail", formConfig.language)}
                            </Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <Input
                                type="email"
                                value={formConfig.notificationEmail}
                                onChange={(e) => onFormConfigChange({ notificationEmail: e.target.value })}
                                placeholder={getUITranslation("notificationEmailPlaceholder", formConfig.language)}
                                className="pl-10"
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Label className="text-sm font-medium text-gray-700">
                                {getUITranslation("notificationMessage", formConfig.language)}
                              </Label>
                              <div className="group relative">
                                <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                  {getUITranslation("notificationMessageHelp", formConfig.language)}
                                </div>
                              </div>
                            </div>
                            <Textarea
                              value={formConfig.notificationMessage}
                              onChange={(e) => onFormConfigChange({ notificationMessage: e.target.value })}
                              placeholder={getUITranslation("notificationMessagePlaceholder", formConfig.language)}
                              className="text-left"
                              rows={4}
                            />
                            <p className="text-xs text-gray-500 mt-2">
                              {getUITranslation("notificationMessageHelp", formConfig.language)}
                            </p>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="languages" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Language Management */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-medium flex items-center">
                        <Globe className="w-5 h-5 text-indigo-600 mr-3" />
                        Supported Languages
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Current Languages */}
                      <div className="space-y-2">
                        {supportedLanguages.map((langCode) => {
                          const lang = AVAILABLE_LANGUAGES.find((l) => l.code === langCode)
                          if (!lang) return null

                          return (
                            <div key={langCode} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <span className="text-lg">{lang.flag}</span>
                                <div>
                                  <p className="font-medium text-sm">{lang.name}</p>
                                  <p className="text-xs text-gray-500">
                                    {langCode === formConfig.language ? "Main Language" : "Additional"}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setSelectedLanguageTab(langCode)}
                                  className="text-xs"
                                >
                                  Edit
                                </Button>
                                {langCode !== formConfig.language && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => removeLanguage(langCode)}
                                    className="text-xs text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {/* Add Language */}
                      {availableToAdd.length > 0 && (
                        <div className="pt-4 border-t border-gray-200">
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">Add Language</Label>
                          <div className="flex space-x-2">
                            <Select value={languageToAdd} onValueChange={setLanguageToAdd}>
                              <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Select language..." />
                              </SelectTrigger>
                              <SelectContent>
                                {availableToAdd.map((lang) => (
                                  <SelectItem key={lang.code} value={lang.code}>
                                    {lang.flag} {lang.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button onClick={addLanguage} disabled={!languageToAdd} size="sm">
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Language Content Editor */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-lg font-medium flex items-center">
                        <Languages className="w-5 h-5 text-purple-600 mr-3" />
                        Language Content
                        {selectedLanguageTab && (
                          <span className="ml-2 text-sm font-normal text-gray-500">
                            ({AVAILABLE_LANGUAGES.find((l) => l.code === selectedLanguageTab)?.flag}{" "}
                            {AVAILABLE_LANGUAGES.find((l) => l.code === selectedLanguageTab)?.name})
                          </span>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {selectedLanguageTab && (
                        <>
                          {/* Form Texts */}
                          <div className="space-y-4">
                            <h4 className="font-medium text-gray-900">Form Information</h4>
                            <div className="grid grid-cols-1 gap-4">
                              <div>
                                <Label className="text-sm font-medium text-gray-700 mb-2 block">Form Title</Label>
                                <Input
                                  value={
                                    getLanguageText(selectedLanguageTab, "formTitle", "title") ||
                                    (selectedLanguageTab === formConfig.language ? formConfig.title : "")
                                  }
                                  onChange={(e) =>
                                    updateLanguageText(selectedLanguageTab, "formTitle", "title", e.target.value)
                                  }
                                  placeholder="Enter form title..."
                                  dir={isRTL(selectedLanguageTab) ? "rtl" : "ltr"}
                                />
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-700 mb-2 block">Form Description</Label>
                                <Textarea
                                  value={
                                    getLanguageText(selectedLanguageTab, "formDescription", "description") ||
                                    (selectedLanguageTab === formConfig.language ? formConfig.description : "")
                                  }
                                  onChange={(e) =>
                                    updateLanguageText(
                                      selectedLanguageTab,
                                      "formDescription",
                                      "description",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Enter form description..."
                                  rows={3}
                                  dir={isRTL(selectedLanguageTab) ? "rtl" : "ltr"}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Field Labels */}
                          <div className="space-y-4">
                            <h4 className="font-medium text-gray-900">Field Labels</h4>
                            <div className="space-y-3">
                              {fields.map((field) => (
                                <div key={field.id} className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-xs text-gray-600">{field.type} - Label</Label>
                                    <Input
                                      value={
                                        getLanguageText(selectedLanguageTab, "fieldLabels", field.id) ||
                                        (selectedLanguageTab === formConfig.language ? field.label : "")
                                      }
                                      onChange={(e) =>
                                        updateLanguageText(selectedLanguageTab, "fieldLabels", field.id, e.target.value)
                                      }
                                      placeholder={field.label}
                                      className="text-sm"
                                      dir={isRTL(selectedLanguageTab) ? "rtl" : "ltr"}
                                    />
                                  </div>
                                  {field.placeholder && (
                                    <div>
                                      <Label className="text-xs text-gray-600">{field.type} - Placeholder</Label>
                                      <Input
                                        value={
                                          getLanguageText(selectedLanguageTab, "fieldPlaceholders", field.id) ||
                                          (selectedLanguageTab === formConfig.language ? field.placeholder : "")
                                        }
                                        onChange={(e) =>
                                          updateLanguageText(
                                            selectedLanguageTab,
                                            "fieldPlaceholders",
                                            field.id,
                                            e.target.value,
                                          )
                                        }
                                        placeholder={field.placeholder}
                                        className="text-sm"
                                        dir={isRTL(selectedLanguageTab) ? "rtl" : "ltr"}
                                      />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* QR Code for this language */}
                          <div className="pt-6 border-t border-gray-200">
                            <h4 className="font-medium text-gray-900 mb-4">QR Code for this Language</h4>
                            <div className="text-center">
                              <div className="inline-block p-3 bg-white border-2 border-gray-200 rounded-lg">
                                <img
                                  src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
                                    `${formUrl}?lang=${selectedLanguageTab}`,
                                  )}`}
                                  alt={`Form QR Code - ${AVAILABLE_LANGUAGES.find((l) => l.code === selectedLanguageTab)?.name}`}
                                  className="w-30 h-30"
                                />
                              </div>
                              <p className="text-xs text-gray-500 mt-2">
                                QR code for {AVAILABLE_LANGUAGES.find((l) => l.code === selectedLanguageTab)?.name}{" "}
                                version
                              </p>
                              <Button
                                size="sm"
                                variant="outline"
                                className="mt-2 text-xs bg-transparent"
                                onClick={() => {
                                  const canvas = document.createElement("canvas")
                                  const ctx = canvas.getContext("2d")
                                  const img = new Image()
                                  img.crossOrigin = "anonymous"
                                  img.onload = () => {
                                    canvas.width = img.width
                                    canvas.height = img.height
                                    ctx?.drawImage(img, 0, 0)
                                    const link = document.createElement("a")
                                    link.download = `${formConfig.title || "form"}-${selectedLanguageTab}-qr-code.png`
                                    link.href = canvas.toDataURL()
                                    link.click()
                                  }
                                  img.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
                                    `${formUrl}?lang=${selectedLanguageTab}`,
                                  )}`
                                }}
                              >
                                <QrCode className="w-3 h-3 mr-1" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="sharing" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Share & Access */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-medium flex items-center">
                        <Share2 className="w-5 h-5 text-purple-600 mr-3" />
                        Share & Access
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Post-Submission Section */}
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">Redirect URL (Optional)</Label>
                          <Input
                            value={formConfig.redirectUrl}
                            onChange={(e) => onFormConfigChange({ redirectUrl: e.target.value })}
                            placeholder="https://example.com/thank-you"
                          />
                          <p className="text-xs text-gray-500 mt-2">Leave empty to show a thank you message instead</p>
                        </div>
                        
                        {formConfig.redirectUrl && (
                          <div>
                            <Label className="text-sm font-medium text-gray-700 mb-2 block">Redirect Target</Label>
                            <select
                              value={formConfig.redirectTarget || "same"}
                              onChange={(e) => onFormConfigChange({ redirectTarget: e.target.value as "same" | "new" | "parent" })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="same">Same Window</option>
                              <option value="new">New Tab</option>
                              <option value="parent">Parent Window (for iframes)</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-2">
                              {formConfig.redirectTarget === "parent" 
                                ? "Useful when form is embedded in an iframe"
                                : formConfig.redirectTarget === "new"
                                ? "Opens redirect URL in a new browser tab"
                                : "Redirects in the same window"
                              }
                            </p>
                          </div>
                        )}
                        
                        {/* Post-Submit Message Settings */}
                        <div className="space-y-3">
                          <Label className="text-sm font-medium text-gray-700">Thank You Message</Label>
                          
                          <div>
                            <Label className="text-xs text-gray-600 mb-1 block">Title</Label>
                            <Input
                              value={formConfig.postSubmitSettings?.title || "Form Submitted!"}
                              onChange={(e) => onFormConfigChange({ 
                                postSubmitSettings: {
                                  ...formConfig.postSubmitSettings,
                                  title: e.target.value
                                }
                              })}
                              placeholder="Form Submitted!"
                            />
                          </div>
                          
                          <div>
                            <Label className="text-xs text-gray-600 mb-1 block">Message</Label>
                            <textarea
                              value={formConfig.postSubmitSettings?.message || "Thank you for your submission. We have received your response."}
                              onChange={(e) => onFormConfigChange({ 
                                postSubmitSettings: {
                                  ...formConfig.postSubmitSettings,
                                  message: e.target.value
                                }
                              })}
                              placeholder="Thank you for your submission. We have received your response."
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                              rows={3}
                            />
                          </div>
                          
                          <div>
                            <Label className="text-xs text-gray-600 mb-1 block">Button Action</Label>
                            <select
                              value={formConfig.postSubmitSettings?.buttonAction || "back"}
                              onChange={(e) => onFormConfigChange({ 
                                postSubmitSettings: {
                                  ...formConfig.postSubmitSettings,
                                  buttonAction: e.target.value as "back" | "close" | "hidden"
                                }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="back">Go Back</option>
                              <option value="close">Close Window</option>
                              <option value="hidden">No Button</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-1">
                              {formConfig.postSubmitSettings?.buttonAction === "close" 
                                ? "Attempts to close the browser window/tab"
                                : formConfig.postSubmitSettings?.buttonAction === "hidden"
                                ? "No button will be shown"
                                : "Goes back to the previous page"
                              }
                            </p>
                          </div>
                          
                          {formConfig.postSubmitSettings?.buttonAction !== "hidden" && (
                            <div>
                              <Label className="text-xs text-gray-600 mb-1 block">Button Text</Label>
                              <Input
                                value={formConfig.postSubmitSettings?.buttonText || "Go Back"}
                                onChange={(e) => onFormConfigChange({ 
                                  postSubmitSettings: {
                                    ...formConfig.postSubmitSettings,
                                    buttonText: e.target.value
                                  }
                                })}
                                placeholder="Go Back"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Language-Specific Links & QR Codes */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-medium flex items-center">
                        <QrCode className="w-5 h-5 text-indigo-600 mr-3" />
                        Language Links & QR Codes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {formConfig.supportedLanguages?.map((language: string) => {
                          const languageInfo = AVAILABLE_LANGUAGES.find(lang => lang.code === language)
                          const languageUrl = language === 'en' ? formUrl : `${formUrl}?lang=${language}`
                          
                          return (
                            <div key={language} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-2xl">{languageInfo?.flag}</span>
                                  <span className="font-medium">{languageInfo?.name || language}</span>
                                  {language === formConfig.language && (
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Main</span>
                                  )}
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => navigator.clipboard.writeText(languageUrl)}
                                >
                                  Copy Link
                                </Button>
                              </div>
                              
                              <div className="flex items-center gap-4">
                                <div className="flex-shrink-0">
                                  <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(languageUrl)}`}
                                    alt={`QR Code for ${languageInfo?.name}`}
                                    className="w-20 h-20 border rounded"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <Input
                                    value={languageUrl}
                                    readOnly
                                    className="bg-gray-50 text-xs"
                                  />
                                  <p className="text-xs text-gray-500 mt-1">
                                    Scan QR code to access form in {languageInfo?.name}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="styling" className="space-y-6">
                <ThemeEditor
                  formConfig={formConfig}
                  onFormConfigChange={onFormConfigChange}
                  onThemeApply={onThemeApply}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    )
  }

  // Regular field properties panel (right sidebar)
  return (
    <div className="w-80 bg-gray-50 flex flex-col h-full border-l border-gray-200" dir="ltr">
      <div className="p-6 border-b border-gray-200 bg-gray-50 text-left">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {getUITranslation("fieldProperties", formConfig.language)}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 pb-20 text-left">
          {panelMode === "field" && selectedField?.type === "text-block" ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Rich Text Properties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs font-medium text-gray-700 mb-2 block">Rich Text Content</Label>
                  <div className="space-y-2">
                    <RichTextEditor
                      content={selectedField.richTextContent || ""}
                      onChange={(content) => onUpdateField(selectedField.id, { richTextContent: content })}
                      placeholder="Enter your rich text content..."
                      className="min-h-[200px]"
                      isRTL={isRTLLanguage}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent"
                      onClick={() => setIsRichTextModalOpen(true)}
                    >
                      <Maximize2 className="w-4 h-4 mr-2" />
                      Edit in Full Screen
                    </Button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Label className="text-xs font-medium text-gray-700">
                      {getUITranslation("helpText", formConfig.language)}
                    </Label>
                    <div className="group relative">
                      <HelpCircle className="w-3 h-3 text-gray-400 cursor-help" />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        Help text appears below the field to provide additional guidance
                      </div>
                    </div>
                  </div>
                  <Textarea
                    value={selectedField.helpText || ""}
                    onChange={(e) => onUpdateField(selectedField.id, { helpText: e.target.value })}
                    placeholder={getUITranslation("helpTextPlaceholder", formConfig.language)}
                    className="mt-1 text-left"
                    dir={isRTLLanguage ? "rtl" : "ltr"}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          ) : panelMode === "field" && selectedField?.type === "submit" ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  {getUITranslation("fieldProperties", formConfig.language)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs font-medium text-gray-700">
                    {getUITranslation("buttonText", formConfig.language)}
                  </Label>
                  <Input
                    value={formConfig.submitButton.text || ""}
                    onChange={(e) => {
                      // Update formConfig.submitButton directly since submit is not in fields array
                      onFormConfigChange({
                        ...formConfig,
                        submitButton: {
                          ...formConfig.submitButton,
                          text: e.target.value
                        }
                      })
                    }}
                    placeholder={getFormTranslation("formElements", "submitForm", formConfig.language)}
                    className="mt-1 text-left"
                    dir={isRTLLanguage ? "rtl" : "ltr"}
                  />
                </div>

                <div>
                  <Label className="text-xs font-medium text-gray-700">
                    {getUITranslation("buttonIcon", formConfig.language)}
                  </Label>
                  <Select
                    value={formConfig.submitButton.icon || "send"}
                    onValueChange={(value) => {
                      // Update formConfig.submitButton directly since submit is not in fields array
                      onFormConfigChange({
                        ...formConfig,
                        submitButton: {
                          ...formConfig.submitButton,
                          icon: value
                        }
                      })
                    }}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="send">Send</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                      <SelectItem value="arrow">Arrow</SelectItem>
                    </SelectContent>
                  </Select>
        </div>

                <div>
                  <Label className="text-xs font-medium text-gray-700">
                    {getUITranslation("buttonStyle", formConfig.language)}
                  </Label>
                  <Select
                    value={formConfig.submitButton.style || "primary"}
                    onValueChange={(value) => {
                      // Update formConfig.submitButton directly since submit is not in fields array
                      onFormConfigChange({
                        ...formConfig,
                        submitButton: {
                          ...formConfig.submitButton,
                          style: value as "primary" | "secondary" | "success"
                        }
                      })
                    }}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primary">Primary (Blue)</SelectItem>
                      <SelectItem value="success">Success (Green)</SelectItem>
                      <SelectItem value="secondary">Secondary (Gray)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ) : panelMode === "field" && selectedField ? (
        <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  {getUITranslation("fieldProperties", formConfig.language)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedField.type !== "heading" &&
                  selectedField.type !== "text-block" &&
                  selectedField.type !== "submit" && (
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium text-gray-700">
                        {getUITranslation("showLabel", formConfig.language)}
                      </Label>
                      <Switch
                        checked={selectedField.showLabel !== false}
                        onCheckedChange={(checked) => onUpdateField(selectedField.id, { showLabel: checked })}
                      />
                    </div>
                  )}

                <div>
                  <Label className="text-xs font-medium text-gray-700">
                    {getUITranslation("fieldLabel", formConfig.language)}
                  </Label>
                  <Input
                    value={selectedField.label}
                    onChange={(e) => onUpdateField(selectedField.id, { label: e.target.value })}
                    className="mt-1 text-left"
                    dir={isRTLLanguage ? "rtl" : "ltr"}
                  />
                </div>

                {selectedField.type !== "heading" &&
                  selectedField.type !== "text-block" &&
                  selectedField.type !== "submit" &&
                  selectedField.type !== "multiple-choice" &&
                  selectedField.type !== "checkboxes" && (
                    <div>
                      <Label className="text-xs font-medium text-gray-700">
                        {getUITranslation("placeholderText", formConfig.language)}
                      </Label>
                      <Input
                        value={selectedField.placeholder || ""}
                        onChange={(e) => onUpdateField(selectedField.id, { placeholder: e.target.value })}
                        placeholder={getDefaultPlaceholder(selectedField.type, formConfig.language)}
                        className="mt-1 text-left"
                        dir={isRTLLanguage ? "rtl" : "ltr"}
                      />
                    </div>
                  )}

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Label className="text-xs font-medium text-gray-700">
                      {getUITranslation("helpText", formConfig.language)}
                    </Label>
                    <div className="group relative">
                      <HelpCircle className="w-3 h-3 text-gray-400 cursor-help" />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        Help text appears below the field to provide additional guidance
                      </div>
                    </div>
                  </div>
                  <Textarea
                    value={selectedField.helpText || ""}
                    onChange={(e) => onUpdateField(selectedField.id, { helpText: e.target.value })}
                    placeholder={getUITranslation("helpTextPlaceholder", formConfig.language)}
                    className="mt-1 text-left"
                    dir={isRTLLanguage ? "rtl" : "ltr"}
                    rows={2}
                  />
                </div>

                {selectedField.type !== "heading" &&
                  selectedField.type !== "text-block" &&
                  selectedField.type !== "submit" && (
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium text-gray-700">
                        {getUITranslation("requiredField", formConfig.language)}
                      </Label>
                      <Switch
                        checked={selectedField.required}
                        onCheckedChange={(checked) => onUpdateField(selectedField.id, { required: checked })}
                      />
                    </div>
                  )}

                {selectedField.type !== "heading" &&
                  selectedField.type !== "text-block" &&
                  selectedField.type !== "submit" && (
                    <div>
                      <Label className="text-xs font-medium text-gray-700">Required Error Message</Label>
                      <Input
                        value={selectedField.requiredErrorMessage || ""}
                        onChange={(e) => onUpdateField(selectedField.id, { requiredErrorMessage: e.target.value })}
                        placeholder={`Please fill your ${(selectedField.label || "field").toLowerCase()}`}
                        className="mt-1 text-left"
                        dir={isRTLLanguage ? "rtl" : "ltr"}
                      />
                    </div>
                  )}

                {selectedField.type === "phone" && (
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <div>
                      <Label className="text-xs font-medium text-gray-700 mb-2 block">Phone Format</Label>
                      <Select
                        value={selectedField.phoneSettings?.format || "international"}
                        onValueChange={(value) =>
                          onUpdateField(selectedField.id, {
                            phoneSettings: {
                              defaultCountryCode: "US",
                              showCountrySelector: value === "international",
                              enableValidation: true,
                              validationMessage: "Please enter a valid phone number",
                              ...selectedField.phoneSettings,
                              format: value as "national" | "international",
                            },
                          })
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="national">National (234 567 8900)</SelectItem>
                          <SelectItem value="international">International (+1 234 567 8900)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium text-gray-700">Show Country Selector</Label>
                      <Switch
                        checked={selectedField.phoneSettings?.showCountrySelector !== false}
                        disabled={selectedField.phoneSettings?.format === "national"}
                        onCheckedChange={(checked) =>
                          onUpdateField(selectedField.id, {
                            phoneSettings: {
                              format: selectedField.phoneSettings?.format || "international",
                              defaultCountryCode: "US",
                              enableValidation: true,
                              validationMessage: "Please enter a valid phone number",
                              ...selectedField.phoneSettings,
                              showCountrySelector: checked,
                            },
                          })
                        }
                      />
                    </div>

                    {selectedField.phoneSettings?.showCountrySelector !== false && selectedField.phoneSettings?.format !== "national" && (
                      <div>
                        <Label className="text-xs font-medium text-gray-700 mb-2 block">Default Country</Label>
                        <CountrySelector
                          selectedCountry={selectedField.phoneSettings?.defaultCountryCode || "US"}
                          onCountryChange={(country) =>
                            onUpdateField(selectedField.id, {
                              phoneSettings: {
                                format: selectedField.phoneSettings?.format || "international",
                                showCountrySelector: true,
                                enableValidation: true,
                                validationMessage: "Please enter a valid phone number",
                                ...selectedField.phoneSettings,
                                defaultCountryCode: country,
                              },
                            })
                          }
                          showLabel={false}
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium text-gray-700">Enable Phone Validation</Label>
                      <Switch
                        checked={selectedField.phoneSettings?.enableValidation !== false}
                        onCheckedChange={(checked) =>
                          onUpdateField(selectedField.id, {
                            phoneSettings: {
                              format: selectedField.phoneSettings?.format || "international",
                              defaultCountryCode: "US",
                              showCountrySelector: true,
                              validationMessage: "Please enter a valid phone number",
                              ...selectedField.phoneSettings,
                              enableValidation: checked,
                            },
                          })
                        }
                      />
                    </div>

                    {selectedField.phoneSettings?.enableValidation !== false && (
                      <div>
                        <Label className="text-xs font-medium text-gray-700">Validation Message</Label>
                        <Input
                          value={selectedField.phoneSettings?.validationMessage || "Please enter a valid phone number"}
                          onChange={(e) =>
                            onUpdateField(selectedField.id, {
                              phoneSettings: {
                                format: selectedField.phoneSettings?.format || "international",
                                defaultCountryCode: "US",
                                showCountrySelector: true,
                                enableValidation: true,
                                ...selectedField.phoneSettings,
                                validationMessage: e.target.value,
                              },
                            })
                          }
                          placeholder="Please enter a valid phone number"
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>
                )}

                {(selectedField.type === "multiple-choice" || selectedField.type === "checkboxes") && (
                  <div>
                    <Label className="text-xs font-medium text-gray-700 mb-2 block">
                      {getUITranslation("options", formConfig.language)}
                    </Label>
                    <DndProvider backend={HTML5Backend}>
                      <div className="space-y-2">
                        {selectedField.options?.map((option, index) => (
                          <DraggableOption
                            key={index}
                            option={option}
                            index={index}
                            moveOption={moveFieldOption}
                            updateOption={updateFieldOption}
                            removeOption={removeFieldOption}
                            isRTL={isRTLLanguage}
                          />
                        ))}
                        <Button size="sm" variant="outline" onClick={addFieldOption} className="w-full bg-transparent">
                          <Plus className="w-3 h-3 mr-1" />
                          {getUITranslation("addOption", formConfig.language)}
              </Button>
                      </div>
                    </DndProvider>
                  </div>
                )}

                {selectedField.type === "signature" && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs font-medium text-gray-700 mb-2 block">Signature Methods</Label>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs">Allow Drawing</span>
                          <Switch
                            checked={selectedField.signatureMethods?.draw !== false}
                            onCheckedChange={(checked) =>
                              onUpdateField(selectedField.id, {
                                signatureMethods: {
                                  upload: true,
                                  ...selectedField.signatureMethods,
                                  draw: checked,
                                },
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs">Allow Upload</span>
                          <Switch
                            checked={selectedField.signatureMethods?.upload !== false}
                            onCheckedChange={(checked) =>
                              onUpdateField(selectedField.id, {
                                signatureMethods: {
                                  draw: true,
                                  ...selectedField.signatureMethods,
                                  upload: checked,
                                },
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs font-medium text-gray-700 mb-2 block">Color Settings</Label>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs">Show Color Picker</span>
                          <Switch
                            checked={selectedField.signatureSettings?.showColorPicker !== false}
                            onCheckedChange={(checked) =>
                              onUpdateField(selectedField.id, {
                                signatureSettings: {
                                  defaultColor: "black",
                                  ...selectedField.signatureSettings,
                                  showColorPicker: checked,
                                },
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-gray-700">Default Color</Label>
                          <Select
                            value={selectedField.signatureSettings?.defaultColor || "black"}
                            onValueChange={(value) =>
                              onUpdateField(selectedField.id, {
                                signatureSettings: {
                                  showColorPicker: true,
                                  ...selectedField.signatureSettings,
                                  defaultColor: value as "black" | "blue" | "red",
                                },
                              })
                            }
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="black">Black</SelectItem>
                              <SelectItem value="blue">Blue</SelectItem>
                              <SelectItem value="red">Red</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
            )}
          </CardContent>
        </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-gray-400 mb-2">
                  <Settings className="w-8 h-8 mx-auto" />
                </div>
                <p className="text-sm text-gray-600">{getUITranslation("selectFieldToEdit", formConfig.language)}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Rich Text Modal */}
      <RichTextModal
        isOpen={isRichTextModalOpen}
        onClose={() => setIsRichTextModalOpen(false)}
        content={selectedField?.richTextContent || ""}
        onChange={(content) => {
          if (selectedField) {
            onUpdateField(selectedField.id, { richTextContent: content })
          }
        }}
        isRTL={isRTLLanguage}
      />
    </div>
  )
}
