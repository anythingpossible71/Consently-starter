"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Palette,
  Type,
  MousePointer,
  Layout,
  Square,
  Settings,
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

// Font weight options
const FONT_WEIGHT_OPTIONS = [
  { value: "400", label: "Normal (400)" },
  { value: "500", label: "Medium (500)" },
  { value: "600", label: "Semi Bold (600)" },
  { value: "700", label: "Bold (700)" },
];

// Shadow presets
const SHADOW_PRESETS = [
  { value: "none", label: "None" },
  { value: "0 1px 3px 0 rgb(0 0 0 / 0.1)", label: "Small" },
  { value: "0 4px 6px -1px rgb(0 0 0 / 0.1)", label: "Medium" },
  { value: "0 10px 15px -3px rgb(0 0 0 / 0.1)", label: "Large" },
  { value: "0 25px 50px -12px rgb(0 0 0 / 0.25)", label: "Extra Large" },
];

// Color picker component
function ColorPicker({ value, onChange, label }: { value: string; onChange: (value: string) => void; label: string }) {
  // Ensure we have a valid color value
  const displayValue = value || "#ffffff";
  
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      <div className="flex items-center gap-2">
        <div 
          className="w-10 h-8 rounded border border-gray-300 cursor-pointer flex-shrink-0"
          style={{ backgroundColor: displayValue }}
          onClick={() => {
            const colorInput = document.createElement('input');
            colorInput.type = 'color';
            colorInput.value = displayValue;
            colorInput.onchange = (e) => {
              const target = e.target as HTMLInputElement;
              onChange(target.value);
            };
            colorInput.click();
          }}
        />
        <input
          type="text"
          value={displayValue}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
          placeholder="#ffffff"
        />
      </div>
    </div>
  );
}

