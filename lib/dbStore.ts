import { connectToDatabase, isDbConnected } from "./mongodb";
import Product, { IProduct } from "@/models/Product";
import Order, { IOrder } from "@/models/Order";
import { INITIAL_PRODUCTS, INITIAL_ORDERS, SeedProduct, SeedOrder } from "./seedData";

// In-Memory store for resilient operation
interface InMemoryStore {
  products: SeedProduct[];
  orders: SeedOrder[];
}

declare global {
  // eslint-disable-next-line no-var
  var inMemoryStore: InMemoryStore | undefined;
}

let store = global.inMemoryStore;
if (!store) {
  store = global.inMemoryStore = {
    products: JSON.parse(JSON.stringify(INITIAL_PRODUCTS)),
    orders: JSON.parse(JSON.stringify(INITIAL_ORDERS)),
  };
}

export async function getProducts(query?: { category?: string; search?: string }): Promise<SeedProduct[]> {
  try {
    const conn = await connectToDatabase();
    if (conn && isDbConnected()) {
      const filter: Record<string, unknown> = { status: "active" };
      if (query?.category && query.category !== "All") {
        filter.category = query.category;
      }
      if (query?.search) {
        filter.$or = [
          { name: { $regex: query.search, $options: "i" } },
          { description: { $regex: query.search, $options: "i" } },
        ];
      }
      const products = await Product.find(filter).lean();
      if (products && products.length > 0) {
        return products.map((p) => ({
          ...p,
          _id: p._id.toString(),
        })) as unknown as SeedProduct[];
      }
    }
  } catch (err) {
    console.warn("Falling back to in-memory product store:", err);
  }

  // Memory store
  let list = [...(store?.products || INITIAL_PRODUCTS)];
  if (query?.category && query.category !== "All") {
    list = list.filter((p) => p.category === query.category);
  }
  if (query?.search) {
    const q = query.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.shades.some((s) => s.shadeName.toLowerCase().includes(q))
    );
  }
  return list;
}

export async function getProductBySlug(slug: string): Promise<SeedProduct | null> {
  try {
    const conn = await connectToDatabase();
    if (conn && isDbConnected()) {
      const product = await Product.findOne({ slug }).lean();
      if (product) {
        return {
          ...product,
          _id: product._id.toString(),
        } as unknown as SeedProduct;
      }
    }
  } catch (err) {
    console.warn("Falling back to in-memory product detail:", err);
  }

  const found = store?.products.find((p) => p.slug === slug);
  return found ? JSON.parse(JSON.stringify(found)) : null;
}

export async function createProduct(data: Partial<SeedProduct>): Promise<SeedProduct> {
  const newId = `prod_${Date.now()}`;
  const totalStock = (data.shades || []).reduce((acc, curr) => acc + (Number(curr.stock) || 0), 0);

  const newProduct: SeedProduct = {
    _id: newId,
    name: data.name || "Untitled Product",
    slug: data.slug || `product-${Date.now()}`,
    tagline: data.tagline || "",
    description: data.description || "",
    price: Number(data.price) || 0,
    compareAtPrice: Number(data.compareAtPrice) || 0,
    category: data.category || "Tinted Lip Oils",
    rating: data.rating || 5.0,
    reviewCount: data.reviewCount || 0,
    images: data.images && data.images.length > 0 ? data.images : [
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80"
    ],
    isBestseller: !!data.isBestseller,
    isNewArrival: !!data.isNewArrival,
    formulaBenefits: data.formulaBenefits || ["Vegan & Cruelty Free", "Skincare Infused"],
    ingredients: data.ingredients || "Full ingredients listed on outer packaging.",
    howToUse: data.howToUse || "Apply evenly with applicator.",
    shades: data.shades || [
      { shadeName: "Default Rose", shadeHex: "#d4788c", sku: "SKU-001", stock: 20, isAvailable: true }
    ],
    totalStock,
    status: data.status || "active",
  };

  try {
    const conn = await connectToDatabase();
    if (conn && isDbConnected()) {
      const created = await Product.create(newProduct);
      return { ...created.toObject(), _id: created._id.toString() } as unknown as SeedProduct;
    }
  } catch (err) {
    console.warn("Saved product to in-memory store:", err);
  }

  store?.products.unshift(newProduct);
  return newProduct;
}

