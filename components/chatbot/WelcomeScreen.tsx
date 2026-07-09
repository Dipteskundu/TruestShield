"use client";

import {
  Search,
  BarChart3,
  FileText,
  CreditCard,
  Shield,
  HelpCircle,
} from "lucide-react";

interface WelcomeScreenProps {
  userName?: string;
  onSuggestionClick: (message: string) => void;
}

const suggestions = [
  {
    icon: Search,
    label: "How do I scan a URL?",
    message: "How do I scan a URL for safety?",
  },
  {
    icon: BarChart3,
    label: "What's my credit status?",
    message: "What's my current credit and usage status?",
  },
  {
    icon: FileText,
    label: "Explain document analysis",
    message: "How does document analysis work?",
  },
  {
    icon: CreditCard,
    label: "What's included in Pro?",
    message: "What's included in the Pro plan?",
  },
  {
    icon: Shield,
    label: "Is my data safe?",
    message: "Is my data safe and private on TrustShield?",
  },
  {
    icon: HelpCircle,
    label: "Getting started guide",
    message: "How do I get started with TrustShield?",
  },
];

export function WelcomeScreen({ userName, onSuggestionClick }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-8">
      <div className="text-center mb-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary mx-auto mb-4 shadow-lg shadow-primary/20">
          <Shield className="h-7 w-7 text-white" />
        </div>
        <h2 className="text-xl font-bold mb-1">
          {userName ? `Hi, ${userName}!` : "Hi!"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {userName
            ? "What can I help you with today?"
            :             "I'm your AI Assistant, here to help with TrustShield."}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 w-full max-w-sm">
        {suggestions.map((s) => (
          <button
            key={s.label}
            onClick={() => onSuggestionClick(s.message)}
            className="flex items-start gap-2.5 rounded-xl border border-border/50 bg-muted/30 p-3 text-left text-sm transition-all hover:bg-muted/60 hover:border-primary/30 hover:shadow-sm active:scale-[0.98]"
          >
            <s.icon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span className="text-foreground/80 leading-snug">{s.label}</span>
          </button>
        ))}
      </div>

      {!userName && (
        <p className="text-xs text-muted-foreground mt-6">
          Sign in to save your conversations and see your account stats.
        </p>
      )}
    </div>
  );
}
