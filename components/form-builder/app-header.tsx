"use client"

import { Button } from "@/components/ui/button"
import { Menu, LogOut, Home } from "lucide-react"
import type { User } from "@/types/form-builder/app-types"

interface AppHeaderProps {
  currentLanguage: string
  user: User | null
  onMenuToggle: () => void
  onNavigateHome: () => void
  onLogout: () => void
}

export function AppHeader({ currentLanguage, user, onMenuToggle, onNavigateHome, onLogout }: AppHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onMenuToggle}>
            <Menu className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onNavigateHome}>
            <Home className="w-5 h-5 mr-2" />
            Form Builder
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{user?.name}</span>
          <Button variant="ghost" size="sm" onClick={onLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
