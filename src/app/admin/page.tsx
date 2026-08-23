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
  Clock
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
            Dashboard Overview
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time analytics, revenue overview, and recent SolarMC store transactions.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href="/admin/products"
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-lg shadow-sm transition-all flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4 text-black" />
            <span>Add Product</span>
          </Link>
          <Link
            href="/admin/coupons"
            className="px-3.5 py-2 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-200 text-xs font-semibold rounded-lg transition-all flex items-center space-x-1.5"
          >
            <Tag className="w-4 h-4 text-amber-400" />
            <span>Create Coupon</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Revenue */}
        <div className="bg-[#0e1017] border border-white/[0.08] rounded-xl p-4 shadow-sm relative overflow-hidden group hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Total Revenue
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
            <span>Live store volume</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-[#0e1017] border border-white/[0.08] rounded-xl p-4 shadow-sm relative overflow-hidden group hover:border-blue-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Orders Processed
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mt-2.5 tracking-tight">
            {metrics.totalOrders}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">
            Java & Bedrock players
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-[#0e1017] border border-white/[0.08] rounded-xl p-4 shadow-sm relative overflow-hidden group hover:border-purple-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Store Packages
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mt-2.5 tracking-tight">
            {metrics.totalProducts}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">
            Ranks, passes & bundles
          </div>
        </div>

        {/* Active Coupons */}
        <div className="bg-[#0e1017] border border-white/[0.08] rounded-xl p-4 shadow-sm relative overflow-hidden group hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Active Coupons
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Tag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mt-2.5 tracking-tight">
            {metrics.totalCoupons}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">
            Discount codes enabled
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-[#0e1017] border border-white/[0.08] rounded-xl p-5 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Recent Transactions</h3>
            <p className="text-xs text-zinc-400">Latest completed webstore checkouts</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-amber-400 hover:underline flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] text-zinc-400 uppercase text-[10px] font-bold tracking-wider bg-white/[0.02]">
                <th className="py-2.5 px-3">Order #</th>
                <th className="py-2.5 px-3">Minecraft Player</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-zinc-500">
                    No orders recorded yet.
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
          href="/admin/pages"
          className="bg-[#0e1017] border border-white/[0.08] hover:border-amber-500/40 rounded-xl p-4 transition-all group shadow-sm"
        >
          <FileText className="w-5 h-5 text-blue-400 mb-2.5 group-hover:scale-105 transition-transform" />
          <h4 className="font-bold text-white text-xs sm:text-sm">Legal & CMS Pages</h4>
          <p className="text-xs text-zinc-400 mt-0.5">
            Edit Terms of Service, Privacy Policy, Impressum, and Server Rules.
          </p>
        </Link>

        <Link
          href="/admin/settings"
          className="bg-[#0e1017] border border-white/[0.08] hover:border-amber-500/40 rounded-xl p-4 transition-all group shadow-sm"
        >
          <Settings className="w-5 h-5 text-amber-400 mb-2.5 group-hover:scale-105 transition-transform" />
          <h4 className="font-bold text-white text-xs sm:text-sm">Server & Store Settings</h4>
          <p className="text-xs text-zinc-400 mt-0.5">
            Configure server IP, live player status, Discord link, and banner.
          </p>
        </Link>

        <Link
          href="/admin/products"
          className="bg-[#0e1017] border border-white/[0.08] hover:border-amber-500/40 rounded-xl p-4 transition-all group shadow-sm"
        >
          <Package className="w-5 h-5 text-emerald-400 mb-2.5 group-hover:scale-105 transition-transform" />
          <h4 className="font-bold text-white text-xs sm:text-sm">Manage Product Catalog</h4>
          <p className="text-xs text-zinc-400 mt-0.5">
            Configure pricing, badges, perks, and automated console commands.
          </p>
        </Link>
      </div>

    </div>
  );
}
