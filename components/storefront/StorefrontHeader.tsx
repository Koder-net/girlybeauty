"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Search, Sparkles, Menu, X, ShieldCheck, Heart } from "lucide-react";

export default function StorefrontHeader() {
  const { toggleCart, totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navLinks = [
    { label: "Shop All", href: "/#bestsellers" },
    { label: "Tinted Lip Oils", href: "/shop/velvet-glaze-tinted-lip-oil" },
    { label: "Whipped Soufflé", href: "/shop/cloud-melt-whipped-souffle" },
    { label: "Glow Drops", href: "/shop/silk-glow-liquid-illuminator" },
    { label: "Butter Mattes", href: "/shop/velvet-matte-butter-lipstick" },
    { label: "Gift Sets", href: "/shop/the-soft-glam-vault-set" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-outline-variant/60 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex items-center">
            <Link href="/" className="group flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-on-surface group-hover:text-primary transition">
                Girly Beauty
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-on-surface-variant hover:text-primary transition tracking-wide py-1 border-b-2 border-transparent hover:border-primary/40"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container transition"
              aria-label="Search products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Admin Portal Quick Link */}
            <Link
              href="/admin/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-surface-container hover:bg-surface-container-high text-primary border border-outline-variant/60 transition"
              title="Open Admin Dashboard"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </Link>

            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className="relative p-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-primary border border-outline-variant/60 transition group"
              aria-label="View Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-white text-[11px] font-bold flex items-center justify-center shadow-md animate-bounce-short">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {searchOpen && (
          <div className="py-3 border-t border-outline-variant/40 animate-fadeIn">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/#bestsellers?search=${encodeURIComponent(searchQuery)}`;
                }
              }}
              className="relative max-w-xl mx-auto"
            >
              <input
                type="text"
                placeholder="Search lip oils, soufflés, shades, ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-surface-container-low rounded-full border border-outline-variant focus:outline-none focus:border-primary text-sm"
                autoFocus
              />
              <Search className="w-4 h-4 text-on-surface-variant absolute left-4 top-3.5" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-3 text-xs text-on-surface-variant hover:text-primary"
                >
                  Clear
                </button>
              )}
            </form>
          </div>
        )}
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-outline-variant/60 bg-surface px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-on-surface hover:bg-surface-container hover:text-primary transition"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-outline-variant/40 flex items-center justify-between">
            <Link
              href="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-sm font-semibold text-primary px-3 py-2 rounded-lg bg-surface-container"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Management</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
