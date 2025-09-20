"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, Calendar, User, Globe, File } from "lucide-react"
import type { FormData } from "@/types/form-builder/app-types"

interface FormResponse {
  id: string
  createdAt: string
  data: Record<string, any> | {
    formData: Record<string, any>
    language: string
    submittedAt: string
    userAgent?: string
    ipAddress?: string
  }
}

interface FormResponsesProps {
  form: FormData
  onClose: () => void
}

export function FormResponses({ form, onClose }: FormResponsesProps) {
  const [responses, setResponses] = useState<FormResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedResponse, setSelectedResponse] = useState<FormResponse | null>(null)

  // Helper function to get form data from response
  const getFormData = (response: FormResponse): Record<string, any> => {
    // Check if data has formData property (newer structure)
    if (response.data && typeof response.data === 'object' && 'formData' in response.data) {
      return response.data.formData || {}
    }
    // Otherwise, data is the form data directly (older structure)
    return response.data || {}
  }


  useEffect(() => {
    fetchResponses()
  }, [form.id])

  const fetchResponses = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/forms/${form.id}/responses`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch responses')
      }
      
      const result = await response.json()
      setResponses(result.responses || [])
    } catch (error) {
      console.error('Error fetching responses:', error)
      setError('Failed to load responses')
    } finally {
      setIsLoading(false)
    }
  }

  const exportToCSV = () => {
    if (responses.length === 0) return

    // Get all unique field IDs from all responses
    const allFieldIds = new Set<string>()
    responses.forEach(response => {
      const formData = getFormData(response)
      Object.keys(formData).forEach(fieldId => {
        allFieldIds.add(fieldId)
      })
    })

    // Create CSV headers
    const headers = ['Submission Date', 'Language', 'IP Address', ...Array.from(allFieldIds)]
    
    // Create CSV rows
    const rows = responses.map(response => {
      const formData = getFormData(response)
      const row = [
        new Date(response.createdAt).toLocaleString(),
        response.data.language || 'Unknown',
        response.data.ipAddress || 'Unknown',
        ...Array.from(allFieldIds).map(fieldId => formData[fieldId] || '')
      ]
      return row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    })

    // Combine headers and rows
    const csvContent = [headers.map(h => `"${h}"`).join(','), ...rows].join('\n')
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${form.title}-responses.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getFieldLabel = (fieldId: string) => {
    const field = form.fields.find(f => f.id === fieldId)
    return field?.label || fieldId
  }

  // Helper function to check if a value is a base64 image
  const isBase64Image = (value: any): boolean => {
    if (typeof value !== 'string') return false
    return value.startsWith('data:image/') && value.includes('base64,')
  }

  // Helper function to render field value (text, image, or files)
  const renderFieldValue = (value: any) => {
    if (isBase64Image(value)) {
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
    
    // Handle array of files (for file-upload field)
    if (Array.isArray(value) && value.every(item => typeof item === 'string' && isBase64Image(item))) {
      return (
        <div className="mt-2 space-y-2">
          {value.map((fileData, index) => {
            const { mimeType, extension } = getFileInfo(fileData)
            const isImage = mimeType.startsWith('image/')
            
            return (
              <div key={index} className="flex items-center gap-3 p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex-shrink-0">
                  {isImage ? (
                    <img
                      src={fileData}
                      alt={`Uploaded file ${index + 1}`}
                      className="w-8 h-8 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => openBase64File(fileData)}
                      title="Click to open in new tab"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-100 rounded border flex items-center justify-center">
                      <File className="w-4 h-4 text-gray-500" />
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
          })}
        </div>
      )
    }
    
    return <p className="text-sm text-gray-600 truncate">{String(value)}</p>
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

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading responses...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchResponses}>Try Again</Button>
        </div>
      </div>
    )
  }

  if (responses.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Eye className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">No Responses Yet</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            This form hasn't received any submissions yet. Once people start filling out your form, 
            their responses will appear here.
          </p>
          <div className="space-y-3">
            <Button onClick={onClose} className="w-full">
              Back to Form
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.open(`/forms/public/${form.id}`, '_blank')}
              className="w-full"
            >
              <Globe className="w-4 h-4 mr-2" />
              Preview Form
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Form Responses</h2>
          <p className="text-gray-600">{responses.length} response{responses.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportToCSV} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={onClose}>Back to Form</Button>
        </div>
      </div>

      {/* Responses List */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {responses.map((response) => (
            <Card 
              key={response.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedResponse(response)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <span className="font-medium">
                      {new Date(response.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      <Globe className="w-3 h-3 mr-1" />
                      {(response.data.language || 'en').toUpperCase()}
                    </Badge>
                    <Badge variant="outline">
                      <User className="w-3 h-3 mr-1" />
                      {response.data.ipAddress || 'Unknown IP'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(() => {
                    const formData = getFormData(response)
                    return Object.entries(formData).slice(0, 6).map(([fieldId, value]) => (
                      <div key={fieldId} className="space-y-1">
                        <p className="text-sm font-medium text-gray-700">
                          {getFieldLabel(fieldId)}
                        </p>
                        {renderFieldValue(value)}
                      </div>
                    ))
                  })()}
                  {Object.keys(getFormData(response)).length === 0 && (
                    <div className="col-span-full text-center text-gray-500 py-4">
                      No form data available
                    </div>
                  )}
                  {Object.keys(getFormData(response)).length > 6 && (
                    <div className="text-sm text-gray-500">
                      +{Object.keys(getFormData(response)).length - 6} more fields
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Response Detail Modal */}
      {selectedResponse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Response Details</CardTitle>
                <p className="text-sm text-gray-600">
                  Submitted on {new Date(selectedResponse.createdAt).toLocaleString()}
                </p>
              </div>
              <Button variant="outline" onClick={() => setSelectedResponse(null)}>
                Close
              </Button>
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-[60vh]">
              <div className="space-y-6">
                {Object.entries(getFormData(selectedResponse)).map(([fieldId, value]) => (
                  <div key={fieldId} className="border-b pb-4">
                    <h4 className="font-medium text-gray-900 mb-2">
                      {getFieldLabel(fieldId)}
                    </h4>
                    {isBase64Image(value) || (Array.isArray(value) && value.every(item => typeof item === 'string' && isBase64Image(item))) ? (
                      <div className="mt-2">
                        {Array.isArray(value) ? (
                          <div className="space-y-3">
                            {value.map((fileData, index) => {
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
                            })}
                          </div>
                        ) : (
                          <img 
                            src={value} 
                            alt="Signature" 
                            className="max-w-full h-auto border border-gray-200 rounded cursor-pointer hover:opacity-80 transition-opacity"
                            style={{ maxHeight: '300px' }}
                            onClick={() => openBase64File(value)}
                            title="Click to open in new tab"
                          />
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {String(value)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}