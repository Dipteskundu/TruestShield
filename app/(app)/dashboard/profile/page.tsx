"use client";

import { useEffect, useState } from "react";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CardGradient } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toaster";
import api from "@/lib/api";
import { User, Lock, Loader2, Save, KeyRound, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AvatarUpload } from "@/components/avatar-upload";

export default function ProfilePage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    api.get("/api/user/profile").then(({ data }) => {
      setName(data.data.name);
      setEmail(data.data.email);
      setAvatar(data.data.avatar || null);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  async function handleProfileUpdate(e: React.FormEvent) {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const { data } = await api.put("/api/user/profile", { name, email });
      if (data.success) {
        toast("Profile updated successfully", "success");
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to update profile";
      toast(message, "error");
    } finally {
      setProfileLoading(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast("New passwords do not match", "error");
      return;
    }
    if (newPassword.length < 8) {
      toast("New password must be at least 8 characters", "error");
      return;
    }
    setPasswordLoading(true);
    try {
      const { data } = await api.put("/api/user/password", {
        currentPassword,
        newPassword,
      });
      if (data.success) {
        toast("Password changed successfully", "success");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to change password";
      toast(message, "error");
    } finally {
      setPasswordLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="space-y-3">
          <div className="h-10 w-32 rounded-lg shimmer" />
          <div className="h-4 w-48 rounded shimmer" />
        </div>
        <div className="rounded-2xl glass p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl shimmer" />
            <div className="space-y-2">
              <div className="h-4 w-32 rounded shimmer" />
              <div className="h-3 w-48 rounded shimmer" />
            </div>
          </div>
          <div className="flex justify-center">
            <div className="h-24 w-24 rounded-full shimmer" />
          </div>
        </div>
        <div className="rounded-2xl glass p-6 space-y-4">
          <div className="space-y-3 max-w-md">
            <div className="h-4 w-16 rounded shimmer" />
            <div className="h-10 w-full rounded-lg shimmer" />
            <div className="h-4 w-16 rounded shimmer" />
            <div className="h-10 w-full rounded-lg shimmer" />
            <div className="h-10 w-32 rounded-lg shimmer" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your account information.</p>
      </div>

      <CardGradient className="animate-fade-in-up opacity-0 stagger-1">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary text-white">
              <User className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>Upload a profile picture to personalize your account.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <AvatarUpload
            currentAvatar={avatar}
            userName={name || "User"}
            onAvatarUpdate={setAvatar}
          />
        </CardContent>
      </CardGradient>

      <CardGradient className="animate-fade-in-up opacity-0 stagger-2">
        <CardContent className="pt-6">
          <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="focus:shadow-glow-sm transition-shadow duration-300"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="focus:shadow-glow-sm transition-shadow duration-300"
              />
            </div>
            <Button type="submit" disabled={profileLoading}>
              {profileLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {profileLoading ? "Saving..." : "Save changes"}
            </Button>
          </form>
        </CardContent>
      </CardGradient>

      <CardGradient className="animate-fade-in-up opacity-0 stagger-3">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-400 text-white">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Password</CardTitle>
              <CardDescription>Change your account password.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {!showPasswordForm ? (
              <motion.div
                key="button"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="group flex items-center gap-3 rounded-xl border border-dashed border-border p-4 text-left transition-all hover:border-accent/50 hover:bg-accent/5 w-full max-w-md hover:shadow-premium"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 transition-all group-hover:bg-accent/20 group-hover:scale-110">
                    <KeyRound className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Change Password</p>
                    <p className="text-xs text-muted-foreground">Update your password to keep your account secure</p>
                  </div>
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Current password</label>
                    <Input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="focus:shadow-glow-sm transition-shadow duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">New password</label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      minLength={8}
                      required
                      className="focus:shadow-glow-sm transition-shadow duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Confirm new password</label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      minLength={8}
                      required
                      className="focus:shadow-glow-sm transition-shadow duration-300"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={passwordLoading}>
                      {passwordLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lock className="mr-2 h-4 w-4" />}
                      {passwordLoading ? "Changing..." : "Change password"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setCurrentPassword("");
                        setNewPassword("");
                        setConfirmPassword("");
                      }}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </CardGradient>
    </div>
  );
}
