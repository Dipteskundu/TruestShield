"use client";

import { useState, useRef } from "react";
import { Camera, Loader2, Trash2, X } from "lucide-react";
import { useToast } from "@/components/ui/toaster";
import api from "@/lib/api";

interface AvatarUploadProps {
  currentAvatar: string | null;
  userName: string;
  onAvatarUpdate: (url: string | null) => void;
}

export function AvatarUpload({ currentAvatar, userName, onAvatarUpdate }: AvatarUploadProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = (userName || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast("Image must be less than 5MB", "error");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleUpload() {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const { data } = await api.post("/api/user/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        toast("Profile picture updated", "success");
        onAvatarUpdate(data.data.avatar);
        setPreview(null);
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to upload avatar";
      toast(message, "error");
    } finally {
      setUploading(false);
    }
  }

  async function handleRemove() {
    try {
      const { data } = await api.delete("/api/user/avatar");
      if (data.success) {
        toast("Profile picture removed", "success");
        onAvatarUpdate(null);
        setPreview(null);
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to remove avatar";
      toast(message, "error");
    }
  }

  const displayImage = preview || currentAvatar;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <div
          className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-2xl font-bold text-primary overflow-hidden"
        >
          {displayImage ? (
            <img src={displayImage} alt="Avatar" className="h-full w-full object-cover" />
          ) : (
            initials
          )}
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 text-white animate-spin" />
          ) : (
            <Camera className="h-6 w-6 text-white" />
          )}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {preview && (
        <div className="flex items-center gap-2">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Save Picture"
            )}
          </button>
          <button
            onClick={() => setPreview(null)}
            disabled={uploading}
            className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent/50 disabled:opacity-50"
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </button>
        </div>
      )}

      {currentAvatar && !preview && (
        <button
          onClick={handleRemove}
          disabled={uploading}
          className="inline-flex items-center gap-2 text-sm text-destructive hover:text-destructive/80"
        >
          <Trash2 className="h-4 w-4" />
          Remove picture
        </button>
      )}

      {!currentAvatar && !preview && (
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <Camera className="h-4 w-4" />
          Upload picture
        </button>
      )}
    </div>
  );
}
