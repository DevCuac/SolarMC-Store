import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await prisma.storeSetting.findMany();
    const settingsMap: Record<string, string> = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });
    return NextResponse.json({ settings: settingsMap });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  }
}
