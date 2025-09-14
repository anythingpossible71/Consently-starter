"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, Edit, Eye, BarChart3, Copy, Trash2 } from "lucide-react"

interface HomepageProps {
  currentLanguage: string
  onCreateForm: () => void
  onEditForm: (formId: string) => void
  onViewResponses: (formId: string) => void
}

export function Homepage({ currentLanguage, onCreateForm, onEditForm, onViewResponses }: HomepageProps) {
  const [searchTerm, setSearchTerm] = useState("")
  
  // Mock form data
  const forms = [
    {
      id: "1",
      title: "Contact Form",
      description: "Basic contact information form",
      status: "published" as const,
      responseCount: 25,
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-20"),
    },
    {
      id: "2", 
      title: "Survey Form",
      description: "Customer satisfaction survey",
      status: "draft" as const,
      responseCount: 0,
      createdAt: new Date("2024-01-18"),
      updatedAt: new Date("2024-01-18"),
    }
  ]

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Forms</h1>
            <p className="text-gray-600 mt-1">Create, edit, and manage your forms</p>
          </div>
          <Button onClick={onCreateForm} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Form
          </Button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search forms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <Card key={form.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{form.title}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{form.description}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    form.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {form.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{form.responseCount} responses</span>
                  <span>Updated {form.updatedAt.toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEditForm(form.id)}
                    className="flex-1"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewResponses(form.id)}
                  >
                    <BarChart3 className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
