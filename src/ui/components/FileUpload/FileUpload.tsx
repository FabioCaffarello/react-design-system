"use client";

import { useState, useRef, type DragEvent, type ChangeEvent } from "react";
import { Upload, X, File, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "../../utils";
import {
  getSpacingClass,
  getRadiusClass,
  getAnimationClass,
  getTypographySizeFromFontSize,
  getTypographyWeightFromFontWeight,
} from "../../tokens";
import Button from "../../primitives/Button/Button";
import Progress from "../../primitives/Progress/Progress";

export interface FileUploadFile {
  file: File;
  id: string;
  preview?: string;
  progress?: number;
  error?: string;
}

export interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  maxFiles?: number;
  onFilesChange?: (files: FileUploadFile[]) => void;
  onFileRemove?: (fileId: string) => void;
  showPreview?: boolean;
  showProgress?: boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
  description?: string;
}

/**
 * FileUpload Component
 *
 * A file upload component with drag and drop, preview, validation, and progress.
 * Follows Atomic Design principles as a Molecule component.
 *
 * @example
 * ```tsx
 * <FileUpload
 *   accept="image/*"
 *   maxSize={5 * 1024 * 1024} // 5MB
 *   onFilesChange={(files) => console.log(files)}
 * />
 * ```
 */
