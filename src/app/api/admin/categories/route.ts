import { NextResponse } from "next/server";
import { checkAdminSession } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
    return NextResponse.json({ categories });
  } catch (error: any) {
    console.error("Fetch categories error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { authorized } = await checkAdminSession();
    if (!authorized) {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 401 });
    }

    const { name, slug, icon, description, sortOrder } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const cleanSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

    const category = await prisma.category.create({
      data: {
        name,
        slug: cleanSlug,
        icon: icon || "⚡",
        description: description || null,
        sortOrder: parseInt(sortOrder) || 0,
      },
    });

    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    console.error("Create category error:", error);
    return NextResponse.json({ error: error.message || "Failed to create category" }, { status: 500 });
  }
}
