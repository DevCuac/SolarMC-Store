import { NextResponse } from "next/server";
import { checkAdminSession } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const pages = await prisma.contentPage.findMany({
      orderBy: { slug: "asc" },
    });
    return NextResponse.json({ pages });
  } catch (error: any) {
    console.error("Fetch pages error:", error);
    return NextResponse.json({ error: "Failed to fetch content pages" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { authorized } = await checkAdminSession();
    if (!authorized) {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 401 });
    }

    const { slug, title, content } = await req.json();

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const page = await prisma.contentPage.upsert({
      where: { slug },
      update: {
        ...(title && { title }),
        ...(content !== undefined && { content }),
      },
      create: {
        slug,
        title: title || slug.toUpperCase(),
        content: content || "",
      },
    });

    return NextResponse.json({ success: true, page });
  } catch (error: any) {
    console.error("Update page error:", error);
    return NextResponse.json({ error: error.message || "Failed to update page" }, { status: 500 });
  }
}
