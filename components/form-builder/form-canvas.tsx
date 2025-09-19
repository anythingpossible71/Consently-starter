"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import type { FormField } from "@/types/form-builder/form-builder"
import type { FormConfig } from "@/types/form-builder/form-config"
import { DraggableField } from "./draggable-field"
import { Edit3, Send, Check, ArrowRight } from "lucide-react"
import { getFormTranslation, isRTL } from "@/utils/form-builder/translations"

interface FormCanvasProps {
  fields: FormField[]
  selectedField: FormField | null
  onSelectField: (field: FormField | null) => void
  onUpdateField: (fieldId: string, updates: Partial<FormField>) => void
  onRemoveField: (fieldId: string) => void
  onMoveField: (dragIndex: number, hoverIndex: number) => void
  onMoveFieldUp: (index: number) => void
  onMoveFieldDown: (index: number) => void
  formTitle: string
  formDescription: string
  onDescriptionChange: (description: string) => void
  currentLanguage: string
  formConfig?: FormConfig
  scrollPosition?: number
  onScrollPositionChange?: (position: number) => void
}

export function FormCanvas({
  fields,
  selectedField,
  onSelectField,
  onUpdateField,
  onRemoveField,
  onMoveField,
  onMoveFieldUp,
  onMoveFieldDown,
  formTitle,
  formDescription,
  onDescriptionChange,
  currentLanguage,
  formConfig,
  scrollPosition = 0,
  onScrollPositionChange,
}: FormCanvasProps) {
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const isRTLLanguage = isRTL(currentLanguage)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Restore scroll position when returning from preview
  useEffect(() => {
    if (scrollContainerRef.current && scrollPosition > 0) {
      scrollContainerRef.current.scrollTop = scrollPosition
    }
  }, [scrollPosition])

  // Track scroll position
  const handleScroll = () => {
    if (scrollContainerRef.current && onScrollPositionChange) {
      onScrollPositionChange(scrollContainerRef.current.scrollTop)
    }
  }

  return (
    <div
      ref={scrollContainerRef}
      className="flex-1 form-canvas-background overflow-y-auto h-full"
      onScroll={handleScroll}
      style={{ maxHeight: "calc(100vh - 128px)" }}
    >
      {/* Form Content Container - Only this part is RTL */}
      <div
        className={`max-w-2xl pb-32 ${isRTLLanguage ? "text-right" : "text-left"}`}
        style={{ margin: "20px auto", padding: "20px 20px 62px 20px" }}
        dir={isRTLLanguage ? "rtl" : "ltr"}
      >
        {/* Form Description */}
        <div className="mb-8">
          {isEditingDescription ? (
            <Textarea
              value={formDescription}
              onChange={(e) => onDescriptionChange(e.target.value)}
              onBlur={() => setIsEditingDescription(false)}
              className="resize-none form-description-input"
              placeholder="Add form description"
              autoFocus
            />
          ) : (
            <div
              className="text-gray-600 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded border border-gray-200 min-h-[40px] flex items-center"
              onClick={() => setIsEditingDescription(true)}
            >
              {formDescription || "Add form description"}
            </div>
          )}
        </div>

        {/* Form Fields - Filter out submit fields from display */}
        {(() => {
          const visibleFields = fields.filter(field => field.type !== 'submit')
          return visibleFields.length === 0 ? (
            <Card className="border-2 border-dashed border-gray-300 form-empty-state">
              <CardContent className="p-12 text-center form-empty-content">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Start building your form</h3>
                <p className="text-gray-500">Drag fields from the left panel to start building your form</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {visibleFields.map((field, index) => (
                <DraggableField
                  key={field.id}
                  field={field}
                  index={index}
                  totalFields={visibleFields.length}
                  selectedField={selectedField}
                  onSelectField={onSelectField}
                  onUpdateField={onUpdateField}
                  onRemoveField={onRemoveField}
                  onMoveField={onMoveField}
                  onMoveFieldUp={onMoveFieldUp}
                  onMoveFieldDown={onMoveFieldDown}
                  currentLanguage={currentLanguage}
                  formConfig={formConfig}
                />
              ))}
            </div>
          )
        })()}

        {/* Form Footer - Submit Button (Always Present, Not Draggable) */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div
            className={`group relative ${
              selectedField?.type === "submit" ? "ring-2 ring-blue-500 ring-opacity-50" : ""
            }`}
            onClick={() => {
              // Create submit button field from form config for editing
              const submitField = {
                id: "submit_button",
                type: "submit" as const,
                label: "Submit Button",
                required: false,
                showLabel: false,
                buttonText: formConfig.submitButton.text,
                buttonIcon: formConfig.submitButton.icon,
                buttonStyle: formConfig.submitButton.style,
              }
              onSelectField(submitField)
            }}
          >
            <Button className={`px-8 py-3 ${
              formConfig.submitButton.style === "primary" ? "bg-blue-600 hover:bg-blue-700 text-white" :
              formConfig.submitButton.style === "secondary" ? "bg-gray-600 hover:bg-gray-700 text-white" :
              "bg-green-600 hover:bg-green-700 text-white"
            }`}>
              {(() => {
                const iconMap = {
                  send: Send,
                  check: Check,
                  arrow: ArrowRight,
                }
                const IconComponent = iconMap[formConfig.submitButton.icon as keyof typeof iconMap] || Send
                return <IconComponent className={`w-4 h-4 ${isRTLLanguage ? "ml-2 mr-0" : "mr-2"}`} />
              })()}
              {formConfig.submitButton.text}
            </Button>

            {/* Edit indicator - UI controls stay LTR positioned */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0 form-control-button bg-transparent"
                onClick={(e) => e.stopPropagation()}
              >
                <Edit3 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
