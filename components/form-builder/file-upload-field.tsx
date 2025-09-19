"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, File, CheckCircle, AlertCircle } from "lucide-react";
import { FormField } from "@/types/form-builder/form-builder";
import { cn } from "@/lib/utils";

interface FileUploadFieldProps {
  field: FormField;
  value?: File[] | string[];
  onChange?: (files: File[] | string[]) => void;
  disabled?: boolean;
  error?: string;
}

export function FileUploadField({ 
  field, 
  value = [], 
  onChange, 
  disabled = false, 
  error 
}: FileUploadFieldProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse accepted file types
  const acceptedTypes = field.acceptedFileTypes?.split(',').map(type => type.trim()) || [];
  const maxFileSize = (field.maxFileSize || 10) * 1024 * 1024; // Convert MB to bytes
  const maxFiles = field.maxFiles || 1;
  const allowMultiple = field.allowMultipleFiles || false;

  const handleFiles = async (files: FileList | File[]) => {
    if (disabled) return;

    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const errors: string[] = [];

    // Validate files
    for (const file of fileArray) {
      // Check file size
      if (file.size > maxFileSize) {
        errors.push(`${file.name} is too large. Maximum size is ${field.maxFileSize || 10}MB.`);
        continue;
      }

      // Check file type
      if (acceptedTypes.length > 0) {
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
        const mimeType = file.type;
        
        const isAccepted = acceptedTypes.some(type => {
          if (type.startsWith('.')) {
            return fileExtension === type.toLowerCase();
          }
          return mimeType.startsWith(type);
        });

        if (!isAccepted) {
          errors.push(`${file.name} is not an accepted file type. Accepted types: ${acceptedTypes.join(', ')}`);
          continue;
        }
      }

      validFiles.push(file);
    }

    // Check max files limit
    const currentFiles = Array.isArray(value) ? value : [];
    const totalFiles = currentFiles.length + validFiles.length;
    
    if (totalFiles > maxFiles) {
      errors.push(`Maximum ${maxFiles} file${maxFiles > 1 ? 's' : ''} allowed.`);
    }

    if (errors.length > 0) {
      // You could show these errors in a toast or alert
      console.error('File upload errors:', errors);
      alert(errors.join('\n'));
      return;
    }

    if (validFiles.length > 0) {
      setUploading(true);
      
      try {
        // Convert files to base64 for storage
        const base64Files = await Promise.all(
          validFiles.map(file => convertToBase64(file))
        );
        
        // Since we're always converting to base64, ensure currentFiles are also strings
        const currentStringFiles = currentFiles.filter((file): file is string => typeof file === 'string');

        const newFiles = allowMultiple
          ? [...currentStringFiles, ...base64Files]
          : base64Files;

        onChange?.(newFiles);
      } catch (error) {
        console.error('Error processing files:', error);
        alert('Error processing files. Please try again.');
      } finally {
        setUploading(false);
      }
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const removeFile = (index: number) => {
    if (disabled) return;

    const currentFiles = Array.isArray(value) ? value : [];
    const newFiles = currentFiles.filter((_, i) => i !== index);

    // Ensure type consistency - if all remaining files are strings, pass as string[]
    const allStrings = newFiles.every(file => typeof file === 'string');
    const allFiles = newFiles.every(file => file instanceof File);

    if (allStrings) {
      onChange?.(newFiles as string[]);
    } else if (allFiles) {
      onChange?.(newFiles as File[]);
    } else {
      // Mixed types - convert all to strings
      const stringFiles = newFiles.map(file => typeof file === 'string' ? file : '');
      onChange?.(stringFiles);
    }
  };

  const getFileInfo = (fileData: string) => {
    // Extract filename from base64 data URL
    const match = fileData.match(/data:([^;]+);base64,(.+)/);
    if (match) {
      const mimeType = match[1];
      const extension = mimeType.split('/')[1] || 'file';
      return { mimeType, extension };
    }
    return { mimeType: 'unknown', extension: 'file' };
  };

  const currentFiles = Array.isArray(value) ? value : [];

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-gray-50",
          error ? "border-red-300 bg-red-50" : "",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-gray-100"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <Upload className={cn(
          "w-8 h-8 mx-auto mb-2",
          dragActive ? "text-blue-500" : "text-gray-400"
        )} />
        <p className="text-sm text-gray-600 mb-1">
          {dragActive ? "Drop files here" : "Click to upload or drag and drop"}
        </p>
        <p className="text-xs text-gray-500">
          {acceptedTypes.length > 0 
            ? `${acceptedTypes.join(', ')} up to ${field.maxFileSize || 10}MB`
            : `Files up to ${field.maxFileSize || 10}MB`
          }
        </p>
        {maxFiles > 1 && (
          <p className="text-xs text-gray-500">
            Maximum {maxFiles} files
          </p>
        )}
        
        <Input
          ref={fileInputRef}
          type="file"
          multiple={allowMultiple}
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="flex items-center gap-2 text-sm text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          Processing files...
        </div>
      )}

      {/* File List */}
      {currentFiles.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Uploaded Files:</Label>
          {currentFiles.map((fileData, index) => {
            // Handle both string (base64) and File objects
            if (typeof fileData === 'string') {
              const { mimeType, extension } = getFileInfo(fileData);
              const isImage = mimeType.startsWith('image/');

              return (
                <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                  <div className="flex-shrink-0">
                    {isImage ? (
                      <img
                        src={fileData}
                        alt={`Uploaded file ${index + 1}`}
                      className="w-10 h-10 object-cover rounded border"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-100 rounded border flex items-center justify-center">
                      <File className="w-5 h-5 text-gray-500" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    File {index + 1}.{extension}
                  </p>
                  <p className="text-xs text-gray-500">{mimeType}</p>
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {!disabled && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
              );
            } else {
              // Handle File objects
              const file = fileData as File;
              const isImage = file.type.startsWith('image/');

              return (
                <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                  <div className="flex-shrink-0">
                    {isImage ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Uploaded file ${index + 1}`}
                        className="w-10 h-10 object-cover rounded border"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded border flex items-center justify-center">
                        <File className="w-5 h-5 text-gray-500" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">{file.type}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {!disabled && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            }
          })}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
}
