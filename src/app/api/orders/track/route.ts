import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  noStore();
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone")?.trim();

    if (!phone) {
      return NextResponse.json({ error: "Missing phone number" }, { status: 400 });
    }

    await connectDB();

    // Create a flexible regex for phone (ignores spaces, dashes, etc.)
    const phoneRegex = new RegExp(phone.replace(/\s+/g, ""), "i");

    // Search by phone, get the most recent order
    const order = await Order.findOne({
      "shippingAddress.phone": phoneRegex
    }).sort({ createdAt: -1 }).populate("products.product");

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("Tracking error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
