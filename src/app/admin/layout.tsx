"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  Layers,
  Tag,
  ShoppingCart,
  FileText,
  Settings,
  ArrowLeft,
  Shield,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Flame,
  Users
} from "lucide-react";

const navSections = [
  {
    title: "PANEL PRINCIPAL",
    items: [
      { name: "Vista General", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    title: "GESTIÓN DE TIENDA",
    items: [
      { name: "Paquetes & Rangos", href: "/admin/products", icon: Package },
      { name: "Categorías", href: "/admin/categories", icon: Layers },
      { name: "Cupones de Descuento", href: "/admin/coupons", icon: Tag },
      { name: "Pedidos & Ventas", href: "/admin/orders", icon: ShoppingCart },
      { name: "Usuarios & Partners", href: "/admin/users", icon: Users },
    ],
  },
  {
    title: "CONFIGURACIÓN",
    items: [
      { name: "Páginas Legales CMS", href: "/admin/pages", icon: FileText },
      { name: "Ajustes del Servidor", href: "/admin/settings", icon: Settings },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#090a0f] flex items-center justify-center text-zinc-400 text-xs font-medium">
        Cargando consola de administración...
      </div>
    );
  }

  const userEmail = session?.user?.email?.toLowerCase().trim();
  const isAdmin = (session?.user as any)?.role === "ADMIN" || 
                  userEmail === "admin@solarmc.net";

  if (!session || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#090a0f] flex items-center justify-center p-4">
        <div className="bg-[#11131c] border border-white/[0.08] rounded-xl max-w-md w-full p-8 text-center shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto mb-4">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Acceso de Administrador Requerido</h2>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
            Debes iniciar sesión con una cuenta de administrador autorizada (<code className="text-amber-300 font-mono">admin@solarmc.net</code>) para acceder al panel.
          </p>

          <div className="mt-6 space-y-2.5">
            <Link
              href="/"
              className="w-full py-2.5 px-4 rounded-lg font-bold text-black text-xs bg-amber-500 hover:bg-amber-400 shadow-md transition-all block"
            >
              Iniciar Sesión en la Tienda
            </Link>
            <Link
              href="/"
              className="w-full py-2 px-4 rounded-lg font-medium text-zinc-400 hover:text-white text-xs bg-white/[0.04] hover:bg-white/[0.08] transition-all block"
            >
              Volver a la Tienda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col md:flex-row">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#0e1017] border-b border-white/[0.08] p-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="relative w-7 h-7 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="SolarMC Logo"
              width={28}
              height={28}
              className="object-contain"
            />
          </div>
          <span className="font-bold text-white text-sm tracking-tight">SolarMC Admin</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 bg-white/[0.05] rounded-lg text-zinc-300"
        >
          {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Professional SaaS Sidebar */}
      <aside
        className={`fixed md:sticky top-0 inset-y-0 left-0 z-40 w-64 bg-[#0c0e15] border-r border-white/[0.07] p-4 flex flex-col justify-between transition-transform duration-200 md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/[0.07]">
            <div className="flex items-center space-x-2.5">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="SolarMC Logo"
                  width={32}
                  height={32}
                  className="object-contain drop-shadow-sm"
                />
              </div>
              <div>
                <h1 className="text-xs font-bold text-white tracking-tight">SolarMC Network</h1>
                <span className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase block">
                  Panel de Administración
                </span>
              </div>
            </div>

            <Link
              href="/"
              target="_blank"
              className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.05] rounded-md transition-colors"
              title="Abrir Tienda Pública"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Grouped Navigation Links */}
          <nav className="space-y-4">
            {navSections.map((section) => (
              <div key={section.title} className="space-y-1">
                <div className="px-3 py-1 text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                  {section.title}
                </div>
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? "bg-amber-500/10 text-amber-300 border-l-2 border-amber-400 font-semibold shadow-sm"
                          : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-zinc-400"}`} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* User Footer & Return to Store */}
        <div className="border-t border-white/[0.07] pt-3 space-y-2">
          <Link
            href="/"
            className="flex items-center space-x-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a la Tienda</span>
          </Link>

          <div className="bg-[#11131c] border border-white/[0.06] rounded-lg p-2.5 flex items-center justify-between">
            <div className="truncate pr-2">
              <div className="text-xs font-semibold text-zinc-200 truncate">
                {session.user?.name || "Angel Rivera"}
              </div>
              <div className="text-[10px] text-amber-400/90 font-mono truncate">
                {session.user?.email || "Admin"}
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="p-1.5 text-zinc-500 hover:text-red-400 rounded-md hover:bg-white/[0.05] transition-colors"
              title="Cerrar Sesión"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 p-6 md:p-8 max-w-6xl overflow-x-hidden">
        {children}
      </main>

    </div>
  );
}