export default function FileUpload({
  accept,
  multiple = false,
  maxSize,
  maxFiles,
  onFilesChange,
  onFileRemove,
  showPreview = true,
  showProgress = false,
  disabled = false,
  className = "",
  label,
  description,
}: FileUploadProps) {
  const [files, setFiles] = useState<FileUploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    if (maxSize && file.size > maxSize) {
      return `File size exceeds ${formatFileSize(maxSize)}`;
    }
    return null;
  };

  const processFiles = (fileList: FileList | File[]): FileUploadFile[] => {
    const fileArray = Array.from(fileList);
    const newFiles: FileUploadFile[] = [];

    fileArray.forEach((file) => {
      const error = validateFile(file);
      const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const fileUpload: FileUploadFile = {
        file,
        id: fileId,
        error,
        progress: showProgress ? 0 : undefined,
      };

      // Generate preview for images
      if (showPreview && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileId
                ? { ...f, preview: e.target?.result as string }
                : f,
            ),
          );
        };
        reader.readAsDataURL(file);
      }

      newFiles.push(fileUpload);
    });

    return newFiles;
  };

  const handleFiles = (newFiles: FileUploadFile[]) => {
    const updatedFiles = multiple ? [...files, ...newFiles] : newFiles;
    const limitedFiles = maxFiles
      ? updatedFiles.slice(0, maxFiles)
      : updatedFiles;

    setFiles(limitedFiles);
    onFilesChange?.(limitedFiles);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const processedFiles = processFiles(droppedFiles);
      handleFiles(processedFiles);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const processedFiles = processFiles(e.target.files);
      handleFiles(processedFiles);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = (fileId: string) => {
    const updatedFiles = files.filter((f) => f.id !== fileId);
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
    onFileRemove?.(fileId);
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div
      className={cn(
        getSpacingClass("lg", "gap"),
        "flex",
        "flex-col",
        className,
      )}
    >
      {(label || description) && (
        <div>
          {label && (
            <label
              className={cn(
                "block",
                getTypographySizeFromFontSize("sm"),
                getTypographyWeightFromFontWeight("medium"),
                "text-fg-primary",
                getSpacingClass("xs", "mb"),
              )}
            >
              {label}
            </label>
          )}
          {description && (
            <p
              className={cn(
                getTypographySizeFromFontSize("sm"),
                "text-fg-secondary",
              )}
            >
              {description}
            </p>
          )}
        </div>
      )}

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={cn(
          "relative",
          "border-2",
          "border-dashed",
          isDragging ? "border-line-brand" : "border-line-default",
          getRadiusClass("lg"),
          getSpacingClass("lg", "p"),
          "text-center",
          "cursor-pointer",
          getAnimationClass("base"),
          "focus:border-line-focus",
          disabled
            ? "opacity-50 cursor-not-allowed"
            : cn(
                "hover:border-line-strong",
                "focus:outline-none",
                "focus:ring-2",
                "focus:ring-offset-2",
              ),
        )}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Upload files"
        aria-disabled={disabled}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          disabled={disabled}
          className="hidden"
        />

        <div
          className={cn(
            "flex",
            "flex-col",
            "items-center",
            getSpacingClass("sm", "gap"),
          )}
        >
          <Upload
            className={cn(
              "h-8",
              "w-8",
              isDragging ? "text-fg-brand" : "text-fg-secondary",
            )}
          />
          <div>
            <span
              className={cn(
                getTypographySizeFromFontSize("sm"),
                getTypographyWeightFromFontWeight("medium"),
                "text-fg-primary",
              )}
            >
              {isDragging
                ? "Drop files here"
                : "Click to upload or drag and drop"}
            </span>
            {accept && (
              <p
                className={cn(
                  getTypographySizeFromFontSize("xs"),
                  "text-fg-secondary",
                  getSpacingClass("xs", "mt"),
                )}
              >
                Accepted: {accept}
              </p>
            )}
            {maxSize && (
              <p
                className={cn(
                  getTypographySizeFromFontSize("xs"),
                  "text-fg-secondary",
                )}
              >
                Max size: {formatFileSize(maxSize)}
              </p>
            )}
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className={cn("flex", "flex-col", getSpacingClass("sm", "gap"))}>
          {files.map((fileUpload) => (
            <div
              key={fileUpload.id}
              className={cn(
                "flex",
                "items-center",
                getSpacingClass("md", "gap"),
                getSpacingClass("base", "p"),
                "border",
                "border-line-default",
                getRadiusClass("md"),
                fileUpload.error ? "bg-error-bg" : "bg-surface-muted",
              )}
            >
              {showPreview && fileUpload.preview ? (
                <img
                  src={fileUpload.preview}
                  alt={fileUpload.file.name}
                  className={cn(
                    "w-12",
                    "h-12",
                    "object-cover",
                    getRadiusClass("md"),
                  )}
                />
              ) : (
                <File className={cn("h-8", "w-8", "text-fg-secondary")} />
              )}

              <div className={cn("flex-1", "min-w-0")}>
                <p
                  className={cn(
                    getTypographySizeFromFontSize("sm"),
                    getTypographyWeightFromFontWeight("medium"),
                    "text-fg-primary",
                    "truncate",
                  )}
                >
                  {fileUpload.file.name}
                </p>
                <p
                  className={cn(
                    getTypographySizeFromFontSize("xs"),
                    "text-fg-secondary",
                  )}
                >
                  {formatFileSize(fileUpload.file.size)}
                </p>
                {fileUpload.error && (
                  <div
                    className={cn(
                      "flex",
                      "items-center",
                      getSpacingClass("xs", "gap"),
                      getSpacingClass("xs", "mt"),
                    )}
                  >
                    <AlertCircle
                      className={cn("h-3", "w-3", "text-fg-error")}
                    />
                    <span
                      className={cn(
                        getTypographySizeFromFontSize("xs"),
                        "text-fg-error",
                      )}
                    >
                      {fileUpload.error}
                    </span>
                  </div>
                )}
                {showProgress && fileUpload.progress !== undefined && (
                  <div className={cn(getSpacingClass("sm", "mt"))}>
                    <Progress value={fileUpload.progress} size="sm" />
                  </div>
                )}
              </div>

              {!fileUpload.error && !showProgress && (
                <CheckCircle2 className={cn("h-5", "w-5", "text-fg-success")} />
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(fileUpload.id);
                }}
                className={`h-auto ${getSpacingClass("xs", "p")}`}
                aria-label={`Remove ${fileUpload.file.name}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
