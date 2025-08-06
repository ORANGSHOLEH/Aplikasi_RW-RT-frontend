// components/admin/AdminLayout.tsx
"use client";

import { ReactNode, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Navbar */}
      <AdminNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} user={undefined} onLogout={function (): void {
              throw new Error("Function not implemented.");
          } } sidebarCollapsed={false} />
      
      {/* Sidebar Desktop */}
      <div className="hidden md:block">
        <AdminSidebar activeTab={""} onTabChange={function (tab: string): void {
                  throw new Error("Function not implemented.");
              } } collapsed={false} onToggleCollapse={function (): void {
                  throw new Error("Function not implemented.");
              } } />
      </div>
      
      {/* Sidebar Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-50 w-64 h-full">
            <AdminSidebar activeTab={""} onTabChange={function (tab: string): void {
                          throw new Error("Function not implemented.");
                      } } collapsed={false} onToggleCollapse={function (): void {
                          throw new Error("Function not implemented.");
                      } } />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="md:ml-64 pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
}