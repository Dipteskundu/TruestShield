"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "default" | "success" | "error";

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue>({
  toast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

const variantConfig = {
  default: {
    icon: Info,
    className: "border-border/50 bg-background/90 backdrop-blur-xl",
    iconClass: "text-muted-foreground",
  },
  success: {
    icon: CheckCircle2,
    className: "border-primary/20 bg-primary/5 backdrop-blur-xl",
    iconClass: "text-primary",
  },
  error: {
    icon: AlertCircle,
    className: "border-destructive/20 bg-destructive/5 backdrop-blur-xl",
    iconClass: "text-destructive",
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, variant: ToastVariant = "default") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((t) => {
          const config = variantConfig[t.variant];
          const Icon = config.icon;
          return (
            <div
              key={t.id}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm shadow-glass animate-in slide-in-from-right",
                config.className
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", config.iconClass)} />
              <span className="flex-1">{t.message}</span>
              <button
                onClick={() => dismiss(t.id)}
                className="shrink-0 rounded-lg p-1 hover:bg-foreground/5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function Toaster() {
  return null;
}
