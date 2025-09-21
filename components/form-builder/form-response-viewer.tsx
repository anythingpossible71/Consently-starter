"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { File, Calendar, User, Globe } from "lucide-react"
import type { FormData } from "@/types/form-builder/app-types"
import { getFormTranslation, isRTL } from "@/utils/form-builder/translations"

interface FormResponse {
  id: string
  createdAt: Date
  data: Record<string, any> | {
    formData: Record<string, any>
    language: string
    submittedAt: string
    userAgent?: string
    ipAddress?: string
  }
}

interface FormResponseViewerProps {
  form: FormData
  response: FormResponse
}

export function FormResponseViewer({ form, response }: FormResponseViewerProps) {
  const currentLanguage = form.config?.language || "en"
  const isRTLLanguage = isRTL(currentLanguage)

  // Helper function to get form data from response
  const getFormData = (response: FormResponse): Record<string, any> => {
    if (response.data && typeof response.data === 'object' && 'formData' in response.data) {
      return (response.data as { formData: Record<string, any> }).formData
    }
    return response.data as Record<string, any>
  }

  // Helper function to check if a value is a base64 image
  const isBase64Image = (value: any): boolean => {
    if (typeof value !== 'string') return false
    return value.startsWith('data:image/') && value.includes('base64,')
  }

  // Helper function to get file info from base64 data
  const getFileInfo = (fileData: string) => {
    const match = fileData.match(/data:([^;]+);base64,(.+)/)
    if (match) {
      const mimeType = match[1]
      const extension = mimeType.split('/')[1] || 'file'
      return { mimeType, extension }
    }
    return { mimeType: 'unknown', extension: 'file' }
  }

  // Helper function to download base64 file
  const downloadBase64File = (fileData: string, filename: string) => {
    const link = document.createElement('a')
    link.href = fileData
    link.download = filename
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Helper function to open base64 file in new tab
  const openBase64File = (fileData: string) => {
    const newWindow = window.open()
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head><title>File Preview</title></head>
          <body style="margin:0; padding:20px; text-align:center;">
            <img src="${fileData}" style="max-width:100%; max-height:100vh; object-fit:contain;" />
          </body>
        </html>
      `)
      newWindow.document.close()
    }
  }

  // Helper function to render field value
  const renderFieldValue = (field: any, value: any) => {
    if (!value) {
      return <span className="text-gray-400 italic">No response</span>
    }

    // Handle signature fields
    if (field.type === 'signature' && isBase64Image(value)) {
      return (
        <div className="mt-2">
          <img 
            src={value} 
            alt="Signature" 
            className="max-w-full h-auto border border-gray-200 rounded cursor-pointer hover:opacity-80 transition-opacity"
            style={{ maxHeight: '200px' }}
            onClick={() => openBase64File(value)}
            title="Click to open in new tab"
          />
        </div>
      )
    }

    // Handle file upload fields
    if (field.type === 'file-upload' && Array.isArray(value)) {
      return (
        <div className="mt-2 space-y-2">
          {value.map((fileData, index) => {
            if (typeof fileData === 'string' && isBase64Image(fileData)) {
              const { mimeType, extension } = getFileInfo(fileData)
              const isImage = mimeType.startsWith('image/')
              
              return (
                <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex-shrink-0">
                    {isImage ? (
                      <img
                        src={fileData}
                        alt={`Uploaded file ${index + 1}`}
                        className="w-12 h-12 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => openBase64File(fileData)}
                        title="Click to open in new tab"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center">
                        <File className="w-6 h-6 text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => {
                        if (isImage) {
                          openBase64File(fileData)
                        } else {
                          downloadBase64File(fileData, `File ${index + 1}.${extension}`)
                        }
                      }}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer bg-transparent border-none p-0"
                      title={isImage ? "Click to open in new tab" : "Click to download"}
                    >
                      File {index + 1}.{extension}
                    </button>
                    <p className="text-xs text-gray-500">{mimeType}</p>
                  </div>
                </div>
              )
            }
            return null
          })}
        </div>
      )
    }

    // Handle other field types
    if (Array.isArray(value)) {
      return (
        <div className="space-y-1">
          {value.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {String(item)}
              </Badge>
            </div>
          ))}
        </div>
      )
    }

    return (
      <p className="text-gray-900 whitespace-pre-wrap">
        {String(value)}
      </p>
    )
  }

  const formData = getFormData(response)
  const visibleFields = form.fields.filter(field => field.type !== 'submit')

  return (
    <div className="space-y-6">
      {/* Response Metadata */}
      <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-700">
            {new Date(response.createdAt).toLocaleString()}
          </span>
        </div>
        {response.data && typeof response.data === 'object' && 'language' in response.data && (
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-gray-500" />
            <Badge variant="secondary">
              {(response.data as any).language?.toUpperCase() || 'EN'}
            </Badge>
          </div>
        )}
        {response.data && typeof response.data === 'object' && 'ipAddress' in response.data && (
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">
              {(response.data as any).ipAddress || 'Unknown IP'}
            </span>
          </div>
        )}
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {visibleFields.map((field) => {
          const fieldValue = formData[field.id]
          const fieldLabel = field.label || getFormTranslation("formElements", "untitledField", currentLanguage)
          
          return (
            <Card key={field.id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      {fieldLabel}
                    </h3>
                    {field.required && (
                      <Badge variant="destructive" className="text-xs">
                        Required
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-gray-700">
                    {renderFieldValue(field, fieldValue)}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* No responses message */}
      {visibleFields.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No form fields found</p>
        </div>
      )}
    </div>
  )
}
