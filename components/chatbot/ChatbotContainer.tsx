"use client";

import { useState } from "react";
import { ChatbotWidget } from "./ChatbotWidget";
import { ChatPanel } from "./ChatPanel";

export function ChatbotContainer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ChatbotWidget isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50">
          <ChatPanel />
        </div>
      )}
    </>
  );
}
