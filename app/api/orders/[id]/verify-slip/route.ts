import { NextRequest, NextResponse } from "next/server";
import { verifyOrderSlip } from "@/lib/dbStore";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { action, reason } = body;

    if (!action || (action !== "approve" && action !== "reject")) {
      return NextResponse.json(
        { success: false, error: "action must be 'approve' or 'reject'" },
        { status: 400 }
      );
    }

    const updated = await verifyOrderSlip(id, action, reason);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: action === "approve" ? "Slip approved successfully" : "Slip rejected",
      data: updated,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to verify slip";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
