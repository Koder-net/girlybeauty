import { NextRequest, NextResponse } from "next/server";
import { getProducts, createProduct } from "@/lib/dbStore";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;

    const products = await getProducts({ category, search });
    return NextResponse.json({ success: true, count: products.length, data: products });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch products";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.price) {
      return NextResponse.json({ success: false, error: "Name and price are required" }, { status: 400 });
    }
    const product = await createProduct(body);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create product";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
