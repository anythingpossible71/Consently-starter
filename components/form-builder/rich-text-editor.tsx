"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Bold, Italic, Underline, Maximize2 } from "lucide-react"

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
  isRTL?: boolean
}

interface RichTextModalProps {
  isOpen: boolean
  onClose: () => void
  content: string
  onChange: (content: string) => void
  isRTL?: boolean
}

export function RichTextEditor({ content, onChange, placeholder, className, isRTL }: RichTextEditorProps) {
  const [localContent, setLocalContent] = useState(content)

  const handleChange = (value: string) => {
    setLocalContent(value)
    onChange(value)
  }

  const applyFormatting = (format: string) => {
    const textarea = document.querySelector(`textarea[data-rich-text="true"]`) as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = localContent.substring(start, end)
    
    let formattedText = ""
    switch (format) {
      case "bold":
        formattedText = `**${selectedText}**`
        break
      case "italic":
        formattedText = `*${selectedText}*`
        break
      case "underline":
        formattedText = `<u>${selectedText}</u>`
        break
      default:
        formattedText = selectedText
    }

    const newContent = localContent.substring(0, start) + formattedText + localContent.substring(end)
    handleChange(newContent)
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex gap-1 p-1 border border-gray-200 rounded-t-md bg-gray-50">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => applyFormatting("bold")}
          className="h-8 w-8 p-0"
        >
          <Bold className="w-3 h-3" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => applyFormatting("italic")}
          className="h-8 w-8 p-0"
        >
          <Italic className="w-3 h-3" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => applyFormatting("underline")}
          className="h-8 w-8 p-0"
        >
          <Underline className="w-3 h-3" />
        </Button>
      </div>
      <Textarea
        data-rich-text="true"
        value={localContent}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-t-none border-t-0 min-h-[100px] resize-none"
        dir={isRTL ? "rtl" : "ltr"}
      />
    </div>
  )
}

export function RichTextModal({ isOpen, onClose, content, onChange, isRTL }: RichTextModalProps) {
  const [localContent, setLocalContent] = useState(content)

  const handleSave = () => {
    onChange(localContent)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Rich Text Editor</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <RichTextEditor
            content={localContent}
            onChange={setLocalContent}
            placeholder="Enter your rich text content..."
            className="h-full"
            isRTL={isRTL}
          />
        </div>
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
