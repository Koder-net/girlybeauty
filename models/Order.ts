import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrderItem {
  productId: string;
  productName: string;
  slug: string;
  shadeName: string;
  shadeHex: string;
  sku: string;
  price: number;
  quantity: number;
  image: string;
}

export interface IBankSlip {
  receiptUrl?: string;
  receiptBase64?: string;
  referenceNumber?: string;
  uploadedAt?: Date;
  verifiedAt?: Date;
  rejectionReason?: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    orderNotes?: string;
  };
  items: IOrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  totalAmount: number;
  paymentMethod: "COD" | "BANK_TRANSFER";
  paymentStatus: "PENDING_PAYMENT" | "SLIP_REVIEW" | "VERIFIED" | "FAILED";
  fulfillmentStatus: "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  bankSlip?: IBankSlip;
  trackingNumber?: string;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    slug: { type: String, required: true },
    shadeName: { type: String, required: true },
    shadeHex: { type: String, required: true },
    sku: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, default: "" },
  },
  { _id: false }
);

const BankSlipSchema = new Schema<IBankSlip>(
  {
    receiptUrl: { type: String, default: "" },
    receiptBase64: { type: String, default: "" },
    referenceNumber: { type: String, default: "" },
    uploadedAt: { type: Date, default: Date.now },
    verifiedAt: { type: Date },
    rejectionReason: { type: String, default: "" },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: "United States" },
      orderNotes: { type: String, default: "" },
    },
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["COD", "BANK_TRANSFER"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING_PAYMENT", "SLIP_REVIEW", "VERIFIED", "FAILED"],
      default: "PENDING_PAYMENT",
    },
    fulfillmentStatus: {
      type: String,
      enum: ["PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PROCESSING",
    },
    bankSlip: { type: BankSlipSchema, default: () => ({}) },
    trackingNumber: { type: String, default: "" },
    adminNotes: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
