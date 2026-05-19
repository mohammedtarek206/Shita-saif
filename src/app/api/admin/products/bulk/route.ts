import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { logActivity } from "@/services/logService";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || ((session.user as any).role !== "superadmin" && (session.user as any).role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ids, action, value } = await req.json();
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No product IDs provided" }, { status: 400 });
    }

    await connectDB();

    let details = "";

    switch (action) {
      case "set_discount":
        if (typeof value !== "number" || value < 0 || value > 100) {
          return NextResponse.json({ error: "Invalid discount percentage" }, { status: 400 });
        }
        
        await Product.updateMany(
          { _id: { $in: ids } },
          [
            {
              $set: {
                discountPrice: value > 0 
                  ? { $round: [{ $multiply: ["$price", 1 - value / 100] }, 0] }
                  : null
              }
            }
          ]
        );
        details = `Applied ${value}% bulk discount to ${ids.length} products`;
        break;

      case "add_stock":
        if (typeof value !== "number" || value <= 0) {
          return NextResponse.json({ error: "Invalid stock value" }, { status: 400 });
        }
        await Product.updateMany(
          { _id: { $in: ids } },
          { $inc: { stock: value } }
        );
        details = `Added ${value} units of stock to ${ids.length} products`;
        break;

      case "remove_stock":
        if (typeof value !== "number" || value <= 0) {
          return NextResponse.json({ error: "Invalid stock value" }, { status: 400 });
        }
        await Product.updateMany(
          { _id: { $in: ids } },
          { $inc: { stock: -value } }
        );
        // Ensure stock doesn't go below 0
        await Product.updateMany(
          { _id: { $in: ids }, stock: { $lt: 0 } },
          { $set: { stock: 0 } }
        );
        details = `Subtracted ${value} units of stock from ${ids.length} products`;
        break;

      case "delete":
        await Product.deleteMany({ _id: { $in: ids } });
        details = `Bulk deleted ${ids.length} products`;
        break;

      default:
        return NextResponse.json({ error: "Invalid bulk action" }, { status: 400 });
    }

    await logActivity(req, "BULK_EDIT_PRODUCTS", "Product", undefined, details);

    return NextResponse.json({ success: true, message: details });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
