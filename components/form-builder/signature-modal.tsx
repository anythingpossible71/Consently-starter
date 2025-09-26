"use client";

import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PenTool, Upload, X, RotateCcw, Palette } from "lucide-react";
import { FormField } from "@/types/form-builder/form-builder";

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signatureData: string) => void;
  field: FormField;
  currentSignature?: string;
}

export function SignatureModal({ 
  isOpen, 
  onClose, 
  onSave, 
  field, 
  currentSignature 
}: SignatureModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureColor, setSignatureColor] = useState(
    field.signatureSettings?.defaultColor === "blue" ? "#3B82F6" :
    field.signatureSettings?.defaultColor === "red" ? "#EF4444" : "#000000"
  );
  const [activeTab, setActiveTab] = useState("draw");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string>("");

  // Initialize canvas
  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Set canvas size
        canvas.width = 600;
        canvas.height = 200;
        
        // Set drawing styles
        ctx.strokeStyle = signatureColor;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // If there's a current signature, draw it
        if (currentSignature) {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          };
          img.src = currentSignature;
        }
      }
    }
  }, [isOpen, signatureColor, currentSignature]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX: number, clientY: number;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX: number, clientY: number;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (activeTab === "draw") {
      const canvas = canvasRef.current;
      if (canvas) {
        const signatureData = canvas.toDataURL("image/png");
        onSave(signatureData);
      }
    } else if (activeTab === "upload" && uploadPreview) {
      onSave(uploadPreview);
    }
    // Don't call onClose() here - let the parent component handle modal closing
  };

  const isSignatureEmpty = () => {
    if (activeTab === "draw") {
      const canvas = canvasRef.current;
      if (!canvas) return true;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) return true;
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      return imageData.data.every(pixel => pixel === 0);
    } else {
      return !uploadPreview;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PenTool className="w-5 h-5" />
            {field.label || "Digital Signature"}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="draw" disabled={!field.signatureMethods?.draw}>
              <PenTool className="w-4 h-4 mr-2" />
              Draw Signature
            </TabsTrigger>
            <TabsTrigger value="upload" disabled={!field.signatureMethods?.upload}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Signature
            </TabsTrigger>
          </TabsList>

          <TabsContent value="draw" className="space-y-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="color-picker" className="text-sm font-medium">
                Color:
              </Label>
              <div className="flex items-center gap-2">
                <input
                  id="color-picker"
                  type="color"
                  value={signatureColor}
                  onChange={(e) => setSignatureColor(e.target.value)}
                  className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <span className="text-sm text-gray-600">{signatureColor}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={clearSignature}
                className="ml-auto"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <canvas
                ref={canvasRef}
                className="w-full h-48 border border-gray-200 rounded cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                style={{ touchAction: "none" }}
              />
              <p className="text-sm text-gray-500 text-center mt-2">
                Draw your signature above
              </p>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600 mb-4">
                Upload an image of your signature
              </p>
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose File
              </Button>
            </div>

            {uploadPreview && (
              <div className="border border-gray-200 rounded-lg p-4">
                <Label className="text-sm font-medium mb-2 block">Preview:</Label>
                <img
                  src={uploadPreview}
                  alt="Signature preview"
                  className="max-h-32 mx-auto border border-gray-200 rounded"
                />
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" className="form-button form-button--secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            className="form-button form-button--primary"
            onClick={handleSave}
            disabled={isSignatureEmpty()}
          >
            Save Signature
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
