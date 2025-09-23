"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Eye, Calendar, User, Globe, Filter, Settings, ChevronLeft, ChevronRight } from "lucide-react"
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

interface FormResponsesTableProps {
  form: FormData
  onClose: () => void
}

interface ViewSettings {
  visibleFields: string[]
  tableSortField: string | null
  tableSortOrder: 'asc' | 'desc' | null
}

export function FormResponsesTable({ form, onClose }: FormResponsesTableProps) {
  const [responses, setResponses] = useState<FormResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewSettings, setViewSettings] = useState<ViewSettings>({
    visibleFields: [],
    tableSortField: null,
    tableSortOrder: null
  })
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const responsesPerPage = 5

  // Helper function to get form data from response
  const getFormData = (response: FormResponse): Record<string, any> => {
    if (response.data && typeof response.data === 'object' && 'formData' in response.data) {
      return (response.data as { formData: Record<string, any> }).formData
    }
    return response.data as Record<string, any>
  }

  // Helper function to get field label
  const getFieldLabel = (fieldId: string) => {
    const field = form.fields.find(f => f.id === fieldId)
    return field?.label || fieldId
  }

  // Helper function to render cell value
  const renderCellValue = (value: any, fieldType?: string) => {
    if (!value) {
      return <span className="text-gray-400 italic">-</span>
    }

    if (Array.isArray(value)) {
      const fullText = value.join(', ')
      return (
        <div 
          className="flex flex-wrap gap-1 max-w-[200px]" 
          title={fullText}
        >
          {value.slice(0, 2).map((item, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {String(item).substring(0, 20)}
              {String(item).length > 20 ? '...' : ''}
            </Badge>
          ))}
          {value.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{value.length - 2} more
            </Badge>
          )}
        </div>
      )
    }

    const stringValue = String(value)
    const maxLength = 30 // Reduced from 50 for better table layout
    
    if (stringValue.length > maxLength) {
      return (
        <span 
          className="block truncate max-w-[200px] cursor-help" 
          title={stringValue}
        >
          {stringValue.substring(0, maxLength)}...
        </span>
      )
    }

    return <span className="block truncate max-w-[200px]">{stringValue}</span>
  }

  // Load responses
  useEffect(() => {
    const loadResponses = async () => {
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

    loadResponses()
  }, [form.id])

  // Load view settings
  useEffect(() => {
    const loadViewSettings = async () => {
      try {
        const response = await fetch(`/api/forms/${form.id}/view-settings`)
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            setViewSettings(result.settings)
          }
        }
      } catch (error) {
        console.error('Error loading view settings:', error)
      }
    }

    loadViewSettings()
  }, [form.id])

  // Reset to first page when responses change
  useEffect(() => {
    setCurrentPage(1)
  }, [responses.length])

  // Save view settings
  const saveViewSettings = async (newSettings: ViewSettings) => {
    try {
      const response = await fetch(`/api/forms/${form.id}/view-settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setViewSettings(result.settings)
        }
      }
    } catch (error) {
      console.error('Error saving view settings:', error)
    }
  }

  // Export to CSV
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

    // Use visible fields if set, otherwise use all fields
    const fieldsToExport = viewSettings.visibleFields.length > 0 
      ? viewSettings.visibleFields 
      : Array.from(allFieldIds)

    // Create CSV headers
    const headers = ['Submission Date', 'Language', 'IP Address', ...fieldsToExport.map(id => getFieldLabel(id))]
    
    // Create CSV rows
    const rows = responses.map(response => {
      const formData = getFormData(response)
      const row = [
        new Date(response.createdAt).toLocaleString(),
        response.data.language || 'Unknown',
        response.data.ipAddress || 'Unknown',
        ...fieldsToExport.map(fieldId => formData[fieldId] || '')
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

  // Handle row click
  const handleRowClick = (responseId: string) => {
    const url = `/forms/${form.id}/responses/${responseId}`
    window.open(url, '_blank')
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
          <Button onClick={onClose}>Back to Form</Button>
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

  // Get all available fields from both form definition and response data
  const allFieldIds = new Set<string>()
  
  // First, add all fields from the form definition
  form.fields.forEach(field => {
    if (field.type !== 'submit' && field.type !== 'heading' && field.type !== 'text-block') {
      allFieldIds.add(field.id)
    }
  })
  
  // Then, add any additional fields that might exist in responses but not in form definition
  responses.forEach(response => {
    const formData = getFormData(response)
    Object.keys(formData).forEach(fieldId => {
      allFieldIds.add(fieldId)
    })
  })

  // Use visible fields if set, otherwise show all fields
  const fieldsToShow = viewSettings.visibleFields.length > 0 
    ? viewSettings.visibleFields 
    : Array.from(allFieldIds)

  // Pagination logic
  const totalPages = Math.ceil(responses.length / responsesPerPage)
  const startIndex = (currentPage - 1) * responsesPerPage
  const endIndex = startIndex + responsesPerPage
  const paginatedResponses = responses.slice(startIndex, endIndex)

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Form Responses</h2>
          <p className="text-sm text-gray-600">
            {responses.length} response{responses.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilterModal(true)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter Fields
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportToCSV}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      {/* Table Container with Horizontal Scroll */}
      <div className="flex-1 overflow-auto px-6">
        <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <Table className="w-full table-fixed">
            <TableHeader>
              <TableRow className="bg-white">
                <TableHead className="sticky left-0 bg-white z-10 w-[200px] border-r border-gray-200">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Submitted
                  </div>
                </TableHead>
                <TableHead className="w-[100px] bg-white border-r border-gray-200">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Language
                  </div>
                </TableHead>
                <TableHead className="w-[120px] bg-white border-r border-gray-200">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    IP Address
                  </div>
                </TableHead>
                {fieldsToShow.map(fieldId => (
                  <TableHead key={fieldId} className="w-auto bg-white border-r border-gray-200 last:border-r-0">
                    {getFieldLabel(fieldId)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedResponses.map((response) => {
                const formData = getFormData(response)
                
                return (
                  <TableRow 
                    key={response.id}
                    className="cursor-pointer hover:bg-gray-50 bg-white"
                    onClick={() => handleRowClick(response.id)}
                  >
                    <TableCell className="sticky left-0 bg-white z-10 font-medium w-[200px] border-r border-gray-200">
                      {new Date(response.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="w-[100px] bg-white border-r border-gray-200">
                      <Badge variant="secondary">
                        {(response.data as any).language || 'EN'}
                      </Badge>
                    </TableCell>
                    <TableCell className="w-[120px] bg-white border-r border-gray-200">
                      <span className="text-sm text-gray-600">
                        {(response.data as any).ipAddress || 'Unknown'}
                      </span>
                    </TableCell>
                    {fieldsToShow.map(fieldId => {
                      const field = form.fields.find(f => f.id === fieldId)
                      return (
                        <TableCell key={fieldId} className="w-auto bg-white border-r border-gray-200 last:border-r-0 max-w-[200px]">
                          <div className="truncate">
                            {renderCellValue(formData[fieldId], field?.type)}
                          </div>
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, responses.length)} of {responses.length} responses
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Filter Table Fields
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-[60vh]">
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Select which fields to display in the table view. Leave empty to show all fields.
                </p>
                <div className="space-y-2">
                  {Array.from(allFieldIds).map(fieldId => {
                    const isSelected = viewSettings.visibleFields.includes(fieldId)
                    return (
                      <label key={fieldId} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            const newVisibleFields = e.target.checked
                              ? [...viewSettings.visibleFields, fieldId]
                              : viewSettings.visibleFields.filter(id => id !== fieldId)
                            
                            const newSettings = {
                              ...viewSettings,
                              visibleFields: newVisibleFields
                            }
                            setViewSettings(newSettings)
                            saveViewSettings(newSettings)
                          }}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">{getFieldLabel(fieldId)}</span>
                      </label>
                    )
                  })}
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const newSettings = {
                        ...viewSettings,
                        visibleFields: []
                      }
                      setViewSettings(newSettings)
                      saveViewSettings(newSettings)
                    }}
                  >
                    Clear All
                  </Button>
                  <Button
                    onClick={() => {
                      const newSettings = {
                        ...viewSettings,
                        visibleFields: Array.from(allFieldIds)
                      }
                      setViewSettings(newSettings)
                      saveViewSettings(newSettings)
                    }}
                  >
                    Select All
                  </Button>
                  <Button onClick={() => setShowFilterModal(false)}>
                    Done
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
