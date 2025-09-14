"use client"

import { useState } from "react"
import { AppHeader } from "@/components/form-builder/app-header"
import { SidebarMenu } from "@/components/form-builder/sidebar-menu"
import { Homepage } from "@/components/form-builder/homepage"
import { FormBuilder } from "@/components/form-builder/form-builder"
import { FormResponses } from "@/components/form-builder/form-responses"
import type { AppPage, User } from "@/types/form-builder/app-types"

export function AppContainer() {
  const [currentPage, setCurrentPage] = useState<AppPage>("home")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentFormId, setCurrentFormId] = useState<string | null>(null)

  // Mock user data - in real app, this would come from authentication
  const [user] = useState<User>({
    id: "1",
    email: "user@example.com",
    name: "John Doe",
    avatar: undefined,
  })

  const handleNavigate = (page: AppPage, formId?: string) => {
    setCurrentPage(page)
    setCurrentFormId(formId || null)
    setIsSidebarOpen(false)
  }

  const handleLogout = () => {
    // Implement logout logic
    console.log("Logout")
  }

  const handleCreateForm = () => {
    setCurrentFormId(null) // New form
    setCurrentPage("editor")
  }

  const handleEditForm = (formId: string) => {
    setCurrentFormId(formId)
    setCurrentPage("editor")
  }

  const handleViewResponses = (formId: string) => {
    setCurrentFormId(formId)
    setCurrentPage("responses")
  }

  const handleNavigateHome = () => {
    setCurrentPage("home")
    setCurrentFormId(null)
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
            />
          )}

          {currentPage === "editor" && (
            <div className="h-full">
              <FormBuilder onNavigateHome={handleNavigateHome} />
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
