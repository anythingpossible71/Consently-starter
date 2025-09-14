"use client"

import { Button } from "@/components/ui/button"
import { Home, Edit, BarChart3, X } from "lucide-react"
import type { AppPage } from "@/types/form-builder/app-types"

interface SidebarMenuProps {
  isOpen: boolean
  onClose: () => void
  currentPage: AppPage
  onNavigate: (page: AppPage) => void
  currentLanguage: string
}

export function SidebarMenu({ isOpen, onClose, currentPage, onNavigate, currentLanguage }: SidebarMenuProps) {
  const menuItems = [
    { id: "home" as AppPage, label: "Home", icon: Home },
    { id: "editor" as AppPage, label: "Editor", icon: Edit },
    { id: "responses" as AppPage, label: "Responses", icon: BarChart3 },
  ]

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      )}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Menu</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    onNavigate(item.id)
                    onClose()
                  }}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              )
            })}
          </nav>
        </div>
      </aside>
    </>
  )
}
