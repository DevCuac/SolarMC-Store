import { NextResponse } from "next/server";
import { checkAdminSession } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.storeSetting.findMany();
    const settingsMap: Record<string, string> = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });
    return NextResponse.json({ settings: settingsMap });
  } catch (error: any) {
    console.error("Fetch settings error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { authorized } = await checkAdminSession();
    if (!authorized) {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 401 });
    }

    const newSettings: Record<string, string> = await req.json();

    const updates = Object.entries(newSettings).map(([key, value]) =>
      prisma.storeSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    );

    await prisma.$transaction(updates);

    return NextResponse.json({ success: true, message: "Settings updated successfully" });
  } catch (error: any) {
    console.error("Update settings error:", error);
    return NextResponse.json({ error: error.message || "Failed to update settings" }, { status: 500 });
  }
}
