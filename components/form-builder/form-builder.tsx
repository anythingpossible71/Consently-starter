"use client"

import { useState, useEffect } from "react"
import { FormEditorHeader } from "@/components/form-builder/form-editor-header"
import { ToolLibrary } from "@/components/form-builder/tool-library"
import { FormCanvas } from "@/components/form-builder/form-canvas"
import { PropertiesPanel } from "@/components/form-builder/properties-panel"
import { FormPreview } from "@/components/form-builder/form-preview"
import type { FormField, FieldType } from "@/types/form-builder/form-builder"
import type { FormConfig } from "@/types/form-builder/form-config"
import { DEFAULT_FORM_CONFIG } from "@/types/form-builder/form-config"
import { THEME_PRESETS, generateThemeCSS } from "@/types/form-builder/theme-config"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { getFormTranslation } from "@/utils/form-builder/translations"
import { LanguageChangeDialog } from "@/components/form-builder/language-change-dialog"
import { saveForm, getForm } from "@/app/actions/forms"
import { Button } from "@/components/ui/button"
import { Save, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface FormBuilderProps {
  onNavigateHome?: () => void
  formId?: string // Optional form ID for editing existing forms
}

export function FormBuilder({ onNavigateHome, formId }: FormBuilderProps) {
  const [fields, setFields] = useState<FormField[]>([])
  const [selectedField, setSelectedField] = useState<FormField | null>(null)
  const [formConfig, setFormConfig] = useState<FormConfig>(DEFAULT_FORM_CONFIG)
  const [isSettingsActive, setIsSettingsActive] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [showLanguageDialog, setShowLanguageDialog] = useState(false)
  const [pendingLanguage, setPendingLanguage] = useState("")
  const [appliedCSS, setAppliedCSS] = useState("")
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isPublishing, setIsPublishing] = useState(false)

  // Load existing form data if formId is provided, otherwise use sample data
  useEffect(() => {
    const loadFormData = async () => {
      if (formId) {
        // Load existing form
        try {
          const result = await getForm(formId)
          if (result.success && result.form) {
            setFormConfig(result.form.config)
            setFields(result.form.fields)
          } else {
            toast({
              title: "Error",
              description: result.error || "Failed to load form",
              variant: "destructive"
            })
          }
        } catch (error) {
          console.error('Error loading form:', error)
          toast({
            title: "Error",
            description: "Failed to load form data",
            variant: "destructive"
          })
        }
      } else {
        // Initialize with sample data for new forms
        const sampleFields: FormField[] = [
          {
            id: "field_1",
            type: "text",
            label: "First Name",
            placeholder: "Enter your first name",
            required: true,
            showLabel: true,
            requiredErrorMessage: "Please fill your first name",
          },
          {
            id: "field_2",
            type: "email",
            label: "Email Address",
            placeholder: "Enter your email",
            required: true,
            showLabel: true,
            requiredErrorMessage: "Please fill your email",
          },
          {
            id: "field_3",
            type: "phone",
            label: "Phone Number",
            placeholder: "Enter your phone number",
            required: false,
            showLabel: true,
            phoneSettings: {
              format: "international",
              defaultCountryCode: "US",
              showCountrySelector: true,
              enableValidation: true,
              validationMessage: "Please enter a valid phone number",
            },
            requiredErrorMessage: "Please fill your phone number",
          },
          {
            id: "field_4",
            type: "textarea",
            label: "Message",
            placeholder: "Enter your message",
            required: false,
            showLabel: true,
            requiredErrorMessage: "Please fill your message",
          },
          {
            id: "field_5",
            type: "multiple-choice",
            label: "Choose your preference",
            placeholder: "Select an option",
            required: true,
            showLabel: true,
            options: ["Option 1", "Option 2", "Option 3"],
            requiredErrorMessage: "Please select an option",
          },
          {
            id: "field_6",
            type: "file-upload",
            label: "Upload Documents",
            placeholder: "Choose files to upload",
            required: true,
            showLabel: true,
            acceptedFileTypes: ".pdf,.doc,.docx,.jpg,.png",
            maxFileSize: 10,
            maxFiles: 3,
            allowMultipleFiles: true,
            requiredErrorMessage: "Please upload the required documents",
          },
          {
            id: "field_7",
            type: "signature",
            label: "Digital Signature",
            required: true,
            showLabel: true,
            signatureMethods: {
              draw: true,
              upload: true,
            },
            signatureSettings: {
              showColorPicker: true,
              defaultColor: "black",
            },
            requiredErrorMessage: "Please provide your signature",
          },
        ]
        setFields(sampleFields)
      }
    }

    loadFormData()
  }, [formId])

  // Initialize theme CSS on mount
  useEffect(() => {
    const theme = THEME_PRESETS[formConfig.selectedTheme] || THEME_PRESETS.default
    const css = generateThemeCSS(theme, formConfig.applyCustomCSS ? formConfig.customCSS : "")
    setAppliedCSS(css)
    applyThemeToDOM(css)
  }, [])

  const applyThemeToDOM = (css: string) => {
    // Remove existing theme styles
    const existingStyle = document.getElementById("form-theme-styles")
    if (existingStyle) {
      existingStyle.remove()
    }

    // Add new theme styles
    const styleElement = document.createElement("style")
    styleElement.id = "form-theme-styles"
    styleElement.textContent = css
    document.head.appendChild(styleElement)
  }

  const handleThemeApply = (css: string) => {
    setAppliedCSS(css)
    applyThemeToDOM(css)
  }

  const getDefaultRequiredMessage = (fieldType: FieldType, label: string): string => {
    const fieldName = label.toLowerCase()
    return `Please fill your ${fieldName}`
  }

  const addField = (fieldType: FieldType) => {
    const label = getFormTranslation("fieldTypes", getFieldTranslationKey(fieldType), formConfig.language)
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type: fieldType,
      label,
      placeholder: "",
      required: false,
      showLabel: fieldType !== "heading" && fieldType !== "text-block" && fieldType !== "submit",
      options:
        fieldType === "multiple-choice" || fieldType === "checkboxes"
          ? [
              `${getFormTranslation("formElements", "option", formConfig.language)} 1`,
              `${getFormTranslation("formElements", "option", formConfig.language)} 2`,
            ]
          : undefined,
      buttonText:
        fieldType === "submit" ? getFormTranslation("formElements", "submitForm", formConfig.language) : undefined,
      buttonIcon: fieldType === "submit" ? "send" : undefined,
      buttonStyle: fieldType === "submit" ? "primary" : undefined,
      // Add signature-specific defaults
      signatureMethods: fieldType === "signature" ? { draw: true, upload: true } : undefined,
      signatureSettings: fieldType === "signature" ? { showColorPicker: true, defaultColor: "black" } : undefined,
      // Add phone-specific defaults
      phoneSettings:
        fieldType === "phone"
          ? {
              format: "international",
              defaultCountryCode: "US",
              showCountrySelector: true,
              enableValidation: true,
              validationMessage: "Please enter a valid phone number",
            }
          : undefined,
      // Add default required error message
      requiredErrorMessage: getDefaultRequiredMessage(fieldType, label),
    }

    // Insert field after selected field if one is selected, otherwise add at end
    if (selectedField) {
      const selectedIndex = fields.findIndex((f) => f.id === selectedField.id)
      if (selectedIndex !== -1) {
        const newFields = [...fields]
        newFields.splice(selectedIndex + 1, 0, newField)
        setFields(newFields)
      } else {
        setFields([...fields, newField])
      }
    } else {
      setFields([...fields, newField])
    }

    setSelectedField(newField)
    setIsSettingsActive(true)
  }

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setFields(fields.map((field) => (field.id === fieldId ? { ...field, ...updates } : field)))
    if (selectedField?.id === fieldId) {
      setSelectedField({ ...selectedField, ...updates })
    }
  }

  const removeField = (fieldId: string) => {
    setFields(fields.filter((field) => field.id !== fieldId))
    if (selectedField?.id === fieldId) {
      setSelectedField(null)
    }
  }

  const moveField = (dragIndex: number, hoverIndex: number) => {
    const newFields = [...fields]
    const draggedField = newFields[dragIndex]
    newFields.splice(dragIndex, 1)
    newFields.splice(hoverIndex, 0, draggedField)
    setFields(newFields)
  }

  const moveFieldUp = (index: number) => {
    if (index > 0) {
      const newFields = [...fields]
      const field = newFields[index]
      newFields.splice(index, 1)
      newFields.splice(index - 1, 0, field)
      setFields(newFields)
    }
  }

  const moveFieldDown = (index: number) => {
    if (index < fields.length - 1) {
      const newFields = [...fields]
      const field = newFields[index]
      newFields.splice(index, 1)
      newFields.splice(index + 1, 0, field)
      setFields(newFields)
    }
  }

  const handleSettingsToggle = () => {
    if (selectedField && !isSettingsActive) {
      // If a field is selected and panel is closed, open with field properties
      setIsSettingsActive(true)
    } else if (selectedField && isSettingsActive) {
      // If a field is selected and panel is open, switch to form settings
      setSelectedField(null)
      setIsSettingsActive(true)
    } else {
      // Toggle panel open/closed
      setIsSettingsActive(!isSettingsActive)
    }
  }

  const handleFieldSelect = (field: FormField | null) => {
    setSelectedField(field)
    if (field) {
      setIsSettingsActive(true)
    }
  }

  const handlePreviewToggle = () => {
    setIsPreviewMode(!isPreviewMode)
    if (!isPreviewMode) {
      // Entering preview mode - close settings panel
      setIsSettingsActive(false)
      // Don't clear selected field - we'll restore it when coming back
    }
  }

  const handleLanguageChange = (language: string) => {
    if (language !== formConfig.language && fields.length > 0) {
      setPendingLanguage(language)
      setShowLanguageDialog(true)
    } else {
      setFormConfig((prev) => ({ ...prev, language }))
      updateFormTitle(language)
    }
  }

  const resetFieldsToLanguage = (language: string) => {
    const resetFields = fields.map((field) => ({
      ...field,
      label: getFormTranslation("fieldTypes", getFieldTranslationKey(field.type), language),
      placeholder: "",
      options: field.options
        ? field.options.map((_, index) => `${getFormTranslation("formElements", "option", language)} ${index + 1}`)
        : undefined,
      buttonText:
        field.type === "submit" ? getFormTranslation("formElements", "submitForm", language) : field.buttonText,
    }))
    setFields(resetFields)
  }

  const confirmLanguageChange = () => {
    setFormConfig((prev) => ({ ...prev, language: pendingLanguage }))
    resetFieldsToLanguage(pendingLanguage)
    updateFormTitle(pendingLanguage)
    setShowLanguageDialog(false)
    setPendingLanguage("")
  }

  const updateFormTitle = (language: string) => {
    if (
      !formConfig.title ||
      formConfig.title === getFormTranslation("formElements", "untitledForm", formConfig.language)
    ) {
      setFormConfig((prev) => ({ ...prev, title: getFormTranslation("formElements", "untitledForm", language) }))
    }
  }

  const handleFormConfigChange = (updates: Partial<FormConfig>) => {
    setFormConfig((prev) => ({ ...prev, ...updates }))

    // Auto-apply theme changes
    if (updates.selectedTheme || updates.customTheme || updates.customCSS || updates.applyCustomCSS !== undefined) {
      const newConfig = { ...formConfig, ...updates }
      const theme = newConfig.customTheme || THEME_PRESETS[newConfig.selectedTheme] || THEME_PRESETS.default
      const css = generateThemeCSS(theme, newConfig.applyCustomCSS ? newConfig.customCSS : "")
      handleThemeApply(css)
    }
  }

  const handleBackToHome = () => {
    // Call the parent navigation function if provided
    if (onNavigateHome) {
      onNavigateHome()
    }
  }

  const handleSaveChanges = () => {
    // Here you would typically save to a backend
    console.log("Saving form configuration:", formConfig)
    console.log("Saving form fields:", fields)

    // Show a success message or toast
    alert("Form settings saved successfully!")
  }

  const handlePublish = async () => {
    if (!formConfig.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a form title before publishing",
        variant: "destructive"
      })
      return
    }

    setIsPublishing(true)
    try {
      const result = await saveForm({
        id: formId,
        title: formConfig.title,
        description: formConfig.description,
        config: formConfig,
        fields: fields.map(field => ({
          ...field,
          // Ensure translations are properly structured
          translations: field.translations || {}
        }))
      })

      if (result.success) {
        toast({
          title: "Success",
          description: result.message
        })
        // Navigate back to forms list
        if (onNavigateHome) {
          onNavigateHome()
        }
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish form",
        variant: "destructive"
      })
    } finally {
      setIsPublishing(false)
    }
  }

  // Preview Mode - Full Screen
  if (isPreviewMode) {
    return (
      <div className="form-container">
        <FormPreview
          fields={fields}
          formTitle={formConfig.title || getFormTranslation("formElements", "untitledForm", formConfig.language)}
          formDescription={formConfig.description}
          formConfig={formConfig}
          onExitPreview={() => {
            setIsPreviewMode(false)
            // Restore selected field and settings panel state when returning from preview
            if (selectedField) {
              setIsSettingsActive(true)
            }
          }}
        />
      </div>
    )
  }

  // Builder Mode - UI always stays LTR, only form content is RTL
  return (
    <DndProvider backend={HTML5Backend}>
      {/* UI Container - Always LTR */}
      <div className="flex flex-col h-screen">
        <FormEditorHeader
          formTitle={formConfig.title}
          onTitleChange={(title) => setFormConfig((prev) => ({ ...prev, title }))}
          onSettingsToggle={handleSettingsToggle}
          isSettingsActive={isSettingsActive && !selectedField}
          onPreviewToggle={handlePreviewToggle}
          onBackToHome={handleBackToHome}
          currentLanguage={formConfig.language}
          onPublish={handlePublish}
          isPublishing={isPublishing}
        />

        <div className="flex flex-1 overflow-hidden h-full">
          <ToolLibrary onAddField={addField} currentLanguage={formConfig.language} />
          <div className="form-container flex-1 flex flex-col overflow-hidden">
            <FormCanvas
              fields={fields}
              selectedField={selectedField}
              onSelectField={handleFieldSelect}
              onUpdateField={updateField}
              onRemoveField={removeField}
              onMoveField={moveField}
              onMoveFieldUp={moveFieldUp}
              onMoveFieldDown={moveFieldDown}
              formTitle={formConfig.title}
              formDescription={formConfig.description}
              onTitleChange={(title) => setFormConfig((prev) => ({ ...prev, title }))}
              onDescriptionChange={(description) => setFormConfig((prev) => ({ ...prev, description }))}
              currentLanguage={formConfig.language}
              formConfig={formConfig}
              scrollPosition={scrollPosition}
              onScrollPositionChange={setScrollPosition}
            />
          </div>
          {isSettingsActive && (
            <PropertiesPanel
              selectedField={selectedField}
              onUpdateField={updateField}
              formConfig={formConfig}
              onFormConfigChange={handleFormConfigChange}
              panelMode={selectedField ? "field" : "form"}
              onClose={() => {
                setIsSettingsActive(false)
                setSelectedField(null)
              }}
              fields={fields}
              onThemeApply={handleThemeApply}
              onSaveChanges={handleSaveChanges}
            />
          )}
        </div>
        <LanguageChangeDialog
          isOpen={showLanguageDialog}
          onClose={() => {
            setShowLanguageDialog(false)
            setPendingLanguage("")
          }}
          onConfirm={confirmLanguageChange}
          currentLanguage={formConfig.language}
          newLanguage={pendingLanguage}
        />
      </div>
    </DndProvider>
  )
}

function getFieldTranslationKey(fieldType: FieldType): string {
  const keys = {
    text: "textInput",
    email: "email",
    phone: "phone",
    textarea: "longText",
    "multiple-choice": "multipleChoice",
    checkboxes: "checkboxes",
    agreement: "agreement",
    date: "dateTime",
    "file-upload": "fileUpload",
    signature: "signature",
    heading: "heading",
    "text-block": "textBlock",
    submit: "submitButton",
  }
  return keys[fieldType] || "field"
}
