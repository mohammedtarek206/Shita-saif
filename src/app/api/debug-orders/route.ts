import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find({}).sort({ createdAt: -1 }).limit(10).lean();
    return NextResponse.json({ 
      success: true, 
      count: orders.length, 
      orders: orders.map(o => ({
        _id: o._id,
        user: o.user,
        userEmail: o.userEmail,
        shippingPhone: o.shippingAddress?.phone,
        createdAt: o.createdAt
      }))
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
