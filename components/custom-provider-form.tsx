"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, X, TestTube, Check, AlertCircle } from "lucide-react";

interface CustomProvider {
  id: string;
  name: string;
  endpoint: string;
  apiKey: string;
  model: string;
  isActive: boolean;
  createdAt: string;
}

interface CustomProviderFormProps {
  provider?: CustomProvider;
  onSave: (data: {
    name: string;
    endpoint: string;
    apiKey: string;
    model: string;
  }) => Promise<void>;
  onDelete?: () => Promise<void>;
  onTest?: () => Promise<{ success: boolean; message: string }>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function CustomProviderForm({
  provider,
  onSave,
  onDelete,
  onTest,
  onCancel,
  isLoading,
}: CustomProviderFormProps) {
  const [name, setName] = useState(provider?.name || "");
  const [endpoint, setEndpoint] = useState(provider?.endpoint || "");
  const [apiKey, setApiKey] = useState(provider?.apiKey || "");
  const [model, setModel] = useState(provider?.model || "");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const isEditing = !!provider;

  async function handleTest() {
    if (!onTest) return;
    setTesting(true);
    setTestResult(null);
    try {
      const result = await onTest();
      setTestResult(result);
    } catch {
      setTestResult({ success: false, message: "Test failed" });
    } finally {
      setTesting(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSave({ name, endpoint, apiKey, model });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border p-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">
          {isEditing ? "Edit Custom Provider" : "Add Custom Provider"}
        </h4>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My OpenAI API"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Model</label>
          <Input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="gpt-4o"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">API Endpoint</label>
        <Input
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          placeholder="https://api.openai.com/v1"
          required
        />
        <p className="text-xs text-muted-foreground">
          Must be an OpenAI-compatible endpoint (e.g., OpenAI, Together, Groq,
          etc.)
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">API Key</label>
        <Input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="sk-..."
          required
        />
        {isEditing && (
          <p className="text-xs text-muted-foreground">
            Current key: {provider.apiKey}
          </p>
        )}
      </div>

      {testResult && (
        <div
          className={`flex items-center gap-2 rounded-lg p-3 text-sm ${
            testResult.success
              ? "bg-emerald-500/10 text-emerald-600"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {testResult.success ? (
            <Check className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <span>{testResult.message}</span>
        </div>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          {isEditing ? "Save Changes" : "Add Provider"}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={handleTest}
          disabled={testing || !apiKey || !endpoint}
        >
          {testing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <TestTube className="mr-2 h-4 w-4" />
          )}
          Test Connection
        </Button>

        {onDelete && (
          <Button
            type="button"
            variant="destructive"
            onClick={onDelete}
            className="ml-auto"
          >
            Delete
          </Button>
        )}
      </div>
    </form>
  );
}
