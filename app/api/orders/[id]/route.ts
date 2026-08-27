import { NextRequest, NextResponse } from "next/server";
import { getOrderById, updateOrderFulfillment } from "@/lib/dbStore";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const order = await getOrderById(id);
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: order });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch order";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { fulfillmentStatus, trackingNumber } = body;

    if (!fulfillmentStatus) {
      return NextResponse.json(
        { success: false, error: "fulfillmentStatus is required" },
        { status: 400 }
      );
    }

    const updated = await updateOrderFulfillment(id, fulfillmentStatus, trackingNumber);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update order";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
