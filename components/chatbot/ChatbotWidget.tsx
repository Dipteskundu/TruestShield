"use client";

import { Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatbotWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function ChatbotWidget({ isOpen, onToggle }: ChatbotWidgetProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={onToggle}
        size="icon"
        className="h-12 w-12 rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 hover:scale-105 transition-all duration-300 gradient-primary"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="h-5 w-5 text-white" />
        ) : (
          <Shield className="h-5 w-5 text-white" />
        )}
      </Button>
    </div>
  );
}
