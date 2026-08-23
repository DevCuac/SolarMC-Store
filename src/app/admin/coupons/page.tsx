"use client";

import React, { useState, useEffect } from "react";
import { Tag, Plus, Edit, Trash2, Loader2, X, Percent, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    discountType: "PERCENTAGE",
    discountValue: "",
    minSpend: "0",
    maxUses: "",
    expiresAt: "",
    isActive: true,
  });

  const loadCoupons = async () => {
    try {
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      if (data.coupons) setCoupons(data.coupons);
    } catch (e) {
      toast.error("Error al cargar cupones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const openCreateModal = () => {
    setEditingCoupon(null);
    setFormData({
      code: "",
      discountType: "PERCENTAGE",
      discountValue: "20",
      minSpend: "0",
      maxUses: "500",
      expiresAt: "",
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (coupon: any) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue.toString(),
      minSpend: (coupon.minSpend || 0).toString(),
      maxUses: coupon.maxUses ? coupon.maxUses.toString() : "",
      expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().split("T")[0] : "",
      isActive: coupon.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.discountValue) {
      toast.error("El código y el valor del descuento son obligatorios");
      return;
    }

    setModalLoading(true);
    try {
      const payload = {
        code: formData.code.trim().toUpperCase(),
        discountType: formData.discountType,
        discountValue: parseFloat(formData.discountValue),
        minSpend: parseFloat(formData.minSpend) || 0,
        maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
        expiresAt: formData.expiresAt ? formData.expiresAt : null,
        isActive: formData.isActive,
      };

      const url = editingCoupon
        ? `/api/admin/coupons/${editingCoupon.id}`
        : "/api/admin/coupons";
      const method = editingCoupon ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          editingCoupon ? "¡Cupón actualizado con éxito!" : "¡Cupón creado con éxito!"
        );
        setIsModalOpen(false);
        loadCoupons();
      } else {
        toast.error(data.error || "Error al guardar cupón");
      }
    } catch (e) {
      toast.error("Error al guardar cupón");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`¿Estás seguro de eliminar el cupón "${code}"?`)) return;

    try {
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Cupón eliminado correctamente");
        setCoupons((prev) => prev.filter((c) => c.id !== id));
      } else {
        toast.error("Error al eliminar cupón");
      }
    } catch (e) {
      toast.error("Error al eliminar cupón");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Cupones & Códigos de Descuento
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Crea códigos de descuento promocionales (% porcentaje o monto fijo en $) para tus jugadores.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-lg shadow-sm transition-all flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-black" />
          <span>Nuevo Cupón</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-[#0e1017] border border-white/[0.08] rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-7 h-7 animate-spin text-amber-400" />
          </div>
        ) : coupons.length === 0 ? (
          <div className="py-16 text-center text-zinc-500 text-xs">
            No se encontraron cupones de descuento.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] text-zinc-400 uppercase text-[10px] font-bold tracking-wider bg-white/[0.02]">
                  <th className="py-3 px-4">Código</th>
                  <th className="py-3 px-4">Descuento</th>
                  <th className="py-3 px-4">Compra Mínima</th>
                  <th className="py-3 px-4">Usos</th>
                  <th className="py-3 px-4">Expiración</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-amber-300 text-xs">
                      <span className="px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded">
                        {coupon.code}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-white">
                      {coupon.discountType === "PERCENTAGE"
                        ? `${coupon.discountValue}% DTO`
                        : `${formatCurrency(coupon.discountValue)} DTO`}
                    </td>
                    <td className="py-3 px-4 text-zinc-400">
                      {coupon.minSpend > 0 ? formatCurrency(coupon.minSpend) : "Ninguna"}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-zinc-200">{coupon.usesCount}</span>
                      {coupon.maxUses ? (
                        <span className="text-zinc-500"> / {coupon.maxUses}</span>
                      ) : (
                        <span className="text-zinc-500"> / ∞</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-zinc-400">
                      {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : "Nunca"}
                    </td>
                    <td className="py-3 px-4">
                      {coupon.isActive ? (
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-semibold">
                          Activo
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded text-[10px] font-semibold">
                          Desactivado
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        onClick={() => openEditModal(coupon)}
                        className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/[0.06] rounded transition-colors"
                        title="Editar Cupón"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(coupon.id, coupon.code)}
                        className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                        title="Eliminar Cupón"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-modal">
          <div className="bg-[#11131c] border border-white/[0.1] rounded-xl max-w-md w-full p-6 relative shadow-2xl overflow-hidden">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-white/[0.05]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 mb-4 pb-3 border-b border-white/[0.08]">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Tag className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-white">
                {editingCoupon ? "Editar Cupón de Descuento" : "Nuevo Cupón de Descuento"}
              </h3>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Código de Cupón *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="ej. SOLAR50"
                  className="w-full bg-[#090a0f] border border-white/[0.08] focus:border-amber-500/50 rounded-lg px-3 py-2 text-xs font-mono font-bold text-amber-300 outline-none uppercase"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Tipo de Descuento
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full bg-[#090a0f] border border-white/[0.08] focus:border-amber-500/50 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 outline-none"
                  >
                    <option value="PERCENTAGE">Porcentaje (%)</option>
                    <option value="FIXED">Monto Fijo ($ USD)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Valor *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    placeholder="20"
                    className="w-full bg-[#090a0f] border border-white/[0.08] focus:border-amber-500/50 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Compra Mínima ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.minSpend}
                    onChange={(e) => setFormData({ ...formData, minSpend: e.target.value })}
                    placeholder="0"
                    className="w-full bg-[#090a0f] border border-white/[0.08] focus:border-amber-500/50 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Límite de Usos Máximos
                  </label>
                  <input
                    type="number"
                    value={formData.maxUses}
                    onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                    placeholder="Ilimitado"
                    className="w-full bg-[#090a0f] border border-white/[0.08] focus:border-amber-500/50 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Fecha de Expiración (Opcional)
                </label>
                <input
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  className="w-full bg-[#090a0f] border border-white/[0.08] focus:border-amber-500/50 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 outline-none"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="couponActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-3.5 h-3.5 rounded text-amber-500 bg-[#090a0f] border-white/[0.2]"
                />
                <label htmlFor="couponActive" className="text-xs text-zinc-300 font-medium cursor-pointer">
                  El cupón está activo y listo para ser canjeado
                </label>
              </div>

              <div className="pt-3 border-t border-white/[0.08] flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white bg-white/[0.05]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold text-black bg-amber-500 hover:bg-amber-400 shadow-sm disabled:opacity-50 flex items-center space-x-1.5"
                >
                  {modalLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                  ) : (
                    <span>Guardar Cupón</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
