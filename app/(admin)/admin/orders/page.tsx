"use client";

import React, { useState, useEffect } from "react";
import { SeedOrder } from "@/lib/seedData";
import {
  ShoppingBag,
  Search,
  Building2,
  Truck,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  FileCheck,
  Filter,
  Check,
  AlertCircle,
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<SeedOrder[]>([]);
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSlipOrder, setSelectedSlipOrder] = useState<SeedOrder | null>(null);
  const [rejectReason, setRejectReason] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [trackingNumberInputs, setTrackingNumberInputs] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const json = await res.json();
      if (json.success) {
        setOrders(json.data);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

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
        await loadOrders();
      }
    } catch (err) {
      console.error("Slip verification error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateFulfillment = async (orderId: string, fulfillmentStatus: SeedOrder["fulfillmentStatus"]) => {
    try {
      const trackingNumber = trackingNumberInputs[orderId];
      await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fulfillmentStatus, trackingNumber }),
      });
      await loadOrders();
    } catch (err) {
      console.error("Failed to update fulfillment status:", err);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesFilter =
      activeStatusFilter === "ALL" ||
      o.paymentStatus === activeStatusFilter ||
      o.fulfillmentStatus === activeStatusFilter;

    const matchesSearch =
      searchQuery === "" ||
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.bankSlip?.referenceNumber && o.bankSlip.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const pendingSlipsCount = orders.filter((o) => o.paymentStatus === "SLIP_REVIEW").length;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-on-surface">
            Order Management & Slip Verification
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Review customer orders, inspect bank transfer deposit slips, and update dispatch fulfillment.
          </p>
        </div>
      </div>

      {/* Status Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-surface border border-outline-variant/60">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by Order #, Customer, Email, or Bank Reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low rounded-xl border border-outline-variant text-xs focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "ALL", label: "All Orders" },
            { id: "SLIP_REVIEW", label: "Slip Review Queue", count: pendingSlipsCount },
            { id: "PROCESSING", label: "Processing" },
            { id: "SHIPPED", label: "Shipped" },
            { id: "VERIFIED", label: "Payment Verified" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                activeStatusFilter === tab.id
                  ? "bg-primary text-white shadow-xs"
                  : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant"
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    activeStatusFilter === tab.id
                      ? "bg-white text-primary"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl bg-surface border border-outline-variant/60 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-outline-variant/40 bg-surface-container-low/60 text-on-surface-variant font-semibold">
                <th className="py-4 px-6">Order ID & Date</th>
                <th className="py-4 px-6">Customer & Address</th>
                <th className="py-4 px-6">Items & Shades</th>
                <th className="py-4 px-6">Payment / Slip</th>
                <th className="py-4 px-6">Fulfillment Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-on-surface-variant">
                    No orders matching the current filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-surface-container-low/40 transition">
                    {/* Order ID & Date */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-sm text-primary font-mono">
                        #{order.orderNumber}
                      </div>
                      <div className="text-[11px] text-on-surface-variant mt-0.5">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString([], {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Recent"}
                      </div>
                      <div className="font-bold text-xs text-on-surface mt-1">
                        ${order.totalAmount.toFixed(2)}
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-on-surface">{order.customer.name}</div>
                      <div className="text-[11px] text-on-surface-variant">{order.customer.phone}</div>
                      <div className="text-[11px] text-on-surface-variant truncate max-w-[180px]">
                        {order.customer.address}, {order.customer.city}
                      </div>
                    </td>

                    {/* Items */}
                    <td className="py-4 px-6">
                      <div className="space-y-1 max-w-[200px]">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-[11px]">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: item.shadeHex }}
                            />
                            <span className="truncate text-on-surface">
                              {item.productName} ({item.shadeName}) ×{item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Payment & Bank Slip */}
                    <td className="py-4 px-6">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          {order.paymentMethod === "BANK_TRANSFER" ? (
                            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px] border border-blue-200 flex items-center gap-1">
                              <Building2 className="w-3 h-3" /> Bank Transfer
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] border border-slate-300 flex items-center gap-1">
                              <Truck className="w-3 h-3" /> COD
                            </span>
                          )}

                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              order.paymentStatus === "VERIFIED"
                                ? "bg-emerald-100 text-emerald-800"
                                : order.paymentStatus === "SLIP_REVIEW"
                                ? "bg-amber-100 text-amber-800 animate-pulse"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                        </div>

                        {order.paymentMethod === "BANK_TRANSFER" && (
                          <div className="flex items-center gap-2 pt-1">
                            {order.bankSlip?.receiptUrl || order.bankSlip?.receiptBase64 ? (
                              <button
                                onClick={() => setSelectedSlipOrder(order)}
                                className="px-2 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-bold text-[10px] border border-outline-variant/60 flex items-center gap-1 transition"
                              >
                                <Eye className="w-3 h-3" />
                                <span>Inspect Receipt</span>
                              </button>
                            ) : (
                              <span className="text-[10px] text-on-surface-variant font-mono">
                                Ref: {order.bankSlip?.referenceNumber || "None"}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Fulfillment Status & Tracking */}
                    <td className="py-4 px-6">
                      <div className="space-y-2">
                        <select
                          value={order.fulfillmentStatus}
                          onChange={(e) =>
                            handleUpdateFulfillment(
                              order._id,
                              e.target.value as SeedOrder["fulfillmentStatus"]
                            )
                          }
                          className={`px-3 py-1 rounded-lg font-bold text-[11px] border focus:outline-none ${
                            order.fulfillmentStatus === "SHIPPED"
                              ? "bg-purple-50 text-purple-800 border-purple-200"
                              : order.fulfillmentStatus === "DELIVERED"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : "bg-surface-container text-on-surface border-outline-variant"
                          }`}
                        >
                          <option value="PROCESSING">Processing</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>

                        {order.fulfillmentStatus === "SHIPPED" && (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              placeholder="Tracking #"
                              defaultValue={order.trackingNumber}
                              onChange={(e) =>
                                setTrackingNumberInputs({
                                  ...trackingNumberInputs,
                                  [order._id]: e.target.value,
                                })
                              }
                              className="px-2 py-0.5 rounded border border-outline-variant text-[10px] w-24 bg-surface"
                            />
                            <button
                              onClick={() => handleUpdateFulfillment(order._id, "SHIPPED")}
                              className="p-1 rounded bg-primary text-white text-[10px]"
                              title="Save Tracking"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-6 text-right">
                      {order.paymentStatus === "SLIP_REVIEW" && (
                        <button
                          onClick={() => setSelectedSlipOrder(order)}
                          className="px-3 py-1.5 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-[11px] shadow-xs transition"
                        >
                          Verify Slip
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bank Slip Verification Modal */}
      {selectedSlipOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface max-w-2xl w-full rounded-3xl border border-outline-variant shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant/40">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Receipt Inspection & Verification
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

            {/* Slip Summary */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-surface-container-low text-xs border border-outline-variant/40">
              <div>
                <span className="text-on-surface-variant block">Customer Information:</span>
                <strong className="text-on-surface text-sm">{selectedSlipOrder.customer.name}</strong>
                <p className="text-on-surface-variant">{selectedSlipOrder.customer.phone}</p>
                <p className="text-on-surface-variant">{selectedSlipOrder.customer.email}</p>
              </div>

              <div>
                <span className="text-on-surface-variant block">Order Amount to Verify:</span>
                <strong className="text-primary text-xl font-serif">
                  ${selectedSlipOrder.totalAmount.toFixed(2)}
                </strong>
                <p className="text-on-surface-variant mt-1">
                  Bank Reference:{" "}
                  <span className="font-mono font-bold text-on-surface">
                    {selectedSlipOrder.bankSlip?.referenceNumber || "Not specified"}
                  </span>
                </p>
              </div>
            </div>

            {/* Receipt Image */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-on-surface">
                Uploaded Payment Slip / Bank Deposit Screen:
              </label>
              <div className="rounded-2xl overflow-hidden border border-outline-variant bg-black/5 flex items-center justify-center max-h-[380px]">
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
                    No image file attached.
                  </div>
                )}
              </div>
            </div>

            {/* Rejection Note */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-on-surface">
                Rejection Reason (If rejecting slip):
              </label>
              <input
                type="text"
                placeholder="e.g. Deposit amount does not match invoice total"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-surface-container-low border border-outline-variant text-xs focus:outline-none focus:border-primary"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-outline-variant/40">
              <button
                onClick={() => handleVerifySlip("reject")}
                disabled={isProcessing}
                className="px-5 py-2.5 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-bold transition flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject Receipt</span>
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
                  <span>{isProcessing ? "Verifying..." : "Approve & Unlock Processing"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
