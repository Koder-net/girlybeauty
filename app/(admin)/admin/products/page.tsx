"use client";

import React, { useState, useEffect } from "react";
import { SeedProduct, SeedShade } from "@/lib/seedData";
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  Sparkles,
  Layers,
  AlertCircle,
  Hash,
  Palette,
  Eye,
} from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<SeedProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState<{
    name: string;
    slug: string;
    tagline: string;
    description: string;
    price: number;
    compareAtPrice: number;
    category: SeedProduct["category"];
    images: string[];
    isBestseller: boolean;
    isNewArrival: boolean;
    shades: SeedShade[];
  }>({
    name: "",
    slug: "",
    tagline: "",
    description: "",
    price: 22.0,
    compareAtPrice: 28.0,
    category: "Tinted Lip Oils",
    images: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80"],
    isBestseller: false,
    isNewArrival: false,
    shades: [
      { shadeName: "Rose Petal", shadeHex: "#d4788c", sku: "VG-ROSE-01", stock: 50, isAvailable: true },
    ],
  });

  const loadProducts = async () => {
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
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleOpenAddModal = () => {
    setEditingProductId(null);
    setFormData({
      name: "",
      slug: "",
      tagline: "",
      description: "",
      price: 22.0,
      compareAtPrice: 28.0,
      category: "Tinted Lip Oils",
      images: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80"],
      isBestseller: false,
      isNewArrival: false,
      shades: [
        { shadeName: "Rose Petal", shadeHex: "#d4788c", sku: "VG-ROSE-01", stock: 50, isAvailable: true },
      ],
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: SeedProduct) => {
    setEditingProductId(product._id);
    setFormData({
      name: product.name,
      slug: product.slug,
      tagline: product.tagline || "",
      description: product.description || "",
      price: product.price,
      compareAtPrice: product.compareAtPrice || 0,
      category: product.category,
      images: product.images,
      isBestseller: product.isBestseller,
      isNewArrival: product.isNewArrival,
      shades: JSON.parse(JSON.stringify(product.shades)),
    });
    setIsModalOpen(true);
  };

  const handleAddShade = () => {
    const nextIdx = formData.shades.length + 1;
    const prefix = formData.name
      ? formData.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 3)
      : "SH";
    const newShade: SeedShade = {
      shadeName: `New Shade ${nextIdx}`,
      shadeHex: "#954558",
      sku: `${prefix}-0${nextIdx}`,
      stock: 40,
      isAvailable: true,
    };
    setFormData({ ...formData, shades: [...formData.shades, newShade] });
  };

  const handleUpdateShade = (index: number, field: keyof SeedShade, value: string | number | boolean) => {
    const updated = [...formData.shades];
    updated[index] = {
      ...updated[index],
      [field]: field === "stock" ? Number(value) : value,
    };
    setFormData({ ...formData, shades: updated });
  };

  const handleRemoveShade = (index: number) => {
    if (formData.shades.length <= 1) return;
    const updated = formData.shades.filter((_, i) => i !== index);
    setFormData({ ...formData, shades: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug =
      formData.slug ||
      formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const payload = {
      ...formData,
      slug,
      totalStock: formData.shades.reduce((sum, s) => sum + (s.stock || 0), 0),
    };

    try {
      if (editingProductId) {
        await fetch(`/api/products/${editingProductId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      setIsModalOpen(false);
      await loadProducts();
    } catch (err) {
      console.error("Save product error:", err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this cosmetic product?")) return;
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      await loadProducts();
    } catch (err) {
      console.error("Delete product error:", err);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesCat = categoryFilter === "All" || p.category === categoryFilter;
    const matchesSearch =
      searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shades.some((s) => s.shadeName.toLowerCase().includes(searchQuery.toLowerCase()) || s.sku.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-on-surface">
            Product & Shade Inventory Manager
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Manage cosmetic formulas, shade swatches with hex codes, SKUs, and live inventory.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-6 py-3 rounded-full bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-md flex items-center gap-2 self-start transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-surface border border-outline-variant/60">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by product title, shade name, or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low rounded-xl border border-outline-variant text-xs focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            "All",
            "Tinted Lip Oils",
            "Cheek & Lip Balms",
            "Glow Highlighters",
            "Plumping Glosses",
            "Velvet Mattes",
            "Beauty Sets",
          ].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                categoryFilter === cat
                  ? "bg-primary text-white"
                  : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Catalog Table */}
      <div className="rounded-3xl bg-surface border border-outline-variant/60 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-outline-variant/40 bg-surface-container-low/60 text-on-surface-variant font-semibold">
                <th className="py-4 px-6">Product Details</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6">Shade Swatches & SKUs</th>
                <th className="py-4 px-6 text-center">Total Stock</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {filteredProducts.map((product) => {
                const totalUnits = product.shades.reduce((sum, s) => sum + (s.stock || 0), 0);
                return (
                  <tr key={product._id} className="hover:bg-surface-container-low/40 transition">
                    {/* Details */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-12 rounded-xl object-cover border border-outline-variant/60 bg-surface shrink-0"
                        />
                        <div>
                          <div className="font-bold text-sm text-on-surface flex items-center gap-2">
                            <span>{product.name}</span>
                            {product.isBestseller && (
                              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                                Bestseller
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-on-surface-variant">
                            slug: /{product.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-semibold text-[11px]">
                        {product.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-4 px-6 font-bold text-on-surface text-sm">
                      ${product.price.toFixed(2)}
                    </td>

                    {/* Shade Variants list */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1.5 max-w-xs">
                        {product.shades.map((shade) => (
                          <div
                            key={shade.sku}
                            className="flex items-center justify-between text-[11px] bg-surface-container-low px-2.5 py-1 rounded-lg border border-outline-variant/30"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs shrink-0"
                                style={{ backgroundColor: shade.shadeHex }}
                              />
                              <span className="font-medium text-on-surface">{shade.shadeName}</span>
                            </div>
                            <div className="flex items-center gap-2 font-mono text-[10px]">
                              <span className="text-outline">{shade.sku}</span>
                              <span
                                className={`font-bold px-1.5 py-0.5 rounded ${
                                  shade.stock <= 5
                                    ? "bg-rose-100 text-rose-800"
                                    : "bg-emerald-50 text-emerald-800"
                                }`}
                              >
                                {shade.stock} pcs
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Total Stock */}
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`font-bold text-sm ${
                          totalUnits <= 15 ? "text-rose-700 font-extrabold" : "text-on-surface"
                        }`}
                      >
                        {totalUnits} units
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(product)}
                          className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary transition"
                          title="Edit product & shades"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="p-2 rounded-lg bg-surface-container hover:bg-rose-100 text-outline hover:text-rose-700 transition"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface max-w-3xl w-full rounded-3xl border border-outline-variant shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant/40">
              <h3 className="font-serif text-2xl font-bold text-on-surface">
                {editingProductId ? "Edit Cosmetic Product & Shades" : "Add New Cosmetic Product"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-on-surface mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Velvet Glaze Tinted Lip Oil"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as SeedProduct["category"],
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant text-xs focus:outline-none focus:border-primary"
                  >
                    <option value="Tinted Lip Oils">Tinted Lip Oils</option>
                    <option value="Cheek & Lip Balms">Cheek & Lip Balms</option>
                    <option value="Glow Highlighters">Glow Highlighters</option>
                    <option value="Plumping Glosses">Plumping Glosses</option>
                    <option value="Velvet Mattes">Velvet Mattes</option>
                    <option value="Beauty Sets">Beauty Sets</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">
                    Price ($ USD) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-on-surface mb-1">
                    Tagline / One-Liner Description
                  </label>
                  <input
                    type="text"
                    placeholder="High-shine peptide lip oil that cushions lips"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-on-surface mb-1">
                    Full Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Rich formula description, texture, and finish..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-on-surface mb-1">
                    Primary Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.images[0] || ""}
                    onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant text-xs focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex items-center gap-6 sm:col-span-2 pt-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-on-surface cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isBestseller}
                      onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                      className="accent-primary"
                    />
                    <span>Mark as Viral Bestseller</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-on-surface cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isNewArrival}
                      onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                      className="accent-primary"
                    />
                    <span>Mark as New Arrival</span>
                  </label>
                </div>
              </div>

              {/* Shade Variants & Hex Code Manager */}
              <div className="space-y-4 pt-4 border-t border-outline-variant/40">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-lg font-bold text-on-surface">
                      Shade Variants & Inventory Swatches
                    </h4>
                    <p className="text-[11px] text-on-surface-variant">
                      Pick hex colors, generate unique SKUs, and assign stock for each shade.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddShade}
                    className="px-4 py-1.5 rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-white text-xs font-bold transition flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Shade</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.shades.map((shade, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-3 items-center p-3 rounded-2xl bg-surface-container-low border border-outline-variant/50 text-xs"
                    >
                      {/* Color Hex & Swatch Picker */}
                      <div className="col-span-12 sm:col-span-3 flex items-center gap-2">
                        <input
                          type="color"
                          value={shade.shadeHex}
                          onChange={(e) => handleUpdateShade(idx, "shadeHex", e.target.value)}
                          className="w-8 h-8 rounded-full border border-black/20 cursor-pointer shrink-0"
                          title="Pick hex color"
                        />
                        <input
                          type="text"
                          value={shade.shadeHex}
                          onChange={(e) => handleUpdateShade(idx, "shadeHex", e.target.value)}
                          placeholder="#d4788c"
                          className="w-20 px-2 py-1 bg-surface rounded-lg border border-outline-variant font-mono text-[11px]"
                        />
                      </div>

                      {/* Shade Name */}
                      <div className="col-span-12 sm:col-span-4">
                        <input
                          type="text"
                          required
                          placeholder="Shade Name (e.g. 01 Rose)"
                          value={shade.shadeName}
                          onChange={(e) => handleUpdateShade(idx, "shadeName", e.target.value)}
                          className="w-full px-3 py-1.5 bg-surface rounded-lg border border-outline-variant text-xs font-semibold"
                        />
                      </div>

                      {/* SKU */}
                      <div className="col-span-6 sm:col-span-3">
                        <input
                          type="text"
                          required
                          placeholder="SKU"
                          value={shade.sku}
                          onChange={(e) => handleUpdateShade(idx, "sku", e.target.value)}
                          className="w-full px-3 py-1.5 bg-surface rounded-lg border border-outline-variant font-mono text-xs"
                        />
                      </div>

                      {/* Stock Count & Remove */}
                      <div className="col-span-6 sm:col-span-2 flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          required
                          placeholder="Stock"
                          value={shade.stock}
                          onChange={(e) => handleUpdateShade(idx, "stock", e.target.value)}
                          className="w-16 px-2 py-1.5 bg-surface rounded-lg border border-outline-variant text-center font-bold text-xs"
                        />
                        {formData.shades.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveShade(idx)}
                            className="p-1.5 rounded-lg text-outline hover:text-rose-600 transition"
                            title="Remove shade"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-outline-variant/40">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 rounded-full bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-md transition"
                >
                  {editingProductId ? "Save Changes" : "Create Cosmetic Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
