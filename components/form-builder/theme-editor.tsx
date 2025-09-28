"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Palette,
  Type,
  MousePointer,
} from "lucide-react";

interface ThemeEditorProps {
  formConfig: FormConfig;
  onFormConfigChange: (updates: Partial<FormConfig>) => void;
}

// Available font families
const FONT_OPTIONS = [
  { value: "Inter, system-ui, sans-serif", label: "Inter (Modern)" },
  { value: "system-ui, -apple-system, sans-serif", label: "System UI" },
  { value: "Helvetica, Arial, sans-serif", label: "Helvetica" },
  { value: "Georgia, serif", label: "Georgia (Serif)" },
  { value: "Times New Roman, serif", label: "Times New Roman" },
  { value: "Monaco, Consolas, monospace", label: "Monaco (Monospace)" },
  { value: "Roboto, sans-serif", label: "Roboto" },
  { value: "Open Sans, sans-serif", label: "Open Sans" },
];

export function ThemeEditor({ formConfig, onFormConfigChange }: ThemeEditorProps) {
  const handleBackgroundColorChange = (color: string) => {
    onFormConfigChange({ backgroundColor: color });
  };

  const handleFontFamilyChange = (font: string) => {
    onFormConfigChange({ formFontFamily: font });
  };

  const handleButtonColorChange = (color: string) => {
    onFormConfigChange({ submitButtonColor: color });
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center">
          <Palette className="w-4 h-4 text-indigo-600 mr-2" />
          Style Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Background Color Control */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-gray-600" />
            <Label className="text-sm font-medium text-gray-700">Background Color</Label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={formConfig.backgroundColor}
              onChange={(e) => handleBackgroundColorChange(e.target.value)}
              className="w-10 h-8 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={formConfig.backgroundColor}
              onChange={(e) => handleBackgroundColorChange(e.target.value)}
              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
              placeholder="#ffffff"
            />
          </div>
        </div>

        {/* Font Family Control */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-gray-600" />
            <Label className="text-sm font-medium text-gray-700">Font Family</Label>
          </div>
          <Select value={formConfig.formFontFamily} onValueChange={handleFontFamilyChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
              {FONT_OPTIONS.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  <span style={{ fontFamily: font.value }}>{font.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Submit Button Color Control */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MousePointer className="w-4 h-4 text-gray-600" />
            <Label className="text-sm font-medium text-gray-700">Submit Button Color</Label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={formConfig.submitButtonColor}
              onChange={(e) => handleButtonColorChange(e.target.value)}
              className="w-10 h-8 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={formConfig.submitButtonColor}
              onChange={(e) => handleButtonColorChange(e.target.value)}
              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
              placeholder="#2563eb"
            />
          </div>
        </div>

        <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-200">
          Changes are saved when you publish
        </div>
      </CardContent>
    </Card>
  );
}