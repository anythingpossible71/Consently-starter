"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AppHeader } from "@/components/form-builder/app-header"
import { SidebarMenu } from "@/components/form-builder/sidebar-menu"
import { Homepage } from "@/components/form-builder/homepage"
import { FormBuilder } from "@/components/form-builder/form-builder"
import { FormResponses } from "@/components/form-builder/form-responses"
import type { AppPage, User, FormData } from "@/types/form-builder/app-types"
import { getForms, getForm } from "@/app/actions/forms"

interface AppContainerProps {
  initialForms?: FormData[]
  user?: User
}

export function AppContainer({ initialForms = [], user: initialUser }: AppContainerProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [forms, setForms] = useState<FormData[]>(initialForms)
  const [isLoadingForms, setIsLoadingForms] = useState(false)
  const [currentForm, setCurrentForm] = useState<FormData | null>(null)
  const [isLoadingForm, setIsLoadingForm] = useState(false)

  // Function to refresh forms data
  const refreshForms = async () => {
    setIsLoadingForms(true)
    try {
      const result = await getForms()
      if (result.success && result.forms) {
        setForms(result.forms)
      }
    } catch (error) {
      console.error('Error refreshing forms:', error)
    } finally {
      setIsLoadingForms(false)
    }
  }

  // Get current state from URL
  const currentPage = (searchParams.get('page') as AppPage) || 'home'
  const currentFormId = searchParams.get('formId')
  const isPreview = searchParams.get('preview') === 'true'
  const isResponses = searchParams.get('responses') === 'true'

  // Use the user from props or fallback to mock data
  const [user] = useState<User | null>(initialUser || null)

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
    // Redirect to sign out
    router.push('/api/auth/signout')
  }

  const handleCreateForm = () => {
    router.push('/forms?page=editor')
  }

  const handleEditForm = (formId: string) => {
    router.push(`/forms?page=editor&formId=${formId}`)
  }

  const handleViewResponses = async (formId: string) => {
    setIsLoadingForm(true)
    try {
      const result = await getForm(formId)
      if (result.success && result.form) {
        setCurrentForm(result.form)
        router.push(`/forms?page=responses&formId=${formId}`)
      }
    } catch (error) {
      console.error('Error loading form:', error)
    } finally {
      setIsLoadingForm(false)
    }
  }

  const handleNavigateHome = () => {
    router.push('/forms?page=home')
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

        <main className="flex-1 overflow-y-auto">
          {currentPage === "home" && (
            <Homepage
              currentLanguage="en"
              onCreateForm={handleCreateForm}
              onEditForm={handleEditForm}
              onViewResponses={handleViewResponses}
              forms={forms}
              onRefreshForms={refreshForms}
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
                isResponses={isResponses}
                onResponsesToggle={(responses: boolean) => {
                  const params = new URLSearchParams(searchParams.toString())
                  if (responses) {
                    params.set('responses', 'true')
                  } else {
                    params.delete('responses')
                  }
                  router.push(`/forms?${params.toString()}`)
                }}
              />
            </div>
          )}

          {currentPage === "responses" && currentForm && (
            <div className="h-full">
              <FormResponses
                form={currentForm}
                onClose={() => {
                  setCurrentForm(null)
                  handleNavigateHome()
                }}
              />
            </div>
          )}

          {currentPage === "responses" && !currentForm && isLoadingForm && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading form...</p>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
