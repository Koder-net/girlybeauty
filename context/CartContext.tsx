"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { SeedProduct, SeedShade } from "@/lib/seedData";

export interface CartItem {
  productId: string;
  productName: string;
  slug: string;
  shadeName: string;
  shadeHex: string;
  sku: string;
  price: number;
  quantity: number;
  image: string;
  maxStock: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: SeedProduct, shade: SeedShade, quantity?: number) => void;
  updateQuantity: (sku: string, quantity: number) => void;
  removeFromCart: (sku: string) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
  freeShippingThreshold: number;
  remainingForFreeShipping: number;
  freeShippingProgress: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 45.0;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("girly_beauty_cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      // Ignore
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem("girly_beauty_cart", JSON.stringify(items));
      } catch {
        // Ignore
      }
    }
  }, [items, isInitialized]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addToCart = (product: SeedProduct, shade: SeedShade, quantity = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.sku === shade.sku);
      if (existingIndex > -1) {
        const copy = [...prev];
        const newQty = Math.min(
          copy[existingIndex].quantity + quantity,
          shade.stock || 99
        );
        copy[existingIndex] = {
          ...copy[existingIndex],
          quantity: newQty,
        };
        return copy;
      } else {
        const newItem: CartItem = {
          productId: product._id,
          productName: product.name,
          slug: product.slug,
          shadeName: shade.shadeName,
          shadeHex: shade.shadeHex,
          sku: shade.sku,
          price: product.price,
          quantity: Math.min(quantity, shade.stock || 99),
          image: shade.image || product.images[0] || "",
          maxStock: shade.stock || 99,
        };
        return [...prev, newItem];
      }
    });
    setIsOpen(true);
  };

  const updateQuantity = (sku: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(sku);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.sku === sku) {
          return {
            ...item,
            quantity: Math.min(quantity, item.maxStock),
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = (sku: string) => {
    setItems((prev) => prev.filter((item) => item.sku !== sku));
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const remainingForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - subtotal
  );

  const freeShippingProgress = Math.min(
    100,
    (subtotal / FREE_SHIPPING_THRESHOLD) * 100
  );

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        totalItems,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        remainingForFreeShipping,
        freeShippingProgress,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
