import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { code, subtotal } = await req.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { valid: false, message: "Please enter a valid coupon code" },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();

    const coupon = await prisma.coupon.findUnique({
      where: { code: cleanCode },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json(
        { valid: false, message: "Invalid or inactive coupon code" },
        { status: 404 }
      );
    }

    if (coupon.expiresAt && new Date() > new Date(coupon.expiresAt)) {
      return NextResponse.json(
        { valid: false, message: "This coupon code has expired" },
        { status: 400 }
      );
    }

    if (coupon.maxUses && coupon.usesCount >= coupon.maxUses) {
      return NextResponse.json(
        { valid: false, message: "This coupon code has reached its maximum usage limit" },
        { status: 400 }
      );
    }

    const currentSubtotal = parseFloat(subtotal) || 0;
    if (coupon.minSpend > 0 && currentSubtotal < coupon.minSpend) {
      return NextResponse.json(
        {
          valid: false,
          message: `Minimum cart total of $${coupon.minSpend.toFixed(2)} required for this coupon`,
        },
        { status: 400 }
      );
    }

    let discountAmount = 0;
    if (coupon.discountType === "PERCENTAGE") {
      discountAmount = (currentSubtotal * coupon.discountValue) / 100;
    } else {
      discountAmount = Math.min(coupon.discountValue, currentSubtotal);
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: parseFloat(discountAmount.toFixed(2)),
      },
      message: `Coupon "${coupon.code}" applied: ${
        coupon.discountType === "PERCENTAGE"
          ? `${coupon.discountValue}% OFF`
          : `$${coupon.discountValue.toFixed(2)} OFF`
      }!`,
    });
  } catch (error: any) {
    console.error("Coupon validation error:", error);
    return NextResponse.json(
      { valid: false, message: "Error validating coupon code" },
      { status: 500 }
    );
  }
}
