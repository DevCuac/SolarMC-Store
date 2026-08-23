"use client";

import React, { useState, useEffect } from "react";
import { Layers, Plus, Edit, Trash2, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { DEFAULT_CATEGORIES } from "@/types";

const availableIconKeys = [
  { key: "home", label: "Inicio (Rayo)" },
  { key: "prison", label: "Prison (Pico)" },
  { key: "universes", label: "Universes (Órbita)" },
  { key: "dungeons", label: "Dungeons (Espadas)" },
  { key: "gens", label: "Gens (Cajas)" },
  { key: "survival", label: "Survival (Árbol)" },
  { key: "global", label: "Global (Mundo)" },
  { key: "flame", label: "Fuego / Llama" },
  { key: "crown", label: "Corona / Rey" },
  { key: "shield", label: "Escudo / Armadura" },
  { key: "coins", label: "Monedas / Economía" },
  { key: "sparkles", label: "Magia / Brillos" },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    icon: "home",
    description: "",
    sortOrder: "0",
  });

  const loadCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.categories && data.categories.length > 0) {
        setCategories(data.categories);
      } else {
        setCategories(DEFAULT_CATEGORIES);
      }
    } catch (e) {
      toast.error("Error al cargar categorías");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      icon: "home",
      description: "",
      sortOrder: (categories.length).toString(),
    });
    setIsModalOpen(true);
  };

  const openEditModal = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      icon: category.icon || "home",
      description: category.description || "",
      sortOrder: (category.sortOrder || 0).toString(),
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("El nombre de la categoría es obligatorio");
      return;
    }

    setModalLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim() || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        icon: formData.icon.trim() || "home",
        description: formData.description.trim(),
        sortOrder: parseInt(formData.sortOrder) || 0,
      };

      const url = editingCategory && !editingCategory.id.startsWith("cat-")
        ? `/api/admin/categories/${editingCategory.id}`
        : "/api/admin/categories";
      const method = editingCategory && !editingCategory.id.startsWith("cat-") ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          editingCategory ? "¡Categoría actualizada con éxito!" : "¡Categoría creada con éxito!"
        );
        setIsModalOpen(false);
        loadCategories();
      } else {
        toast.error(data.error || "Error al guardar categoría");
      }
    } catch (e) {
      toast.error("Error al guardar categoría");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de eliminar la categoría "${name}" y todos sus productos asociados?`)) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Categoría eliminada con éxito");
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } else {
        toast.error("Error al eliminar categoría");
      }
    } catch (e) {
      toast.error("Error al eliminar categoría");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Categorías de la Tienda
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Organiza los paquetes y productos en modalidades (Prison, Universes, Survival, Dungeons, Gens).
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-lg shadow-sm transition-all flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-black" />
          <span>Nueva Categoría</span>
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-[#0e1017] border border-white/[0.08] rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-7 h-7 animate-spin text-amber-400" />
          </div>
        ) : categories.length === 0 ? (
          <div className="py-16 text-center text-zinc-500 text-xs">
            No hay categorías definidas aún.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] text-zinc-400 uppercase text-[11px] font-semibold tracking-wider bg-white/[0.02]">
                  <th className="py-3 px-4">Icono</th>
                  <th className="py-3 px-4">Nombre</th>
                  <th className="py-3 px-4">Slug</th>
                  <th className="py-3 px-4">Descripción</th>
                  <th className="py-3 px-4">Productos</th>
                  <th className="py-3 px-4">Orden</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {categories.map((cat) => (
                  <tr key={cat.id || cat.slug} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                        <CategoryIcon iconName={cat.icon || cat.slug} className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">
                      {cat.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-amber-300">
                      {cat.slug}
                    </td>
                    <td className="py-3 px-4 text-zinc-400 max-w-xs truncate">
                      {cat.description || "—"}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-white/[0.03] text-zinc-300 font-semibold rounded text-[11px] border border-white/[0.06]">
                        {cat._count?.products ?? 0} paquetes
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-zinc-400">
                      {cat.sortOrder}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/[0.06] rounded transition-colors"
                        title="Editar Categoría"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                        title="Eliminar Categoría"
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

      {/* Create / Edit Category Modal */}
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
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-white">
                {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
              </h3>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Estilo de Icono
                  </label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full bg-[#090a0f] border border-white/[0.08] focus:border-amber-500/50 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 outline-none"
                  >
                    {availableIconKeys.map((item) => (
                      <option key={item.key} value={item.key}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Nombre de Categoría *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="ej. Prison o Dungeons"
                    className="w-full bg-[#090a0f] border border-white/[0.08] focus:border-amber-500/50 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="prison"
                    className="w-full bg-[#090a0f] border border-white/[0.08] focus:border-amber-500/50 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Orden de Posición
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
                    className="w-full bg-[#090a0f] border border-white/[0.08] focus:border-amber-500/50 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 outline-none"
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
                  placeholder="Breve descripción para la categoría o modalidad..."
                  className="w-full bg-[#090a0f] border border-white/[0.08] focus:border-amber-500/50 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 outline-none"
                />
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
                    <span>Guardar Categoría</span>
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
