"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Card,
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
import {
  CreditCard,
  Loader2,
  Save,
  Bot,
  Plus,
  Trash2,
  Key,
  BarChart3,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { AIProviderSelect } from "@/components/ai-provider-select";
import { CustomProviderForm } from "@/components/custom-provider-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { signOut } from "next-auth/react";

interface ProviderModel {
  id: string;
  name: string;
  description: string;
}

interface Provider {
  id: string;
  name: string;
  models: ProviderModel[];
  hasApiKey: boolean;
}

interface CustomProvider {
  id: string;
  name: string;
  endpoint: string;
  apiKey: string;
  model: string;
  isActive: boolean;
  createdAt: string;
}

interface AISettings {
  provider: string;
  model: string | null;
  customProviders: CustomProvider[];
  availableProviders: Provider[];
}

function AccordionSection({
  title,
  description,
  icon: Icon,
  gradient,
  children,
  defaultOpen = false,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <CardGradient className="animate-fade-in-up">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left"
      >
        <CardHeader className="cursor-pointer">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </div>
            </div>
            {isOpen ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </CardHeader>
      </button>
      {isOpen && (
        <CardContent className="animate-fade-in-up">
          {children}
        </CardContent>
      )}
    </CardGradient>
  );
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const [aiSettings, setAISettings] = useState<AISettings | null>(null);
  const [selectedProvider, setSelectedProvider] = useState("system");
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [aiSettingsLoading, setAISettingsLoading] = useState(false);
  const [showAddProvider, setShowAddProvider] = useState(false);
  const [editingProvider, setEditingProvider] = useState<CustomProvider | null>(null);
  const [providerLoading, setProviderLoading] = useState(false);

  // Delete account state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    api.get("/api/user/ai-settings").then(({ data }) => {
      setAISettings(data.data);
      setSelectedProvider(data.data.provider);
      setSelectedModel(data.data.model);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  async function handleAISettingsSave() {
    setAISettingsLoading(true);
    try {
      const { data } = await api.put("/api/user/ai-settings", {
        provider: selectedProvider,
        model: selectedModel,
      });
      if (data.success) {
        toast("AI settings updated successfully", "success");
        setAISettings((prev) =>
          prev ? { ...prev, provider: selectedProvider, model: selectedModel } : prev
        );
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to update AI settings";
      toast(message, "error");
    } finally {
      setAISettingsLoading(false);
    }
  }

  async function handleAddCustomProvider(formData: {
    name: string;
    endpoint: string;
    apiKey: string;
    model: string;
  }) {
    setProviderLoading(true);
    try {
      const { data } = await api.post("/api/user/ai-settings/providers", formData);
      if (data.success) {
        toast("Custom provider added successfully", "success");
        setAISettings((prev) =>
          prev
            ? { ...prev, customProviders: [...prev.customProviders, data.data] }
            : prev
        );
        setShowAddProvider(false);
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to add custom provider";
      toast(message, "error");
    } finally {
      setProviderLoading(false);
    }
  }

  async function handleRemoveCustomProvider(id: string) {
    try {
      const { data } = await api.delete(`/api/user/ai-settings/providers/${id}`);
      if (data.success) {
        toast("Custom provider removed", "success");
        setAISettings((prev) =>
          prev
            ? {
                ...prev,
                customProviders: prev.customProviders.filter((p) => p.id !== id),
              }
            : prev
        );
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to remove custom provider";
      toast(message, "error");
    }
  }

  async function handleDeleteAccount() {
    if (!deletePassword) {
      toast("Password is required", "error");
      return;
    }
    if (deleteConfirmation !== "DELETE") {
      toast("Type DELETE to confirm", "error");
      return;
    }

    setDeleteLoading(true);
    try {
      const { data } = await api.delete("/api/user/account", {
        data: { password: deletePassword },
      });
      if (data.success) {
        toast("Account deleted permanently", "success");
        signOut({ callbackUrl: "/" });
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to delete account";
      toast(message, "error");
    } finally {
      setDeleteLoading(false);
    }
  }

  const allProviders: Provider[] = [
    {
      id: "system",
      name: "System Default",
      models: [{ id: "default", name: "Default Model", description: "Platform's AI" }],
      hasApiKey: true,
    },
    ...(aiSettings?.availableProviders || []),
    {
      id: "custom",
      name: "Custom Provider",
      models: [{ id: "custom", name: "User-defined", description: "Your own API" }],
      hasApiKey: true,
    },
  ];

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
              <div className="h-4 w-24 rounded shimmer" />
              <div className="h-3 w-40 rounded shimmer" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-6 w-24 rounded shimmer" />
              <div className="h-4 w-48 rounded shimmer" />
            </div>
            <div className="h-10 w-32 rounded-lg shimmer" />
          </div>
        </div>
        <div className="rounded-2xl glass p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl shimmer" />
            <div className="space-y-2">
              <div className="h-4 w-24 rounded shimmer" />
              <div className="h-3 w-56 rounded shimmer" />
            </div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-xl shimmer" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your TrustShield account.</p>
      </div>

      <AccordionSection
        title="Plan"
        description="Your current subscription plan."
        icon={CreditCard}
        gradient="from-emerald-500 to-teal-400"
        defaultOpen
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold capitalize">
              {(session?.user as { plan?: string })?.plan || "free"} plan
            </p>
            <p className="text-sm text-muted-foreground">
              View detailed usage breakdowns and limits.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/usage">
              <Button variant="outline" size="sm">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Usage
              </Button>
            </Link>
            <Button variant="outline" disabled>
              Upgrade (coming soon)
            </Button>
          </div>
        </div>
      </AccordionSection>

      <AccordionSection
        title="AI Provider"
        description="Configure which AI powers your scans and analysis."
        icon={Bot}
        gradient="from-violet-500 to-purple-400"
        defaultOpen
      >
        <div className="space-y-6">
          <AIProviderSelect
            providers={allProviders}
            selectedProvider={selectedProvider}
            selectedModel={selectedModel}
            onProviderChange={setSelectedProvider}
            onModelChange={setSelectedModel}
          />

          <Button onClick={handleAISettingsSave} disabled={aiSettingsLoading}>
            {aiSettingsLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {aiSettingsLoading ? "Saving..." : "Save Preferences"}
          </Button>

          {selectedProvider === "custom" && (
            <div className="space-y-4 border-t border-border pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Custom Providers</h3>
                  <p className="text-sm text-muted-foreground">
                    Add your own OpenAI-compatible API endpoints.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowAddProvider(true);
                    setEditingProvider(null);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Provider
                </Button>
              </div>

              {showAddProvider && !editingProvider && (
                <CustomProviderForm
                  onSave={handleAddCustomProvider}
                  onCancel={() => setShowAddProvider(false)}
                  isLoading={providerLoading}
                />
              )}

              {aiSettings?.customProviders && aiSettings.customProviders.length > 0 && (
                <div className="space-y-3">
                  {aiSettings.customProviders.map((provider) => (
                    <div
                      key={provider.id}
                      className="flex items-center justify-between rounded-xl border p-4 hover:shadow-premium transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Key className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{provider.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {provider.endpoint} &middot; {provider.model}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Key: {provider.apiKey}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingProvider(provider);
                            setShowAddProvider(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveCustomProvider(provider.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {(!aiSettings?.customProviders || aiSettings.customProviders.length === 0) && !showAddProvider && (
                <div className="rounded-xl border border-dashed p-8 text-center">
                  <Key className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No custom providers added yet.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Add your own OpenAI-compatible API to use with TrustShield.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </AccordionSection>

      <div className="animate-fade-in-up opacity-0 stagger-3">
        <Card className="border-destructive/30 animate-glow-pulse">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-400 text-white">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>
                  Permanently delete your account and all associated data.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between rounded-xl border border-destructive/20 p-4">
              <div>
                <p className="font-medium">Delete Account</p>
                <p className="text-sm text-muted-foreground">
                  This action cannot be undone. All your scans, documents, and data will be permanently removed.
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Account</DialogTitle>
            <DialogDescription>
              This action is permanent and cannot be undone. All your data will be
              erased.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="delete-password" className="text-sm font-medium">
                Enter your password to confirm
              </label>
              <Input
                id="delete-password"
                type="password"
                placeholder="Your password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="delete-confirm" className="text-sm font-medium">
                Type <span className="font-bold">DELETE</span> to confirm
              </label>
              <Input
                id="delete-confirm"
                placeholder="DELETE"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setDeletePassword("");
                setDeleteConfirmation("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteLoading || deleteConfirmation !== "DELETE" || !deletePassword}
              onClick={handleDeleteAccount}
            >
              {deleteLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              {deleteLoading ? "Deleting..." : "Yes, delete my account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
