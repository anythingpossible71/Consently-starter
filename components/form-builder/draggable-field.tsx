"use client"

import { useRef } from "react"
import { useDrag, useDrop } from "react-dnd"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { FormField } from "@/types/form-builder/form-builder"
import type { FormConfig } from "@/types/form-builder/form-config"
import { FieldRenderer } from "./field-renderer"
import { Edit3, Trash2, GripVertical, ChevronUp, ChevronDown } from "lucide-react"

interface DraggableFieldProps {
  field: FormField
  index: number
  totalFields: number
  selectedField: FormField | null
  onSelectField: (field: FormField) => void
  onUpdateField: (fieldId: string, updates: Partial<FormField>) => void
  onRemoveField: (fieldId: string) => void
  onMoveField: (dragIndex: number, hoverIndex: number) => void
  onMoveFieldUp: (index: number) => void
  onMoveFieldDown: (index: number) => void
  currentLanguage: string
  formConfig?: FormConfig
}

interface DragItem {
  type: string
  index: number
  id: string
}

export function DraggableField({
  field,
  index,
  totalFields,
  selectedField,
  onSelectField,
  onUpdateField,
  onRemoveField,
  onMoveField,
  onMoveFieldUp,
  onMoveFieldDown,
  currentLanguage,
  formConfig,
}: DraggableFieldProps) {
  const ref = useRef<HTMLDivElement>(null)
  const dragRef = useRef<HTMLDivElement>(null)

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: unknown }>({
    accept: "field",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // Time to actually perform the action
      onMoveField(dragIndex, hoverIndex)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag, preview] = useDrag({
    type: "field",
    item: () => {
      return { id: field.id, index }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const opacity = isDragging ? 0.4 : 1

  // Connect drag and drop refs
  drag(dragRef)
  drop(ref)

  const canMoveUp = index > 0
  const canMoveDown = index < totalFields - 1

  return (
    <div
      ref={ref}
      style={{ opacity }}
      data-handler-id={handlerId}
      className={`group relative ${selectedField?.id === field.id ? "ring-2 ring-blue-500 ring-opacity-50" : ""}`}
      onClick={() => onSelectField(field)}
    >
      <Card className="hover:shadow-md transition-shadow cursor-move form-field-card">
        <CardContent className="p-6 form-field-content">
          <FieldRenderer field={field} formConfig={formConfig} currentLanguage={currentLanguage} />
        </CardContent>
      </Card>

      {/* Field Controls - Always positioned on the right (LTR) */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        {/* Up arrow - hidden for submit fields */}
        {field.type !== 'submit' && (
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 form-control-button bg-transparent"
            onClick={(e) => {
              e.stopPropagation()
              onMoveFieldUp(index)
            }}
            disabled={!canMoveUp}
            title="Move up"
          >
            <ChevronUp className="w-3 h-3" />
          </Button>
        )}

        {/* Down arrow - hidden for submit fields */}
        {field.type !== 'submit' && (
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 form-control-button bg-transparent"
            onClick={(e) => {
              e.stopPropagation()
              onMoveFieldDown(index)
            }}
            disabled={!canMoveDown}
            title="Move down"
          >
            <ChevronDown className="w-3 h-3" />
          </Button>
        )}

        {/* Edit button */}
        <Button
          size="sm"
          variant="outline"
          className="h-8 w-8 p-0 form-control-button bg-transparent"
          onClick={(e) => {
            e.stopPropagation()
            onSelectField(field)
          }}
          title="Edit field"
        >
          <Edit3 className="w-3 h-3" />
        </Button>

        {/* Delete button - hidden for submit fields */}
        {field.type !== 'submit' && (
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 form-control-button hover:bg-red-50 hover:border-red-200 bg-transparent"
            onClick={(e) => {
              e.stopPropagation()
              onRemoveField(field.id)
            }}
            title="Delete field"
          >
            <Trash2 className="w-3 h-3 text-red-500" />
          </Button>
        )}
      </div>

      {/* Drag Handle - Always positioned on the left (LTR) - hidden for submit fields */}
      {field.type !== 'submit' && (
        <div className="absolute top-1/2 left-2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div ref={dragRef} className="cursor-move p-1 hover:bg-gray-100 rounded" onClick={(e) => e.stopPropagation()}>
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      )}
    </div>
  )
}
