import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Coupon from "@/models/Coupon";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { code, amount } = await req.json();

    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(), 
      isActive: true,
      expiryDate: { $gt: new Date() }
    });

    if (!coupon) {
      return NextResponse.json({ error: "Invalid or expired coupon" }, { status: 404 });
    }

    if (amount < coupon.minOrderAmount) {
      return NextResponse.json({ 
        error: `Minimum order amount for this coupon is ${coupon.minOrderAmount} EGP` 
      }, { status: 400 });
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
    }

    let discountValue = 0;
    if (coupon.discountType === "percentage") {
      discountValue = (amount * coupon.discountAmount) / 100;
      if (coupon.maxDiscount && discountValue > coupon.maxDiscount) {
        discountValue = coupon.maxDiscount;
      }
    } else {
      discountValue = coupon.discountAmount;
    }

    return NextResponse.json({ 
      discount: discountValue,
      code: coupon.code
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
