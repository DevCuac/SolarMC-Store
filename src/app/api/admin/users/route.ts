import { NextResponse } from "next/server";
import { checkAdminSession } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { authorized } = await checkAdminSession();
    if (!authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: { orders: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      users: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        minecraftUsername: u.minecraftUsername,
        minecraftEdition: u.minecraftEdition,
        creatorCode: u.creatorCode,
        creatorCommissionRate: u.creatorCommissionRate,
        ordersCount: u._count.orders,
        createdAt: u.createdAt,
      })),
    });
  } catch (error: any) {
    console.error("Admin users GET error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { authorized } = await checkAdminSession();
    if (!authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      email,
      password,
      role = "USER",
      minecraftUsername,
      minecraftEdition = "Java",
      creatorCode,
      creatorCommissionRate = 10,
    } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña requeridos" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json({ error: "Ya existe un usuario con ese correo" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role,
        minecraftUsername: minecraftUsername ? minecraftUsername.trim() : null,
        minecraftEdition,
        creatorCode: role === "PARTNER" && creatorCode ? creatorCode.toUpperCase().trim() : null,
        creatorCommissionRate: role === "PARTNER" ? parseFloat(creatorCommissionRate) || 10 : null,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error("Admin user create error:", error);
    return NextResponse.json({ error: error.message || "Failed to create user" }, { status: 500 });
  }
}
