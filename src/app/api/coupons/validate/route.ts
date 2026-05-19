import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Coupon from "@/models/Coupon";

// POST /api/coupons/validate  — checks if a code is valid and returns the discount
export async function POST(req: NextRequest) {
  await connectDB();
  const { code, orderTotal } = await req.json();

  if (!code) return NextResponse.json({ error: "No code provided" }, { status: 400 });

  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

  if (!coupon) return NextResponse.json({ error: "invalid" }, { status: 404 });
  if (new Date() > coupon.expiresAt) return NextResponse.json({ error: "expired" }, { status: 410 });
  if (coupon.usedCount >= coupon.maxUses) return NextResponse.json({ error: "maxed" }, { status: 409 });
  if (orderTotal < coupon.minOrder) return NextResponse.json({ error: "min_order", minOrder: coupon.minOrder }, { status: 422 });

  const discount =
    coupon.type === "percentage"
      ? Math.round((orderTotal * coupon.value) / 100)
      : Math.min(coupon.value, orderTotal);

  return NextResponse.json({ valid: true, discount, type: coupon.type, value: coupon.value });
}
