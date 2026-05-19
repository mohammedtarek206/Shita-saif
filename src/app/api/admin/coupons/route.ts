import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Coupon from "@/models/Coupon";

import { logActivity } from "@/services/logService";

export async function GET() {
  await connectDB();
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  return NextResponse.json(coupons);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const coupon = await Coupon.create(body);
  if (coupon) {
    await logActivity(req, "CREATE_COUPON", "Coupon", coupon._id as string, `Created coupon ${coupon.code} with ${coupon.type} discount of ${coupon.value}`);
  }
  return NextResponse.json(coupon, { status: 201 });
}
