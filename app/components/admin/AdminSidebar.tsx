"use client";

import {
  HomeIcon,
  UsersIcon,
  DocumentTextIcon,
  ShoppingBagIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Tooltip } from "../ui/Tooltip";

type AdminSidebarProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
};

export default function AdminSidebar({
  activeTab,
  onTabChange,
  collapsed,
  onToggleCollapse,
}: AdminSidebarProps) {
  const navItems = [
    { name: "Dashboard", tab: "dashboard", icon: HomeIcon },
    // { name: "Data KK", tab: "kk", icon: DocumentTextIcon },
    // { name: "Data Warga", tab: "warga", icon: UsersIcon },
    { name: "UMKM", tab: "umkm", icon: ShoppingBagIcon },
    { name: "Loker", tab: "loker", icon: DocumentTextIcon },
    { name: "Profile", tab: "profile", icon: UserCircleIcon },
  ];

  return (
    <div
      className={`bg-gray-800 text-white h-full fixed transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div
        className={`p-4 border-b border-gray-700 flex items-center ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        {!collapsed && (
          <div>
            <h1 className="text-xl font-bold">RW16 Ciwaruga</h1>
            <p className="text-sm text-gray-400">Admin Dashboard</p>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="text-gray-400 hover:text-white"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRightIcon className="h-5 w-5" />
          ) : (
            <ChevronLeftIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Tooltip content={item.name} disabled={!collapsed}>
                <button
                  onClick={() => onTabChange(item.tab)}
                  className={`w-full text-left flex items-center p-2 rounded-lg transition-colors ${
                    activeTab === item.tab
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 ${collapsed ? "mx-auto" : "mr-3"}`}
                  />
                  {!collapsed && <span className="truncate">{item.name}</span>}
                </button>
              </Tooltip>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
