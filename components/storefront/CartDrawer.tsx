"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotal,
    totalItems,
    remainingForFreeShipping,
    freeShippingProgress,
  } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 animate-fadeIn"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-surface border-l border-outline-variant shadow-2xl flex flex-col h-full transform transition ease-in-out duration-300">
          {/* Header */}
          <div className="p-5 border-b border-outline-variant/60 flex items-center justify-between bg-surface-container-low/80">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <h2 className="font-serif text-xl font-bold text-on-surface">Your Beauty Bag</h2>
              <span className="bg-primary/10 text-primary font-semibold text-xs px-2.5 py-0.5 rounded-full border border-primary/20">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-2 rounded-full hover:bg-surface-container-high text-on-surface-variant transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="bg-surface-container px-5 py-3.5 border-b border-outline-variant/40">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-medium text-on-surface-variant flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                {remainingForFreeShipping === 0 ? (
                  <span className="text-primary font-semibold">🎉 You unlocked FREE standard shipping!</span>
                ) : (
                  <span>
                    Add <strong className="text-primary">${remainingForFreeShipping.toFixed(2)}</strong> more for FREE shipping!
                  </span>
                )}
              </span>
              <span className="font-bold text-primary">{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="w-full bg-outline-variant/40 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary-container to-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4 text-primary">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <h3 className="font-serif text-lg font-bold text-on-surface mb-1">Your bag is empty</h3>
                <p className="text-sm text-on-surface-variant max-w-xs mb-6">
                  Discover our soft-glam lip oils, whipped cream soufflés, and dewy strobe illuminators.
                </p>
                <button
                  onClick={closeCart}
                  className="px-6 py-2.5 rounded-full bg-primary text-white font-medium text-sm hover:bg-primary/90 transition shadow-md"
                >
                  Explore Best Sellers
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.sku}
                  className="flex gap-3.5 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/50 hover:border-primary-container/60 transition"
                >
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-20 h-20 object-cover rounded-lg bg-surface border border-outline-variant/40 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/shop/${item.slug}`}
                          onClick={closeCart}
                          className="font-medium text-sm text-on-surface hover:text-primary transition line-clamp-1"
                        >
                          {item.productName}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.sku)}
                          className="text-outline hover:text-error transition p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Shade indicator */}
                      <div className="flex items-center gap-1.5 mt-1">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs shrink-0"
                          style={{ backgroundColor: item.shadeHex }}
                        />
                        <span className="text-xs text-on-surface-variant font-medium">
                          {item.shadeName}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-outline-variant/30">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-outline-variant rounded-lg bg-surface">
                        <button
                          onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                          className="p-1 text-on-surface-variant hover:text-primary transition"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-on-surface min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                          className="p-1 text-on-surface-variant hover:text-primary transition disabled:opacity-40"
                          disabled={item.quantity >= item.maxStock}
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="font-bold text-sm text-on-surface">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-outline-variant/60 bg-surface-container-low/90 space-y-3.5">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Subtotal</span>
                  <span className="font-bold text-on-surface text-base">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-on-surface-variant">
                  <span>Estimated Shipping</span>
                  <span>{remainingForFreeShipping === 0 ? "FREE" : "Calculated at checkout"}</span>
                </div>
                <div className="flex justify-between text-xs text-on-surface-variant">
                  <span>Taxes</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full py-3.5 px-6 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-primary/30 transition duration-200"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={closeCart}
                className="w-full text-center text-xs font-medium text-on-surface-variant hover:text-primary transition py-1"
              >
                Or Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
