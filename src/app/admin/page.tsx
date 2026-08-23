"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Tag, 
  TrendingUp, 
  Plus, 
  Loader2,
  FileText,
  Settings,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Users
} from "lucide-react";
import { formatCurrency, getMinecraftHeadRender } from "@/lib/utils";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
      })
      .catch((e) => console.error("Error loading stats", e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-7 h-7 animate-spin text-amber-400" />
      </div>
    );
  }

  const metrics = stats?.metrics || {
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCoupons: 0,
  };

  const recentOrders = stats?.recentOrders || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Vista General del Panel
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Analítica en tiempo real, volumen de ventas y transacciones recientes de SolarMC.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href="/admin/products"
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-lg shadow-sm transition-all flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4 text-black" />
            <span>Añadir Producto</span>
          </Link>
          <Link
            href="/admin/coupons"
            className="px-3.5 py-2 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-200 text-xs font-semibold rounded-lg transition-all flex items-center space-x-1.5"
          >
            <Tag className="w-4 h-4 text-amber-400" />
            <span>Crear Cupón</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Revenue */}
        <div className="bg-[#0e1017] border border-white/[0.08] rounded-xl p-4 shadow-sm relative overflow-hidden group hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Ingresos Totales
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mt-2.5 tracking-tight">
            {formatCurrency(metrics.totalRevenue)}
          </div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>Volumen procesado en vivo</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-[#0e1017] border border-white/[0.08] rounded-xl p-4 shadow-sm relative overflow-hidden group hover:border-blue-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Pedidos Realizados
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mt-2.5 tracking-tight">
            {metrics.totalOrders}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">
            Jugadores Java & Bedrock
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-[#0e1017] border border-white/[0.08] rounded-xl p-4 shadow-sm relative overflow-hidden group hover:border-purple-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Paquetes en Tienda
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mt-2.5 tracking-tight">
            {metrics.totalProducts}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">
            Rangos, pases & créditos
          </div>
        </div>

        {/* Active Coupons */}
        <div className="bg-[#0e1017] border border-white/[0.08] rounded-xl p-4 shadow-sm relative overflow-hidden group hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Cupones Activos
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Tag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mt-2.5 tracking-tight">
            {metrics.totalCoupons}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">
            Descuentos disponibles
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-[#0e1017] border border-white/[0.08] rounded-xl p-5 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Transacciones Recientes</h3>
            <p className="text-xs text-zinc-400">Últimos pedidos completados en la tienda</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-amber-400 hover:underline flex items-center space-x-1"
          >
            <span>Ver Todos</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] text-zinc-400 uppercase text-[10px] font-bold tracking-wider bg-white/[0.02]">
                <th className="py-2.5 px-3">Orden #</th>
                <th className="py-2.5 px-3">Jugador Minecraft</th>
                <th className="py-2.5 px-3">Monto</th>
                <th className="py-2.5 px-3">Estado</th>
                <th className="py-2.5 px-3">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-zinc-500">
                    Aún no se han registrado órdenes.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-2.5 px-3 font-mono font-semibold text-white">
                      {order.orderNumber}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center space-x-2">
                        <img
                          src={getMinecraftHeadRender(order.minecraftUsername)}
                          alt={order.minecraftUsername}
                          className="w-5 h-5 rounded border border-white/[0.1] object-contain"
                          onError={(e) => {
                            (e.target as HTMLElement).setAttribute(
                              "src",
                              "https://mc-heads.net/head/steve/128"
                            );
                          }}
                        />
                        <span className="font-semibold text-zinc-200">
                          {order.minecraftUsername}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-amber-300">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded text-[10px] font-semibold flex items-center space-x-1 w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>{order.status}</span>
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-zinc-400">
                      {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <Link
          href="/admin/users"
          className="bg-[#0e1017] border border-white/[0.08] hover:border-amber-500/40 rounded-xl p-4 transition-all group shadow-sm"
        >
          <Users className="w-5 h-5 text-purple-400 mb-2.5 group-hover:scale-105 transition-transform" />
          <h4 className="font-bold text-white text-xs sm:text-sm">Gestión de Usuarios & Partners</h4>
          <p className="text-xs text-zinc-400 mt-0.5">
            Administra roles, códigos de creador, comisiones y contraseñas.
          </p>
        </Link>

        <Link
          href="/admin/pages"
          className="bg-[#0e1017] border border-white/[0.08] hover:border-amber-500/40 rounded-xl p-4 transition-all group shadow-sm"
        >
          <FileText className="w-5 h-5 text-blue-400 mb-2.5 group-hover:scale-105 transition-transform" />
          <h4 className="font-bold text-white text-xs sm:text-sm">Páginas Legales CMS</h4>
          <p className="text-xs text-zinc-400 mt-0.5">
            Edita Términos, Privacidad, Aviso Legal y Reglas del Servidor.
          </p>
        </Link>

        <Link
          href="/admin/settings"
          className="bg-[#0e1017] border border-white/[0.08] hover:border-amber-500/40 rounded-xl p-4 transition-all group shadow-sm"
        >
          <Settings className="w-5 h-5 text-amber-400 mb-2.5 group-hover:scale-105 transition-transform" />
          <h4 className="font-bold text-white text-xs sm:text-sm">Ajustes & Enlaces del Navbar</h4>
          <p className="text-xs text-zinc-400 mt-0.5">
            Configura anuncios rotativos, IP, Discord y enlaces de la barra superior.
          </p>
        </Link>
      </div>

    </div>
  );
}
