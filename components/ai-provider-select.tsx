"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";

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

interface AIProviderSelectProps {
  providers: Provider[];
  selectedProvider: string;
  selectedModel: string | null;
  onProviderChange: (provider: string) => void;
  onModelChange: (model: string) => void;
}

export function AIProviderSelect({
  providers,
  selectedProvider,
  selectedModel,
  onProviderChange,
  onModelChange,
}: AIProviderSelectProps) {
  const [expandedProvider, setExpandedProvider] = useState<string | null>(null);

  const currentProvider = providers.find((p) => p.id === selectedProvider);
  const currentModel = currentProvider?.models.find(
    (m) => m.id === (selectedModel || currentProvider?.models[0]?.id)
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">AI Provider</label>
        <div className="grid gap-2">
          {providers.map((provider) => (
            <button
              key={provider.id}
              type="button"
              onClick={() => {
                onProviderChange(provider.id);
                if (provider.models.length > 0) {
                  onModelChange(provider.models[0].id);
                }
                setExpandedProvider(
                  expandedProvider === provider.id ? null : provider.id
                );
              }}
              className={`flex items-center justify-between rounded-xl border p-3 text-left transition-all ${
                selectedProvider === provider.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30 hover:bg-primary/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    selectedProvider === provider.id
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/30"
                  }`}
                >
                  {selectedProvider === provider.id && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{provider.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {provider.hasApiKey
                      ? "API key configured"
                      : "Requires API key"}
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform ${
                  expandedProvider === provider.id ? "rotate-180" : ""
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {expandedProvider && currentProvider && (
        <div className="space-y-2 pl-2">
          <label className="text-sm font-medium">Model</label>
          <div className="grid gap-2">
            {currentProvider.models.map((model) => (
              <button
                key={model.id}
                type="button"
                onClick={() => onModelChange(model.id)}
                className={`flex items-center justify-between rounded-xl border p-3 text-left transition-all ${
                  (selectedModel || currentProvider.models[0].id) === model.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30 hover:bg-primary/5"
                }`}
              >
                <div>
                  <p className="font-medium">{model.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {model.description}
                  </p>
                </div>
                {(selectedModel || currentProvider.models[0].id) === model.id && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {currentProvider && !currentProvider.hasApiKey && selectedProvider !== "custom" && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-sm text-amber-600">
          <p>
            No API key found for {currentProvider.name}. Add{" "}
            <code className="font-mono text-xs">
              {currentProvider.id.toUpperCase()}_API_KEY
            </code>{" "}
            to your environment variables, or add a custom provider with your own
            API key.
          </p>
        </div>
      )}
    </div>
  );
}
