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

    const { name, slug, icon, description, sortOrder } = await req.json();

    const category = await prisma.category.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(icon !== undefined && { icon }),
        ...(description !== undefined && { description }),
        ...(sortOrder !== undefined && { sortOrder: parseInt(sortOrder) }),
      },
    });

    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    console.error("Update category error:", error);
    return NextResponse.json({ error: error.message || "Failed to update category" }, { status: 500 });
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

    await prisma.category.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "Category deleted successfully" });
  } catch (error: any) {
    console.error("Delete category error:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
