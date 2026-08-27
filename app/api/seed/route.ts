import { NextResponse } from "next/server";
import { connectToDatabase, isDbConnected } from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";
import User from "@/models/User";
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from "@/lib/seedData";

export async function POST() {
  try {
    const conn = await connectToDatabase();
    if (conn && isDbConnected()) {
      await Product.deleteMany({});
      await Order.deleteMany({});
      await User.deleteMany({});

      await Product.insertMany(INITIAL_PRODUCTS);
      await Order.insertMany(INITIAL_ORDERS);
      await User.create({
        name: "Admin User",
        email: "admin@girlybeauty.com",
        role: "admin",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      });

      return NextResponse.json({
        success: true,
        message: "Database successfully seeded into MongoDB!",
        counts: {
          products: INITIAL_PRODUCTS.length,
          orders: INITIAL_ORDERS.length,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Seeded into in-memory store (MongoDB server offline or in memory mode)",
      counts: {
        products: INITIAL_PRODUCTS.length,
        orders: INITIAL_ORDERS.length,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to seed database";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
