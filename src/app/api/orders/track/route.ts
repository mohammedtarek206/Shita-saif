import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const identifier = searchParams.get("identifier"); // email or phone
    const orderId = searchParams.get("orderId"); // orderNumber or _id

    if (!identifier || !orderId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();

    // Search by email/phone AND orderNumber/id
    const order = await Order.findOne({
      $and: [
        {
          $or: [
            { userEmail: identifier.toLowerCase() },
            { "shippingAddress.email": identifier.toLowerCase() },
            { "shippingAddress.phone": identifier }
          ]
        },
        {
          $or: [
            { orderNumber: orderId.toUpperCase() },
            { invoiceNumber: orderId.toUpperCase() }
          ]
        }
      ]
    }).populate("products.product");

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("Tracking error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
