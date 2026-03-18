"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  MessageCircle,
  Users,
  Calendar,
  BarChart3,
  Smartphone,
  Brain,
  Send,
  QrCode,
  Settings,
  ChevronUp,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const MAIN_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Conversations", href: "/dashboard/conversations", icon: MessageCircle },
  { label: "Leads & CRM", href: "/dashboard/leads", icon: Users },
  { label: "Bookings", href: "/dashboard/bookings", icon: Calendar },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
];

const TOOLS_NAV_ITEMS: NavItem[] = [
  { label: "WhatsApp", href: "/dashboard/whatsapp", icon: Smartphone },
  { label: "AI Training", href: "/dashboard/training", icon: Brain },
  { label: "Follow-ups", href: "/dashboard/followups", icon: Send },
  { label: "QR Codes", href: "/dashboard/qr", icon: QrCode },
];

const BOTTOM_NAV_ITEMS: NavItem[] = [
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface SidebarProps {
  businessName?: string;
  businessEmail?: string;
  plan?: string;
}

export default function Sidebar({ businessName, businessEmail, plan = "starter" }: SidebarProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const planDisplay = plan.charAt(0).toUpperCase() + plan.slice(1);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-[#1a1a2e] p-2 text-white md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-[240px] flex-col bg-[#1a1a2e] transition-transform duration-300",
          "md:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Close button (mobile) */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="absolute right-4 top-4 text-white/60 hover:text-white md:hidden"
          aria-label="Close menu"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8a020]">
            <span className="text-lg font-bold text-[#1a1a2e]">C</span>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#e8a020]">CypAI</p>
            <p className="text-sm font-bold text-white">Dashboard</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {/* Main section */}
          <div className="mb-2 px-3">
            <p className="mb-2 px-4 text-[10px] font-semibold uppercase tracking-wider text-white/40">
              Main
            </p>
            {MAIN_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "group mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition",
                  isActive(item.href)
                    ? "border-l-[3px] border-[#e8a020] bg-white/5 text-[#e8a020]"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="my-4 border-t border-white/10" />

          {/* Tools section */}
          <div className="mb-2 px-3">
            <p className="mb-2 px-4 text-[10px] font-semibold uppercase tracking-wider text-white/40">
              Tools
            </p>
            {TOOLS_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "group mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition",
                  isActive(item.href)
                    ? "border-l-[3px] border-[#e8a020] bg-white/5 text-[#e8a020]"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="my-4 border-t border-white/10" />

          {/* Bottom section */}
          <div className="px-3">
            {BOTTOM_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "group mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition",
                  isActive(item.href)
                    ? "border-l-[3px] border-[#e8a020] bg-white/5 text-[#e8a020]"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Bottom user section */}
        <div className="border-t border-white/10 p-4">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex w-full items-center gap-3 rounded-lg p-2 transition hover:bg-white/5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8a020] text-sm font-bold text-[#1a1a2e]">
                {getInitials(businessName || "Business")}
              </div>
              <div className="flex-1 truncate text-left">
                <p className="truncate text-sm font-medium text-white">{businessName || "Your Business"}</p>
                <p className="truncate text-xs text-white/60">{businessEmail || "business@example.com"}</p>
              </div>
              <ChevronUp className={cn("h-4 w-4 text-white/60 transition", showUserMenu && "rotate-180")} />
            </button>

            {/* User dropdown menu */}
            {showUserMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 rounded-lg border border-white/10 bg-[#1a1a2e] py-2 shadow-xl">
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem("cypai-dashboard-email");
                    window.location.href = "/login";
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>

          {/* Plan badge */}
          <div className="mt-3 flex items-center justify-between">
            <span className="rounded-full bg-[#e8a020]/20 px-3 py-1 text-xs font-semibold text-[#e8a020]">
              {planDisplay} Plan
            </span>
            <Link
              href="/pricing"
              className="text-xs font-medium text-white/60 hover:text-[#e8a020]"
            >
              Upgrade
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-gray-200 bg-white md:hidden">
        {MAIN_NAV_ITEMS.slice(0, 4).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 p-2",
              isActive(item.href) ? "text-[#e8a020]" : "text-gray-500"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}
        <button
          onClick={() => setIsMobileOpen(true)}
          className="flex flex-col items-center gap-1 p-2 text-gray-500"
        >
          <Menu className="h-5 w-5" />
          <span className="text-[10px] font-medium">More</span>
        </button>
      </nav>
    </>
  );
}