export async function updateProduct(id: string, data: Partial<SeedProduct>): Promise<SeedProduct | null> {
  try {
    const conn = await connectToDatabase();
    if (conn && isDbConnected()) {
      const updated = await Product.findByIdAndUpdate(id, data, { new: true }).lean();
      if (updated) {
        return { ...updated, _id: updated._id.toString() } as unknown as SeedProduct;
      }
    }
  } catch (err) {
    console.warn("Updating in-memory product:", err);
  }

  const idx = store?.products.findIndex((p) => p._id === id);
  if (idx !== undefined && idx !== -1 && store) {
    store.products[idx] = {
      ...store.products[idx],
      ...data,
      totalStock: (data.shades || store.products[idx].shades).reduce((acc, curr) => acc + (Number(curr.stock) || 0), 0),
    };
    return JSON.parse(JSON.stringify(store.products[idx]));
  }
  return null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const conn = await connectToDatabase();
    if (conn && isDbConnected()) {
      await Product.findByIdAndDelete(id);
      return true;
    }
  } catch (err) {
    console.warn("Deleting in-memory product:", err);
  }

  if (store) {
    store.products = store.products.filter((p) => p._id !== id);
    return true;
  }
  return false;
}

export async function getOrders(statusFilter?: string): Promise<SeedOrder[]> {
  try {
    const conn = await connectToDatabase();
    if (conn && isDbConnected()) {
      const filter: Record<string, unknown> = {};
      if (statusFilter && statusFilter !== "ALL") {
        filter.paymentStatus = statusFilter;
      }
      const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();
      if (orders && orders.length > 0) {
        return orders.map((o) => ({
          ...o,
          _id: o._id.toString(),
          createdAt: o.createdAt?.toISOString(),
          updatedAt: o.updatedAt?.toISOString(),
        })) as unknown as SeedOrder[];
      }
    }
  } catch (err) {
    console.warn("Falling back to in-memory orders store:", err);
  }

  let list = [...(store?.orders || INITIAL_ORDERS)];
  if (statusFilter && statusFilter !== "ALL") {
    list = list.filter((o) => o.paymentStatus === statusFilter || o.fulfillmentStatus === statusFilter);
  }
  return list;
}

export async function getOrderById(idOrNumber: string): Promise<SeedOrder | null> {
  try {
    const conn = await connectToDatabase();
    if (conn && isDbConnected()) {
      const order = await Order.findOne({
        $or: [{ _id: idOrNumber.match(/^[0-9a-fA-F]{24}$/) ? idOrNumber : undefined }, { orderNumber: idOrNumber }],
      }).lean();
      if (order) {
        return {
          ...order,
          _id: order._id.toString(),
          createdAt: order.createdAt?.toISOString(),
          updatedAt: order.updatedAt?.toISOString(),
        } as unknown as SeedOrder;
      }
    }
  } catch (err) {
    console.warn("Falling back to in-memory order detail:", err);
  }

  const found = store?.orders.find((o) => o._id === idOrNumber || o.orderNumber === idOrNumber);
  return found ? JSON.parse(JSON.stringify(found)) : null;
}

export async function createOrder(data: Partial<SeedOrder>): Promise<SeedOrder> {
  const randSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `GB-${randSuffix}`;
  const newOrder: SeedOrder = {
    _id: `ord_${Date.now()}`,
    orderNumber,
    customer: data.customer || {
      name: "Guest Shopper",
      email: "guest@example.com",
      phone: "+1 555-000-0000",
      address: "123 Beauty Lane",
      city: "New York",
      postalCode: "10001",
      country: "United States",
    },
    items: data.items || [],
    subtotal: data.subtotal || 0,
    shippingFee: data.shippingFee || 0,
    discount: data.discount || 0,
    totalAmount: data.totalAmount || 0,
    paymentMethod: data.paymentMethod || "COD",
    paymentStatus: data.paymentMethod === "BANK_TRANSFER" ? "SLIP_REVIEW" : "PENDING_PAYMENT",
    fulfillmentStatus: "PROCESSING",
    bankSlip: data.bankSlip || {},
    trackingNumber: "",
    adminNotes: data.paymentMethod === "BANK_TRANSFER" ? "Customer uploaded bank transfer receipt." : "Cash on delivery.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const conn = await connectToDatabase();
    if (conn && isDbConnected()) {
      const created = await Order.create(newOrder);
      return {
        ...created.toObject(),
        _id: created._id.toString(),
        createdAt: created.createdAt?.toISOString(),
        updatedAt: created.updatedAt?.toISOString(),
      } as unknown as SeedOrder;
    }
  } catch (err) {
    console.warn("Order saved in memory fallback:", err);
  }

  store?.orders.unshift(newOrder);
  return newOrder;
}

