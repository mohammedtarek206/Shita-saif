import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendOrderNotification } from "@/services/notificationService";

import { logActivity } from "@/services/logService";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || ((session.user as any).role !== "superadmin" && (session.user as any).role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    await connectDB();
    
    // Check if status is being updated to push to tracking history
    const updateData: any = { ...body };
    
    if (body.status) {
      updateData.$push = {
        trackingHistory: {
          status: body.status,
          timestamp: new Date(),
          note: body.deliveryNotes || "Status updated by admin"
        }
      };
    }

    const order = await Order.findByIdAndUpdate(id, updateData, { new: true });
    
    if (order) {
      if (body.status) {
        await sendOrderNotification(order, body.status === "delivered" ? "delivered" : "status_update");
      }
      await logActivity(req, "UPDATE_ORDER", "Order", id, `Updated order status or details. Body: ${JSON.stringify(body)}`);
    }

    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "superadmin" && (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const order = await Order.findById(id);
    if (order) {
      await Order.findByIdAndDelete(id);
      await logActivity(req, "DELETE_ORDER", "Order", id, `Deleted order with ID ${id} (Total: ${order.total})`);
    }
    return NextResponse.json({ message: "Order deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
