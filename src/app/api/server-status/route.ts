import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// In-memory cache for status to avoid rate limits
let cachedStatus: {
  timestamp: number;
  data: {
    minecraft: {
      online: boolean;
      players: number;
      max: number;
      version?: string;
      motd?: string;
    };
    discord: {
      online: number;
      total: number;
    };
  };
} | null = null;

const CACHE_TTL_MS = 30 * 1000; // 30 seconds cache

export async function GET() {
  const now = Date.now();

  // Return cached data if fresh
  if (cachedStatus && now - cachedStatus.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(cachedStatus.data);
  }

  // Load configured IP & Discord URL from DB
  let serverIp = "play.solarmc.net";
  let discordUrl = "https://discord.gg/solarmc";
  let fallbackOnlinePlayers = 861;
  let fallbackDiscordOnline = 2611;

  try {
    const settings = await prisma.storeSetting.findMany();
    const settingsMap: Record<string, string> = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    if (settingsMap.server_ip) serverIp = settingsMap.server_ip;
    if (settingsMap.discord_url) discordUrl = settingsMap.discord_url;
    if (settingsMap.server_online_count) {
      fallbackOnlinePlayers = parseInt(settingsMap.server_online_count) || 861;
    }
    if (settingsMap.discord_online_count) {
      fallbackDiscordOnline = parseInt(settingsMap.discord_online_count) || 2611;
    }
  } catch (e) {
    console.error("Failed to read settings from DB", e);
  }

  // 1. Fetch Minecraft Server Status from mcsrvstat.us
  let mcResult = {
    online: true,
    players: fallbackOnlinePlayers,
    max: 2000,
    version: "1.20.x",
    motd: "SolarMC Network",
  };

  try {
    const cleanIp = serverIp.split(":")[0];
    const mcRes = await fetch(`https://api.mcsrvstat.us/3/${encodeURIComponent(cleanIp)}`, {
      next: { revalidate: 30 },
      headers: { "User-Agent": "SolarMC-Store/1.0" },
    });

    if (mcRes.ok) {
      const mcData = await mcRes.json();
      if (mcData.online) {
        mcResult = {
          online: true,
          players: mcData.players?.online ?? fallbackOnlinePlayers,
          max: mcData.players?.max ?? 2000,
          version: mcData.version ?? "1.20.x",
          motd: mcData.motd?.clean?.join(" ") ?? "SolarMC Network",
        };
      }
    }
  } catch (e) {
    console.warn("Could not query Minecraft server status, using fallback:", e);
  }

  // 2. Fetch Discord Live Status from Discord Invite API
  let discordResult = {
    online: fallbackDiscordOnline,
    total: 8420,
  };

  try {
    // Extract invite code from URL (e.g. https://discord.gg/solarmc -> solarmc)
    const match = discordUrl.match(/discord(?:\.gg|\.com\/invite)\/([a-zA-Z0-9-_]+)/);
    const inviteCode = match ? match[1] : "solarmc";

    const dcRes = await fetch(
      `https://discord.com/api/v9/invites/${encodeURIComponent(inviteCode)}?with_counts=true`,
      {
        next: { revalidate: 30 },
        headers: { "User-Agent": "SolarMC-Store/1.0" },
      }
    );

    if (dcRes.ok) {
      const dcData = await dcRes.json();
      if (dcData.approximate_presence_count !== undefined) {
        discordResult = {
          online: dcData.approximate_presence_count,
          total: dcData.approximate_member_count ?? 8420,
        };
      }
    }
  } catch (e) {
    console.warn("Could not query Discord status, using fallback:", e);
  }

  const responseData = {
    minecraft: mcResult,
    discord: discordResult,
  };

  cachedStatus = {
    timestamp: now,
    data: responseData,
  };

  return NextResponse.json(responseData);
}
