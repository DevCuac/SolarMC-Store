import { NextResponse } from "next/server";
import { checkAdminSession } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category");

    const where: any = {};
    if (categorySlug && categorySlug !== "all") {
      where.category = { slug: categorySlug };
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ products });
  } catch (error: any) {
    console.error("Fetch products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
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
      isActive = true,
      sortOrder = 0,
    } = data;

    if (!name || !categoryId || price === undefined) {
      return NextResponse.json(
        { error: "Name, category, and price are required" },
        { status: 400 }
      );
    }

    const cleanSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

    const perksJson = Array.isArray(perks) ? JSON.stringify(perks) : (typeof perks === "string" ? perks : JSON.stringify([]));
    const commandsJson = Array.isArray(commands) ? JSON.stringify(commands) : (typeof commands === "string" ? commands : JSON.stringify([]));

    const product = await prisma.product.create({
      data: {
        name,
        slug: cleanSlug,
        description: description || "",
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        badge: badge || null,
        icon: icon || null,
        perks: perksJson,
        commands: commandsJson,
        categoryId,
        isActive: Boolean(isActive),
        sortOrder: parseInt(sortOrder) || 0,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: error.message || "Failed to create product" }, { status: 500 });
  }
}
