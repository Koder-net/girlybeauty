"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Heart, Shield, RefreshCw, Send, Check } from "lucide-react";

export default function StorefrontFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <footer className="bg-surface-container-high/60 border-t border-outline-variant/60 pt-16 pb-12 mt-20">
      {/* Brand Value Props Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-8 rounded-2xl bg-surface border border-outline-variant/50 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-on-surface">Clean & Peptide Infused</h4>
              <p className="text-xs text-on-surface-variant">Skin-nourishing beauty formulas</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-on-surface">100% Vegan & Cruelty-Free</h4>
              <p className="text-xs text-on-surface-variant">Leaping Bunny certified</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-on-surface">Free Standard Shipping</h4>
              <p className="text-xs text-on-surface-variant">On all domestic orders over $45</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-on-surface">Verified Bank Slips & COD</h4>
              <p className="text-xs text-on-surface-variant">Secure multi-channel checkout</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-serif text-2xl font-bold text-on-surface">Girly Beauty</span>
            </Link>
            <p className="text-sm text-on-surface-variant leading-relaxed max-w-sm">
              Formulated to enhance your natural glow with soft-glam textures, juicy peptide tints, and weightless whipped pigments.
            </p>

            {/* Newsletter form */}
            <div className="pt-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary block mb-2">
                Join the Girly Club (Get 15% Off)
              </span>
              {subscribed ? (
                <div className="p-3 rounded-xl bg-tertiary-fixed/30 border border-tertiary/20 text-tertiary text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Welcome! Use code <strong>GIRLYGLOW</strong> at checkout.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-full bg-surface border border-outline-variant text-xs focus:outline-none focus:border-primary"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary/90 text-white text-xs font-semibold shrink-0 transition"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="font-semibold text-sm text-on-surface mb-4">Shop Collections</h4>
            <ul className="space-y-2.5 text-xs text-on-surface-variant">
              <li>
                <Link href="/shop/velvet-glaze-tinted-lip-oil" className="hover:text-primary transition">
                  Velvet Glaze Lip Oils
                </Link>
              </li>
              <li>
                <Link href="/shop/cloud-melt-whipped-souffle" className="hover:text-primary transition">
                  Cloud Melt Cheek Soufflé
                </Link>
              </li>
              <li>
                <Link href="/shop/silk-glow-liquid-illuminator" className="hover:text-primary transition">
                  Silk Glow Strobe Drops
                </Link>
              </li>
              <li>
                <Link href="/shop/velvet-matte-butter-lipstick" className="hover:text-primary transition">
                  Velvet Matte Lipsticks
                </Link>
              </li>
              <li>
                <Link href="/shop/the-soft-glam-vault-set" className="hover:text-primary transition">
                  The Soft-Glam Vault Sets
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-semibold text-sm text-on-surface mb-4">Customer Care</h4>
            <ul className="space-y-2.5 text-xs text-on-surface-variant">
              <li>
                <Link href="/checkout" className="hover:text-primary transition">
                  Payment Slip Verification
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-primary transition">
                  Shipping & Delivery FAQs
                </Link>
              </li>
              <li>
                <Link href="/#reviews" className="hover:text-primary transition">
                  Customer Reviews
                </Link>
              </li>
              <li>
                <Link href="/#bestsellers" className="hover:text-primary transition">
                  Shade Finder Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Admin & Portals */}
          <div>
            <h4 className="font-semibold text-sm text-on-surface mb-4">Store Management</h4>
            <ul className="space-y-2.5 text-xs text-on-surface-variant">
              <li>
                <Link href="/admin/dashboard" className="hover:text-primary transition font-medium">
                  ✦ Admin Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin/orders" className="hover:text-primary transition">
                  Bank Slips Review Queue
                </Link>
              </li>
              <li>
                <Link href="/admin/products" className="hover:text-primary transition">
                  Shade & Inventory Manager
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-outline-variant/40 flex flex-col sm:flex-row items-center justify-between text-xs text-on-surface-variant gap-4">
          <p>© {new Date().getFullYear()} Girly Beauty Inc. All rights reserved. Crafted with soft-glam love.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-primary cursor-pointer">Privacy Policy</span>
            <span className="hover:text-primary cursor-pointer">Terms of Service</span>
            <span className="hover:text-primary cursor-pointer">Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
