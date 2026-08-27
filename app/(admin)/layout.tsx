"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Bell,
  Search,
  Menu,
  X,
  FileCheck,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingSlipsCount, setPendingSlipsCount] = useState(0);

  useEffect(() => {
    async function checkPendingSlips() {
      try {
        const res = await fetch("/api/orders?status=SLIP_REVIEW");
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setPendingSlipsCount(data.data.length);
        }
      } catch {
        // Ignore
      }
    }
    checkPendingSlips();
    const interval = setInterval(checkPendingSlips, 15000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    {
      label: "Overview",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Products & Shades",
      href: "/admin/products",
      icon: Package,
    },
    {
      label: "Orders & Slips",
      href: "/admin/orders",
      icon: ShoppingBag,
      badge: pendingSlipsCount > 0 ? `${pendingSlipsCount} to verify` : undefined,
    },
  ];

  return (
    <div className="min-h-screen bg-surface-container-low flex flex-col lg:flex-row text-on-surface">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-surface border-r border-outline-variant/60 flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 space-y-8">
          {/* Logo & Brand */}
          <div className="flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif text-xl font-bold tracking-tight text-on-surface block leading-none">
                  Girly Beauty
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-primary">
                  Admin Console
                </span>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-outline px-3 block mb-2">
              Management
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-primary"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-white text-primary"
                          : "bg-amber-100 text-amber-800 border border-amber-300"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-outline-variant/40 space-y-4">
          <Link
            href="/"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-primary transition border border-outline-variant/50"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Storefront</span>
            </div>
            <span className="text-[10px] uppercase font-bold text-outline">Open</span>
          </Link>

          {/* Admin Profile */}
          <div className="flex items-center gap-3 pt-2">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
              alt="Admin"
              className="w-10 h-10 rounded-full object-cover border border-primary/30"
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-on-surface truncate">Admin Director</div>
              <div className="text-[11px] text-on-surface-variant truncate">admin@girlybeauty.com</div>
            </div>
            <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-outline-variant/60 h-16 flex items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
              <span className="font-semibold text-on-surface">Store Online</span>
              <span className="text-outline">• Ready for slip verifications</span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {pendingSlipsCount > 0 && (
              <Link
                href="/admin/orders"
                className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold animate-pulse"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>{pendingSlipsCount} Pending Slips to Review</span>
              </Link>
            )}

            <Link
              href="/"
              className="px-4 py-1.5 rounded-full bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Storefront</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
