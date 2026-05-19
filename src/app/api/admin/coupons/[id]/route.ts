import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Coupon from "@/models/Coupon";

import { logActivity } from "@/services/logService";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const body = await req.json();
  const coupon = await Coupon.findByIdAndUpdate(id, body, { new: true });
  
  if (coupon) {
    await logActivity(req, "UPDATE_COUPON", "Coupon", id, `Updated coupon ${coupon.code}: ${JSON.stringify(body)}`);
  }

  return NextResponse.json(coupon);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const coupon = await Coupon.findById(id);
  if (coupon) {
    await Coupon.findByIdAndDelete(id);
    await logActivity(req, "DELETE_COUPON", "Coupon", id, `Deleted coupon with code ${coupon.code}`);
  }
  return NextResponse.json({ success: true });
}

