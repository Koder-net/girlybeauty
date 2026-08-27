"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SeedProduct } from "@/lib/seedData";
import ProductCard from "@/components/storefront/ProductCard";
import {
  Sparkles,
  ArrowRight,
  Star,
  CheckCircle2,
  Heart,
  Flame,
  Play,
  Video,
  ShoppingBag,
} from "lucide-react";

export default function StorefrontHomePage() {
  const [products, setProducts] = useState<SeedProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/products");
        const json = await res.json();
        if (json.success) {
          setProducts(json.data);
        }
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);

  const categories = [
    "All",
    "Tinted Lip Oils",
    "Cheek & Lip Balms",
    "Glow Highlighters",
    "Plumping Glosses",
    "Velvet Mattes",
    "Beauty Sets",
  ];

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const socialReels = [
    {
      id: "reel-1",
      creator: "@beautybychloe",
      views: "1.4M views",
      quote: "The shiniest non-sticky lip oil EVER. 01 Rose Whisper is my holy grail!",
      product: "Velvet Glaze Tinted Lip Oil",
      slug: "velvet-glaze-tinted-lip-oil",
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: "reel-2",
      creator: "@glamwithsoph",
      views: "890K views",
      quote: "This whipped soufflé melts right into cheeks and blurs all my texture ✨",
      product: "Cloud Melt Soufflé",
      slug: "cloud-melt-whipped-souffle",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: "reel-3",
      creator: "@mia_glows",
      views: "2.1M views",
      quote: "Glass skin in 2 drops! Mixed Champagne Glow into my moisturizer.",
      product: "Silk Glow Drops",
      slug: "silk-glow-liquid-illuminator",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: "reel-4",
      creator: "@ellie_beauty",
      views: "670K views",
      quote: "French Mauve is the ultimate everyday clean-girl lip. So buttery soft!",
      product: "Velvet Matte Lipstick",
      slug: "velvet-matte-butter-lipstick",
      image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <div className="space-y-24">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-gradient-to-b from-surface-container-low via-surface to-surface">
        {/* Glow ambient blurs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary-container/20 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-primary-fixed-dim/30 blur-2xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-primary-container/50 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  New Peptide Glaze Collection
                </span>
              </div>

              {/* Title */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-on-surface leading-[1.15]">
                Glaze Your Lips in <br className="hidden sm:inline" />
                <span className="italic font-normal text-primary">High-Shine</span> Velvet Luxury.
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-on-surface-variant max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Skincare-infused cosmetic formulations powered by tri-peptides, cloudberry seed oil, and cloud-whipped pigments. Zero stickiness, endless cushion.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <a
                  href="#bestsellers"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-primary/30 transition transform hover:-translate-y-0.5"
                >
                  <span>Shop Best Sellers</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <Link
                  href="/shop/velvet-glaze-tinted-lip-oil"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-surface hover:bg-surface-container text-on-surface font-semibold text-sm border border-outline-variant hover:border-primary transition flex items-center justify-center gap-2"
                >
                  <span>Explore Velvet Glaze ($22)</span>
                </Link>
              </div>

              {/* Trust signals */}
              <div className="pt-6 border-t border-outline-variant/40 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-on-surface-variant">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-tertiary" />
                  <span>100% Vegan & Cruelty-Free</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-tertiary" />
                  <span>12H Cushioning Moisture</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span><strong>4.9/5</strong> (15,000+ Reviews)</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main hero card */}
                <div className="relative rounded-3xl overflow-hidden border-2 border-outline-variant/60 bg-surface shadow-2xl group">
                  <img
                    src="https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=1000&auto=format&fit=crop&q=80"
                    alt="Velvet Glaze Lip Oil"
                    className="w-full h-[450px] object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="text-xs uppercase font-bold tracking-widest text-primary-fixed mb-1">
                      ✦ Trending on TikTok
                    </span>
                    <h3 className="font-serif text-2xl font-bold">Velvet Glaze Tinted Lip Oil</h3>
                    <p className="text-xs text-white/80 mt-1">Available in 6 juicy soft-glam shades</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-lg font-bold text-white">$22.00</span>
                      <Link
                        href="/shop/velvet-glaze-tinted-lip-oil"
                        className="px-4 py-2 rounded-full bg-white text-primary text-xs font-bold hover:bg-primary-fixed transition shadow-md"
                      >
                        Shop Now
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Floating pill badge */}
                <div className="absolute -top-4 -left-4 bg-surface/95 backdrop-blur-md p-3.5 rounded-2xl border border-outline-variant shadow-lg flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-on-surface">Selling Fast!</div>
                    <div className="text-[11px] text-on-surface-variant">Over 1,200 orders this week</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BESTSELLERS & CATEGORY TABS */}
      <section id="bestsellers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Curated Cosmetic Collection
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-on-surface">
            Soft-Glam Bestsellers
          </h2>
          <p className="text-sm text-on-surface-variant">
            Explore our iconic clean formulas. Pick your shade swatch below to preview and add straight to your beauty bag.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat
                  ? "bg-primary text-white shadow-md shadow-primary/20 scale-105"
                  : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant border border-outline-variant/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-96 rounded-2xl bg-surface-container animate-pulse border border-outline-variant/40"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 3. TIKTOK & REEL SOCIAL PROOF GRID */}
      <section className="bg-surface-container-low/60 border-y border-outline-variant/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                <Video className="w-4 h-4" />
                <span>As Seen On Your FYP</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-on-surface">
                Join the #GirlyGlow Club
              </h2>
              <p className="text-sm text-on-surface-variant">
                See real unboxings, glossy lip swatches, and skin transformations from beauty creators.
              </p>
            </div>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline"
            >
              <span>Follow @GirlyBeauty on TikTok</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {socialReels.map((reel) => (
              <div
                key={reel.id}
                className="rounded-2xl overflow-hidden bg-surface border border-outline-variant/60 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Media frame */}
                <div className="relative aspect-[4/5] overflow-hidden bg-surface-container">
                  <img
                    src={reel.image}
                    alt={reel.creator}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-between p-4 text-white">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-xs text-[11px] font-semibold">
                        {reel.views}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center">
                        <Play className="w-3.5 h-3.5 fill-white text-white translate-x-0.5" />
                      </div>
                    </div>

                    <div>
                      <span className="font-bold text-sm block">{reel.creator}</span>
                      <p className="text-xs text-white/90 italic line-clamp-2 mt-1">
                        &quot;{reel.quote}&quot;
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tagged product footer */}
                <div className="p-3.5 bg-surface-container-low/70 flex items-center justify-between border-t border-outline-variant/40">
                  <div className="text-xs">
                    <span className="text-[10px] text-on-surface-variant uppercase font-medium block">
                      Tagged Product
                    </span>
                    <span className="font-bold text-on-surface line-clamp-1">{reel.product}</span>
                  </div>
                  <Link
                    href={`/shop/${reel.slug}`}
                    className="p-2 rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-white transition"
                    title="Shop tagged item"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FORMULA & INGREDIENT ETHOS SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-surface-container p-8 sm:p-12 lg:p-16 border border-outline-variant/60 shadow-xs relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                ✦ Clean Peptide Science
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-on-surface leading-tight">
                Cosmetics that treat your skin with every swipe.
              </h2>
              <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
                We believe you shouldn&apos;t have to choose between rich pigment payoff and skin hydration. Every Girly Beauty formula is loaded with bio-compatible tri-peptides, wild cloudberry seed oil, and plant squalane.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-surface border border-outline-variant/50">
                  <h4 className="font-bold text-sm text-primary mb-1">Maxi-Lip™ Peptides</h4>
                  <p className="text-xs text-on-surface-variant">
                    Stimulates collagen synthesis and visibly defines lip contour over 28 days.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-surface border border-outline-variant/50">
                  <h4 className="font-bold text-primary text-sm mb-1">Wild Cloudberry Oil</h4>
                  <p className="text-xs text-on-surface-variant">
                    Rich in Omega-3 and Vitamin C for barrier repair and instant glass luster.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop&q=80"
                  alt="Formula bottle"
                  className="rounded-2xl w-80 h-96 object-cover shadow-xl border-2 border-surface"
                />
                <div className="absolute -bottom-4 -right-4 p-4 rounded-2xl bg-surface border border-outline-variant shadow-lg max-w-[200px]">
                  <div className="text-2xl font-bold font-serif text-primary">12-Hour</div>
                  <div className="text-xs text-on-surface-variant font-medium">
                    Continuous hydration clinically validated
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