export async function verifyOrderSlip(
  orderIdOrNumber: string,
  action: "approve" | "reject",
  reason?: string
): Promise<SeedOrder | null> {
  const updateData: Partial<SeedOrder> = {
    paymentStatus: action === "approve" ? "VERIFIED" : "FAILED",
    fulfillmentStatus: action === "approve" ? "PROCESSING" : "CANCELLED",
    adminNotes: action === "approve" ? "Payment slip verified and accepted." : `Payment slip rejected: ${reason || "Invalid slip"}.`,
    updatedAt: new Date().toISOString(),
  };

  try {
    const conn = await connectToDatabase();
    if (conn && isDbConnected()) {
      const updated = await Order.findOneAndUpdate(
        { $or: [{ _id: orderIdOrNumber.match(/^[0-9a-fA-F]{24}$/) ? orderIdOrNumber : undefined }, { orderNumber: orderIdOrNumber }] },
        {
          $set: {
            paymentStatus: updateData.paymentStatus,
            fulfillmentStatus: updateData.fulfillmentStatus,
            adminNotes: updateData.adminNotes,
            "bankSlip.verifiedAt": action === "approve" ? new Date() : undefined,
            "bankSlip.rejectionReason": action === "reject" ? reason : undefined,
          },
        },
        { new: true }
      ).lean();
      if (updated) {
        return {
          ...updated,
          _id: updated._id.toString(),
          createdAt: updated.createdAt?.toISOString(),
          updatedAt: updated.updatedAt?.toISOString(),
        } as unknown as SeedOrder;
      }
    }
  } catch (err) {
    console.warn("Updating slip in memory store:", err);
  }

  const idx = store?.orders.findIndex((o) => o._id === orderIdOrNumber || o.orderNumber === orderIdOrNumber);
  if (idx !== undefined && idx !== -1 && store) {
    store.orders[idx] = {
      ...store.orders[idx],
      ...updateData,
      bankSlip: {
        ...store.orders[idx].bankSlip,
        verifiedAt: action === "approve" ? new Date().toISOString() : undefined,
        rejectionReason: action === "reject" ? reason : undefined,
      },
    };
    return JSON.parse(JSON.stringify(store.orders[idx]));
  }
  return null;
}

export async function updateOrderFulfillment(
  orderIdOrNumber: string,
  fulfillmentStatus: "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED",
  trackingNumber?: string
): Promise<SeedOrder | null> {
  const updateData: Record<string, unknown> = {
    fulfillmentStatus,
    updatedAt: new Date().toISOString(),
  };
  if (trackingNumber) {
    updateData.trackingNumber = trackingNumber;
  }

  try {
    const conn = await connectToDatabase();
    if (conn && isDbConnected()) {
      const updated = await Order.findOneAndUpdate(
        { $or: [{ _id: orderIdOrNumber.match(/^[0-9a-fA-F]{24}$/) ? orderIdOrNumber : undefined }, { orderNumber: orderIdOrNumber }] },
        { $set: updateData },
        { new: true }
      ).lean();
      if (updated) {
        return {
          ...updated,
          _id: updated._id.toString(),
          createdAt: updated.createdAt?.toISOString(),
          updatedAt: updated.updatedAt?.toISOString(),
        } as unknown as SeedOrder;
      }
    }
  } catch (err) {
    console.warn("Updating order fulfillment in memory store:", err);
  }

  const idx = store?.orders.findIndex((o) => o._id === orderIdOrNumber || o.orderNumber === orderIdOrNumber);
  if (idx !== undefined && idx !== -1 && store) {
    store.orders[idx] = {
      ...store.orders[idx],
      fulfillmentStatus,
      trackingNumber: trackingNumber || store.orders[idx].trackingNumber,
      updatedAt: new Date().toISOString(),
    };
    return JSON.parse(JSON.stringify(store.orders[idx]));
  }
  return null;
}
