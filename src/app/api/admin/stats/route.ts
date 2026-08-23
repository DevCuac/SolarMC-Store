import { NextResponse } from "next/server";
import { checkAdminSession } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { authorized } = await checkAdminSession();
    if (!authorized) {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 401 });
    }

    const [
      totalOrders,
      ordersAggregate,
      totalProducts,
      totalUsers,
      totalCoupons,
      recentOrders,
      popularProducts,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: {
          total: true,
        },
      }),
      prisma.product.count(),
      prisma.user.count(),
      prisma.coupon.count(),
      prisma.order.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.findMany({
        take: 5,
        orderBy: { price: "desc" },
        include: { category: true },
      }),
    ]);

    const totalRevenue = ordersAggregate._sum.total || 0;

    return NextResponse.json({
      metrics: {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalUsers,
        totalCoupons,
      },
      recentOrders,
      popularProducts,
    });
  } catch (error: any) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