// Slider component with number input
function SliderControl({ value, onChange, label, min = 0, max = 100, step = 1, unit = "px" }: {
  value: number;
  onChange: (value: number) => void;
  label: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseInt(e.target.value) || 0;
    const clampedValue = Math.min(Math.max(numValue, min), max);
    onChange(clampedValue);
  };

  const handleSliderChange = (newValue: number[]) => {
    if (newValue.length > 0) {
      onChange(newValue[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label className="text-sm font-medium text-gray-700">{label}</Label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={value}
            onChange={handleInputChange}
            min={min}
            max={max}
            step={step}
            className="w-16 px-2 py-1 text-sm border border-gray-300 rounded text-center"
          />
          <span className="text-sm text-gray-500">{unit}</span>
        </div>
      </div>
      <Slider
        value={[value]}
        onValueChange={handleSliderChange}
        min={min}
        max={max}
        step={step}
        className="w-full"
        onWheel={(e) => e.preventDefault()}
      />
    </div>
  );
}

export function ThemeEditor({ formConfig, onFormConfigChange }: ThemeEditorProps) {
  // State for toggles
  const [formBorderEnabled, setFormBorderEnabled] = useState(true);
  const [formBackgroundEnabled, setFormBackgroundEnabled] = useState(true);

  // State for all style values to make sliders interactive
  const [styleValues, setStyleValues] = useState({
    pageBackground: "#f8fafc",
    cardBackground: "#ffffff",
    cardBorderRadius: 12,
    cardPadding: 32,
    cardShadow: "0 10px 15px -3px rgb(15 23 42 / 0.08)",
    fieldGap: 20,
    sectionGap: 40,
    fontFamily: "Inter, system-ui, sans-serif",
    baseFontSize: 16,
    headingSize: 20,
    headingWeight: "600",
    labelSize: 15,
    labelWeight: "600",
    bodyTextColor: "#1f2937",
    headingColor: "#0f172a",
    labelColor: "#0f172a",
    helpTextColor: "#64748b",
    primaryColor: "#2563eb",
    errorColor: "#ef4444",
    successColor: "#10b981",
    warningColor: "#f59e0b",
    inputBackground: "#ffffff",
    inputTextColor: "#0f172a",
    inputBorderStyle: "solid",
    inputBorderColor: "#cbd5f5",
    inputBorderWidth: 1,
    focusBorderStyle: "solid",
    focusBorderColor: "#2563eb",
    focusBorderWidth: 2,
    focusRing: "0 0 0 3px rgba(37, 99, 235, 0.15)",
    inputHeight: 48,
    inputBorderRadius: 10,
    placeholderColor: "#94a3b8",
    primaryButtonBackground: "#2563eb",
    primaryButtonHover: "#1d4ed8",
    primaryButtonText: "#ffffff",
    buttonPadding: 12,
    buttonBorderRadius: 24,
    fileSurface: "#f1f5f9",
    fileHoverSurface: "#e2e8f0",
    signatureSurface: "#ecf4ff",
    phoneBorderStyle: "solid",
    phoneBorderColor: "#cbd5f5",
    phoneBorderWidth: 1,
  });

  // Handlers that update both local state and call the parent
  const handleColorChange = (property: string, value: string) => {
    setStyleValues(prev => ({ ...prev, [property]: value }));
    console.log(`Color change: ${property} = ${value}`);
  };

  const handleSliderChange = (property: string, value: number) => {
    setStyleValues(prev => ({ ...prev, [property]: value }));
    console.log(`Slider change: ${property} = ${value}`);
  };

  const handleSelectChange = (property: string, value: string) => {
    setStyleValues(prev => ({ ...prev, [property]: value }));
    console.log(`Select change: ${property} = ${value}`);
  };

  const handleToggleChange = (property: string, value: boolean) => {
    console.log(`Toggle change: ${property} = ${value}`);
  };

  return (
    <div className="space-y-4">
      {/* Layout Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center">
            <Layout className="w-4 h-4 text-indigo-600 mr-2" />
            Layout
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ColorPicker
            value={styleValues.pageBackground}
            onChange={(value) => handleColorChange("pageBackground", value)}
            label="Page Background"
          />
          
          {/* Form Background Toggle */}
            <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-gray-700">Form Background</Label>
              <Switch
              checked={formBackgroundEnabled}
              onCheckedChange={(checked) => {
                setFormBackgroundEnabled(checked);
                handleToggleChange("formBackground", checked);
              }}
              />
            </div>

          {formBackgroundEnabled && (
            <ColorPicker
              value={styleValues.cardBackground}
              onChange={(value) => handleColorChange("cardBackground", value)}
              label="Card Background"
            />
          )}

          {/* Form Border Toggle */}
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-gray-700">Form Border</Label>
            <Switch
              checked={formBorderEnabled}
              onCheckedChange={(checked) => {
                setFormBorderEnabled(checked);
                handleToggleChange("formBorder", checked);
              }}
                  />
                </div>

          {formBorderEnabled && (
            <SliderControl
              value={styleValues.cardBorderRadius}
              onChange={(value) => handleSliderChange("cardBorderRadius", value)}
              label="Card Border Radius"
              min={0}
              max={24}
              unit="px"
            />
          )}

          <SliderControl
            value={styleValues.cardPadding}
            onChange={(value) => handleSliderChange("cardPadding", value)}
            label="Card Padding"
            min={8}
            max={48}
            unit="px"
          />

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Card Shadow</Label>
            <Select value={styleValues.cardShadow} onValueChange={(value) => handleSelectChange("cardShadow", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select shadow" />
              </SelectTrigger>
              <SelectContent>
                {SHADOW_PRESETS.map((preset) => (
                  <SelectItem key={preset.value} value={preset.value}>
                    {preset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <SliderControl
            value={styleValues.fieldGap}
            onChange={(value) => handleSliderChange("fieldGap", value)}
            label="Field Gap"
            min={8}
            max={32}
            unit="px"
          />

          <SliderControl
            value={styleValues.sectionGap}
            onChange={(value) => handleSliderChange("sectionGap", value)}
            label="Section Gap"
            min={16}
            max={48}
            unit="px"
          />
        </CardContent>
      </Card>

      {/* Typography Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center">
            <Type className="w-4 h-4 text-indigo-600 mr-2" />
            Typography
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Font Family</Label>
            <Select value={styleValues.fontFamily} onValueChange={(value) => handleSelectChange("fontFamily", value)}>
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

          <SliderControl
            value={styleValues.baseFontSize}
            onChange={(value) => handleSliderChange("baseFontSize", value)}
            label="Base Font Size"
            min={12}
            max={20}
            unit="px"
          />

          <SliderControl
            value={styleValues.headingSize}
            onChange={(value) => handleSliderChange("headingSize", value)}
            label="Heading Size"
            min={16}
            max={32}
            unit="px"
          />

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Heading Weight</Label>
            <Select value={styleValues.headingWeight} onValueChange={(value) => handleSelectChange("headingWeight", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select weight" />
              </SelectTrigger>
              <SelectContent>
                {FONT_WEIGHT_OPTIONS.map((weight) => (
                  <SelectItem key={weight.value} value={weight.value}>
                    {weight.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <SliderControl
            value={styleValues.labelSize}
            onChange={(value) => handleSliderChange("labelSize", value)}
            label="Label Size"
            min={12}
            max={18}
            unit="px"
          />

            <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Label Weight</Label>
            <Select value={styleValues.labelWeight} onValueChange={(value) => handleSelectChange("labelWeight", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select weight" />
              </SelectTrigger>
              <SelectContent>
                {FONT_WEIGHT_OPTIONS.map((weight) => (
                  <SelectItem key={weight.value} value={weight.value}>
                    {weight.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
              </div>

          <ColorPicker
            value={styleValues.bodyTextColor}
            onChange={(value) => handleColorChange("bodyTextColor", value)}
            label="Body Text Color"
          />

          <ColorPicker
            value={styleValues.headingColor}
            onChange={(value) => handleColorChange("headingColor", value)}
            label="Heading Color"
          />

          <ColorPicker
            value={styleValues.labelColor}
            onChange={(value) => handleColorChange("labelColor", value)}
            label="Label Color"
          />

          <ColorPicker
            value={styleValues.helpTextColor}
            onChange={(value) => handleColorChange("helpTextColor", value)}
            label="Help Text Color"
          />
        </CardContent>
      </Card>

      {/* Colors Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center">
            <Palette className="w-4 h-4 text-indigo-600 mr-2" />
            Colors
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ColorPicker
            value={styleValues.primaryColor}
            onChange={(value) => handleColorChange("primaryColor", value)}
            label="Primary Color"
          />

          <ColorPicker
            value={styleValues.errorColor}
            onChange={(value) => handleColorChange("errorColor", value)}
            label="Error Color"
          />

          <ColorPicker
            value={styleValues.successColor}
            onChange={(value) => handleColorChange("successColor", value)}
            label="Success Color"
          />

          <ColorPicker
            value={styleValues.warningColor}
            onChange={(value) => handleColorChange("warningColor", value)}
            label="Warning Color"
          />
        </CardContent>
      </Card>

      {/* Inputs Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center">
            <Square className="w-4 h-4 text-indigo-600 mr-2" />
            Inputs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ColorPicker
            value="#ffffff"
            onChange={(value) => handleColorChange("inputBackground", value)}
            label="Input Background"
          />

          <ColorPicker
            value="#0f172a"
            onChange={(value) => handleColorChange("inputTextColor", value)}
            label="Input Text Color"
          />

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Input Border</Label>
            <div className="flex gap-2">
              <Select value="solid" onValueChange={(value) => handleSelectChange("inputBorderStyle", value)}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid">Solid</SelectItem>
                  <SelectItem value="dashed">Dashed</SelectItem>
                  <SelectItem value="dotted">Dotted</SelectItem>
                </SelectContent>
              </Select>
                <input
                  type="color"
                value="#cbd5f5"
                onChange={(e) => handleColorChange("inputBorderColor", e.target.value)}
                  className="w-10 h-8 rounded border border-gray-300 cursor-pointer"
                />
              <Slider
                value={[1]}
                onValueChange={([val]) => handleSliderChange("inputBorderWidth", val)}
                min={0}
                max={4}
                step={1}
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Focus Border</Label>
            <div className="flex gap-2">
              <Select value="solid" onValueChange={(value) => handleSelectChange("focusBorderStyle", value)}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid">Solid</SelectItem>
                  <SelectItem value="dashed">Dashed</SelectItem>
                  <SelectItem value="dotted">Dotted</SelectItem>
                </SelectContent>
              </Select>
              <input
                type="color"
                value="#2563eb"
                onChange={(e) => handleColorChange("focusBorderColor", e.target.value)}
                className="w-10 h-8 rounded border border-gray-300 cursor-pointer"
              />
              <Slider
                value={[2]}
                onValueChange={([val]) => handleSliderChange("focusBorderWidth", val)}
                min={0}
                max={4}
                step={1}
                className="flex-1"
              />
                </div>
              </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Focus Ring</Label>
            <Select value="0 0 0 3px rgba(37, 99, 235, 0.15)" onValueChange={(value) => handleSelectChange("focusRing", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select shadow" />
              </SelectTrigger>
              <SelectContent>
                {SHADOW_PRESETS.map((preset) => (
                  <SelectItem key={preset.value} value={preset.value}>
                    {preset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
                </div>

          <SliderControl
            value={48}
            onChange={(value) => handleSliderChange("inputHeight", value)}
            label="Input Height"
            min={32}
            max={56}
            unit="px"
          />

          <SliderControl
            value={10}
            onChange={(value) => handleSliderChange("inputBorderRadius", value)}
            label="Input Border Radius"
            min={0}
            max={12}
            unit="px"
          />

          <ColorPicker
            value="#94a3b8"
            onChange={(value) => handleColorChange("placeholderColor", value)}
            label="Placeholder Color"
          />
        </CardContent>
      </Card>

      {/* Buttons Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center">
            <MousePointer className="w-4 h-4 text-indigo-600 mr-2" />
            Buttons
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ColorPicker
            value="#2563eb"
            onChange={(value) => handleColorChange("primaryButtonBackground", value)}
            label="Primary Button Background"
          />

          <ColorPicker
            value="#1d4ed8"
            onChange={(value) => handleColorChange("primaryButtonHover", value)}
            label="Primary Button Hover"
          />

          <ColorPicker
            value="#ffffff"
            onChange={(value) => handleColorChange("primaryButtonText", value)}
            label="Primary Button Text"
          />

          <SliderControl
            value={12}
            onChange={(value) => handleSliderChange("buttonPadding", value)}
            label="Button Padding"
            min={8}
            max={24}
            unit="px"
          />

          <SliderControl
            value={24}
            onChange={(value) => handleSliderChange("buttonBorderRadius", value)}
            label="Button Border Radius"
            min={0}
            max={24}
            unit="px"
          />
        </CardContent>
      </Card>

      {/* Advanced Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center">
            <Settings className="w-4 h-4 text-indigo-600 mr-2" />
            Advanced
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ColorPicker
            value="#f1f5f9"
            onChange={(value) => handleColorChange("fileSurface", value)}
            label="File Upload Surface"
          />

          <ColorPicker
            value="#e2e8f0"
            onChange={(value) => handleColorChange("fileHoverSurface", value)}
            label="File Upload Hover"
          />

          <ColorPicker
            value="#ecf4ff"
            onChange={(value) => handleColorChange("signatureSurface", value)}
            label="Signature Surface"
          />

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Phone Input Border</Label>
            <div className="flex gap-2">
              <Select value="solid" onValueChange={(value) => handleSelectChange("phoneBorderStyle", value)}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid">Solid</SelectItem>
                  <SelectItem value="dashed">Dashed</SelectItem>
                  <SelectItem value="dotted">Dotted</SelectItem>
                </SelectContent>
              </Select>
              <input
                type="color"
                value="#cbd5f5"
                onChange={(e) => handleColorChange("phoneBorderColor", e.target.value)}
                className="w-10 h-8 rounded border border-gray-300 cursor-pointer"
              />
              <Slider
                value={[1]}
                onValueChange={([val]) => handleSliderChange("phoneBorderWidth", val)}
                min={0}
                max={4}
                step={1}
                className="flex-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-xs text-gray-500 text-center pt-4 border-t border-gray-200">
        Changes are saved when you publish
      </div>
    </div>
  );
}