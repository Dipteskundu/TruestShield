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
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { AIProviderSelect } from "@/components/ai-provider-select";
import { CustomProviderForm } from "@/components/custom-provider-form";

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

  async function handleTestCustomProvider(provider: CustomProvider) {
    const { data } = await api.post("/api/user/ai-settings/providers/test", {
      provider: "custom",
      endpoint: provider.endpoint,
      apiKey: provider.apiKey.replace(/\.\.\./g, ""),
      model: provider.model,
    });
    return data.data || { success: false, message: "Test failed" };
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
        <div className="space-y-2">
          <div className="h-10 w-32 rounded-lg bg-muted" />
          <div className="h-4 w-48 rounded bg-muted" />
        </div>
        <div className="rounded-xl border border-border/50 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="h-3 w-40 rounded bg-muted" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-6 w-24 rounded bg-muted" />
              <div className="h-4 w-48 rounded bg-muted" />
            </div>
            <div className="h-10 w-32 rounded-lg bg-muted" />
          </div>
        </div>
        <div className="rounded-xl border border-border/50 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="h-3 w-56 rounded bg-muted" />
            </div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-muted" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your TrustShield account.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 text-white">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Plan</CardTitle>
              <CardDescription>Your current subscription plan.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-400 text-white">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>AI Provider</CardTitle>
              <CardDescription>
                Configure which AI powers your scans and analysis.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
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
                      className="flex items-center justify-between rounded-xl border p-4"
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
        </CardContent>
      </Card>
    </div>
  );
}
