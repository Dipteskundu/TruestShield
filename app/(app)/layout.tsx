"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { ChatbotContainer } from "@/components/chatbot/ChatbotContainer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex flex-1 pt-14">
        <AppSidebar />
        <main className="flex-1 p-6 pb-20 md:pb-6 md:pl-64 max-w-5xl mx-auto">{children}</main>
      </div>
      <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <ChatbotContainer />
    </div>
  );
}
