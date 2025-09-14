"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { X, Plus, Trash2, GripVertical } from "lucide-react"
import { useDrag, useDrop } from "react-dnd"
import type { FormField, FieldType } from "@/types/form-builder/form-builder"
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
  const [localField, setLocalField] = useState<FormField | null>(null)

  // Update local field when selected field changes
  useEffect(() => {
    setLocalField(selectedField ? { ...selectedField } : null)
  }, [selectedField])

  const handleFieldUpdate = (updates: Partial<FormField>) => {
    if (!localField) return
    const updatedField = { ...localField, ...updates }
    setLocalField(updatedField)
    onUpdateField(localField.id, updates)
  }

  const handleOptionAdd = () => {
    if (!localField) return
    const newOptions = [...(localField.options || []), `Option ${(localField.options?.length || 0) + 1}`]
    handleFieldUpdate({ options: newOptions })
  }

  const handleOptionUpdate = (index: number, value: string) => {
    if (!localField?.options) return
    const newOptions = [...localField.options]
    newOptions[index] = value
    handleFieldUpdate({ options: newOptions })
  }

  const handleOptionRemove = (index: number) => {
    if (!localField?.options) return
    const newOptions = localField.options.filter((_, i) => i !== index)
    handleFieldUpdate({ options: newOptions })
  }

  const handleOptionMove = (dragIndex: number, hoverIndex: number) => {
    if (!localField?.options) return
    const newOptions = [...localField.options]
    const draggedOption = newOptions[dragIndex]
    newOptions.splice(dragIndex, 1)
    newOptions.splice(hoverIndex, 0, draggedOption)
    handleFieldUpdate({ options: newOptions })
  }

  // Draggable Option Component
  const DraggableOption = ({ option, index }: { option: string; index: number }) => {
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
          handleOptionMove(item.index, index)
          item.index = index
        }
      },
    })

    return (
      <div
        ref={(node) => drag(drop(node))}
        className={`flex items-center space-x-2 p-2 rounded border ${
          isDragging ? "opacity-50 bg-gray-100" : "bg-white"
        }`}
      >
        <div className="cursor-move p-1 hover:bg-gray-100 rounded">
          <GripVertical className="w-3 h-3 text-gray-400" />
        </div>
        <Input
          value={option}
          onChange={(e) => handleOptionUpdate(index, e.target.value)}
          placeholder={`Option ${index + 1}`}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleOptionRemove(index)}
          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    )
  }

  const renderFieldProperties = () => {
    if (!localField) return null

    return (
      <div className="space-y-6">
        {/* Basic Properties */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900">Basic Properties</h3>
          
          {/* Label */}
          <div className="space-y-2">
            <Label htmlFor="field-label">Label</Label>
            <Input
              id="field-label"
              value={localField.label}
              onChange={(e) => handleFieldUpdate({ label: e.target.value })}
              placeholder="Field label"
            />
          </div>

          {/* Placeholder */}
          {localField.type !== "heading" && localField.type !== "text-block" && localField.type !== "submit" && localField.type !== "signature" && (
            <div className="space-y-2">
              <Label htmlFor="field-placeholder">Placeholder</Label>
              <Input
                id="field-placeholder"
                value={localField.placeholder || ""}
                onChange={(e) => handleFieldUpdate({ placeholder: e.target.value })}
                placeholder="Placeholder text"
              />
            </div>
          )}

          {/* Help Text */}
          <div className="space-y-2">
            <Label htmlFor="field-help">Help Text</Label>
            <Textarea
              id="field-help"
              value={localField.helpText || ""}
              onChange={(e) => handleFieldUpdate({ helpText: e.target.value })}
              placeholder="Help text for users"
              rows={2}
            />
          </div>

          {/* Required */}
          {localField.type !== "heading" && localField.type !== "text-block" && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="field-required"
                checked={localField.required}
                onCheckedChange={(checked) => handleFieldUpdate({ required: !!checked })}
              />
              <Label htmlFor="field-required">Required field</Label>
            </div>
          )}

          {/* Show Label */}
          {localField.type !== "heading" && localField.type !== "text-block" && localField.type !== "submit" && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="field-show-label"
                checked={localField.showLabel !== false}
                onCheckedChange={(checked) => handleFieldUpdate({ showLabel: !!checked })}
              />
              <Label htmlFor="field-show-label">Show label</Label>
            </div>
          )}

          {/* Required Error Message */}
          {localField.required && (
            <div className="space-y-2">
              <Label htmlFor="field-error-message">Required Error Message</Label>
              <Input
                id="field-error-message"
                value={localField.requiredErrorMessage || ""}
                onChange={(e) => handleFieldUpdate({ requiredErrorMessage: e.target.value })}
                placeholder="Error message when field is required"
              />
            </div>
          )}
        </div>

        {/* Field-Specific Properties */}
        {renderFieldSpecificProperties()}
      </div>
    )
  }

  const renderFieldSpecificProperties = () => {
    if (!localField) return null

    switch (localField.type) {
      case "multiple-choice":
      case "checkboxes":
        return (
          <div className="space-y-4">
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Options</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleOptionAdd}
                  className="h-8"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Option
                </Button>
              </div>
              
              <div className="space-y-2">
                {localField.options?.map((option, index) => (
                  <DraggableOption key={index} option={option} index={index} />
                )) || []}
              </div>
            </div>
          </div>
        )

      case "submit":
        return (
          <div className="space-y-4">
            <Separator />
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900">Submit Button Settings</h3>
              
              <div className="space-y-2">
                <Label htmlFor="button-text">Button Text</Label>
                <Input
                  id="button-text"
                  value={formConfig.submitButton.text}
                  onChange={(e) => onFormConfigChange({ 
                    submitButton: { ...formConfig.submitButton, text: e.target.value }
                  })}
                  placeholder="Submit"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="button-style">Button Style</Label>
                <Select
                  value={formConfig.submitButton.style}
                  onValueChange={(value: "primary" | "secondary" | "success") => 
                    onFormConfigChange({ 
                      submitButton: { ...formConfig.submitButton, style: value }
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primary</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="button-icon">Button Icon</Label>
                <Select
                  value={formConfig.submitButton.icon}
                  onValueChange={(value) => onFormConfigChange({ 
                    submitButton: { ...formConfig.submitButton, icon: value }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="send">Send</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                    <SelectItem value="arrow">Arrow</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case "phone":
        return (
          <div className="space-y-4">
            <Separator />
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900">Phone Settings</h3>
              
              <div className="space-y-2">
                <Label htmlFor="phone-format">Format</Label>
                <Select
                  value={localField.phoneSettings?.format || "international"}
                  onValueChange={(value: "national" | "international") => 
                    handleFieldUpdate({ 
                      phoneSettings: { 
                        ...localField.phoneSettings, 
                        format: value 
                      } 
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="national">National</SelectItem>
                    <SelectItem value="international">International</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="default-country">Default Country Code</Label>
                <Input
                  id="default-country"
                  value={localField.phoneSettings?.defaultCountryCode || "US"}
                  onChange={(e) => handleFieldUpdate({ 
                    phoneSettings: { 
                      ...localField.phoneSettings, 
                      defaultCountryCode: e.target.value 
                    } 
                  })}
                  placeholder="US"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-country-selector"
                  checked={localField.phoneSettings?.showCountrySelector !== false}
                  onCheckedChange={(checked) => handleFieldUpdate({ 
                    phoneSettings: { 
                      ...localField.phoneSettings, 
                      showCountrySelector: !!checked 
                    } 
                  })}
                />
                <Label htmlFor="show-country-selector">Show Country Selector</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enable-validation"
                  checked={localField.phoneSettings?.enableValidation !== false}
                  onCheckedChange={(checked) => handleFieldUpdate({ 
                    phoneSettings: { 
                      ...localField.phoneSettings, 
                      enableValidation: !!checked 
                    } 
                  })}
                />
                <Label htmlFor="enable-validation">Enable Validation</Label>
              </div>

              {localField.phoneSettings?.enableValidation && (
                <div className="space-y-2">
                  <Label htmlFor="validation-message">Validation Message</Label>
                  <Input
                    id="validation-message"
                    value={localField.phoneSettings?.validationMessage || ""}
                    onChange={(e) => handleFieldUpdate({ 
                      phoneSettings: { 
                        ...localField.phoneSettings, 
                        validationMessage: e.target.value 
                      } 
                    })}
                    placeholder="Please enter a valid phone number"
                  />
                </div>
              )}
            </div>
          </div>
        )

      case "file-upload":
        return (
          <div className="space-y-4">
            <Separator />
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900">File Upload Settings</h3>
              
              <div className="space-y-2">
                <Label htmlFor="accepted-file-types">Accepted File Types</Label>
                <Input
                  id="accepted-file-types"
                  value={localField.acceptedFileTypes || ""}
                  onChange={(e) => handleFieldUpdate({ acceptedFileTypes: e.target.value })}
                  placeholder=".pdf,.doc,.docx,.jpg,.png"
                />
                <p className="text-xs text-gray-500">
                  Comma-separated file extensions (e.g., .pdf,.doc,.jpg)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-file-size">Max File Size (MB)</Label>
                <Input
                  id="max-file-size"
                  type="number"
                  value={localField.maxFileSize || ""}
                  onChange={(e) => handleFieldUpdate({ maxFileSize: parseInt(e.target.value) || undefined })}
                  placeholder="10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-files">Max Number of Files</Label>
                <Input
                  id="max-files"
                  type="number"
                  value={localField.maxFiles || ""}
                  onChange={(e) => handleFieldUpdate({ maxFiles: parseInt(e.target.value) || undefined })}
                  placeholder="1"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="multiple-files"
                  checked={localField.allowMultipleFiles || false}
                  onCheckedChange={(checked) => handleFieldUpdate({ allowMultipleFiles: !!checked })}
                />
                <Label htmlFor="multiple-files">Allow Multiple Files</Label>
              </div>
            </div>
          </div>
        )

      case "signature":
        return (
          <div className="space-y-4">
            <Separator />
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900">Signature Settings</h3>
              
              <div className="space-y-3">
                <Label>Signature Methods</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="signature-draw"
                      checked={localField.signatureMethods?.draw !== false}
                      onCheckedChange={(checked) => handleFieldUpdate({ 
                        signatureMethods: { 
                          ...localField.signatureMethods, 
                          draw: !!checked 
                        } 
                      })}
                    />
                    <Label htmlFor="signature-draw">Allow Drawing</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="signature-upload"
                      checked={localField.signatureMethods?.upload !== false}
                      onCheckedChange={(checked) => handleFieldUpdate({ 
                        signatureMethods: { 
                          ...localField.signatureMethods, 
                          upload: !!checked 
                        } 
                      })}
                    />
                    <Label htmlFor="signature-upload">Allow Upload</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Signature Options</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show-color-picker"
                    checked={localField.signatureSettings?.showColorPicker !== false}
                    onCheckedChange={(checked) => handleFieldUpdate({ 
                      signatureSettings: { 
                        ...localField.signatureSettings, 
                        showColorPicker: !!checked 
                      } 
                    })}
                  />
                  <Label htmlFor="show-color-picker">Show Color Picker</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="default-color">Default Color</Label>
                  <Select
                    value={localField.signatureSettings?.defaultColor || "black"}
                    onValueChange={(value: "black" | "blue" | "red") => 
                      handleFieldUpdate({ 
                        signatureSettings: { 
                          ...localField.signatureSettings, 
                          defaultColor: value 
                        } 
                      })
                    }
                  >
                    <SelectTrigger>
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
        )

      default:
        return null
    }
  }

  const renderFormSettings = () => {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900">Form Settings</h3>
          
          <div className="space-y-2">
            <Label htmlFor="form-title">Form Title</Label>
            <Input
              id="form-title"
              value={formConfig.title}
              onChange={(e) => onFormConfigChange({ title: e.target.value })}
              placeholder="Form title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="form-description">Form Description</Label>
            <Textarea
              id="form-description"
              value={formConfig.description}
              onChange={(e) => onFormConfigChange({ description: e.target.value })}
              placeholder="Form description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="form-language">Language</Label>
            <Select
              value={formConfig.language}
              onValueChange={(value) => onFormConfigChange({ language: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="ar">Arabic</SelectItem>
                <SelectItem value="he">Hebrew</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {onSaveChanges && (
          <Button 
            className="w-full" 
            onClick={onSaveChanges}
          >
            Save Changes
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
      <div className="p-4 pb-[50px]">
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
            {panelMode === "field" ? renderFieldProperties() : renderFormSettings()}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
