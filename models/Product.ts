import mongoose, { Schema, Document, Model } from "mongoose";

export interface IShadeVariant {
  _id?: string;
  shadeName: string;
  shadeHex: string;
  sku: string;
  stock: number;
  image?: string;
  isAvailable?: boolean;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  rating: number;
  reviewCount: number;
  images: string[];
  isBestseller: boolean;
  isNewArrival: boolean;
  formulaBenefits: string[];
  ingredients: string;
  howToUse: string;
  shades: IShadeVariant[];
  totalStock: number;
  status: "active" | "draft" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

const ShadeVariantSchema = new Schema<IShadeVariant>(
  {
    shadeName: { type: String, required: true },
    shadeHex: { type: String, required: true },
    sku: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    image: { type: String, default: "" },
    isAvailable: { type: Boolean, default: true },
  },
  { _id: true }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    tagline: { type: String, default: "" },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, default: 0 },
    category: {
      type: String,
      required: true,
      enum: [
        "Tinted Lip Oils",
        "Plumping Glosses",
        "Velvet Mattes",
        "Cheek & Lip Balms",
        "Glow Highlighters",
        "Beauty Sets",
      ],
      default: "Tinted Lip Oils",
    },
    rating: { type: Number, default: 5.0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    images: { type: [String], default: [] },
    isBestseller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    formulaBenefits: { type: [String], default: [] },
    ingredients: { type: String, default: "" },
    howToUse: { type: String, default: "" },
    shades: { type: [ShadeVariantSchema], default: [] },
    totalStock: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["active", "draft", "archived"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Calculate totalStock before save
ProductSchema.pre("save", function () {
  if (this.shades && this.shades.length > 0) {
    this.totalStock = this.shades.reduce((acc, curr) => acc + (curr.stock || 0), 0);
  }
});

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
