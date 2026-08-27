import { NextRequest, NextResponse } from "next/server";
import { getOrders, createOrder } from "@/lib/dbStore";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "ALL";

    const orders = await getOrders(status);
    return NextResponse.json({ success: true, count: orders.length, data: orders });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch orders";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.customer || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Customer details and items are required" },
        { status: 400 }
      );
    }
    const order = await createOrder(body);
    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
