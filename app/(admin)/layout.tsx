"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { ChatbotContainer } from "@/components/chatbot/ChatbotContainer";
import { useSidebarCollapsed } from "@/hooks/use-sidebar-collapsed";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { collapsed, toggle, mounted } = useSidebarCollapsed();

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar
        onMenuClick={() => setSidebarOpen(true)}
        sidebarCollapsed={mounted ? collapsed : false}
        onToggleSidebar={toggle}
      />
      <div className="flex flex-1">
        <AdminSidebar collapsed={mounted ? collapsed : false} />
        <main className="flex-1 p-6 pb-20 md:pb-6">{children}</main>
      </div>
      <MobileSidebar role="admin" open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <ChatbotContainer />
    </div>
  );
}
