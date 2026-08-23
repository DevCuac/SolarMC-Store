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

    const sessionUser = session.user as any;
    const userId = sessionUser.id;
    const userEmail = session.user.email?.toLowerCase().trim();
    const sessionName = session.user.name?.trim();
    const sessionMcUsername = sessionUser.minecraftUsername?.trim();

    // 1. Try to find the user in the database
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(userId ? [{ id: userId }] : []),
          ...(userEmail ? [{ email: userEmail }] : []),
          ...(sessionMcUsername ? [{ minecraftUsername: sessionMcUsername }] : []),
        ],
      },
      include: {
        orders: {
          orderBy: { createdAt: "desc" },
        },
        accounts: true,
      },
    });

    // 2. If user doesn't exist yet in the database (e.g. logged in via OAuth or quick MC), create it!
    if (!user) {
      const emailToUse = userEmail || (sessionMcUsername ? `${sessionMcUsername.toLowerCase()}@player.local` : `user_${Date.now()}@solarmc.net`);
      const nameToUse = sessionName || sessionMcUsername || emailToUse.split("@")[0];
      const roleToUse = sessionUser.role || (emailToUse === "admin@solarmc.net" ? "ADMIN" : "USER");

      try {
        user = await prisma.user.create({
          data: {
            name: nameToUse,
            email: emailToUse,
            role: roleToUse,
            minecraftUsername: sessionMcUsername || nameToUse,
            minecraftEdition: sessionUser.minecraftEdition || "Java",
          },
          include: {
            orders: true,
            accounts: true,
          },
        });
      } catch (createErr) {
        // If creation fails due to duplicate email, fetch by email
        user = await prisma.user.findFirst({
          where: { email: emailToUse },
          include: {
            orders: { orderBy: { createdAt: "desc" } },
            accounts: true,
          },
        });
      }
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name || sessionName || "",
        email: user.email || userEmail || "",
        role: user.role || sessionUser.role || "USER",
        minecraftUsername: user.minecraftUsername || sessionMcUsername || "",
        minecraftEdition: user.minecraftEdition || sessionUser.minecraftEdition || "Java",
        creatorCode: user.creatorCode,
        creatorCommissionRate: user.creatorCommissionRate || 10,
        discordId: user.discordId,
        discordUsername: user.discordUsername,
        googleId: user.googleId,
        createdAt: user.createdAt,
        orders: user.orders ? user.orders.map((o) => ({
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
        })) : [],
        connectedAccounts: user.accounts ? user.accounts.map((a) => a.provider) : [],
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

    const sessionUser = session.user as any;
    const userId = sessionUser.id;
    const userEmail = session.user.email?.toLowerCase().trim();
    const sessionMcUsername = sessionUser.minecraftUsername?.trim();
    const body = await req.json();

    const { name, minecraftUsername, minecraftEdition, newPassword, currentPassword } = body;

    let user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(userId ? [{ id: userId }] : []),
          ...(userEmail ? [{ email: userEmail }] : []),
          ...(sessionMcUsername ? [{ minecraftUsername: sessionMcUsername }] : []),
        ],
      },
    });

    if (!user) {
      // Auto-create if updating
      const emailToUse = userEmail || `${(minecraftUsername || "user").toLowerCase()}@player.local`;
      user = await prisma.user.create({
        data: {
          name: name?.trim() || emailToUse.split("@")[0],
          email: emailToUse,
          role: sessionUser.role || "USER",
          minecraftUsername: minecraftUsername?.trim() || "Steve",
          minecraftEdition: minecraftEdition || "Java",
        },
      });
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
        role: updated.role,
        minecraftUsername: updated.minecraftUsername,
        minecraftEdition: updated.minecraftEdition,
      },
    });
  } catch (error: any) {
    console.error("Profile PUT error:", error);
    return NextResponse.json({ error: "Error al actualizar perfil" }, { status: 500 });
  }
}
