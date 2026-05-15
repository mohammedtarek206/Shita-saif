import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions) as any;
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("Order Request Body:", JSON.stringify(body, null, 2));
    console.log("Session User:", session.user);

    const { 
      products, 
      subtotal, 
      tax, 
      shippingCost, 
      discount, 
      totalPrice, 
      couponCode,
      paymentMethod,
      shippingAddress,
      paymentDetails 
    } = body;

    // Generate unique numbers
    const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const trackingSteps = [
      { label: { ar: "قيد الانتظار", en: "Pending" }, completed: true, active: true, date: new Date() },
      { label: { ar: "تم التأكيد", en: "Confirmed" }, completed: false, active: false },
      { label: { ar: "جاري التجهيز", en: "Preparing" }, completed: false, active: false },
      { label: { ar: "تم الشحن", en: "Shipped" }, completed: false, active: false },
      { label: { ar: "تم التوصيل", en: "Delivered" }, completed: false, active: false },
    ];

    try {
      const order = await Order.create({
        user: (session.user.id && mongoose.Types.ObjectId.isValid(session.user.id)) ? session.user.id : undefined,
        userEmail: session.user.email?.toLowerCase(),
        products,
        subtotal,
        tax,
        shippingCost,
        discount,
        totalPrice,
        couponCode,
        paymentMethod,
        shippingAddress,
        paymentDetails,
        invoiceNumber,
        orderNumber,
        status: "pending",
        paymentStatus: "pending",
        trackingSteps,
        trackingHistory: [{ status: "pending", timestamp: new Date(), note: "Order placed successfully" }]
      });
      return NextResponse.json(order, { status: 201 });
    } catch (dbError: any) {
      console.error("Database Order Creation Error:", dbError);
      return NextResponse.json({ 
        error: dbError.message, 
        details: dbError.errors,
        stack: dbError.stack 
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error("General Order Route Error:", error);
    return NextResponse.json({ 
      error: error.message || "Unknown error occurred",
      details: error.errors || null
    }, { status: 500 });
  }
}

export async function GET(req: Request) {
  noStore();
  try {
    await connectDB();
    const session = await getServerSession(authOptions) as any;
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const userEmail = session.user.email?.toLowerCase();
    
    const isAdmin = session.user.role === "admin" || session.user.role === "superadmin";

    let query: any = {};
    if (!isAdmin) {
      const orConditions: any[] = [];
      
      if (session.user.id && mongoose.Types.ObjectId.isValid(session.user.id)) {
        orConditions.push({ user: session.user.id });
      }
      
      if (session.user.email) {
        const emailRegex = new RegExp(`^${session.user.email}$`, "i");
        orConditions.push({ userEmail: emailRegex });
        orConditions.push({ "shippingAddress.email": emailRegex });
      }

      query = orConditions.length > 0 ? { $or: orConditions } : { _id: null }; // _id: null to return empty if no user info
    }
    
    console.log("--- DEBUG ORDERS ---");
    console.log("Session User:", session.user);
    console.log("Query:", JSON.stringify(query));
    
    const orders = await Order.find(query).sort({ createdAt: -1 }).populate("products.product");
    console.log("Orders Found:", orders.length);
    console.log("--------------------");

    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
