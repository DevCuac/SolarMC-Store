"use client";

import React, { useState, useEffect } from "react";
import { Layers, Plus, Edit, Trash2, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { DEFAULT_CATEGORIES } from "@/types";

const availableIconKeys = [
  { key: "home", label: "Home (Zap)" },
  { key: "prison", label: "Prison (Pickaxe)" },
  { key: "universes", label: "Universes (Orbit)" },
  { key: "dungeons", label: "Dungeons (Swords)" },
  { key: "gens", label: "Gens (Boxes)" },
  { key: "survival", label: "Survival (Tree)" },
  { key: "global", label: "Global (Globe)" },
  { key: "flame", label: "Flame / Fire" },
  { key: "crown", label: "Crown / Royal" },
  { key: "shield", label: "Shield / Armor" },
  { key: "coins", label: "Coins / Economy" },
  { key: "sparkles", label: "Sparkles / Magic" },
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
      toast.error("Failed to load categories");
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
      toast.error("Category name is required");
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
          editingCategory ? "Category updated successfully!" : "Category created successfully!"
        );
        setIsModalOpen(false);
        loadCategories();
      } else {
        toast.error(data.error || "Failed to save category");
      }
    } catch (e) {
      toast.error("Error saving category");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}" and its associated products?`)) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Category deleted successfully");
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } else {
        toast.error("Failed to delete category");
      }
    } catch (e) {
      toast.error("Error deleting category");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Store Categories
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Organize packages into gamemodes (Prison, Universes, Survival, Dungeons, Gens).
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-3.5 py-2 bg-[#ff9d00] hover:bg-[#ffad26] text-black text-xs font-black rounded-lg shadow-[0_0_12px_rgba(255,157,0,0.25)] hover:shadow-[0_0_18px_rgba(255,157,0,0.45)] transition-all flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-black" />
          <span>New Category</span>
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-[#121522] border border-[#1e2336] rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#ff9d00]" />
          </div>
        ) : categories.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            No categories defined yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1e2336] text-gray-400 uppercase tracking-wider bg-[#0e1019]">
                  <th className="py-3 px-4">Icon</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Slug</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Products</th>
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#181d2e]">
                {categories.map((cat) => (
                  <tr key={cat.id || cat.slug} className="hover:bg-[#161a2b] transition-colors">
                    <td className="py-3 px-4">
                      <div className="w-7 h-7 rounded bg-[#181d2e] border border-[#242b40] flex items-center justify-center">
                        <CategoryIcon iconName={cat.icon || cat.slug} className="w-3.5 h-3.5" />
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-white">
                      {cat.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-amber-400">
                      {cat.slug}
                    </td>
                    <td className="py-3 px-4 text-gray-400 max-w-xs truncate">
                      {cat.description || "—"}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-[#181d2e] text-gray-300 font-bold rounded text-[11px] border border-[#242b40]">
                        {cat._count?.products ?? 0} pkgs
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-400">
                      {cat.sortOrder}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="p-1.5 bg-[#181d2e] hover:bg-[#22283e] text-gray-300 hover:text-white rounded transition-colors"
                        title="Edit Category"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="p-1.5 bg-red-950/30 hover:bg-red-900/50 text-red-400 hover:text-red-300 rounded transition-colors"
                        title="Delete Category"
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
          <div className="bg-[#121522] border border-[#242b40] rounded-xl max-w-md w-full p-6 relative shadow-2xl overflow-hidden">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-[#181d2e]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-[#1e2336]">
              <div className="w-9 h-9 rounded-lg bg-[#ff9d00]/10 border border-[#ff9d00]/30 flex items-center justify-center text-[#ff9d00]">
                <Layers className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-lg font-black text-white">
                {editingCategory ? "Edit Category" : "New Category"}
              </h3>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                    Icon Style
                  </label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full bg-[#0e1019] border border-[#1e2336] focus:border-[#ff9d00] rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                  >
                    {availableIconKeys.map((item) => (
                      <option key={item.key} value={item.key}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Prison or Dungeons"
                    className="w-full bg-[#0e1019] border border-[#1e2336] focus:border-[#ff9d00] rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="prison"
                    className="w-full bg-[#0e1019] border border-[#1e2336] focus:border-[#ff9d00] rounded-lg px-2.5 py-1.5 text-xs text-white outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
                    className="w-full bg-[#0e1019] border border-[#1e2336] focus:border-[#ff9d00] rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short description for this gamemode category..."
                  className="w-full bg-[#0e1019] border border-[#1e2336] focus:border-[#ff9d00] rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                />
              </div>

              <div className="pt-3 border-t border-[#1e2336] flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-gray-400 hover:text-white bg-[#181d2e]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-5 py-1.5 rounded-lg text-xs font-black text-black bg-[#ff9d00] hover:bg-[#ffad26] shadow-[0_0_12px_rgba(255,157,0,0.25)] disabled:opacity-50 flex items-center space-x-1.5"
                >
                  {modalLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                  ) : (
                    <span>Save Category</span>
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
