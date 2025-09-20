"use client";

import * as React from "react";
import { Moon, Sun, Palette, Waves, Trees, Clock } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

import { getThemesByCategory } from "@/themes";

// Icon mapping for dynamic icons
const iconMap = {
  Sun,
  Moon,
  Palette,
  Waves,
  Trees,
  Clock,
} as const;

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  // Only show forest theme to prevent theme switching
  const forestTheme = { name: "forest", label: "Forest Green", icon: "Trees", emoji: "🌲" };

  const getIconComponent = (iconName?: string) => {
    if (!iconName || !(iconName in iconMap)) return Palette;
    return iconMap[iconName as keyof typeof iconMap];
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Only show Forest theme */}
        <DropdownMenuItem disabled>
          <Trees className="mr-2 h-4 w-4" />
          <span className="flex items-center gap-1">
            <span>🌲</span>
            Forest Green (Active)
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
