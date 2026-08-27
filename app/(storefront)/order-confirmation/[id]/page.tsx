"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SeedOrder } from "@/lib/seedData";
import {
  CheckCircle2,
  Clock,
  Building2,
  Truck,
  ArrowRight,
  Sparkles,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";

export default function OrderConfirmationPage() {
  const params = useParams();
  const id = params?.id as string;
  const [order, setOrder] = useState<SeedOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      if (!id) return;
      try {
        const res = await fetch(`/api/orders/${id}`);
        const json = await res.json();
        if (json.success && json.data) {
          setOrder(json.data);
        }
      } catch (err) {
        console.error("Error loading order:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrder();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center animate-pulse space-y-4">
        <div className="w-16 h-16 bg-surface-container rounded-full mx-auto" />
        <div className="h-8 bg-surface-container rounded-lg w-64 mx-auto" />
        <div className="h-4 bg-surface-container rounded-lg w-48 mx-auto" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-on-surface">Order Received</h2>
        <p className="text-sm text-on-surface-variant">
          Your order has been recorded in the Girly Beauty fulfillment queue.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2.5 rounded-full bg-primary text-white text-xs font-bold"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 lg:py-16 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-tertiary-fixed/40 text-tertiary flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-primary">
          ✦ Order Confirmed
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-on-surface">
          Thank you, {order.customer.name}!
        </h1>
        <p className="text-sm text-on-surface-variant max-w-md mx-auto">
          We&apos;ve sent a confirmation email to <strong>{order.customer.email}</strong> with your tracking link.
        </p>
      </div>

      {/* Order Status Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-outline-variant/60 shadow-lg space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-outline-variant/40">
          <div>
            <span className="text-xs text-on-surface-variant">Order Identifier</span>
            <div className="font-serif text-2xl font-bold text-primary">
              #{order.orderNumber}
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-on-surface-variant">Payment Method</span>
            <div className="font-bold text-sm text-on-surface flex items-center gap-1.5 justify-end">
              {order.paymentMethod === "BANK_TRANSFER" ? (
                <>
                  <Building2 className="w-4 h-4 text-primary" />
                  <span>Direct Bank Transfer</span>
                </>
              ) : (
                <>
                  <Truck className="w-4 h-4 text-primary" />
                  <span>Cash on Delivery</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Verification Status Banner */}
        {order.paymentMethod === "BANK_TRANSFER" && (
          <div className="p-4 rounded-2xl bg-surface-container border border-primary-container/40 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <Clock className="w-4 h-4 animate-spin-slow" />
            </div>
            <div className="text-xs space-y-1">
              <div className="font-bold text-primary text-sm">
                {order.paymentStatus === "VERIFIED"
                  ? "✓ Bank Slip Verified & Payment Approved"
                  : "Bank Payment Slip Under Verification"}
              </div>
              <p className="text-on-surface-variant">
                {order.paymentStatus === "VERIFIED"
                  ? "Your transaction has been approved by the finance team. Your parcel is in priority packing."
                  : "Our admin team verifies bank deposit receipts within 1-2 hours during business hours."}
              </p>
            </div>
          </div>
        )}

        {/* Order Items */}
        <div className="space-y-3 pt-2">
          <h3 className="font-serif font-bold text-base text-on-surface">Items Ordered</h3>
          <div className="space-y-3 divide-y divide-outline-variant/30">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 pt-3 text-xs">
                <img
                  src={item.image}
                  alt={item.productName}
                  className="w-14 h-14 object-cover rounded-xl border border-outline-variant shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-on-surface text-sm">{item.productName}</div>
                  <div className="flex items-center gap-1.5 text-on-surface-variant mt-0.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.shadeHex }}
                    />
                    <span>{item.shadeName}</span>
                    <span>• Qty: {item.quantity}</span>
                  </div>
                </div>
                <div className="font-bold text-sm text-on-surface">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals Breakdown */}
        <div className="pt-4 border-t border-outline-variant/40 space-y-2 text-xs text-on-surface-variant">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-bold text-on-surface">${order.subtotal.toFixed(2)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-primary font-medium">
              <span>Discount</span>
              <span>-${order.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="font-bold text-on-surface">
              {order.shippingFee === 0 ? "FREE" : `$${order.shippingFee.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between text-base font-bold text-on-surface pt-3 border-t border-outline-variant/40">
            <span>Total Paid / Due</span>
            <span className="text-xl text-primary">${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Shipping Address Recap */}
        <div className="pt-4 border-t border-outline-variant/40 text-xs space-y-1">
          <span className="font-bold text-on-surface block">Shipping To:</span>
          <p className="text-on-surface-variant">
            {order.customer.address}, {order.customer.city} {order.customer.postalCode}, {order.customer.country}
          </p>
          <p className="text-on-surface-variant">Phone: {order.customer.phone}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/"
          className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          href="/admin/orders"
          className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-surface hover:bg-surface-container text-primary font-semibold text-xs border border-primary-container/60 flex items-center justify-center gap-2 transition"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>View in Admin Orders Portal</span>
        </Link>
      </div>
    </div>
  );
}
