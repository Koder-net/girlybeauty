import React from "react";
import Link from "next/link";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/storefront/CartDrawer";
import StorefrontHeader from "@/components/storefront/StorefrontHeader";
import StorefrontFooter from "@/components/storefront/StorefrontFooter";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-surface text-on-surface">
        {/* Top Announcement Bar */}
        <div className="bg-primary text-on-primary text-xs font-semibold py-2 px-4 text-center tracking-wider flex items-center justify-center gap-2 overflow-hidden shadow-xs">
          <span className="inline-block animate-pulse">✦</span>
          <span>FREE SHIPPING ON ORDERS OVER $45 &nbsp;|&nbsp; USE CODE: <span className="underline decoration-dotted font-bold">GIRLYGLOW</span> FOR 15% OFF</span>
          <span className="inline-block animate-pulse">✦</span>
        </div>

        {/* Brand Header */}
        <StorefrontHeader />

        {/* Main Content */}
        <main className="flex-1">{children}</main>

        {/* Slide-out Cart Drawer */}
        <CartDrawer />

        {/* Storefront Footer */}
        <StorefrontFooter />
      </div>
    </CartProvider>
  );
}
