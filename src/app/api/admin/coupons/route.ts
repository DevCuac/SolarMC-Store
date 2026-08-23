import { NextResponse } from "next/server";
import { checkAdminSession } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ coupons });
  } catch (error: any) {
    console.error("Fetch coupons error:", error);
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { authorized } = await checkAdminSession();
    if (!authorized) {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 401 });
    }

    const {
      code,
      discountType = "PERCENTAGE",
      discountValue,
      minSpend = 0,
      maxUses,
      expiresAt,
      isActive = true,
    } = await req.json();

    if (!code || discountValue === undefined) {
      return NextResponse.json(
        { error: "Coupon code and discount value are required" },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();

    const existing = await prisma.coupon.findUnique({
      where: { code: cleanCode },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Coupon code "${cleanCode}" already exists` },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: cleanCode,
        discountType: discountType === "FIXED" ? "FIXED" : "PERCENTAGE",
        discountValue: parseFloat(discountValue),
        minSpend: parseFloat(minSpend) || 0,
        maxUses: maxUses ? parseInt(maxUses) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive: Boolean(isActive),
      },
    });

    return NextResponse.json({ success: true, coupon });
  } catch (error: any) {
    console.error("Create coupon error:", error);
    return NextResponse.json({ error: error.message || "Failed to create coupon" }, { status: 500 });
  }
}
