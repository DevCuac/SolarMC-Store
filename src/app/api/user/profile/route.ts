import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

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
      include: {
        orders: {
          orderBy: { createdAt: "desc" },
        },
        accounts: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        minecraftUsername: user.minecraftUsername,
        minecraftEdition: user.minecraftEdition || "Java",
        creatorCode: user.creatorCode,
        creatorCommissionRate: user.creatorCommissionRate || 10,
        discordId: user.discordId,
        discordUsername: user.discordUsername,
        googleId: user.googleId,
        createdAt: user.createdAt,
        orders: user.orders.map((o) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          total: o.total,
          subtotal: o.subtotal,
          discountTotal: o.discountTotal,
          couponCode: o.couponCode,
          creatorCode: o.creatorCode,
          status: o.status,
          items: typeof o.items === "string" ? JSON.parse(o.items || "[]") : o.items,
          createdAt: o.createdAt,
        })),
        connectedAccounts: user.accounts.map((a) => a.provider),
      },
    });
  } catch (error: any) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const userEmail = session.user.email?.toLowerCase().trim();
    const body = await req.json();

    const { name, minecraftUsername, minecraftEdition, newPassword, currentPassword } = body;

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

    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (minecraftUsername !== undefined) updateData.minecraftUsername = minecraftUsername.trim();
    if (minecraftEdition !== undefined) updateData.minecraftEdition = minecraftEdition;

    // Handle password change if requested
    if (newPassword && newPassword.trim() !== "") {
      if (user.password && currentPassword) {
        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
          return NextResponse.json({ error: "La contraseña actual no es correcta" }, { status: 400 });
        }
      }
      updateData.password = await bcrypt.hash(newPassword.trim(), 10);
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "Perfil actualizado correctamente",
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        minecraftUsername: updated.minecraftUsername,
        minecraftEdition: updated.minecraftEdition,
      },
    });
  } catch (error: any) {
    console.error("Profile PUT error:", error);
    return NextResponse.json({ error: "Error al actualizar perfil" }, { status: 500 });
  }
}
