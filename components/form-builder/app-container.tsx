"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AppHeader } from "@/components/form-builder/app-header"
import { SidebarMenu } from "@/components/form-builder/sidebar-menu"
import { Homepage } from "@/components/form-builder/homepage"
import { FormBuilder } from "@/components/form-builder/form-builder"
import { FormResponses } from "@/components/form-builder/form-responses"
import type { AppPage, User, FormData } from "@/types/form-builder/app-types"
import { getForms } from "@/app/actions/forms"

interface AppContainerProps {
  initialForms?: FormData[]
}

export function AppContainer({ initialForms = [] }: AppContainerProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [forms, setForms] = useState<FormData[]>(initialForms)
  const [isLoadingForms, setIsLoadingForms] = useState(false)

  // Get current state from URL
  const currentPage = (searchParams.get('page') as AppPage) || 'home'
  const currentFormId = searchParams.get('formId')
  const isPreview = searchParams.get('preview') === 'true'

  // Mock user data - in real app, this would come from authentication
  const [user] = useState<User>({
    id: "1",
    email: "user@example.com",
    name: "John Doe",
    avatar: undefined,
  })

  // Forms are now passed as props from server component

  const handleNavigate = (page: AppPage, formId?: string) => {
    const params = new URLSearchParams()
    params.set('page', page)
    if (formId) {
      params.set('formId', formId)
    }
    router.push(`/forms?${params.toString()}`)
    setIsSidebarOpen(false)
  }

  const handleLogout = () => {
    // Implement logout logic
    console.log("Logout")
  }

  const handleCreateForm = () => {
    router.push('/forms?page=editor')
  }

  const handleEditForm = (formId: string) => {
    router.push(`/forms?page=editor&formId=${formId}`)
  }

  const handleViewResponses = (formId: string) => {
    router.push(`/forms?page=responses&formId=${formId}`)
  }

  const handleNavigateHome = () => {
    router.push('/forms?page=home')
  }

  const refreshForms = async () => {
    try {
      const result = await getForms()
      if (result.success) {
        setForms(result.forms)
      }
    } catch (error) {
      console.error('Error refreshing forms:', error)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarMenu
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        currentLanguage="en" // You can make this dynamic
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {currentPage !== "responses" && (
          <AppHeader
            currentLanguage="en" // You can make this dynamic
            user={user}
            onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            onNavigateHome={handleNavigateHome}
            onLogout={handleLogout}
          />
        )}

        <main className="flex-1 overflow-hidden">
          {currentPage === "home" && (
            <Homepage
              currentLanguage="en"
              onCreateForm={handleCreateForm}
              onEditForm={handleEditForm}
              onViewResponses={handleViewResponses}
              forms={forms}
            />
          )}

          {currentPage === "editor" && (
            <div className="h-full">
              <FormBuilder 
                onNavigateHome={() => {
                  handleNavigateHome()
                  refreshForms() // Refresh forms when navigating back
                }} 
                formId={currentFormId || undefined}
                isPreview={isPreview}
                onPreviewToggle={(preview: boolean) => {
                  const params = new URLSearchParams(searchParams.toString())
                  if (preview) {
                    params.set('preview', 'true')
                  } else {
                    params.delete('preview')
                  }
                  router.push(`/forms?${params.toString()}`)
                }}
              />
            </div>
          )}

          {currentPage === "responses" && currentFormId && (
            <FormResponses formId={currentFormId} currentLanguage="en" onBack={handleNavigateHome} />
          )}
        </main>
      </div>
    </div>
  )
}
