"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Menu, LogOut, Home, User } from "lucide-react"
import type { User as UserType } from "@/types/form-builder/app-types"

interface AppHeaderProps {
  currentLanguage: string
  user: UserType | null
  onMenuToggle: () => void
  onNavigateHome: () => void
  onLogout: () => void
}

export function AppHeader({ currentLanguage, user, onMenuToggle, onNavigateHome, onLogout }: AppHeaderProps) {
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)

  const getUserInitials = (name: string | null) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
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
          
          <div className="flex items-center gap-3">
            {user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsUserDialogOpen(true)}
                className="flex items-center gap-2 p-2"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar ?? undefined} alt={user.name ?? undefined} />
                  <AvatarFallback className="text-xs">
                    {getUserInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-700 hidden sm:inline">{user.name || user.email}</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* User Dialog */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatar ?? undefined} alt={user?.name ?? undefined} />
                <AvatarFallback>
                  {user ? getUserInitials(user.name) : <User className="h-5 w-5" />}
                </AvatarFallback>
              </Avatar>
              User Account
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Name</label>
              <p className="text-sm text-gray-900">{user?.name || 'Not provided'}</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <p className="text-sm text-gray-900">{user?.email}</p>
            </div>
            
            <div className="pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsUserDialogOpen(false)
                  onLogout()
                }}
                className="w-full"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
