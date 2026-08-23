import { NextResponse } from "next/server";
import { checkAdminSession } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { authorized } = await checkAdminSession();
    if (!authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const {
      name,
      email,
      role,
      minecraftUsername,
      minecraftEdition,
      creatorCode,
      creatorCommissionRate,
      password,
    } = body;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email.toLowerCase().trim();
    if (role !== undefined) updateData.role = role;
    if (minecraftUsername !== undefined) updateData.minecraftUsername = minecraftUsername ? minecraftUsername.trim() : null;
    if (minecraftEdition !== undefined) updateData.minecraftEdition = minecraftEdition;

    // Creator Code for Partners
    if (role === "PARTNER" || role === "ADMIN") {
      updateData.creatorCode = creatorCode ? creatorCode.toUpperCase().trim() : null;
      updateData.creatorCommissionRate = creatorCommissionRate !== undefined ? parseFloat(creatorCommissionRate) || 10 : 10;
    } else {
      updateData.creatorCode = null;
    }

    // Password reset if provided
    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password.trim(), 10);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error: any) {
    console.error("Admin user update error:", error);
    return NextResponse.json({ error: error.message || "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { authorized } = await checkAdminSession();
    if (!authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (error: any) {
    console.error("Admin user delete error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
