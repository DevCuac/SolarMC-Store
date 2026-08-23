"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { 
  Copy, 
  Check, 
  ShieldCheck, 
  MessageSquare, 
  ShoppingBag, 
  User, 
  LogOut,
  Signal
} from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { DEFAULT_CATEGORIES } from "@/types";
import { copyToClipboard } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // Do not render storefront Navbar/Hero on admin dashboard pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const { data: session } = useSession();
  const { 
    setIsAuthModalOpen, 
    setAuthModalTab, 
    selectedCategory, 
    setSelectedCategory, 
    categories,
    totalItemsCount,
    setIsCartOpen
  } = useCart();

  const [copied, setCopied] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({
    server_name: "SolarMC",
    server_ip: "play.solarmc.net",
    discord_url: "https://discord.gg/solarmc",
  });

  // Dynamic live server & discord status
  const [liveStatus, setLiveStatus] = useState<{
    minecraft: { online: boolean; players: number; max: number };
    discord: { online: number; total: number };
  }>({
    minecraft: { online: true, players: 861, max: 2000 },
    discord: { online: 2611, total: 8420 },
  });

  // Load Settings & live server status
  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(() => {});

    const fetchLiveStatus = () => {
      fetch("/api/server-status")
        .then((res) => res.json())
        .then((data) => {
          if (data) setLiveStatus(data);
        })
        .catch(() => {});
    };

    fetchLiveStatus();
    const interval = setInterval(fetchLiveStatus, 30000); // 30s auto-refresh
    return () => clearInterval(interval);
  }, []);

  const handleCopyIP = async () => {
    const ip = settings.server_ip || "play.solarmc.net";
    const success = await copyToClipboard(ip);
    
    if (success) {
      setCopied(true);
      toast.success("¡IP Copiada al portapapeles!", {
        description: `Conéctate ahora en ${ip}`,
        duration: 3500,
      });
      setTimeout(() => setCopied(false), 2500);
    } else {
      toast.info(`Dirección del servidor: ${ip}`);
    }
  };

  const isAdmin = (session?.user as any)?.role === "ADMIN" || 
                  session?.user?.email?.toLowerCase().trim() === "angelriveradeveloper@gmail.com";

  const handleCategoryClick = (slug: string) => {
    setSelectedCategory(slug);
    if (pathname !== "/") {
      router.push("/");
    }
  };

  const navCategories = categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  return (
    <header className="w-full">
      {/* Top Announcement Strip */}
      {settings.announcement_banner && (
        <div className="bg-[#0e1017] border-b border-white/[0.06] py-1 px-4 text-center text-xs font-medium text-amber-300/90 tracking-wide">
          <span>{settings.announcement_banner}</span>
        </div>
      )}

      {/* Top Utility Header */}
      <div className="max-w-6xl mx-auto px-4 pt-3 pb-2">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          
          {/* Server Connection Pill & Live Discord Count */}
          <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-between sm:justify-start">
            {/* Copy Server IP button */}
            <button
              onClick={handleCopyIP}
              className="flex items-center space-x-2 bg-[#12141d] hover:bg-[#181b27] border border-white/[0.08] hover:border-amber-500/40 px-3 py-1.5 rounded-lg text-zinc-300 hover:text-white transition-all group shadow-sm active:scale-[0.98]"
              title="Click para copiar la IP del servidor"
            >
              <span className={`w-2 h-2 rounded-full ${liveStatus.minecraft.online ? "bg-emerald-400 animate-pulse" : "bg-zinc-500"}`} />
              <span className="font-mono font-semibold text-amber-300">{settings.server_ip || "play.solarmc.net"}</span>
              <span className="text-[11px] text-zinc-500 font-medium">
                ({liveStatus.minecraft.players.toLocaleString()} online)
              </span>
              <span className="text-zinc-500 group-hover:text-amber-400 pl-1">
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </span>
            </button>

            <span className="text-zinc-700 hidden sm:inline">•</span>

            {/* Discord Link with Live Count */}
            <a
              href={settings.discord_url || "https://discord.gg/solarmc"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 text-zinc-400 hover:text-indigo-300 bg-[#12141d] hover:bg-[#181b27] border border-white/[0.08] px-3 py-1.5 rounded-lg transition-all shadow-sm group"
            >
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
              <span>Discord: <strong className="text-zinc-200">{liveStatus.discord.online.toLocaleString()}</strong></span>
            </a>
          </div>

          {/* Right Utility: Admin, Auth, Cart */}
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:border-amber-500/60 rounded-lg text-xs font-semibold transition-all shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin</span>
              </Link>
            )}

            {!session ? (
              <button
                onClick={() => {
                  setAuthModalTab("signin");
                  setIsAuthModalOpen(true);
                }}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#12141d] hover:bg-[#181b27] border border-white/[0.08] text-zinc-300 hover:text-white rounded-lg font-medium transition-all shadow-sm"
              >
                <User className="w-3.5 h-3.5 text-zinc-400" />
                <span>Sign In</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="text-zinc-400 hidden md:inline truncate max-w-[120px]">
                  {session.user?.email || session.user?.name}
                </span>
                <button
                  onClick={() => signOut()}
                  className="px-2.5 py-1 rounded-lg bg-red-950/20 hover:bg-red-900/40 border border-red-800/30 text-red-400 hover:text-red-300 transition-all font-medium text-xs"
                >
                  Logout
                </button>
              </div>
            )}

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold rounded-lg transition-all shadow-[0_0_15px_rgba(245,158,11,0.25)] hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-black" />
              <span>Cart</span>
              {totalItemsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-black text-amber-400 rounded text-[10px] font-black">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Hero Branding with Logo */}
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col items-center justify-center text-center">
        <Link href="/" className="group flex flex-col items-center">
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center -my-2">
            <Image
              src="/logo.png"
              alt="SolarMC Logo"
              width={180}
              height={180}
              priority
              className="object-contain drop-shadow-[0_0_25px_rgba(245,158,11,0.35)] group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <span className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.25em] uppercase text-amber-300/80 -mt-1">
            OFFICIAL MINECRAFT NETWORK STORE
          </span>
        </Link>
      </div>

      {/* Sleek, Professional Category Bar */}
      <div className="w-full max-w-6xl mx-auto px-4 mb-6">
        <nav className="w-full bg-[#10121a]/95 border border-white/[0.08] rounded-xl p-1 shadow-lg backdrop-blur-md overflow-x-auto scrollbar-none">
          <div className="flex items-center justify-start md:justify-center min-w-max space-x-1">
            {navCategories.map((category) => {
              const isActive = selectedCategory === category.slug;
              return (
                <button
                  key={category.id || category.slug}
                  onClick={() => handleCategoryClick(category.slug)}
                  className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all duration-150 whitespace-nowrap group ${
                    isActive
                      ? "bg-white/[0.08] text-white shadow-sm font-semibold"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]"
                  }`}
                >
                  <CategoryIcon 
                    iconName={category.icon || category.slug} 
                    className={`w-4 h-4 transition-colors ${
                      isActive ? "text-amber-400" : "text-zinc-400 group-hover:text-zinc-200"
                    }`} 
                  />
                  <span>{category.name}</span>

                  {/* Refined bottom solar accent line for active category */}
                  {isActive && (
                    <span className="absolute bottom-0 left-2.5 right-2.5 h-[2px] bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
}
