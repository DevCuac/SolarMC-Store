import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const userEmail = session.user.email?.toLowerCase().trim();

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(userId ? [{ id: userId }] : []),
          ...(userEmail ? [{ email: userEmail }] : []),
        ],
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isPartner = user.role === "PARTNER" || user.role === "ADMIN";

    if (!isPartner || !user.creatorCode) {
      return NextResponse.json({
        isPartner: false,
        message: "No tienes el rol de Partner o no se te ha asignado un código de creador.",
      });
    }

    // Fetch all orders credited to this partner
    const creditedOrders = await prisma.order.findMany({
      where: {
        OR: [
          { partnerId: user.id },
          { creatorCode: user.creatorCode },
        ],
        status: "COMPLETED",
      },
      orderBy: { createdAt: "desc" },
    });

    let totalVolumeGenerated = 0;
    let totalCommissionsEarned = 0;

    creditedOrders.forEach((ord) => {
      totalVolumeGenerated += ord.total;
      totalCommissionsEarned += ord.creatorCommission || 0;
    });

    return NextResponse.json({
      isPartner: true,
      partner: {
        id: user.id,
        name: user.name,
        creatorCode: user.creatorCode,
        commissionRate: user.creatorCommissionRate || 10,
        totalSalesCount: creditedOrders.length,
        totalVolumeGenerated: parseFloat(totalVolumeGenerated.toFixed(2)),
        totalCommissionsEarned: parseFloat(totalCommissionsEarned.toFixed(2)),
      },
      salesHistory: creditedOrders.map((ord) => ({
        id: ord.id,
        orderNumber: ord.orderNumber,
        buyerPlayer: ord.minecraftUsername,
        orderTotal: ord.total,
        commissionEarned: ord.creatorCommission || 0,
        createdAt: ord.createdAt,
      })),
    });
  } catch (error: any) {
    console.error("Partner finances error:", error);
    return NextResponse.json({ error: "Failed to load partner finances" }, { status: 500 });
  }
}
