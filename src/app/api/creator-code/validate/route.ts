import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json({ valid: false, error: "Código inválido" }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();

    // Find Partner user with this creatorCode
    const partner = await prisma.user.findFirst({
      where: {
        creatorCode: cleanCode,
        role: { in: ["PARTNER", "ADMIN"] },
      },
      select: {
        id: true,
        name: true,
        minecraftUsername: true,
        creatorCode: true,
        creatorCommissionRate: true,
      },
    });

    if (!partner) {
      return NextResponse.json({ valid: false, error: "Código de creador no encontrado" }, { status: 404 });
    }

    return NextResponse.json({
      valid: true,
      creator: {
        id: partner.id,
        name: partner.name || partner.minecraftUsername || partner.creatorCode,
        code: partner.creatorCode,
        commissionRate: partner.creatorCommissionRate || 10,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ valid: false, error: "Error al verificar código" }, { status: 500 });
  }
}
