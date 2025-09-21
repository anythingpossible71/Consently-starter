"use client"

import { useState, useEffect, useImperativeHandle, forwardRef } from "react"
import { FormEditorHeader } from "@/components/form-builder/form-editor-header"
import { ToolLibrary } from "@/components/form-builder/tool-library"
import { FormCanvas } from "@/components/form-builder/form-canvas"
import { PropertiesPanel } from "@/components/form-builder/properties-panel"
import { FormPreview } from "@/components/form-builder/form-preview"
import { FormResponses } from "@/components/form-builder/form-responses"
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

interface FormBuilderProps {
  onNavigateHome?: (bypassUnsavedCheck?: boolean) => void
  formId?: string // Optional form ID for editing existing forms
  isPreview?: boolean // Preview state from URL
  onPreviewToggle?: (preview: boolean) => void // Callback to update URL
  isResponses?: boolean // Responses view state from URL
  onResponsesToggle?: (responses: boolean) => void // Callback to update URL
}

export interface FormBuilderRef {
  hasUnsavedChanges: boolean
  showExitConfirmation: (onConfirm: () => void) => void
}

export const FormBuilder = forwardRef<FormBuilderRef, FormBuilderProps>(({ onNavigateHome, formId, isPreview = false, onPreviewToggle, isResponses = false, onResponsesToggle }, ref) => {
  const [fields, setFields] = useState<FormField[]>([])
  const [selectedField, setSelectedField] = useState<FormField | null>(null)
  const [formConfig, setFormConfig] = useState<FormConfig>(DEFAULT_FORM_CONFIG)
  const [isSettingsActive, setIsSettingsActive] = useState(false)
  const [showLanguageDialog, setShowLanguageDialog] = useState(false)
  const [pendingLanguage, setPendingLanguage] = useState("")
  const [appliedCSS, setAppliedCSS] = useState("")
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isPublishing, setIsPublishing] = useState(false)
  const [allFields, setAllFields] = useState<FormField[]>([]) // All fields including submit
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showExitDialog, setShowExitDialog] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null)

  // Expose unsaved changes state to parent component
  useImperativeHandle(ref, () => ({
    hasUnsavedChanges,
    showExitConfirmation: (onConfirm: () => void) => {
      if (hasUnsavedChanges) {
        setPendingNavigation(() => onConfirm)
        setShowExitDialog(true)
      } else {
        onConfirm()
      }
    }
  }), [hasUnsavedChanges])

  // Mark form as having unsaved changes
  const markAsChanged = () => {
    setHasUnsavedChanges(true)
  }

  // Handle navigation with unsaved changes check
  const handleNavigation = (navigationFn: () => void) => {
    if (hasUnsavedChanges) {
      setPendingNavigation(() => navigationFn)
      setShowExitDialog(true)
    } else {
      navigationFn()
    }
  }

  // Confirm exit and discard changes
  const confirmExit = () => {
    setHasUnsavedChanges(false)
    setShowExitDialog(false)
    if (pendingNavigation) {
      pendingNavigation()
      setPendingNavigation(null)
    }
  }

  // Cancel exit and stay on page
  const cancelExit = () => {
    setShowExitDialog(false)
    setPendingNavigation(null)
  }

  // Handle browser navigation (back button, refresh, etc.)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?'
        return e.returnValue
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  // Load existing form data if formId is provided, otherwise use sample data
  useEffect(() => {
    const loadFormData = async () => {
      if (formId) {
        // Load existing form
        try {
          const result = await getForm(formId)
          if (result.success && result.form) {
            setFormConfig(result.form.config)
            // Store all fields including submit
            setAllFields(result.form.fields)
            // Filter out submit fields when loading for editing (they're handled separately)
            const editableFields = result.form.fields.filter(field => field.type !== 'submit')
            setFields(editableFields)
            // Clear unsaved changes flag when loading existing form
            setHasUnsavedChanges(false)
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
        // Initialize with empty form for new forms
        setFields([])
        setAllFields([]) // For new forms, allFields = fields (no submit field yet)
      }
    }

    loadFormData()
  }, [formId])

  // Sync allFields with fields (for preview) - add submit field when needed
  useEffect(() => {
    // For existing forms, allFields should include the submit field from database
    // For new forms, we'll add submit field when saving
    if (formId && allFields.length > 0) {
      // Don't modify allFields for existing forms - it already has the submit field
      return
    }
    
    // For new forms, allFields should match fields (no submit field yet)
    setAllFields(fields)
  }, [fields, formId, allFields.length])

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
    const fieldName = (label || "field").toLowerCase()
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
    markAsChanged()
  }

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setFields(fields.map((field) => (field.id === fieldId ? { ...field, ...updates } : field)))
    if (selectedField?.id === fieldId) {
      setSelectedField({ ...selectedField, ...updates })
    }
    markAsChanged()
  }

  const removeField = (fieldId: string) => {
    // Prevent deletion of submit fields
    const fieldToRemove = fields.find(field => field.id === fieldId)
    if (fieldToRemove?.type === 'submit') {
      return // Don't allow deletion of submit fields
    }
    
    setFields(fields.filter((field) => field.id !== fieldId))
    if (selectedField?.id === fieldId) {
      setSelectedField(null)
    }
    markAsChanged()
  }

  const moveField = (dragIndex: number, hoverIndex: number) => {
    const newFields = [...fields]
    const draggedField = newFields[dragIndex]
    
    // Prevent moving submit fields
    if (draggedField?.type === 'submit') {
      return
    }
    
    // Prevent moving fields to the last position if it's occupied by a submit field
    const lastField = newFields[newFields.length - 1]
    if (lastField?.type === 'submit' && hoverIndex >= newFields.length - 1) {
      return
    }
    
    newFields.splice(dragIndex, 1)
    newFields.splice(hoverIndex, 0, draggedField)
    setFields(newFields)
    markAsChanged()
  }

  const moveFieldUp = (index: number) => {
    if (index > 0) {
      const newFields = [...fields]
      const field = newFields[index]
      
      // Prevent moving submit fields
      if (field?.type === 'submit') {
        return
      }
      
      newFields.splice(index, 1)
      newFields.splice(index - 1, 0, field)
      setFields(newFields)
      markAsChanged()
    }
  }

  const moveFieldDown = (index: number) => {
    if (index < fields.length - 1) {
      const newFields = [...fields]
      const field = newFields[index]
      
      // Prevent moving submit fields
      if (field?.type === 'submit') {
        return
      }
      
      // Prevent moving to the last position if it's occupied by a submit field
      const lastField = newFields[newFields.length - 1]
      if (lastField?.type === 'submit' && index + 1 >= newFields.length - 1) {
        return
      }
      
      newFields.splice(index, 1)
      newFields.splice(index + 1, 0, field)
      setFields(newFields)
      markAsChanged()
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
    const newPreviewState = !isPreview
    if (onPreviewToggle) {
      onPreviewToggle(newPreviewState)
    }
    if (newPreviewState) {
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
    markAsChanged()

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
      handleNavigation(onNavigateHome)
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
        // Clear unsaved changes flag since form was saved
        setHasUnsavedChanges(false)
        // Navigate back to forms list (bypass unsaved changes check since form is saved)
        if (onNavigateHome) {
          onNavigateHome(true) // Pass true to bypass unsaved changes check
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
  if (isPreview) {
    return (
      <div className="h-screen overflow-hidden">
        <FormPreview
          fields={allFields}
          formTitle={formConfig.title || getFormTranslation("formElements", "untitledForm", formConfig.language)}
          formConfig={formConfig}
          onExitPreview={() => {
            if (onPreviewToggle) {
              onPreviewToggle(false)
            }
            // Restore selected field and settings panel state when returning from preview
            if (selectedField) {
              setIsSettingsActive(true)
            }
          }}
        />
      </div>
    )
  }

  if (isResponses) {
    return (
      <div className="h-screen overflow-hidden">
        <FormResponses
          form={{
            id: formId || '',
            title: formConfig.title || getFormTranslation("formElements", "untitledForm", formConfig.language),
            description: formConfig.description || '',
            status: 'published',
            createdAt: new Date(),
            updatedAt: new Date(),
            responseCount: 0,
            shareUrl: '',
            config: formConfig,
            fields: allFields
          }}
          onClose={() => {
            if (onResponsesToggle) {
              onResponsesToggle(false)
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
          onTitleChange={(title) => {
            setFormConfig((prev) => ({ ...prev, title }))
            markAsChanged()
          }}
          onSettingsToggle={handleSettingsToggle}
          isSettingsActive={isSettingsActive && !selectedField}
          onPreviewToggle={handlePreviewToggle}
          onBackToHome={handleBackToHome}
          currentLanguage={formConfig.language}
          onPublish={handlePublish}
          isPublishing={isPublishing}
          isPreview={isPreview}
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
              formId={formId}
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
        
        {/* Unsaved Changes Confirmation Dialog */}
        <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
              <AlertDialogDescription>
                You have unsaved changes to your form. Are you sure you want to leave without saving? 
                Your changes will be lost.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={cancelExit}>Stay on Page</AlertDialogCancel>
              <AlertDialogAction onClick={confirmExit} className="bg-red-600 hover:bg-red-700">
                Leave Without Saving
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DndProvider>
  )
})

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
