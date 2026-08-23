"use client";

import React, { useState, useEffect, useRef } from "react";
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
  ChevronDown,
  Award,
  DollarSign,
  History,
  Shield,
  Layers,
  Settings
} from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { usePlayer } from "@/context/PlayerContext";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { NavIcon } from "@/components/ui/NavIcon";
import { AnnouncementBanner } from "@/components/layout/AnnouncementBanner";
import { DEFAULT_CATEGORIES, DEFAULT_NAV_LINKS, DEFAULT_ANNOUNCEMENTS, NavLinkItem } from "@/types";
import { copyToClipboard, getMinecraftHeadRender } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // Do not render storefront Navbar/Hero on admin dashboard pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const { data: session } = useSession();
  const { minecraftUsername } = usePlayer();
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
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [navLinks, setNavLinks] = useState<NavLinkItem[]>(DEFAULT_NAV_LINKS);
  const [announcements, setAnnouncements] = useState<string[]>(DEFAULT_ANNOUNCEMENTS);
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

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load Settings, dynamic nav links & live server status
  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setSettings(data.settings);

          // Parse custom navigation links
          if (data.settings.nav_links) {
            try {
              const parsed = JSON.parse(data.settings.nav_links);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setNavLinks(parsed);
              }
            } catch (e) {}
          }

          // Parse custom rotating announcements
          if (data.settings.announcements) {
            try {
              const parsed = JSON.parse(data.settings.announcements);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setAnnouncements(parsed);
              }
            } catch (e) {}
          } else if (data.settings.announcement_banner) {
            setAnnouncements([data.settings.announcement_banner]);
          }
        }
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

  const userRole = (session?.user as any)?.role || "USER";
  const userEmail = session?.user?.email?.toLowerCase().trim() || "";
  const isAdmin = userRole === "ADMIN" || userEmail === "admin@solarmc.net";
  const isPartner = userRole === "PARTNER" || isAdmin;

  const displayName = session?.user?.name || (session?.user as any)?.minecraftUsername || userEmail.split("@")[0] || "Mi Cuenta";
  const mcPlayerRender = (session?.user as any)?.minecraftUsername || minecraftUsername || userEmail || "Steve";

  const handleCategoryClick = (slug: string) => {
    setSelectedCategory(slug);
    if (pathname !== "/") {
      router.push("/");
    }
  };

  const navCategories = categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  return (
    <header className="w-full">
      {/* 1. Top Rotating Announcements Banner */}
      <AnnouncementBanner announcements={announcements} />

      {/* 2. Top Navigation Bar (Links on Left | user_displayname & Cart on Right) */}
      <div className="max-w-6xl mx-auto px-4 pt-3 pb-2">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          
          {/* Left: Dynamic Editable Navigation Links (Inicio, Votos, Wiki, Reglas, etc.) */}
          <nav className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto w-full sm:w-auto scrollbar-none py-1">
            {navLinks.map((link) => {
              const isInternal = link.url.startsWith("/") && !link.isExternal;
              const isCurrent = isInternal && pathname === link.url;

              if (isInternal) {
                return (
                  <Link
                    key={link.id || link.label}
                    href={link.url}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                      isCurrent
                        ? "bg-white/[0.08] text-amber-300 shadow-sm border border-amber-500/30"
                        : "text-zinc-300 hover:text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    <NavIcon name={link.icon} className="w-3.5 h-3.5" />
                    <span>{link.label}</span>
                  </Link>
                );
              }

              return (
                <a
                  key={link.id || link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/[0.05] transition-all whitespace-nowrap group"
                >
                  <NavIcon name={link.icon} className="w-3.5 h-3.5 text-zinc-400 group-hover:text-amber-300 transition-colors" />
                  <span>{link.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Right: [user_displayname Dropdown] & [Cart Button] */}
          <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end flex-shrink-0">
            
            {/* User Dropdown Button (or Sign In) */}
            {!session ? (
              <button
                onClick={() => {
                  setAuthModalTab("signin");
                  setIsAuthModalOpen(true);
                }}
                className="flex items-center space-x-2 px-3.5 py-1.5 bg-[#12141d] hover:bg-[#181b27] border border-white/[0.08] text-zinc-200 hover:text-white rounded-lg font-medium transition-all shadow-sm"
              >
                <User className="w-3.5 h-3.5 text-zinc-400" />
                <span>Iniciar Sesión</span>
              </button>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-[#12141d] hover:bg-[#181b27] border border-white/[0.08] hover:border-amber-500/40 text-zinc-200 hover:text-white rounded-lg font-medium transition-all shadow-sm group"
                >
                  <img
                    src={getMinecraftHeadRender(mcPlayerRender)}
                    alt="Skin Head"
                    className="w-5 h-5 rounded border border-white/[0.1] object-contain"
                  />
                  <span className="font-semibold text-xs text-white max-w-[130px] truncate">
                    {displayName}
                  </span>
                  
                  {/* Mini Role Indicator Pill */}
                  {userRole !== "USER" && (
                    <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded border ${
                      isAdmin
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                        : "bg-purple-500/20 text-purple-300 border-purple-500/40"
                    }`}>
                      {userRole}
                    </span>
                  )}

                  <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 group-hover:text-amber-300 transition-transform duration-200 ${userDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Floating User Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#11131c] border border-white/[0.1] rounded-xl shadow-2xl py-1.5 z-50 animate-modal">
                    
                    {/* User Header */}
                    <div className="px-3.5 py-2 border-b border-white/[0.07]">
                      <div className="text-xs font-bold text-white truncate">{displayName}</div>
                      <div className="text-[10px] text-zinc-400 truncate">{userEmail}</div>
                    </div>

                    <div className="py-1">
                      {/* Mi Cuenta */}
                      <Link
                        href="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2.5 px-3.5 py-2 text-xs text-zinc-300 hover:text-white hover:bg-white/[0.05] transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-amber-400" />
                        <span>Mi Perfil & Datos</span>
                      </Link>

                      {/* Historial de Compras */}
                      <Link
                        href="/profile?tab=orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2.5 px-3.5 py-2 text-xs text-zinc-300 hover:text-white hover:bg-white/[0.05] transition-colors"
                      >
                        <History className="w-3.5 h-3.5 text-blue-400" />
                        <span>Historial de Compras</span>
                      </Link>

                      {/* Finanzas de Partner (Solo Partners / Admins) */}
                      {isPartner && (
                        <Link
                          href="/profile?tab=finances"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2.5 px-3.5 py-2 text-xs text-purple-300 hover:text-purple-200 hover:bg-purple-500/10 transition-colors font-semibold"
                        >
                          <Award className="w-3.5 h-3.5 text-purple-400" />
                          <span>Finanzas de Partner</span>
                        </Link>
                      )}

                      {/* Admin Console (Solo Admins) */}
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2.5 px-3.5 py-2 text-xs text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 transition-colors font-semibold border-t border-white/[0.05]"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}
                    </div>

                    {/* Logout */}
                    <div className="border-t border-white/[0.07] pt-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          signOut();
                        }}
                        className="w-full flex items-center space-x-2.5 px-3.5 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-colors text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>

                  </div>
                )}
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

      {/* 3. Hero Section (3-Column Layout: Jugar Ahora | Logo SolarMC | Discord Unirte) */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Left Box: JUGAR AHORA / COPIAR IP */}
          <div className="md:col-span-4 order-2 md:order-1">
            <div 
              onClick={handleCopyIP}
              className="cursor-pointer bg-[#11131c]/90 hover:bg-[#161925] border border-white/[0.08] hover:border-amber-500/50 rounded-2xl p-4 shadow-[0_4px_25px_rgba(0,0,0,0.4)] hover:shadow-[0_10px_35px_rgba(245,158,11,0.12)] transition-all duration-300 flex items-center justify-between group"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${liveStatus.minecraft.online ? "bg-emerald-400 animate-pulse" : "bg-zinc-500"}`} />
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                    JUGAR AHORA
                  </span>
                </div>
                <div className="text-sm font-black text-white font-mono group-hover:text-amber-300 transition-colors">
                  {settings.server_ip || "play.solarmc.net"}
                </div>
                <div className="text-[11px] text-zinc-400 font-medium">
                  {liveStatus.minecraft.players.toLocaleString()} jugadores en línea
                </div>
              </div>

              {/* Action Circle */}
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] group-hover:border-amber-500/40 group-hover:bg-amber-500/10 flex items-center justify-center text-zinc-400 group-hover:text-amber-400 transition-all flex-shrink-0">
                {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
              </div>
            </div>
          </div>

          {/* Center Box: SolarMC Main Logo Emblem */}
          <div className="md:col-span-4 order-1 md:order-2 flex flex-col items-center justify-center text-center">
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

          {/* Right Box: DISCORD / UNIRTE */}
          <div className="md:col-span-4 order-3">
            <a
              href={settings.discord_url || "https://discord.gg/solarmc"}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-[#11131c]/90 hover:bg-[#161925] border border-white/[0.08] hover:border-indigo-500/50 rounded-2xl p-4 shadow-[0_4px_25px_rgba(0,0,0,0.4)] hover:shadow-[0_10px_35px_rgba(88,101,242,0.12)] transition-all duration-300 group"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400">
                      DISCORD OFICIAL
                    </span>
                  </div>
                  <div className="text-sm font-black text-white group-hover:text-indigo-300 transition-colors">
                    discord.gg/solarmc
                  </div>
                  <div className="text-[11px] text-zinc-400 font-medium">
                    {liveStatus.discord.online.toLocaleString()} miembros conectados
                  </div>
                </div>

                {/* Action Circle */}
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] group-hover:border-indigo-500/40 group-hover:bg-[#5865F2]/10 flex items-center justify-center text-zinc-400 group-hover:text-indigo-400 transition-all flex-shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
              </div>
            </a>
          </div>

        </div>
      </div>

      {/* 4. Category Bar Underneath Hero */}
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

                  {/* Bottom solar accent line for active category */}
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
