"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface LanguageChangeDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  currentLanguage: string
  newLanguage: string
}

export function LanguageChangeDialog({
  isOpen,
  onClose,
  onConfirm,
  currentLanguage,
  newLanguage
}: LanguageChangeDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Language</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-gray-600">
            Changing the language will reset all form elements (labels, placeholders, options) 
            to their default text in the new language. This action cannot be undone.
          </p>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
