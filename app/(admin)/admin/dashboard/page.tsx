"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SeedOrder, SeedProduct } from "@/lib/seedData";
import {
  DollarSign,
  ShoppingBag,
  Clock,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Eye,
  ArrowRight,
  TrendingUp,
  Package,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<SeedOrder[]>([]);
  const [products, setProducts] = useState<SeedProduct[]>([]);
  const [selectedSlipOrder, setSelectedSlipOrder] = useState<SeedOrder | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      const [ordersRes, productsRes] = await fetchOrdersAndProducts();
      if (ordersRes?.success) setOrders(ordersRes.data);
      if (productsRes?.success) setProducts(productsRes.data);
    } catch (err) {
      console.error("Dashboard data error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  async function fetchOrdersAndProducts() {
    const [oRes, pRes] = await Promise.all([
      fetch("/api/orders").then((r) => r.json()),
      fetch("/api/products").then((r) => r.json()),
    ]);
    return [oRes, pRes];
  }

  // Calculate Metrics
  const totalRevenue = orders.reduce((sum, o) => {
    return o.paymentStatus === "VERIFIED" || o.paymentMethod === "COD"
      ? sum + o.totalAmount
      : sum;
  }, 0);

  const pendingSlips = orders.filter((o) => o.paymentStatus === "SLIP_REVIEW");

  const lowStockShades: {
    productName: string;
    slug: string;
    shadeName: string;
    shadeHex: string;
    sku: string;
    stock: number;
  }[] = [];

  products.forEach((p) => {
    p.shades.forEach((s) => {
      if (s.stock <= 10) {
        lowStockShades.push({
          productName: p.name,
          slug: p.slug,
          shadeName: s.shadeName,
          shadeHex: s.shadeHex,
          sku: s.sku,
          stock: s.stock,
        });
      }
    });
  });

  const handleVerifySlip = async (action: "approve" | "reject") => {
    if (!selectedSlipOrder) return;
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/orders/${selectedSlipOrder._id}/verify-slip`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          reason: action === "reject" ? rejectReason : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedSlipOrder(null);
        setRejectReason("");
        await loadData();
      }
    } catch (err) {
      console.error("Slip verification failed:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Page Title */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-on-surface">Store Overview</h1>
        <p className="text-xs text-on-surface-variant mt-1">
          Monitor cosmetics sales, review customer bank slips, and track inventory health.
        </p>
      </div>

      {/* 1. KEY METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric: Revenue */}
        <div className="p-6 rounded-3xl bg-surface border border-outline-variant/60 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Total Revenue
            </span>
            <div className="w-10 h-10 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="font-serif text-3xl font-bold text-on-surface">
              ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1 text-xs text-tertiary font-bold mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% this month</span>
            </div>
          </div>
        </div>

        {/* Metric: Total Orders */}
        <div className="p-6 rounded-3xl bg-surface border border-outline-variant/60 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Total Orders
            </span>
            <div className="w-10 h-10 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="font-serif text-3xl font-bold text-on-surface">
              {orders.length}
            </div>
            <div className="text-xs text-on-surface-variant mt-1">
              {orders.filter((o) => o.fulfillmentStatus === "PROCESSING").length} in processing
            </div>
          </div>
        </div>

        {/* Metric: Pending Slips Review */}
        <div
          className={`p-6 rounded-3xl border shadow-xs flex flex-col justify-between transition ${
            pendingSlips.length > 0
              ? "bg-amber-50/70 border-amber-300"
              : "bg-surface border-outline-variant/60"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Pending Slips
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="font-serif text-3xl font-bold text-amber-900">
              {pendingSlips.length}
            </div>
            <div className="text-xs text-amber-800 font-semibold mt-1">
              {pendingSlips.length > 0
                ? "⚠ Action required to unlock shipping"
                : "All slips cleared"}
            </div>
          </div>
        </div>

        {/* Metric: Low Stock Alert */}
        <div
          className={`p-6 rounded-3xl border shadow-xs flex flex-col justify-between transition ${
            lowStockShades.length > 0
              ? "bg-rose-50/70 border-rose-300"
              : "bg-surface border-outline-variant/60"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-900">
              Low Stock Alert
            </span>
            <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-800">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="font-serif text-3xl font-bold text-rose-900">
              {lowStockShades.length}
            </div>
            <div className="text-xs text-rose-800 font-semibold mt-1">
              {lowStockShades.length > 0 ? "Shades need replenishment" : "Inventory optimal"}
            </div>
          </div>
        </div>
      </div>

      {/* 2. QUICK SLIP APPROVAL QUEUE WIDGET */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-outline-variant/60 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-outline-variant/40">
          <div>
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-primary" />
              <h2 className="font-serif text-xl font-bold text-on-surface">
                Bank Transfer Slip Approval Queue
              </h2>
              {pendingSlips.length > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300">
                  {pendingSlips.length} Awaiting Review
                </span>
              )}
            </div>
            <p className="text-xs text-on-surface-variant mt-1">
              Inspect uploaded customer bank payment receipts and verify with 1-click.
            </p>
          </div>

          <Link
            href="/admin/orders"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {pendingSlips.length === 0 ? (
          <div className="py-10 text-center text-xs text-on-surface-variant space-y-2">
            <CheckCircle2 className="w-8 h-8 text-tertiary mx-auto" />
            <div className="font-bold text-on-surface text-sm">All bank slips are up to date!</div>
            <p>New receipts uploaded during checkout will appear here for instant approval.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-outline-variant/40 text-on-surface-variant font-semibold">
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Bank Ref / Slip</th>
                  <th className="py-3 px-4">Date Uploaded</th>
                  <th className="py-3 px-4 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {pendingSlips.map((order) => (
                  <tr key={order._id} className="hover:bg-surface-container-low/60 transition">
                    <td className="py-3 px-4 font-bold text-primary">
                      #{order.orderNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-on-surface">{order.customer.name}</div>
                      <div className="text-[11px] text-on-surface-variant">{order.customer.phone}</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-on-surface">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {order.bankSlip?.receiptUrl || order.bankSlip?.receiptBase64 ? (
                          <button
                            onClick={() => setSelectedSlipOrder(order)}
                            className="relative group block w-10 h-10 rounded-lg overflow-hidden border border-outline-variant shrink-0"
                            title="Click to zoom receipt"
                          >
                            <img
                              src={order.bankSlip.receiptBase64 || order.bankSlip.receiptUrl}
                              alt="Slip"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                              <Eye className="w-3.5 h-3.5" />
                            </div>
                          </button>
                        ) : null}
                        <div>
                          <span className="font-mono font-semibold text-on-surface block">
                            {order.bankSlip?.referenceNumber || "No Ref Provided"}
                          </span>
                          <span className="text-[10px] text-on-surface-variant">Bank Transfer</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant">
                      {order.bankSlip?.uploadedAt
                        ? new Date(order.bankSlip.uploadedAt).toLocaleString([], {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Recent"}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedSlipOrder(order)}
                          className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs border border-outline-variant/60 transition"
                        >
                          Review & Zoom
                        </button>
                        <button
                          onClick={async () => {
                            setSelectedSlipOrder(order);
                            setIsProcessing(true);
                            await fetch(`/api/orders/${order._id}/verify-slip`, {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ action: "approve" }),
                            });
                            setIsProcessing(false);
                            setSelectedSlipOrder(null);
                            await loadData();
                          }}
                          className="px-3 py-1.5 rounded-lg bg-tertiary hover:bg-tertiary/90 text-white font-bold text-xs transition"
                        >
                          Approve
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 3. LOW STOCK WATCHLIST & RECENT ACTIVITY (2 COLS) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Low Stock Watchlist */}
        <div className="p-6 rounded-3xl bg-surface border border-outline-variant/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/40">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              <h3 className="font-serif text-lg font-bold text-on-surface">
                Low Stock Shade Watchlist
              </h3>
            </div>
            <Link
              href="/admin/products"
              className="text-xs font-bold text-primary hover:underline"
            >
              Manage Catalog
            </Link>
          </div>

          <div className="space-y-2.5">
            {lowStockShades.length === 0 ? (
              <p className="text-xs text-on-surface-variant py-4 text-center">
                All shade variants have healthy stock levels.
              </p>
            ) : (
              lowStockShades.slice(0, 5).map((item) => (
                <div
                  key={item.sku}
                  className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs"
                      style={{ backgroundColor: item.shadeHex }}
                    />
                    <div>
                      <div className="font-bold text-on-surface">{item.productName}</div>
                      <div className="text-[11px] text-on-surface-variant">
                        {item.shadeName} • <span className="font-mono">{item.sku}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        item.stock === 0
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {item.stock} left
                    </span>
                    <Link
                      href="/admin/products"
                      className="text-primary hover:underline font-bold text-[11px]"
                    >
                      Restock
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Orders Stream */}
        <div className="p-6 rounded-3xl bg-surface border border-outline-variant/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/40">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-primary" />
              <h3 className="font-serif text-lg font-bold text-on-surface">
                Recent Order Feed
              </h3>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-primary hover:underline"
            >
              All Orders
            </Link>
          </div>

          <div className="space-y-2.5">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order._id}
                className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs"
              >
                <div>
                  <div className="font-bold text-primary">#{order.orderNumber}</div>
                  <div className="text-[11px] text-on-surface">
                    {order.customer.name} • {order.items.length} items
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-on-surface">${order.totalAmount.toFixed(2)}</div>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      order.paymentStatus === "VERIFIED"
                        ? "bg-emerald-100 text-emerald-800"
                        : order.paymentStatus === "SLIP_REVIEW"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. MODAL: SLIP INSPECTION & VERIFICATION */}
      {selectedSlipOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface max-w-2xl w-full rounded-3xl border border-outline-variant shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant/40">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Bank Transfer Verification
                </span>
                <h3 className="font-serif text-2xl font-bold text-on-surface">
                  Order #{selectedSlipOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSlipOrder(null)}
                className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant"
              >
                ✕
              </button>
            </div>

            {/* Customer & Amount Details */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-surface-container-low text-xs border border-outline-variant/40">
              <div>
                <span className="text-on-surface-variant block">Customer:</span>
                <strong className="text-on-surface text-sm">{selectedSlipOrder.customer.name}</strong>
                <p className="text-on-surface-variant">{selectedSlipOrder.customer.phone}</p>
                <p className="text-on-surface-variant">{selectedSlipOrder.customer.email}</p>
              </div>

              <div>
                <span className="text-on-surface-variant block">Total Order Value:</span>
                <strong className="text-primary text-xl font-serif">
                  ${selectedSlipOrder.totalAmount.toFixed(2)}
                </strong>
                <p className="text-on-surface-variant mt-1">
                  Reference:{" "}
                  <span className="font-mono font-bold text-on-surface">
                    {selectedSlipOrder.bankSlip?.referenceNumber || "None"}
                  </span>
                </p>
              </div>
            </div>

            {/* Slip Receipt Image Preview */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-on-surface">
                Uploaded Bank Receipt Image / Document:
              </label>
              <div className="rounded-2xl overflow-hidden border border-outline-variant bg-black/5 flex items-center justify-center max-h-[350px]">
                {selectedSlipOrder.bankSlip?.receiptBase64 ||
                selectedSlipOrder.bankSlip?.receiptUrl ? (
                  <img
                    src={
                      selectedSlipOrder.bankSlip.receiptBase64 ||
                      selectedSlipOrder.bankSlip.receiptUrl
                    }
                    alt="Receipt preview"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="p-8 text-center text-xs text-on-surface-variant">
                    No image file attached. Verify via transaction reference number.
                  </div>
                )}
              </div>
            </div>

            {/* Rejection Note Field */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-on-surface">
                Rejection Note (Only needed if rejecting slip):
              </label>
              <input
                type="text"
                placeholder="e.g. Incomplete transfer slip / amount mismatch"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-surface-container-low border border-outline-variant text-xs focus:outline-none focus:border-primary"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-outline-variant/40">
              <button
                onClick={() => handleVerifySlip("reject")}
                disabled={isProcessing}
                className="px-5 py-2.5 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-bold transition flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject Slip</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedSlipOrder(null)}
                  className="px-5 py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleVerifySlip("approve")}
                  disabled={isProcessing}
                  className="px-6 py-2.5 rounded-full bg-tertiary hover:bg-tertiary/90 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isProcessing ? "Verifying..." : "Approve & Mark Verified"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
