import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    const {
      items,
      minecraftUsername,
      minecraftEdition = "Java",
      customerEmail,
      couponCode,
      creatorCode,
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Your shopping cart is empty" },
        { status: 400 }
      );
    }

    if (!minecraftUsername || minecraftUsername.trim() === "") {
      return NextResponse.json(
        { error: "Minecraft username is required for delivery" },
        { status: 400 }
      );
    }

    // Recalculate subtotal server-side based on actual database product prices
    let calculatedSubtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      const unitPrice = product ? product.price : parseFloat(item.price);
      const qty = parseInt(item.quantity) || 1;
      calculatedSubtotal += unitPrice * qty;

      let commandsArray: string[] = [];
      if (product && product.commands) {
        try {
          commandsArray = JSON.parse(product.commands);
        } catch {
          commandsArray = [product.commands];
        }
      }

      validatedItems.push({
        productId: item.productId,
        name: product ? product.name : item.name,
        price: unitPrice,
        quantity: qty,
        badge: product?.badge || item.badge || null,
        commands: commandsArray,
      });
    }

    // 1. Validate Discount Coupon (if any)
    let discountTotal = 0;
    let appliedCoupon = null;

    if (couponCode && typeof couponCode === "string" && couponCode.trim() !== "") {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.trim().toUpperCase() },
      });

      if (
        coupon &&
        coupon.isActive &&
        (!coupon.expiresAt || new Date() <= new Date(coupon.expiresAt)) &&
        (!coupon.maxUses || coupon.usesCount < coupon.maxUses) &&
        calculatedSubtotal >= coupon.minSpend
      ) {
        appliedCoupon = coupon;
        if (coupon.discountType === "PERCENTAGE") {
          discountTotal = (calculatedSubtotal * coupon.discountValue) / 100;
        } else {
          discountTotal = Math.min(coupon.discountValue, calculatedSubtotal);
        }

        // Increment coupon use counter
        await prisma.coupon.update({
          where: { id: coupon.id },
          data: { usesCount: { increment: 1 } },
        });
      }
    }

    const finalTotal = Math.max(0, calculatedSubtotal - discountTotal);

    // 2. Validate Partner / Creator Code (Support-A-Creator)
    let creditedPartner = null;
    let creatorCommission = 0;

    if (creatorCode && typeof creatorCode === "string" && creatorCode.trim() !== "") {
      const cleanCreator = creatorCode.trim().toUpperCase();
      creditedPartner = await prisma.user.findFirst({
        where: {
          creatorCode: cleanCreator,
          role: { in: ["PARTNER", "ADMIN"] },
        },
      });

      if (creditedPartner) {
        const rate = creditedPartner.creatorCommissionRate || 10;
        creatorCommission = parseFloat(((finalTotal * rate) / 100).toFixed(2));
      }
    }

    const orderNumber = `SOL-${Math.floor(100000 + Math.random() * 900000)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session?.user ? (session.user as any).id : null,
        customerEmail: customerEmail || session?.user?.email || `${minecraftUsername.toLowerCase()}@player.local`,
        minecraftUsername: minecraftUsername.trim(),
        minecraftEdition: minecraftEdition || "Java",
        subtotal: parseFloat(calculatedSubtotal.toFixed(2)),
        discountTotal: parseFloat(discountTotal.toFixed(2)),
        total: parseFloat(finalTotal.toFixed(2)),
        couponCode: appliedCoupon ? appliedCoupon.code : null,
        creatorCode: creditedPartner ? creditedPartner.creatorCode : null,
        creatorCommission,
        partnerId: creditedPartner ? creditedPartner.id : null,
        status: "COMPLETED",
        items: JSON.stringify(validatedItems),
        commandsExecuted: true,
      },
    });

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      total: order.total,
      subtotal: order.subtotal,
      discountTotal: order.discountTotal,
      creatorCode: order.creatorCode,
      minecraftUsername: order.minecraftUsername,
      message: `Order #${order.orderNumber} placed successfully! Digital perks are now dispatched to ${order.minecraftUsername}.`,
    });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to process checkout. Please try again." },
      { status: 500 }
    );
  }
}
