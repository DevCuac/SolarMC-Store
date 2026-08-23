import { NextResponse } from "next/server";
import { checkAdminSession } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { category: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

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
    const {
      name,
      slug,
      description,
      price,
      originalPrice,
      badge,
      icon,
      perks,
      commands,
      categoryId,
      isActive,
      sortOrder,
    } = data;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (originalPrice !== undefined) updateData.originalPrice = originalPrice ? parseFloat(originalPrice) : null;
    if (badge !== undefined) updateData.badge = badge || null;
    if (icon !== undefined) updateData.icon = icon || null;
    if (perks !== undefined) updateData.perks = Array.isArray(perks) ? JSON.stringify(perks) : perks;
    if (commands !== undefined) updateData.commands = Array.isArray(commands) ? JSON.stringify(commands) : commands;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);
    if (sortOrder !== undefined) updateData.sortOrder = parseInt(sortOrder);

    const product = await prisma.product.update({
      where: { id: params.id },
      data: updateData,
      include: { category: true },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("Update product error:", error);
    return NextResponse.json({ error: error.message || "Failed to update product" }, { status: 500 });
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

    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error: any) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
