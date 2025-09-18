"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
  ChevronDown,
} from "lucide-react"
import { getUITranslation, isRTL } from "@/utils/form-builder/translations"
import type { FormData } from "@/types/form-builder/app-types"

interface HomepageProps {
  currentLanguage: string
  onCreateForm: () => void
  onEditForm: (formId: string) => void
  onViewResponses: (formId: string) => void
  forms: FormData[]
}

// Available languages with flags
const AVAILABLE_LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "he", name: "עברית", flag: "🇮🇱" },
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

export function Homepage({ currentLanguage, onCreateForm, onEditForm, onViewResponses, forms }: HomepageProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLanguages, setSelectedLanguages] = useState<Record<string, string>>({})
  const [qrModalOpen, setQrModalOpen] = useState(false)
  const [qrModalData, setQrModalData] = useState<{ url: string; title: string } | null>(null)
  const isRTLLanguage = isRTL(currentLanguage)

  const filteredForms = forms.filter(
    (form) =>
      form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getFormLanguage = (formId: string) => {
    return selectedLanguages[formId] || "en"
  }

  const setFormLanguage = (formId: string, language: string) => {
    setSelectedLanguages((prev) => ({ ...prev, [formId]: language }))
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
    // Implement delete functionality
    console.log("Delete form:", formId)
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
        <Button onClick={onCreateForm} className="bg-blue-600 hover:bg-blue-700">
          <Plus className={`w-4 h-4 ${isRTLLanguage ? "ml-2 mr-0" : "mr-2"}`} />
          {getUITranslation("newForm", currentLanguage)}
        </Button>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredForms.map((form) => {
          const selectedLang = getFormLanguage(form.id)
          const shareUrl = getShareUrl(form, selectedLang)
          const supportedLanguages = form.config?.supportedLanguages || ["en"]
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
                    <Badge variant={form.status === "published" ? "default" : "secondary"}>
                      {getUITranslation(form.status, currentLanguage)}
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
                        {form.shareUrl && (
                          <>
                            <DropdownMenuItem onClick={() => handleCopyLink(shareUrl)}>
                              <Copy className="mr-2 h-4 w-4" />
                              {getUITranslation("copyLink", currentLanguage)}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => window.open(shareUrl, "_blank")}>
                              <ExternalLink className="mr-2 h-4 w-4" />
                              {getUITranslation("openForm", currentLanguage)}
                            </DropdownMenuItem>
                          </>
                        )}
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
              <CardContent>
                {/* QR Code and Language Section */}
                <div
                  className={`flex items-center gap-4 mb-4 p-3 bg-gray-50 rounded-lg ${isRTLLanguage ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handleQRClick(form, selectedLang)}
                  >
                    <QRCodeDisplay text={shareUrl} size={80} />
                  </div>
                  <div className="flex-1 space-y-2">
                    {/* Language Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full justify-between bg-transparent">
                          <span className="flex items-center gap-2">
                            <span>{selectedLangInfo.flag}</span>
                            <span>{selectedLangInfo.name}</span>
                          </span>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-48">
                        {supportedLanguages.map((langCode) => {
                          const langInfo = getLanguageInfo(langCode)
                          return (
                            <DropdownMenuItem
                              key={langCode}
                              onClick={() => setFormLanguage(form.id, langCode)}
                              className={selectedLang === langCode ? "bg-blue-50" : ""}
                            >
                              <span className="flex items-center gap-2">
                                <span>{langInfo.flag}</span>
                                <span>{langInfo.name}</span>
                              </span>
                            </DropdownMenuItem>
                          )
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Share Link */}
                    <div className="flex items-center gap-1">
                      <Input value={shareUrl} readOnly className="text-xs h-8 bg-white" />
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 flex-shrink-0 bg-transparent"
                        onClick={() => handleCopyLink(shareUrl)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className={`flex gap-2 ${isRTLLanguage ? "flex-row-reverse" : ""}`}>
                  <Button variant="outline" size="sm" onClick={() => onEditForm(form.id)} className="flex-1">
                    <Edit className={`w-4 h-4 ${isRTLLanguage ? "ml-2 mr-0" : "mr-2"}`} />
                    {getUITranslation("edit", currentLanguage)}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onViewResponses(form.id)} className="flex-1">
                    <BarChart3 className={`w-4 h-4 ${isRTLLanguage ? "ml-2 mr-0" : "mr-2"}`} />
                    {getUITranslation("responses", currentLanguage)} ({form.responseCount})
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
    </div>
  )
}