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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toaster";
import api from "@/lib/api";
import {
  User,
  Lock,
  Loader2,
  Save,
  KeyRound,
  X,
  Pencil,
  AtSign,
  MapPin,
  Shield,
  Calendar,
  Mail,
  UserCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AvatarUpload } from "@/components/avatar-upload";
import { formatDate } from "@/lib/utils";

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

interface ProfileData {
  name: string;
  username: string;
  email: string;
  gender: string;
  city: string;
  provider: string;
  role: string;
  plan: string;
  avatar: string | null;
  createdAt: string;
}

export default function ProfilePage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    api
      .get("/api/user/profile")
      .then(({ data }) => {
        const p = data.data;
        setProfile(p);
        setAvatar(p.avatar || null);
        setName(p.name);
        setUsername(p.username || "");
        setGender(p.gender || "prefer_not_to_say");
        setCity(p.city || "");
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function handleCancelEdit() {
    if (profile) {
      setName(profile.name);
      setUsername(profile.username || "");
      setGender(profile.gender || "prefer_not_to_say");
      setCity(profile.city || "");
    }
    setIsEditing(false);
  }

  async function handleProfileUpdate(e: React.FormEvent) {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const { data } = await api.put("/api/user/profile", {
        name,
        username,
        gender,
        city,
      });
      if (data.success) {
        setProfile(data.data);
        setIsEditing(false);
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
        setShowPasswordForm(false);
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

  function getProviderBadge(provider: string) {
    switch (provider) {
      case "google":
        return (
          <Badge variant="outline" className="gap-1 border-blue-500/30 text-blue-600 dark:text-blue-400">
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </Badge>
        );
      case "github":
        return (
          <Badge variant="outline" className="gap-1 border-zinc-500/30 text-zinc-700 dark:text-zinc-300">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="gap-1">
            <Shield className="h-3 w-3" />
            Email
          </Badge>
        );
    }
  }

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="relative overflow-hidden rounded-2xl glass p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-violet-500/10" />
          <div className="relative flex flex-col sm:flex-row items-center gap-6">
            <div className="h-20 w-20 rounded-full shimmer" />
            <div className="space-y-3 text-center sm:text-left">
              <div className="h-8 w-48 rounded-lg shimmer" />
              <div className="h-4 w-32 rounded shimmer" />
              <div className="flex gap-2 justify-center sm:justify-start">
                <div className="h-6 w-16 rounded-full shimmer" />
                <div className="h-6 w-16 rounded-full shimmer" />
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl glass p-6 space-y-4">
          <div className="h-6 w-40 rounded shimmer" />
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-20 rounded shimmer" />
                <div className="h-10 w-full rounded-lg shimmer" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account information and settings.
        </p>
      </div>

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl glass animate-fade-in-up opacity-0 stagger-1">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-violet-500/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(5,150,105,0.08),transparent_50%)]" />
        <div className="relative p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-full blur-xl opacity-20" />
              <div className="relative">
                <AvatarUpload
                  currentAvatar={avatar}
                  userName={profile?.name || "User"}
                  onAvatarUpdate={setAvatar}
                />
              </div>
            </div>
            <div className="text-center sm:text-left space-y-2">
              <h2 className="text-2xl font-bold">
                {profile?.name || "User"}
              </h2>
              <p className="text-muted-foreground flex items-center gap-1 justify-center sm:justify-start">
                <Mail className="h-4 w-4" />
                {profile?.email}
              </p>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                {getProviderBadge(profile?.provider || "local")}
                <Badge
                  variant={profile?.plan === "pro" ? "default" : "secondary"}
                  className="gap-1"
                >
                  {profile?.plan === "pro" ? "Pro" : "Free"}
                </Badge>
                {profile?.role === "admin" && (
                  <Badge variant="glow" className="gap-1">
                    Admin
                  </Badge>
                )}
              </div>
            </div>
            <div className="sm:ml-auto">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Member since {profile?.createdAt ? formatDate(profile.createdAt) : ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <CardGradient className="animate-fade-in-up opacity-0 stagger-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 text-white shadow-md shadow-emerald-500/20">
                <User className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  {isEditing
                    ? "Update your personal details below."
                    : "Your account details and personal information."}
                </CardDescription>
              </div>
            </div>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="gap-2"
              >
                <Pencil className="h-4 w-4" />
                Update Profile
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {!isEditing ? (
              <motion.div
                key="view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                      <UserCircle className="h-4 w-4" />
                      Full Name
                    </p>
                    <p className="text-base font-medium">{profile?.name || "—"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                      <AtSign className="h-4 w-4" />
                      Username
                    </p>
                    <p className="text-base font-medium">{profile?.username || "—"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                      <Mail className="h-4 w-4" />
                      Email
                    </p>
                    <p className="text-base font-medium">{profile?.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                      <User className="h-4 w-4" />
                      Gender
                    </p>
                    <p className="text-base font-medium capitalize">
                      {profile?.gender
                        ? profile.gender.replace(/_/g, " ")
                        : "—"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      City
                    </p>
                    <p className="text-base font-medium">{profile?.city || "—"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                      <Shield className="h-4 w-4" />
                      Auth Provider
                    </p>
                    <div className="pt-0.5">{getProviderBadge(profile?.provider || "local")}</div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="edit"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-1.5">
                        <UserCircle className="h-4 w-4 text-muted-foreground" />
                        Full Name
                      </label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        required
                        className="focus:shadow-glow-sm transition-shadow duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-1.5">
                        <AtSign className="h-4 w-4 text-muted-foreground" />
                        Username
                      </label>
                      <Input
                        value={username}
                        onChange={(e) =>
                          setUsername(
                            e.target.value.toLowerCase().replace(/\s+/g, "")
                          )
                        }
                        placeholder="username"
                        minLength={3}
                        maxLength={30}
                        required
                        className="focus:shadow-glow-sm transition-shadow duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-1.5">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        Email
                      </label>
                      <Input
                        type="email"
                        value={profile?.email || ""}
                        disabled
                        className="opacity-60 cursor-not-allowed"
                      />
                      <p className="text-xs text-muted-foreground">
                        Email cannot be changed.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-1.5">
                        <User className="h-4 w-4 text-muted-foreground" />
                        Gender
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background/50 backdrop-blur-sm px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:shadow-glow-sm transition-shadow duration-300 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {genderOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        City
                      </label>
                      <Input
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Your city"
                        className="max-w-md focus:shadow-glow-sm transition-shadow duration-300"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={profileLoading}>
                      {profileLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      {profileLoading ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleCancelEdit}
                      disabled={profileLoading}
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

      {/* Password Section */}
      <CardGradient className="animate-fade-in-up opacity-0 stagger-3">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-400 text-white shadow-md shadow-violet-500/20">
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
                    <p className="text-xs text-muted-foreground">
                      Update your password to keep your account secure
                    </p>
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
                <form
                  onSubmit={handlePasswordChange}
                  className="space-y-4 max-w-md"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Current password
                    </label>
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
                    <label className="text-sm font-medium">
                      Confirm new password
                    </label>
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
                      {passwordLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Lock className="mr-2 h-4 w-4" />
                      )}
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
