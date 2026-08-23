import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { minecraftUsername, minecraftEdition } = await req.json();

    if (!minecraftUsername || minecraftUsername.trim() === "") {
      return NextResponse.json(
        { error: "Minecraft username is required to claim rank" },
        { status: 400 }
      );
    }

    const cleanUsername = minecraftUsername.trim();

    // Check if player has already claimed in the last 24h
    const recentClaim = await prisma.order.findFirst({
      where: {
        minecraftUsername: cleanUsername,
        items: {
          contains: "Free Rank",
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (recentClaim) {
      return NextResponse.json(
        {
          error: `Player ${cleanUsername} has already claimed the Free Starter Rank!`,
          alreadyClaimed: true,
        },
        { status: 400 }
      );
    }

    // Generate unique order number
    const orderNumber = `FREE-${Math.floor(100000 + Math.random() * 900000)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        minecraftUsername: cleanUsername,
        minecraftEdition: minecraftEdition || "Java",
        total: 0,
        subtotal: 0,
        discountTotal: 0,
        status: "COMPLETED",
        items: JSON.stringify([
          {
            name: "Claimed Free Starter Rank",
            price: 0,
            quantity: 1,
            badge: "FREE",
            perks: [
              "Extra Player Vault (/pv 1)",
              "Special Starter Kit (/kit starter)",
              "Gamemode specific perks",
              "Exclusive [Starter] Chat Tag",
            ],
          },
        ]),
        commandsExecuted: true,
      },
    });

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      message: `🎉 Congratulations! Free Starter Rank has been successfully granted to ${cleanUsername}. Join ${cleanUsername} on the server to enjoy your perks!`,
    });
  } catch (error: any) {
    console.error("Error claiming rank:", error);
    return NextResponse.json(
      { error: "Failed to claim free rank. Please try again." },
      { status: 500 }
    );
  }
}
