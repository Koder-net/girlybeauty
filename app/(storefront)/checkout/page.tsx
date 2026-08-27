"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Building2,
  UploadCloud,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  FileCheck,
  AlertCircle,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "United States",
    orderNotes: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<"COD" | "BANK_TRANSFER">("BANK_TRANSFER");
  const [bankSlipBase64, setBankSlipBase64] = useState<string>("");
  const [bankSlipName, setBankSlipName] = useState<string>("");
  const [referenceNumber, setReferenceNumber] = useState<string>("");
  const [promoCode, setPromoCode] = useState<string>("");
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [promoApplied, setPromoApplied] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const shippingFee = subtotal >= 45 || subtotal === 0 ? 0.0 : 4.99;
  const totalAmount = Math.max(0, subtotal + shippingFee - discountAmount);

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === "GIRLYGLOW") {
      const discount = Number((subtotal * 0.15).toFixed(2));
      setDiscountAmount(discount);
      setPromoApplied(true);
      setErrorMsg("");
    } else {
      setErrorMsg("Invalid promo code. Try GIRLYGLOW for 15% off!");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBankSlipName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBankSlipBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!customer.name || !customer.email || !customer.phone || !customer.address || !customer.city) {
      setErrorMsg("Please fill in all required shipping fields.");
      return;
    }

    if (items.length === 0) {
      setErrorMsg("Your bag is empty. Please add products before checking out.");
      return;
    }

    if (paymentMethod === "BANK_TRANSFER" && !bankSlipBase64 && !referenceNumber) {
      setErrorMsg("Please upload your bank transfer slip receipt or provide the transaction reference number.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customer,
        items,
        subtotal,
        shippingFee,
        discount: discountAmount,
        totalAmount,
        paymentMethod,
        bankSlip:
          paymentMethod === "BANK_TRANSFER"
            ? {
                receiptUrl:
                  bankSlipBase64 ||
                  "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80",
                receiptBase64: bankSlipBase64,
                referenceNumber: referenceNumber || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
                uploadedAt: new Date().toISOString(),
              }
            : undefined,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.data) {
        clearCart();
        router.push(`/order-confirmation/${data.data._id || data.data.orderNumber}`);
      } else {
        setErrorMsg(data.error || "Failed to place order.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Something went wrong while placing your order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-primary flex items-center justify-center gap-1.5">
          <Lock className="w-3.5 h-3.5" /> 256-Bit Encrypted Secure Checkout
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-on-surface">
          Complete Your Order
        </h1>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Customer Details & Payment (8 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-error-container text-error text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Contact & Shipping Address */}
          <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-outline-variant/60 shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-outline-variant/40">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h2 className="font-serif text-xl font-bold text-on-surface">
                Shipping & Contact Information
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-on-surface mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sophia Montgomery"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="sophia@example.com"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1.5">
                  Phone Number (for Courier SMS) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-on-surface mb-1.5">
                  Street Address & Apartment / Unit *
                </label>
                <input
                  type="text"
                  required
                  placeholder="742 Evergreen Terrace, Apt 4B"
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1.5">
                  City *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Beverly Hills"
                  value={customer.city}
                  onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1.5">
                  Postal / ZIP Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="90210"
                  value={customer.postalCode}
                  onChange={(e) => setCustomer({ ...customer, postalCode: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-on-surface mb-1.5">
                  Delivery Notes / Gate Code (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Leave package at front porch / call on arrival"
                  value={customer.orderNotes}
                  onChange={(e) => setCustomer({ ...customer, orderNotes: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* 2. Payment Method Selector */}
          <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-outline-variant/60 shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-outline-variant/40">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h2 className="font-serif text-xl font-bold text-on-surface">
                Select Payment Method
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Bank Transfer Option */}
              <div
                onClick={() => setPaymentMethod("BANK_TRANSFER")}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                  paymentMethod === "BANK_TRANSFER"
                    ? "border-primary bg-primary-fixed/20 shadow-xs"
                    : "border-outline-variant/60 bg-surface hover:border-primary-container"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-5 h-5 text-primary" />
                    <span className="font-bold text-sm text-on-surface">Direct Bank Transfer</span>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "BANK_TRANSFER"}
                    onChange={() => setPaymentMethod("BANK_TRANSFER")}
                    className="accent-primary"
                  />
                </div>
                <p className="text-xs text-on-surface-variant mt-2">
                  Upload transaction receipt or slip for fast order verification & priority packing.
                </p>
              </div>

              {/* Cash On Delivery Option */}
              <div
                onClick={() => setPaymentMethod("COD")}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                  paymentMethod === "COD"
                    ? "border-primary bg-primary-fixed/20 shadow-xs"
                    : "border-outline-variant/60 bg-surface hover:border-primary-container"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <Truck className="w-5 h-5 text-primary" />
                    <span className="font-bold text-sm text-on-surface">Cash on Delivery (COD)</span>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="accent-primary"
                  />
                </div>
                <p className="text-xs text-on-surface-variant mt-2">
                  Pay with exact cash directly to the courier upon doorstep delivery.
                </p>
              </div>
            </div>

            {/* Bank Transfer Details & Slip Upload Dropzone */}
            {paymentMethod === "BANK_TRANSFER" && (
              <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant/60 space-y-4 animate-fadeIn">
                <div className="text-xs space-y-1 bg-surface p-4 rounded-xl border border-outline-variant/40">
                  <div className="font-bold text-primary text-sm flex items-center gap-1.5 mb-2">
                    <Building2 className="w-4 h-4" />
                    <span>Official Girly Beauty Bank Account</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-on-surface">
                    <div><strong>Bank:</strong> Chase Manhattan Beauty Escrow</div>
                    <div><strong>Account Name:</strong> Girly Beauty LLC</div>
                    <div><strong>Account #:</strong> 8492-3841-0021</div>
                    <div><strong>Routing / Swift:</strong> 021000021 (CHASEUS33)</div>
                  </div>
                </div>

                {/* Slip Upload Box */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-on-surface">
                    Upload Bank Transfer Slip / Payment Receipt *
                  </label>

                  <div className="border-2 border-dashed border-primary-container/70 rounded-2xl p-5 text-center bg-surface hover:bg-surface-container-low transition cursor-pointer relative">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />

                    {bankSlipBase64 ? (
                      <div className="flex items-center justify-center gap-3">
                        <img
                          src={bankSlipBase64}
                          alt="Uploaded Receipt"
                          className="w-16 h-16 object-cover rounded-lg border border-primary/40 shadow-xs"
                        />
                        <div className="text-left">
                          <div className="text-xs font-bold text-tertiary flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Receipt Attached
                          </div>
                          <span className="text-[11px] text-on-surface-variant line-clamp-1">
                            {bankSlipName || "receipt.jpg"}
                          </span>
                          <span className="text-[10px] text-primary underline">Click to replace file</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <UploadCloud className="w-8 h-8 text-primary mx-auto opacity-80" />
                        <div className="text-xs font-bold text-on-surface">
                          Drag & drop receipt screenshot or click to browse
                        </div>
                        <p className="text-[11px] text-on-surface-variant">
                          Supports PNG, JPG, JPEG (Max 10MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Reference Number */}
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">
                    Bank Transaction Reference / Deposit Slip # (Optional if image uploaded)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. TXN-98412398"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface border border-outline-variant text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Order Summary Sidebar (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-outline-variant/60 shadow-lg sticky top-28 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant/40">
              <h3 className="font-serif text-xl font-bold text-on-surface">Order Summary</h3>
              <span className="text-xs font-semibold text-on-surface-variant">
                {items.length} items
              </span>
            </div>

            {/* Line items list */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.sku} className="flex gap-3 text-xs">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-14 h-14 object-cover rounded-lg border border-outline-variant shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <span className="font-bold text-on-surface truncate">{item.productName}</span>
                    <div className="flex items-center gap-1.5 text-on-surface-variant mt-0.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.shadeHex }}
                      />
                      <span>{item.shadeName} × {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-bold text-on-surface self-center">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Promo Code Input */}
            <div className="pt-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Discount code (GIRLYGLOW)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-xl bg-surface-container-low border border-outline-variant text-xs focus:outline-none focus:border-primary uppercase"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant text-xs font-bold text-primary transition"
                >
                  Apply
                </button>
              </div>
              {promoApplied && (
                <div className="text-[11px] text-tertiary font-semibold mt-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> 15% discount &apos;GIRLYGLOW&apos; applied!
                </div>
              )}
            </div>

            {/* Calculations breakdown */}
            <div className="pt-4 border-t border-outline-variant/40 space-y-2 text-xs text-on-surface-variant">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-on-surface">${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-primary">
                  <span>Discount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Standard Tracked Shipping</span>
                <span className="font-bold text-on-surface">
                  {shippingFee === 0 ? "FREE" : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-on-surface pt-3 border-t border-outline-variant/40">
                <span>Total Amount</span>
                <span className="text-xl text-primary">${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={isSubmitting || items.length === 0}
              className="w-full py-4 px-6 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-primary/30 transition transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Securing Your Order...</span>
              ) : (
                <>
                  <span>Place Order ✦ ${totalAmount.toFixed(2)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center text-[11px] text-on-surface-variant">
              By placing your order, you agree to Girly Beauty&apos;s Terms of Service and Glow Guarantee.
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
