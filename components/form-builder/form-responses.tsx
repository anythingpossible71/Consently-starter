"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, Calendar, User, Globe } from "lucide-react"
import type { FormData } from "@/types/form-builder/app-types"

interface FormResponse {
  id: string
  createdAt: string
  data: {
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
      Object.keys(response.data.formData).forEach(fieldId => {
        allFieldIds.add(fieldId)
      })
    })

    // Create CSV headers
    const headers = ['Submission Date', 'Language', 'IP Address', ...Array.from(allFieldIds)]
    
    // Create CSV rows
    const rows = responses.map(response => {
      const row = [
        new Date(response.createdAt).toLocaleString(),
        response.data.language,
        response.data.ipAddress || 'Unknown',
        ...Array.from(allFieldIds).map(fieldId => response.data.formData[fieldId] || '')
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
        <div className="text-center">
          <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Responses Yet</h3>
          <p className="text-gray-600 mb-4">
            This form hasn't received any submissions yet.
          </p>
          <Button onClick={onClose}>Back to Form</Button>
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
                      {response.data.language.toUpperCase()}
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
                  {Object.entries(response.data.formData).slice(0, 6).map(([fieldId, value]) => (
                    <div key={fieldId} className="space-y-1">
                      <p className="text-sm font-medium text-gray-700">
                        {getFieldLabel(fieldId)}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {String(value)}
                      </p>
                    </div>
                  ))}
                  {Object.keys(response.data.formData).length > 6 && (
                    <div className="text-sm text-gray-500">
                      +{Object.keys(response.data.formData).length - 6} more fields
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
                {Object.entries(selectedResponse.data.formData).map(([fieldId, value]) => (
                  <div key={fieldId} className="border-b pb-4">
                    <h4 className="font-medium text-gray-900 mb-2">
                      {getFieldLabel(fieldId)}
                    </h4>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {String(value)}
                    </p>
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