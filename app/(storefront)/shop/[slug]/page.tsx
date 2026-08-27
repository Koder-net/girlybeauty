"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { SeedProduct, SeedShade } from "@/lib/seedData";
import { useCart } from "@/context/CartContext";
import {
  Star,
  ShoppingBag,
  Heart,
  Share2,
  Check,
  Truck,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Plus,
  Minus,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [product, setProduct] = useState<SeedProduct | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedShade, setSelectedShade] = useState<SeedShade | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"benefits" | "ingredients" | "howToUse" | "reviews">("benefits");
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { addToCart, openCart } = useCart();

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;
      try {
        const res = await fetch(`/api/products/${slug}`);
        const json = await res.json();
        if (json.success && json.data) {
          setProduct(json.data);
          setSelectedImage(json.data.images[0] || "");
          if (json.data.shades && json.data.shades.length > 0) {
            setSelectedShade(json.data.shades[0]);
          }
        }
      } catch (err) {
        console.error("Error loading product:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="animate-pulse grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 h-[500px] bg-surface-container rounded-3xl" />
          <div className="lg:col-span-5 space-y-4">
            <div className="h-6 w-32 bg-surface-container rounded-full" />
            <div className="h-10 w-3/4 bg-surface-container rounded-lg" />
            <div className="h-6 w-24 bg-surface-container rounded-lg" />
            <div className="h-40 bg-surface-container rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="font-serif text-3xl font-bold text-on-surface mb-4">Product Not Found</h2>
        <p className="text-on-surface-variant mb-8">
          The cosmetic product you are looking for may have been retired or moved.
        </p>
        <Link
          href="/"
          className="px-8 py-3 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition shadow-md"
        >
          Return to Storefront
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedShade) return;
    addToCart(product, selectedShade, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleBuyNow = () => {
    if (!selectedShade) return;
    addToCart(product, selectedShade, quantity);
    router.push("/checkout");
  };

  const isLowStock = Boolean(selectedShade && selectedShade.stock > 0 && selectedShade.stock <= 5);
  const isOutOfStock = Boolean(selectedShade && selectedShade.stock === 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-16">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-on-surface-variant">
        <Link href="/" className="hover:text-primary transition">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/#bestsellers" className="hover:text-primary transition">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-on-surface truncate">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square rounded-3xl overflow-hidden bg-surface-container-low border border-outline-variant/60 shadow-lg">
            <img
              src={selectedImage || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
            {product.isBestseller && (
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary text-white text-xs font-bold tracking-wider uppercase shadow-md">
                ✦ Bestseller
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition shrink-0 ${
                    selectedImage === img
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-outline-variant/50 hover:border-primary-container"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Buy Box */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header & Rating */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                {product.category}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="font-bold text-on-surface">{product.rating.toFixed(1)}</span>
                <span>({product.reviewCount} reviews)</span>
              </div>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-on-surface leading-tight">
              {product.name}
            </h1>
            <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
              {product.tagline || product.description}
            </p>
          </div>

          {/* Pricing & Installments */}
          <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/50 flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-2.5">
                <span className="font-bold text-2xl text-on-surface">${product.price.toFixed(2)}</span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-sm text-outline line-through">
                    ${product.compareAtPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <span className="text-xs text-on-surface-variant block mt-1">
                4 interest-free payments of <strong>${(product.price / 4).toFixed(2)}</strong> with Klarna or Afterpay
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-tertiary-fixed/40 text-tertiary text-xs font-bold">
              In Stock
            </span>
          </div>

          {/* Shade Swatch Picker */}
          {product.shades && product.shades.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-on-surface-variant">
                  Select Shade:{" "}
                  <strong className="text-on-surface font-semibold">
                    {selectedShade?.shadeName}
                  </strong>
                </span>
                <span className="text-xs font-mono text-outline">
                  SKU: {selectedShade?.sku}
                </span>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                {product.shades.map((shade) => {
                  const isSelected = selectedShade?.sku === shade.sku;
                  return (
                    <button
                      key={shade.sku}
                      type="button"
                      onClick={() => setSelectedShade(shade)}
                      className={`relative w-10 h-10 rounded-full transition-all duration-200 border-2 ${
                        isSelected
                          ? "border-primary scale-110 shadow-md ring-2 ring-primary/30"
                          : "border-outline-variant/60 hover:scale-105"
                      }`}
                      style={{ backgroundColor: shade.shadeHex }}
                      title={`${shade.shadeName} - ${shade.sku}`}
                    >
                      {isSelected && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white drop-shadow-md" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Real-time stock status */}
              <div className="flex items-center gap-2 text-xs pt-1">
                {isOutOfStock ? (
                  <span className="text-error font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Out of stock for this shade
                  </span>
                ) : isLowStock ? (
                  <span className="text-amber-600 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Only {selectedShade?.stock} units left in stock!
                  </span>
                ) : (
                  <span className="text-tertiary font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ready to ship (Same day fulfillment)
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Quantity & Buy Box Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              {/* Stepper */}
              <div className="flex items-center border border-outline-variant rounded-full bg-surface px-3 py-2">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-1 text-on-surface-variant hover:text-primary transition"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 font-bold text-sm text-on-surface min-w-[32px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) =>
                      Math.min(selectedShade?.stock || 99, q + 1)
                    )
                  }
                  className="p-1 text-on-surface-variant hover:text-primary transition"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Bag CTA */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-3.5 px-6 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition shadow-md ${
                  isOutOfStock
                    ? "bg-surface-container text-outline cursor-not-allowed"
                    : isAdded
                    ? "bg-tertiary text-white"
                    : "bg-primary hover:bg-primary/90 text-white shadow-primary/20 hover:shadow-lg"
                }`}
              >
                {isOutOfStock ? (
                  <span>Sold Out</span>
                ) : isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Beauty Bag - ${(product.price * quantity).toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>

            {/* Express Buy Now */}
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="w-full py-3.5 px-6 rounded-full bg-on-surface hover:bg-black text-surface font-semibold text-sm transition flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Instant Buy / Checkout</span>
            </button>
          </div>

          {/* Reassurance list */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-outline-variant/50 text-xs text-on-surface-variant">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-primary" />
              <span>Free Shipping Over $45</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>30-Day Glow Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>100% Vegan & Cruelty-Free</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-primary" />
              <span>Skin Barrier Nourishing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs / Accordion Details */}
      <div className="border-t border-outline-variant/60 pt-10">
        <div className="flex items-center gap-8 border-b border-outline-variant/40 pb-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab("benefits")}
            className={`font-serif text-lg font-bold pb-2 transition border-b-2 whitespace-nowrap ${
              activeTab === "benefits"
                ? "text-primary border-primary"
                : "text-on-surface-variant border-transparent hover:text-on-surface"
            }`}
          >
            Formula & Benefits
          </button>
          <button
            onClick={() => setActiveTab("ingredients")}
            className={`font-serif text-lg font-bold pb-2 transition border-b-2 whitespace-nowrap ${
              activeTab === "ingredients"
                ? "text-primary border-primary"
                : "text-on-surface-variant border-transparent hover:text-on-surface"
            }`}
          >
            Clean Ingredients
          </button>
          <button
            onClick={() => setActiveTab("howToUse")}
            className={`font-serif text-lg font-bold pb-2 transition border-b-2 whitespace-nowrap ${
              activeTab === "howToUse"
                ? "text-primary border-primary"
                : "text-on-surface-variant border-transparent hover:text-on-surface"
            }`}
          >
            How to Apply
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`font-serif text-lg font-bold pb-2 transition border-b-2 whitespace-nowrap ${
              activeTab === "reviews"
                ? "text-primary border-primary"
                : "text-on-surface-variant border-transparent hover:text-on-surface"
            }`}
          >
            Customer Reviews ({product.reviewCount})
          </button>
        </div>

        <div className="py-8">
          {activeTab === "benefits" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.formulaBenefits.map((benefit, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-surface-container-low border border-outline-variant/40">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-on-surface">{benefit}</h4>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Tested on all skin tones with zero synthetic fragrances, parabens, or heavy mineral oils.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "ingredients" && (
            <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/40 space-y-4 max-w-3xl">
              <h4 className="font-serif font-bold text-base text-on-surface">Full Ingredient Breakdown:</h4>
              <p className="text-xs font-mono text-on-surface-variant leading-relaxed">
                {product.ingredients}
              </p>
              <div className="text-xs text-primary font-semibold flex items-center gap-2 pt-2">
                <Check className="w-4 h-4" />
                <span>Formulated without parabens, phthalates, sulfates, or microplastics.</span>
              </div>
            </div>
          )}

          {activeTab === "howToUse" && (
            <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/40 space-y-4 max-w-2xl">
              <h4 className="font-serif font-bold text-base text-on-surface">Pro Glam Routine:</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {product.howToUse}
              </p>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6 max-w-3xl">
              <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/40 flex items-center justify-between">
                <div>
                  <div className="font-serif text-3xl font-bold text-on-surface">{product.rating.toFixed(1)} / 5.0</div>
                  <div className="flex text-amber-500 my-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-on-surface-variant">Based on {product.reviewCount} verified purchases</span>
                </div>
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-full bg-surface border border-outline-variant hover:border-primary text-xs font-bold transition"
                >
                  Write a Review
                </button>
              </div>

              {/* Sample Verified Reviews */}
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-surface border border-outline-variant/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-on-surface">Jessica T.</span>
                      <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed/30 text-tertiary text-[10px] font-bold">
                        Verified Buyer
                      </span>
                    </div>
                    <span className="text-xs text-on-surface-variant">2 days ago</span>
                  </div>
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    &quot;01 Rose Whisper is hands down my favorite lip oil of the year! The formula is so juicy, hydrating, and smells like soft sweet berries without being overpowering.&quot;
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-surface border border-outline-variant/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-on-surface">Ariana L.</span>
                      <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed/30 text-tertiary text-[10px] font-bold">
                        Verified Buyer
                      </span>
                    </div>
                    <span className="text-xs text-on-surface-variant">1 week ago</span>
                  </div>
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    &quot;Glides on like silk and doesn&apos;t stick to my hair on windy days. I ended up ordering 3 more shades!&quot;
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
