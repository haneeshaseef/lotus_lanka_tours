"use client";

import { usePathname, useRouter } from "next/navigation";
import { Bell, Search, LogOut, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/tours": "Tour Management",
  "/admin/inquiries": "Inquiries",
  "/admin/custom-requests": "Custom Tour Requests",
  "/admin/blog": "Blog Management",
  "/admin/reviews": "Review Management",
  "/admin/media": "Media Library",
  "/admin/users": "User Management",
  "/admin/analytics": "Analytics",
};

export default function AdminTopbar() {
  const pathname = usePathname();
  const router = useRouter();
  const title =
    Object.entries(PAGE_TITLES)
      .sort(([a], [b]) => b.length - a.length)
      .find(([key]) => pathname.startsWith(key))?.[1] ?? "Admin";

  const [searchFocused, setSearchFocused] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/en/sign-in");
    router.refresh();
  };

  const initial = userEmail?.charAt(0).toUpperCase() ?? "A";

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0 shadow-sm">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="font-semibold text-gray-900 text-base leading-tight">{title}</h1>
          <p className="text-xs text-gray-400">Lotus Lanka Tours</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div
          className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-200 ${
            searchFocused
              ? "border-primary-300 bg-primary-50 shadow-sm"
              : "border-gray-200 bg-gray-50"
          }`}
        >
          <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none w-40"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>

        <button className="relative p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        </button>

        {/* User menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-linear-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xs font-bold">
              {initial}
            </div>
            <span className="hidden md:block text-sm text-gray-700 max-w-32 truncate">
              {userEmail ?? "Admin"}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="text-xs font-medium text-gray-900 truncate">{userEmail}</p>
                <p className="text-xs text-muted">Administrator</p>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
