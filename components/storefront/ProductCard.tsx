"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SeedProduct, SeedShade } from "@/lib/seedData";
import { useCart } from "@/context/CartContext";
import { Star, ShoppingBag, Check } from "lucide-react";

export default function ProductCard({ product }: { product: SeedProduct }) {
  const { addToCart } = useCart();
  const [selectedShade, setSelectedShade] = useState<SeedShade>(
    product.shades[0] || {
      shadeName: "Default",
      shadeHex: "#d4788c",
      sku: "SKU-001",
      stock: 10,
    }
  );
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedShade, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  return (
    <div className="group rounded-2xl bg-surface border border-outline-variant/60 hover:border-primary-container hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* Product Image Container */}
      <Link
        href={`/shop/${product.slug}`}
        className="relative block aspect-square bg-surface-container-low overflow-hidden cursor-pointer"
      >
        <img
          src={selectedShade.image || product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isBestseller && (
            <span className="px-2.5 py-1 rounded-full bg-primary text-white text-[11px] font-bold tracking-wider uppercase shadow-xs">
              ✦ Viral Bestseller
            </span>
          )}
          {product.isNewArrival && (
            <span className="px-2.5 py-1 rounded-full bg-primary-container text-white text-[11px] font-bold tracking-wider uppercase shadow-xs">
              New Arrival
            </span>
          )}
        </div>

        {/* Quick Shade count badge */}
        {product.shades.length > 1 && (
          <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-surface/90 backdrop-blur-xs text-[11px] font-medium text-on-surface-variant border border-outline-variant/50">
            {product.shades.length} shades
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-on-surface-variant mb-1.5">
            <span className="font-semibold uppercase tracking-wider text-primary text-[10px]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-on-surface-variant/70 font-normal">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/shop/${product.slug}`} className="block">
            <h3 className="font-serif font-bold text-base text-on-surface group-hover:text-primary transition line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-on-surface-variant line-clamp-2 mt-1 leading-relaxed">
            {product.tagline || product.description}
          </p>
        </div>

        {/* Shade Swatch Selector */}
        {product.shades && product.shades.length > 0 && (
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-on-surface-variant font-medium text-[11px]">
                Shade: <strong className="text-on-surface">{selectedShade.shadeName}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {product.shades.map((shade) => {
                const isSelected = selectedShade.sku === shade.sku;
                return (
                  <button
                    key={shade.sku}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedShade(shade);
                    }}
                    title={`${shade.shadeName} (${shade.sku})`}
                    className={`relative w-6 h-6 rounded-full transition-all duration-200 border-2 ${
                      isSelected
                        ? "border-primary scale-110 shadow-xs ring-2 ring-primary/20"
                        : "border-outline-variant/60 hover:scale-105"
                    }`}
                    style={{ backgroundColor: shade.shadeHex }}
                  >
                    {isSelected && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Price & Add to Bag CTA */}
        <div className="pt-3 border-t border-outline-variant/40 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-lg text-on-surface">${product.price.toFixed(2)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-outline line-through">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={selectedShade.stock === 0}
            className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 ${
              selectedShade.stock === 0
                ? "bg-surface-container text-outline cursor-not-allowed"
                : isAdded
                ? "bg-tertiary text-white shadow-xs"
                : "bg-primary hover:bg-primary/90 text-white shadow-sm hover:shadow-md"
            }`}
          >
            {selectedShade.stock === 0 ? (
              <span>Sold Out</span>
            ) : isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
