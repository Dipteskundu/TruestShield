"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { ChatbotContainer } from "@/components/chatbot/ChatbotContainer";
import { useSidebarCollapsed } from "@/hooks/use-sidebar-collapsed";
import { cn } from "@/lib/utils";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { collapsed, toggle, mounted } = useSidebarCollapsed();

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar
        onMenuClick={() => setSidebarOpen(true)}
        sidebarCollapsed={mounted ? collapsed : false}
        onToggleSidebar={toggle}
      />
      <div className="flex flex-1 pt-14">
        <AppSidebar collapsed={mounted ? collapsed : false} />
        <main
          className={cn(
            "flex-1 p-6 pb-20 md:pb-6 transition-all duration-300 ease-in-out max-w-5xl mx-auto",
            mounted && collapsed ? "md:pl-16" : "md:pl-64"
          )}
        >
          {children}
        </main>
      </div>
      <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <ChatbotContainer />
    </div>
  );
}
