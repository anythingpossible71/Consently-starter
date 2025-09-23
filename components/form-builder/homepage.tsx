"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Copy,
  ExternalLink,
  BarChart3,
  Trash2,
  Calendar,
  FileText,
  RefreshCw,
} from "lucide-react"
import { getUITranslation, isRTL } from "@/utils/form-builder/translations"
import type { FormData } from "@/types/form-builder/app-types"
import { deleteForm } from "@/app/actions/forms"

interface HomepageProps {
  currentLanguage: string
  onCreateForm: () => void
  onEditForm: (formId: string) => void
  onViewResponses: (formId: string) => void
  forms: FormData[]
  onRefreshForms?: () => void
  onDeleteForm?: (formId: string) => void
}

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

// QR Code component
function QRCodeDisplay({ text, size = 120 }: { text: string; size?: number }) {
  // Simple QR code placeholder - in real app, use a QR library like 'qrcode' or 'react-qr-code'
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`

  return (
    <img
      src={qrCodeUrl || "/placeholder.svg"}
      alt="QR Code"
      width={size}
      height={size}
      className="border rounded-lg bg-white p-2"
    />
  )
}

export function Homepage({ currentLanguage, onCreateForm, onEditForm, onViewResponses, forms, onRefreshForms, onDeleteForm }: HomepageProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [qrModalOpen, setQrModalOpen] = useState(false)
  const [qrModalData, setQrModalData] = useState<{ url: string; title: string } | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [formToDelete, setFormToDelete] = useState<{ id: string; title: string } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const isRTLLanguage = isRTL(currentLanguage)

  const filteredForms = forms.filter(
    (form) =>
      form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getFormLanguage = (formId: string) => {
    // Use the form's actual language from database
    const form = forms.find(f => f.id === formId)
    return form?.config?.language || "en"
  }

  const getShareUrl = (form: FormData, language: string) => {
    const baseUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}/forms/public/${form.id}`
      : `http://localhost:3001/forms/public/${form.id}`
    return language !== "en" ? `${baseUrl}?lang=${language}` : baseUrl
  }

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url)
    // You might want to show a toast notification here
  }

  const handleDeleteForm = (formId: string) => {
    const form = forms.find(f => f.id === formId)
    if (form) {
      setFormToDelete({ id: formId, title: form.title })
      setDeleteDialogOpen(true)
    }
  }

  const confirmDelete = async () => {
    if (!formToDelete) return
    
    setIsDeleting(true)
    try {
      const result = await deleteForm(formToDelete.id)
      if (result.success) {
        // Call the parent's delete handler if provided
        if (onDeleteForm) {
          onDeleteForm(formToDelete.id)
        }
        // Refresh forms list
        if (onRefreshForms) {
          onRefreshForms()
        }
        setDeleteDialogOpen(false)
        setFormToDelete(null)
      } else {
        console.error('Failed to delete form:', result.message)
        // You might want to show a toast notification here
      }
    } catch (error) {
      console.error('Error deleting form:', error)
      // You might want to show a toast notification here
    } finally {
      setIsDeleting(false)
    }
  }

  const handleQRClick = (form: FormData, language: string) => {
    const url = getShareUrl(form, language)
    setQrModalData({ url, title: form.title })
    setQrModalOpen(true)
  }

  const getLanguageInfo = (code: string) => {
    return AVAILABLE_LANGUAGES.find((lang) => lang.code === code) || AVAILABLE_LANGUAGES[0]
  }

  return (
    <div className={`p-6 max-w-7xl mx-auto ${isRTLLanguage ? "rtl" : "ltr"}`} dir={isRTLLanguage ? "rtl" : "ltr"}>
      {/* Header */}
      <div className={`flex items-center justify-between mb-8 ${isRTLLanguage ? "flex-row-reverse" : ""}`}>
        <div>
          <h1 className={`text-3xl font-bold text-gray-900 ${isRTLLanguage ? "text-right" : "text-left"}`}>
            {getUITranslation("myForms", currentLanguage)}
          </h1>
          <p className={`text-gray-600 mt-2 ${isRTLLanguage ? "text-right" : "text-left"}`}>
            {getUITranslation("manageYourForms", currentLanguage)}
          </p>
        </div>
        <div className={`flex gap-2 ${isRTLLanguage ? "flex-row-reverse" : ""}`}>
          {onRefreshForms && (
            <Button 
              onClick={onRefreshForms} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              {getUITranslation("refresh", currentLanguage)}
            </Button>
          )}
          <Button onClick={onCreateForm} className="bg-blue-600 hover:bg-blue-700">
            <Plus className={`w-4 h-4 ${isRTLLanguage ? "ml-2 mr-0" : "mr-2"}`} />
            {getUITranslation("newForm", currentLanguage)}
          </Button>
        </div>
      </div>

      {/* Search and Stats */}
      <div className={`flex items-center gap-4 mb-6 ${isRTLLanguage ? "flex-row-reverse" : ""}`}>
        <div className="relative flex-1 max-w-md">
          <Search
            className={`absolute ${isRTLLanguage ? "right-3" : "left-3"} top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4`}
          />
          <Input
            placeholder={getUITranslation("searchForms", currentLanguage)}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`${isRTLLanguage ? "pr-10 text-right" : "pl-10"}`}
            dir={isRTLLanguage ? "rtl" : "ltr"}
          />
        </div>
        <div className={`flex items-center gap-4 text-sm text-gray-600 ${isRTLLanguage ? "flex-row-reverse" : ""}`}>
          <span>
            {forms.length} {getUITranslation("totalForms", currentLanguage)}
          </span>
          <span>
            {forms.filter((f) => f.status === "published").length} {getUITranslation("published", currentLanguage)}
          </span>
          <span>
            {forms.reduce((sum, f) => sum + f.responseCount, 0)} {getUITranslation("totalResponses", currentLanguage)}
          </span>
        </div>
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
        {filteredForms.map((form) => {
          const selectedLang = getFormLanguage(form.id)
          const shareUrl = getShareUrl(form, selectedLang)
          const supportedLanguages = Array.isArray(form.config?.supportedLanguages) 
            ? form.config.supportedLanguages 
            : ["en"]
          const selectedLangInfo = getLanguageInfo(selectedLang)

          return (
            <Card key={form.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className={`flex items-start justify-between ${isRTLLanguage ? "flex-row-reverse" : ""}`}>
                  <div className="flex-1">
                    <CardTitle
                      className={`text-lg cursor-pointer hover:text-blue-600 transition-colors ${isRTLLanguage ? "text-right" : "text-left"}`}
                      onClick={() => onEditForm(form.id)}
                    >
                      {form.title}
                    </CardTitle>
                    {form.description && (
                      <CardDescription className={`mt-1 ${isRTLLanguage ? "text-right" : "text-left"}`}>
                        {form.description}
                      </CardDescription>
                    )}
                  </div>
                  <div className={`flex items-center gap-2 ${isRTLLanguage ? "flex-row-reverse" : ""}`}>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <span>{selectedLangInfo.flag}</span>
                      <span>{selectedLangInfo.name}</span>
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEditForm(form.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          {getUITranslation("edit", currentLanguage)}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCopyLink(shareUrl)}>
                          <Copy className="mr-2 h-4 w-4" />
                          {getUITranslation("copyLink", currentLanguage)}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.open(shareUrl, "_blank")}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          {getUITranslation("openForm", currentLanguage)}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onViewResponses(form.id)}>
                          <BarChart3 className="mr-2 h-4 w-4" />
                          {getUITranslation("viewResponses", currentLanguage)}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteForm(form.id)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          {getUITranslation("delete", currentLanguage)}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* QR Code Section */}
                <div className="flex justify-center">
                  <div
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handleQRClick(form, selectedLang)}
                  >
                    <QRCodeDisplay text={shareUrl} size={120} />
                  </div>
                </div>

                {/* URL Input and Copy */}
                <div className="flex items-center gap-2">
                  <Input value={shareUrl} readOnly className="text-xs h-8 bg-white flex-1" />
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 flex-shrink-0"
                    onClick={() => handleCopyLink(shareUrl)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 flex-shrink-0"
                    onClick={() => window.open(shareUrl, "_blank")}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>

                {/* Action Buttons */}
                <div className={`flex gap-2 ${isRTLLanguage ? "flex-row-reverse" : ""}`}>
                  <Button variant="outline" size="sm" onClick={() => onEditForm(form.id)} className="flex-1">
                    <Edit className={`w-4 h-4 ${isRTLLanguage ? "ml-2 mr-0" : "mr-2"}`} />
                    {getUITranslation("edit", currentLanguage)}
                  </Button>
                  <Button 
                    variant={form.responseCount === 0 ? "outline" : "default"} 
                    size="sm" 
                    onClick={() => onViewResponses(form.id)} 
                    className="flex-1"
                    disabled={form.responseCount === 0}
                  >
                    <BarChart3 className={`w-4 h-4 ${isRTLLanguage ? "ml-2 mr-0" : "mr-2"}`} />
                    {form.responseCount === 0 
                      ? getUITranslation("noResponses", currentLanguage)
                      : `${form.responseCount} ${form.responseCount === 1 ? getUITranslation("response", currentLanguage) : getUITranslation("responses", currentLanguage)}`
                    }
                  </Button>
                </div>

                {/* Updated Date */}
                <div
                  className={`flex items-center gap-1 text-xs text-gray-500 mt-2 ${isRTLLanguage ? "flex-row-reverse justify-end" : ""}`}
                >
                  <Calendar className="w-3 h-3" />
                  <span>Updated {form.updatedAt.toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredForms.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm
              ? getUITranslation("noFormsFound", currentLanguage)
              : getUITranslation("noForms", currentLanguage)}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm
              ? getUITranslation("tryDifferentSearch", currentLanguage)
              : getUITranslation("createFirstForm", currentLanguage)}
          </p>
          {!searchTerm && (
            <Button onClick={onCreateForm} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              {getUITranslation("createForm", currentLanguage)}
            </Button>
          )}
        </div>
      )}

      {/* QR Code Modal */}
      <Dialog open={qrModalOpen} onOpenChange={setQrModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">{qrModalData?.title} - QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 py-6">
            {qrModalData && (
              <>
                <QRCodeDisplay text={qrModalData.url} size={280} />
                <p className="text-sm text-gray-600 text-center">Scan this QR code to access the form</p>
                <div className="w-full">
                  <Input value={qrModalData.url} readOnly className="text-center text-sm" />
                </div>
                <Button variant="outline" onClick={() => handleCopyLink(qrModalData.url)} className="w-full">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Form</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{formToDelete?.title}"? This action cannot be undone.
              All form responses and data will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete Form"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}