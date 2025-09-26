"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
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
  Save,
  Maximize2,
} from "lucide-react"
import { getUITranslation, getFormTranslation, isRTL, getDefaultPlaceholder } from "@/utils/form-builder/translations"
import { useState, useRef } from "react"
import { Check, ChevronsUpDown } from "lucide-react"

// Available languages with flags and native names
const AVAILABLE_LANGUAGES = [
  { code: "en", name: "English", native: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", native: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", native: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", native: "Deutsch", flag: "🇩🇪" },
  { code: "pt", name: "Portuguese", native: "Português", flag: "🇵🇹" },
  { code: "it", name: "Italian", native: "Italiano", flag: "🇮🇹" },
  { code: "nl", name: "Dutch", native: "Nederlands", flag: "🇳🇱" },
  { code: "ru", name: "Russian", native: "Русский", flag: "🇷🇺" },
  { code: "zh-CN", name: "Chinese (Simplified)", native: "简体中文", flag: "🇨🇳" },
  { code: "zh-TW", name: "Chinese (Traditional)", native: "繁體中文", flag: "🇹🇼" },
  { code: "ja", name: "Japanese", native: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "Korean", native: "한국어", flag: "🇰🇷" },
  { code: "ar", name: "Arabic", native: "العربية", flag: "🇸🇦" },
  { code: "hi", name: "Hindi", native: "हिन्दी", flag: "🇮🇳" },
  { code: "tr", name: "Turkish", native: "Türkçe", flag: "🇹🇷" },
  { code: "pl", name: "Polish", native: "Polski", flag: "🇵🇱" },
  { code: "cs", name: "Czech", native: "Čeština", flag: "🇨🇿" },
  { code: "el", name: "Greek", native: "Ελληνικά", flag: "🇬🇷" },
  { code: "he", name: "Hebrew", native: "עברית", flag: "🇮🇱" },
  { code: "th", name: "Thai", native: "ไทย", flag: "🇹🇭" },
  { code: "vi", name: "Vietnamese", native: "Tiếng Việt", flag: "🇻🇳" },
  { code: "id", name: "Indonesian", native: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "ms", name: "Malay", native: "Bahasa Melayu", flag: "🇲🇾" },
  { code: "bn", name: "Bengali", native: "বাংলা", flag: "🇧🇩" },
  { code: "ur", name: "Urdu", native: "اردو", flag: "🇵🇰" },
  { code: "sv", name: "Swedish", native: "Svenska", flag: "🇸🇪" },
  { code: "da", name: "Danish", native: "Dansk", flag: "🇩🇰" },
  { code: "no", name: "Norwegian", native: "Norsk", flag: "🇳🇴" },
  { code: "fi", name: "Finnish", native: "Suomi", flag: "🇫🇮" },
  { code: "ro", name: "Romanian", native: "Română", flag: "🇷🇴" },
  { code: "hu", name: "Hungarian", native: "Magyar", flag: "🇭🇺" },
  { code: "sk", name: "Slovak", native: "Slovenčina", flag: "🇸🇰" },
  { code: "bg", name: "Bulgarian", native: "Български", flag: "🇧🇬" },
  { code: "uk", name: "Ukrainian", native: "Українська", flag: "🇺🇦" },
  { code: "tl", name: "Filipino / Tagalog", native: "Filipino", flag: "🇵🇭" },
  { code: "fa", name: "Persian (Farsi)", native: "فارسی", flag: "🇮🇷" },
  { code: "ta", name: "Tamil", native: "தமிழ்", flag: "🇮🇳" },
  { code: "te", name: "Telugu", native: "తెలుగు", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", native: "मराठी", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી", flag: "🇮🇳" },
  { code: "af", name: "Afrikaans", native: "Afrikaans", flag: "🇿🇦" },
  { code: "sw", name: "Swahili", native: "Kiswahili", flag: "🇰🇪" }
]
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
  const [isRichTextModalOpen, setIsRichTextModalOpen] = useState(false)
  const [isLanguagePopoverOpen, setIsLanguagePopoverOpen] = useState(false)

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


  // Side panel form settings
  if (panelMode === "form") {
    return (
      <div className="w-96 bg-gray-50 flex flex-col h-full border-l border-gray-200" dir="ltr">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gray-50 text-left">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {getUITranslation("formSettings", formConfig.language)}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 pb-20 text-left">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="general" className="text-xs">
                  <Settings className="w-3 h-3 mr-1" />
                  General
                </TabsTrigger>
                <TabsTrigger value="sharing" className="text-xs">
                  <Share2 className="w-3 h-3 mr-1" />
                  Sharing
                </TabsTrigger>
                <TabsTrigger value="styling" className="text-xs">
                  <Palette className="w-3 h-3 mr-1" />
                  Style
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4">
                <div className="space-y-4">
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
                        <Popover open={isLanguagePopoverOpen} onOpenChange={setIsLanguagePopoverOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={isLanguagePopoverOpen}
                              className="w-full justify-between"
                            >
                              {formConfig.language ? (
                                (() => {
                                  const selectedLang = AVAILABLE_LANGUAGES.find(lang => lang.code === formConfig.language)
                                  return selectedLang ? (
                                    <span className="flex items-center gap-2">
                                      <span>{selectedLang.flag}</span>
                                      <span>{selectedLang.native}</span>
                                    </span>
                                  ) : "Select language..."
                                })()
                              ) : (
                                "Select language..."
                              )}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Search languages..." />
                              <CommandList>
                                <CommandEmpty>No language found.</CommandEmpty>
                                <CommandGroup>
                                  {AVAILABLE_LANGUAGES.map((language) => (
                                    <CommandItem
                                      key={language.code}
                                      value={`${language.name} ${language.native} ${language.code}`}
                                      onSelect={() => {
                                        onFormConfigChange({ language: language.code })
                                        setIsLanguagePopoverOpen(false)
                                      }}
                                    >
                                      <Check
                                        className={`mr-2 h-4 w-4 ${
                                          formConfig.language === language.code ? "opacity-100" : "opacity-0"
                                        }`}
                                      />
                                      <span className="flex items-center gap-2">
                                        <span>{language.flag}</span>
                                        <span>{language.native}</span>
                                        <span className="text-sm text-gray-500">({language.name})</span>
                                      </span>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
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


              <TabsContent value="sharing" className="space-y-4">
                <div className="space-y-4">
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

                </div>
              </TabsContent>

              <TabsContent value="styling" className="space-y-4">
                <ThemeEditor
                  formConfig={formConfig}
                  onFormConfigChange={onFormConfigChange}
                  onThemeApply={onThemeApply}
                  formId={formId}
                />
              </TabsContent>
            </Tabs>

            {/* Save Button */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <Button onClick={onSaveChanges} className="w-full bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Regular field properties panel (right sidebar)
  return (
    <div className="w-96 bg-gray-50 flex flex-col h-full border-l border-gray-200" dir="ltr">
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
                <CardTitle className="text-sm font-medium">
                  {getUITranslation("richTextProperties", formConfig.language)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs font-medium text-gray-700 mb-2 block">
                    {getUITranslation("richTextContent", formConfig.language)}
                  </Label>
                  <div className="space-y-2">
                    <RichTextEditor
                      content={selectedField.richTextContent || ""}
                      onChange={(content) => onUpdateField(selectedField.id, { richTextContent: content })}
                      placeholder={getUITranslation("enterRichTextContent", formConfig.language)}
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
                      {getUITranslation("editInFullScreen", formConfig.language)}
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
                        {getUITranslation("helpTextTooltip", formConfig.language)}
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
                    value={formConfig.submitButton.text || getFormTranslation("formElements", "submitForm", formConfig.language)}
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
                      <SelectItem value="send">{getUITranslation("send", formConfig.language)}</SelectItem>
                      <SelectItem value="check">{getUITranslation("check", formConfig.language)}</SelectItem>
                      <SelectItem value="arrow">{getUITranslation("arrow", formConfig.language)}</SelectItem>
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
                      <SelectItem value="primary">{getUITranslation("primary", formConfig.language)}</SelectItem>
                      <SelectItem value="success">{getUITranslation("success", formConfig.language)}</SelectItem>
                      <SelectItem value="secondary">{getUITranslation("secondary", formConfig.language)}</SelectItem>
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
                        {getUITranslation("helpTextTooltip", formConfig.language)}
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
                      <Label className="text-xs font-medium text-gray-700">
                        {getUITranslation("requiredErrorMessage", formConfig.language)}
                      </Label>
                      <Input
                        value={selectedField.requiredErrorMessage || ""}
                        onChange={(e) => onUpdateField(selectedField.id, { requiredErrorMessage: e.target.value })}
                        placeholder={getFormTranslation("validation", "pleaseFillRequiredField", formConfig.language)}
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
