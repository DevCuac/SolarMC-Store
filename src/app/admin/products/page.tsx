"use client";

import React, { useState, useEffect } from "react";
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X, 
  Loader2,
  Sparkles,
  Terminal,
  Filter,
  CheckCircle2,
  Eye
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { ProductItem, CategoryItem } from "@/types";
import { CategoryIcon } from "@/components/ui/CategoryIcon";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    originalPrice: "",
    badge: "",
    categoryId: "",
    perks: [""],
    commands: [""],
    isActive: true,
  });

  const loadData = async () => {
    try {
      const [prodsRes, catsRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/categories"),
      ]);
      const prodsData = await prodsRes.json();
      const catsData = await catsRes.json();

      if (catsData.categories) setCategories(catsData.categories);
      if (prodsData.products) {
        const parsed = prodsData.products.map((p: any) => ({
          ...p,
          perks: typeof p.perks === "string" ? JSON.parse(p.perks || "[]") : p.perks || [],
          commands: typeof p.commands === "string" ? JSON.parse(p.commands || "[]") : p.commands || [],
        }));
        setProducts(parsed);
      }
    } catch (e) {
      toast.error("Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      price: "",
      originalPrice: "",
      badge: "MÁS VENDIDO",
      categoryId: categories[0]?.id || "",
      perks: ["Entrega instantánea en el juego", "Prefijo exclusivo en el chat Solar"],
      commands: ["credits add {player} 1000"],
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: ProductItem) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price.toString(),
      originalPrice: product.originalPrice ? product.originalPrice.toString() : "",
      badge: product.badge || "",
      categoryId: product.categoryId,
      perks: product.perks && product.perks.length > 0 ? product.perks : [""],
      commands: product.commands && product.commands.length > 0 ? product.commands : [""],
      isActive: product.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.categoryId) {
      toast.error("Nombre, precio y categoría son obligatorios");
      return;
    }

    setModalLoading(true);
    try {
      const cleanPerks = formData.perks.filter((p) => p.trim() !== "");
      const cleanCommands = formData.commands.filter((c) => c.trim() !== "");

      const payload = {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: formData.description,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        badge: formData.badge || null,
        categoryId: formData.categoryId,
        perks: cleanPerks,
        commands: cleanCommands,
        isActive: formData.isActive,
      };

      const url = editingProduct
        ? `/api/admin/products/${editingProduct.id}`
        : "/api/admin/products";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          editingProduct ? "¡Paquete actualizado con éxito!" : "¡Paquete creado con éxito!"
        );
        setIsModalOpen(false);
        loadData();
      } else {
        toast.error(data.error || "Error al guardar paquete");
      }
    } catch (e) {
      toast.error("Error al guardar paquete");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de eliminar el paquete "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Paquete eliminado correctamente");
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        toast.error("Error al eliminar paquete");
      }
    } catch (e) {
      toast.error("Error al eliminar paquete");
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || p.categoryId === categoryFilter || p.category?.slug === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Paquetes & Rangos de la Tienda
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Crea, pon precio y administra artículos, ventajas de rangos y comandos de consola automatizados.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-lg shadow-sm transition-all flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-black" />
          <span>Nuevo Paquete</span>
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre de paquete o descripción..."
            className="w-full bg-[#11131c] border border-white/[0.08] focus:border-amber-500/50 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 outline-none transition-colors"
          />
        </div>

        <div className="w-full sm:w-48">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-[#11131c] border border-white/[0.08] focus:border-amber-500/50 rounded-lg px-3 py-2 text-xs text-zinc-300 outline-none transition-colors"
          >
            <option value="all">Todas las Categorías ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#0e1017] border border-white/[0.08] rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-7 h-7 animate-spin text-amber-400" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-zinc-500 text-xs">
            No se encontraron paquetes que coincidan con la búsqueda.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] text-zinc-400 uppercase text-[11px] font-semibold tracking-wider bg-white/[0.02]">
                  <th className="py-3 px-4">Paquete</th>
                  <th className="py-3 px-4">Categoría</th>
                  <th className="py-3 px-4">Insignia</th>
                  <th className="py-3 px-4">Precio</th>
                  <th className="py-3 px-4">Ventajas</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 max-w-[220px]">
                      <div className="font-semibold text-white truncate">{product.name}</div>
                      <div className="text-[10px] text-zinc-500 font-mono truncate">{product.slug}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1.5 px-2 py-0.5 bg-white/[0.04] text-zinc-300 rounded border border-white/[0.06] w-fit text-[11px]">
                        <CategoryIcon iconName={product.category?.icon || product.category?.slug} className="w-3.5 h-3.5 text-amber-400" />
                        <span>{product.category?.name || "Global"}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {product.badge ? (
                        <span className="px-2 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase rounded">
                          {product.badge}
                        </span>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-amber-300 text-sm">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="py-3 px-4 text-zinc-400">
                      <span className="px-2 py-0.5 bg-white/[0.03] rounded border border-white/[0.06] text-[11px]">
                        {product.perks?.length || 0} beneficios
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {product.isActive ? (
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-semibold">
                          Activo
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded text-[10px] font-semibold">
                          Oculto
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/[0.06] rounded transition-colors"
                        title="Editar Paquete"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id, product.name)}
                        className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                        title="Eliminar Paquete"
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

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-modal">
          <div className="bg-[#11131c] border border-white/[0.1] rounded-xl max-w-2xl w-full p-6 relative shadow-2xl overflow-hidden max-h-[90vh] flex flex-col justify-between">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-white/[0.05]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 mb-4 pb-3 border-b border-white/[0.08]">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Package className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-white">
                {editingProduct ? "Editar Paquete de Producto" : "Crear Nuevo Paquete"}
              </h3>
            </div>

            <form onSubmit={handleSaveProduct} className="overflow-y-auto pr-1 space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Nombre del Paquete *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="ej. 4500 Créditos Solar o Rango Titán"
                    className="w-full bg-[#090a0f] border border-white/[0.08] focus:border-amber-500/50 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Categoría *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full bg-[#090a0f] border border-white/[0.08] focus:border-amber-500/50 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none"
                    required
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Precio ($ USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="49.99"
                    className="w-full bg-[#090a0f] border border-white/[0.08] focus:border-amber-500/50 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Precio Original (Opcional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="59.99"
                    className="w-full bg-[#090a0f] border border-white/[0.08] focus:border-amber-500/50 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Insignia / Badge
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="MÁS VENDIDO, MENSUAL..."
                    className="w-full bg-[#090a0f] border border-white/[0.08] focus:border-amber-500/50 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Descripción
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe las ventajas y detalles de este paquete..."
                  className="w-full bg-[#090a0f] border border-white/[0.08] focus:border-amber-500/50 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none"
                />
              </div>

              {/* Perks List Builder */}
              <div className="bg-[#090a0f] p-3.5 rounded-lg border border-white/[0.08] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-300 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ventajas y Beneficios (Viñetas)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, perks: [...formData.perks, ""] })}
                    className="text-[11px] text-amber-400 hover:underline font-semibold"
                  >
                    + Añadir Ventaja
                  </button>
                </div>

                {formData.perks.map((perk, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={perk}
                      onChange={(e) => {
                        const copy = [...formData.perks];
                        copy[index] = e.target.value;
                        setFormData({ ...formData, perks: copy });
                      }}
                      placeholder={`Ventaja #${index + 1}`}
                      className="flex-1 bg-[#11131c] border border-white/[0.08] rounded px-2.5 py-1.5 text-xs text-zinc-100 outline-none"
                    />
                    {formData.perks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const copy = formData.perks.filter((_, i) => i !== index);
                          setFormData({ ...formData, perks: copy });
                        }}
                        className="text-zinc-500 hover:text-red-400 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Console Commands Builder */}
              <div className="bg-[#090a0f] p-3.5 rounded-lg border border-white/[0.08] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-300 flex items-center space-x-1.5">
                    <Terminal className="w-3.5 h-3.5 text-amber-400" />
                    <span>Comandos de Consola en el Servidor (Usa &#123;player&#125;)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, commands: [...formData.commands, ""] })}
                    className="text-[11px] text-amber-400 hover:underline font-semibold"
                  >
                    + Añadir Comando
                  </button>
                </div>

                {formData.commands.map((cmd, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={cmd}
                      onChange={(e) => {
                        const copy = [...formData.commands];
                        copy[index] = e.target.value;
                        setFormData({ ...formData, commands: copy });
                      }}
                      placeholder="ej. lp user {player} parent add overlord"
                      className="flex-1 bg-[#11131c] border border-white/[0.08] rounded px-2.5 py-1.5 text-xs text-amber-300 font-mono outline-none"
                    />
                    {formData.commands.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const copy = formData.commands.filter((_, i) => i !== index);
                          setFormData({ ...formData, commands: copy });
                        }}
                        className="text-zinc-500 hover:text-red-400 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
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
                    <span>Guardar Paquete</span>
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
