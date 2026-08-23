import { NextResponse } from "next/server";
import { checkAdminSession } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { authorized } = await checkAdminSession();
    if (!authorized) {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");

    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { orderNumber: { contains: search } },
        { minecraftUsername: { contains: search } },
        { customerEmail: { contains: search } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true, email: true, role: true },
        },
      },
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error("Fetch orders error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
