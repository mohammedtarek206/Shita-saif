import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

    // Generate unique invoice number
    const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    try {
      const order = await Order.create({
        user: session.user.id,
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
        status: "pending",
        paymentStatus: "pending"
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
    const emailRegex = new RegExp(`^${session.user.email}$`, "i");
    const query = isAdmin ? {} : { 
      $or: [
        { user: session.user.id }, 
        { userEmail: emailRegex },
        { "shippingAddress.email": emailRegex } 
      ] 
    };
    
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
