"use client";

import React, { useState, useEffect } from "react";
import { 
  ShoppingCart, 
  Search, 
  Loader2, 
  CheckCircle2, 
  Eye, 
  X, 
  Terminal,
  Calendar,
  User,
  CreditCard
} from "lucide-react";
import { formatCurrency, getMinecraftHeadRender } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const loadOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (data.orders) setOrders(data.orders);
    } catch (e) {
      toast.error("Error al cargar órdenes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      ord.minecraftUsername.toLowerCase().includes(search.toLowerCase()) ||
      (ord.customerEmail && ord.customerEmail.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === "ALL" || ord.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Pedidos & Transacciones
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Historial completo de compras, registro de comandos automáticos y recibos de jugadores.
          </p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por Orden #, Usuario de Minecraft o Correo..."
            className="w-full bg-[#11131c] border border-white/[0.08] focus:border-amber-500/50 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 outline-none transition-colors"
          />
        </div>

        <div className="w-full sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-[#11131c] border border-white/[0.08] focus:border-amber-500/50 rounded-lg px-3 py-2 text-xs text-zinc-300 outline-none transition-colors"
          >
            <option value="ALL">Todos los Estados ({orders.length})</option>
            <option value="COMPLETED">Completados</option>
            <option value="PENDING">Pendientes</option>
            <option value="REFUNDED">Reembolsados</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#0e1017] border border-white/[0.08] rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-7 h-7 animate-spin text-amber-400" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-zinc-500 text-xs">
            No se encontraron transacciones que coincidan con la búsqueda.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] text-zinc-400 uppercase text-[10px] font-bold tracking-wider bg-white/[0.02]">
                  <th className="py-3 px-4">Orden ID</th>
                  <th className="py-3 px-4">Jugador Minecraft</th>
                  <th className="py-3 px-4">Edición</th>
                  <th className="py-3 px-4">Total Pagado</th>
                  <th className="py-3 px-4">Cupón</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4">Fecha</th>
                  <th className="py-3 px-4 text-right">Detalles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-white">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 px-4">
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
                        <div>
                          <div className="font-semibold text-zinc-200">{order.minecraftUsername}</div>
                          {order.customerEmail && (
                            <div className="text-[10px] text-zinc-500">{order.customerEmail}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-zinc-300">
                      {order.minecraftEdition || "Java"}
                    </td>
                    <td className="py-3 px-4 font-bold text-amber-300 text-xs sm:text-sm">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="py-3 px-4">
                      {order.couponCode ? (
                        <span className="px-2 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded text-[10px] font-mono font-bold">
                          {order.couponCode}
                        </span>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-semibold flex items-center space-x-1 w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>{order.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-zinc-400">
                      {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/[0.06] rounded transition-colors"
                        title="Ver detalles de la orden"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-modal">
          <div className="bg-[#11131c] border border-white/[0.1] rounded-xl max-w-lg w-full p-6 relative shadow-2xl overflow-hidden max-h-[90vh] flex flex-col justify-between">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-white/[0.05]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 mb-4 pb-3 border-b border-white/[0.08]">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Detalles de la Orden #{selectedOrder.orderNumber}
                </h3>
                <span className="text-[11px] text-zinc-400">
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="overflow-y-auto space-y-3.5 pr-1 text-xs">
              {/* Player info */}
              <div className="bg-[#090a0f] p-3.5 rounded-lg border border-white/[0.08] flex items-center space-x-3">
                <img
                  src={getMinecraftHeadRender(selectedOrder.minecraftUsername)}
                  alt="Player Head"
                  className="w-10 h-10 rounded border border-white/[0.1] object-contain"
                />
                <div>
                  <div className="text-[9px] uppercase font-bold text-zinc-500">
                    Jugador Receptor
                  </div>
                  <div className="text-sm font-bold text-white">
                    {selectedOrder.minecraftUsername} ({selectedOrder.minecraftEdition})
                  </div>
                  <div className="text-zinc-400 text-[11px]">{selectedOrder.customerEmail || "Compra como invitado"}</div>
                </div>
              </div>

              {/* Items Purchased */}
              <div className="bg-[#090a0f] p-3.5 rounded-lg border border-white/[0.08] space-y-1.5">
                <span className="font-bold text-zinc-300 block mb-1">Paquetes Adquiridos</span>
                {(() => {
                  try {
                    const parsed = JSON.parse(selectedOrder.items || "[]");
                    return parsed.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center py-1 border-b border-white/[0.05] last:border-none">
                        <div>
                          <span className="font-medium text-white">{item.name}</span>
                          <span className="text-zinc-500 ml-2">x{item.quantity}</span>
                        </div>
                        <span className="font-semibold text-amber-300">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ));
                  } catch {
                    return <div className="text-zinc-400">{selectedOrder.items}</div>;
                  }
                })()}
              </div>

              {/* Financial Breakdown */}
              <div className="bg-[#090a0f] p-3.5 rounded-lg border border-white/[0.08] space-y-1">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span>{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                {selectedOrder.discountTotal > 0 && (
                  <div className="flex justify-between text-amber-400">
                    <span>Descuento ({selectedOrder.couponCode})</span>
                    <span>-{formatCurrency(selectedOrder.discountTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs font-bold text-white pt-1.5 border-t border-white/[0.06]">
                  <span>Total Pagado</span>
                  <span className="text-amber-300 font-extrabold">{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>

              {/* Delivery status */}
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2.5 flex items-center space-x-2 text-emerald-300">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                <span>Comandos de consola ejecutados y ventajas otorgadas al jugador.</span>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-white/[0.08] flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full py-2 rounded-lg text-xs font-semibold text-white bg-white/[0.06] hover:bg-white/[0.1] transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
