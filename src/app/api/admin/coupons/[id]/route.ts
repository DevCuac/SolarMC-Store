import { NextResponse } from "next/server";
import { checkAdminSession } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { authorized } = await checkAdminSession();
    if (!authorized) {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 401 });
    }

    const data = await req.json();
    const { code, discountType, discountValue, minSpend, maxUses, expiresAt, isActive } = data;

    const coupon = await prisma.coupon.update({
      where: { id: params.id },
      data: {
        ...(code && { code: code.trim().toUpperCase() }),
        ...(discountType && { discountType }),
        ...(discountValue !== undefined && { discountValue: parseFloat(discountValue) }),
        ...(minSpend !== undefined && { minSpend: parseFloat(minSpend) }),
        ...(maxUses !== undefined && { maxUses: maxUses ? parseInt(maxUses) : null }),
        ...(expiresAt !== undefined && { expiresAt: expiresAt ? new Date(expiresAt) : null }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      },
    });

    return NextResponse.json({ success: true, coupon });
  } catch (error: any) {
    console.error("Update coupon error:", error);
    return NextResponse.json({ error: error.message || "Failed to update coupon" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { authorized } = await checkAdminSession();
    if (!authorized) {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 401 });
    }

    await prisma.coupon.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "Coupon deleted successfully" });
  } catch (error: any) {
    console.error("Delete coupon error:", error);
    return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
  }
}
