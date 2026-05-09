"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Map, MessageSquare, FileText, Image, Star,
  Users, BarChart2, ChevronLeft, ChevronRight, Leaf, ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { href: "/admin/tours", icon: Map, label: "Tours" },
  { href: "/admin/inquiries", icon: MessageSquare, label: "Inquiries" },
  { href: "/admin/custom-requests", icon: ClipboardList, label: "Custom Requests" },
  { href: "/admin/blog", icon: FileText, label: "Blog" },
  { href: "/admin/reviews", icon: Star, label: "Reviews" },
  { href: "/admin/media", icon: Image, label: "Media" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/analytics", icon: BarChart2, label: "Analytics" },
];

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const isActive = (item: { href: string; exact?: boolean }) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <aside
      className={cn(
        "bg-gray-950 text-white flex flex-col transition-all duration-300 shrink-0 border-r border-gray-800",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-800 h-16 bg-gray-900">
        <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary-500 to-primary-700 flex items-center justify-center shrink-0 shadow-lg shadow-primary-900/50">
          <Leaf className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div>
            <span className="font-playfair font-bold text-sm leading-tight text-white block">
              Lotus Lanka
            </span>
            <span className="text-xs text-primary-400 font-normal tracking-wider uppercase">Admin Panel</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative overflow-hidden",
                active
                  ? "bg-linear-to-r from-primary-700/90 to-primary-600/70 text-white shadow-sm border-l-2 border-primary-400"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/70 border-l-2 border-transparent"
              )}
            >
              <item.icon className={cn("w-4 h-4 shrink-0 transition-transform duration-200", active ? "scale-110" : "")} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center gap-2 p-4 border-t border-gray-800 text-gray-500 hover:text-white hover:bg-gray-800/50 transition-all duration-200 text-xs"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <>
            <ChevronLeft className="w-4 h-4" />
            <span className="tracking-wide">Collapse</span>
          </>
        )}
      </button>
    </aside>
  );
}
