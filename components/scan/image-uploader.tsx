"use client";

import { useState, useEffect, useCallback } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Upload,
  X,
  RotateCcw,
  ImageIcon,
  AlertCircle,
  FileImage,
} from "lucide-react";
import api from "@/lib/api";
import type { ScanResult } from "@/types/scan";

interface ImageUploaderProps {
  onResult: (result: ScanResult) => void;
  onError: (error: string) => void;
  beforeScan?: () => boolean;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ImageUploader({
  onResult,
  onError,
  beforeScan,
  loading,
  setLoading,
}: ImageUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        const code = fileRejections[0].errors[0]?.code;
        if (code === "file-too-large") {
          setError("File is too large. Maximum size is 10 MB.");
        } else {
          setError("Invalid file type. Please upload JPEG, PNG, or WebP.");
        }
        return;
      }
      const file = acceptedFiles[0];
      if (!file) return;

      if (preview) URL.revokeObjectURL(preview);
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setError(null);
    },
    [preview]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    onDrop: handleDrop,
    disabled: loading,
  });

  async function handleSubmit() {
    if (!selectedFile) return;
    if (beforeScan && !beforeScan()) return;

    setLoading(true);
    setUploadProgress(0);
    setAnalyzing(false);
    setError(null);

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const { data } = await api.post("/api/scan/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (e.total) {
            setUploadProgress(Math.round((e.loaded * 100) / e.total));
          }
        },
      });
      setAnalyzing(true);
      onResult(data.data);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Image scan failed. Please try again.";
      setError(message);
      onError(message);
    } finally {
      setLoading(false);
      setAnalyzing(false);
      setUploadProgress(0);
    }
  }

  function handleRemove() {
    if (preview) URL.revokeObjectURL(preview);
    setSelectedFile(null);
    setPreview(null);
    setError(null);
  }

  const isUploading = loading && uploadProgress > 0 && !analyzing;

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        {!selectedFile ? (
          <div
            {...getRootProps()}
            className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl transition-all cursor-pointer ${
              isDragActive
                ? "border-primary bg-primary/5 scale-[1.02]"
                : "border-border/50 bg-muted/20 hover:bg-primary/5 hover:border-primary/30"
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <ImageIcon
                className={`h-10 w-10 mb-3 transition-colors ${
                  isDragActive ? "text-primary" : "text-muted-foreground/50"
                }`}
              />
              <p className="text-sm text-muted-foreground">
                {isDragActive ? "Drop your image here" : "Drag & drop an image, or click to browse"}
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                JPEG, PNG, WebP — Max 10 MB
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              {preview && (
                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-border/50 bg-muted/20">
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <FileImage className="h-4 w-4 text-muted-foreground shrink-0" />
                  <p className="text-sm font-medium truncate">
                    {selectedFile.name}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatFileSize(selectedFile.size)}
                </p>
                <div className="flex gap-2 mt-3">
                  <label
                    className={`inline-flex items-center gap-1.5 rounded-lg border border-border/50 bg-background/50 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-primary/5 hover:text-foreground transition-all cursor-pointer ${
                      loading ? "pointer-events-none opacity-50" : ""
                    }`}
                  >
                    <Upload className="h-3 w-3" />
                    Change
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleDrop([file], []);
                        }
                      }}
                      disabled={loading}
                    />
                  </label>
                  {!loading && (
                    <button
                      onClick={handleRemove}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border/50 bg-background/50 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-destructive/5 hover:text-destructive transition-all"
                    >
                      <X className="h-3 w-3" />
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Uploading...</span>
                  <span className="font-medium text-primary">{uploadProgress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-primary/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {analyzing && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing image...
              </div>
            )}

            {error && (
              <div className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span className="flex-1">{error}</span>
              </div>
            )}
          </div>
        )}

        {selectedFile && (
          error ? (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              size="lg"
              className="w-full"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RotateCcw className="mr-2 h-4 w-4" />
              )}
              {loading ? "Retrying..." : "Retry"}
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              size="lg"
              className="w-full"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              {loading ? "Scanning..." : "Scan Image"}
            </Button>
          )
        )}
      </CardContent>
    </Card>
  );
}
