"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  X, 
  Loader2, 
  Key, 
  Shield, 
  Award, 
  CheckCircle2, 
  DollarSign,
  Laptop,
  Smartphone
} from "lucide-react";
import { toast } from "sonner";
import { getMinecraftHeadRender } from "@/lib/utils";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
    minecraftUsername: "",
    minecraftEdition: "Java",
    creatorCode: "",
    creatorCommissionRate: "10",
  });

  const loadUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.users) setUsers(data.users);
    } catch (e) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "USER",
      minecraftUsername: "",
      minecraftEdition: "Java",
      creatorCode: "",
      creatorCommissionRate: "10",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (user: any) => {
    setEditingUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: "", // Leave blank unless changing
      role: user.role || "USER",
      minecraftUsername: user.minecraftUsername || "",
      minecraftEdition: user.minecraftEdition || "Java",
      creatorCode: user.creatorCode || "",
      creatorCommissionRate: (user.creatorCommissionRate || 10).toString(),
    });
    setIsModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      toast.error("El correo es requerido");
      return;
    }

    if (!editingUser && !formData.password) {
      toast.error("La contraseña es requerida para nuevos usuarios");
      return;
    }

    setModalLoading(true);
    try {
      const url = editingUser ? `/api/admin/users/${editingUser.id}` : "/api/admin/users";
      const method = editingUser ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(editingUser ? "Usuario actualizado con éxito" : "Usuario creado con éxito");
        setIsModalOpen(false);
        loadUsers();
      } else {
        toast.error(data.error || "Error al guardar usuario");
      }
    } catch (e) {
      toast.error("Error al conectar con el servidor");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteUser = async (id: string, email: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar al usuario ${email}?`)) return;

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Usuario eliminado");
        setUsers((prev) => prev.filter((u) => u.id !== id));
      } else {
        toast.error("Error al eliminar usuario");
      }
    } catch (e) {
      toast.error("Error al conectar con el servidor");
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.name && u.name.toLowerCase().includes(search.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(search.toLowerCase())) ||
      (u.minecraftUsername && u.minecraftUsername.toLowerCase().includes(search.toLowerCase())) ||
      (u.creatorCode && u.creatorCode.toLowerCase().includes(search.toLowerCase()));

    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Gestión de Usuarios & Partners
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Administra cuentas registradas, cambia contraseñas, asigna roles (Admin / Partner / User) y códigos de creador.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-lg shadow-sm transition-all flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-black" />
          <span>Nuevo Usuario</span>
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
            placeholder="Buscar por Nombre, Email, Minecraft IGN o Código de Creador..."
            className="w-full bg-[#11131c] border border-white/[0.08] focus:border-amber-500/50 rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 outline-none transition-colors"
          />
        </div>

        <div className="w-full sm:w-48">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full bg-[#11131c] border border-white/[0.08] focus:border-amber-500/50 rounded-lg px-3 py-2 text-xs text-zinc-300 outline-none transition-colors"
          >
            <option value="ALL">Todos los Roles ({users.length})</option>
            <option value="USER">Usuarios (USER)</option>
            <option value="PARTNER">Creadores (PARTNER)</option>
            <option value="ADMIN">Administradores (ADMIN)</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#0e1017] border border-white/[0.08] rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-7 h-7 animate-spin text-amber-400" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center text-zinc-500 text-xs">
            No se encontraron usuarios que coincidan con la búsqueda.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] text-zinc-400 uppercase text-[10px] font-bold tracking-wider bg-white/[0.02]">
                  <th className="py-3 px-4">Usuario / Email</th>
                  <th className="py-3 px-4">Minecraft IGN</th>
                  <th className="py-3 px-4">Rol</th>
                  <th className="py-3 px-4">Código Partner</th>
                  <th className="py-3 px-4">Compras</th>
                  <th className="py-3 px-4">Registrado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={getMinecraftHeadRender(user.minecraftUsername || user.email || "Steve")}
                          alt="Head"
                          className="w-7 h-7 rounded border border-white/[0.1] object-contain"
                        />
                        <div>
                          <div className="font-semibold text-white">{user.name || "Sin nombre"}</div>
                          <div className="text-[10px] text-zinc-400 font-mono">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {user.minecraftUsername ? (
                        <div className="flex items-center space-x-1 font-semibold text-zinc-200">
                          <span>{user.minecraftUsername}</span>
                          <span className="text-[9px] text-zinc-500">({user.minecraftEdition || "Java"})</span>
                        </div>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                        user.role === "ADMIN"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                          : user.role === "PARTNER"
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                          : "bg-white/[0.05] text-zinc-300 border border-white/[0.08]"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {user.creatorCode ? (
                        <div className="flex items-center space-x-1">
                          <span className="px-2 py-0.5 bg-purple-500/10 text-purple-300 border border-purple-500/30 rounded font-mono font-bold text-[10px]">
                            {user.creatorCode}
                          </span>
                          <span className="text-[10px] text-zinc-500">({user.creatorCommissionRate || 10}%)</span>
                        </div>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-zinc-400">
                      {user.ordersCount || 0} pedidos
                    </td>
                    <td className="py-3 px-4 text-zinc-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        onClick={() => openEditModal(user)}
                        className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/[0.06] rounded transition-colors"
                        title="Editar Usuario"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id, user.email)}
                        className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                        title="Eliminar Usuario"
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

      {/* Create / Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-modal">
          <div className="bg-[#11131c] border border-white/[0.1] rounded-xl max-w-lg w-full p-6 relative shadow-2xl overflow-hidden max-h-[90vh] flex flex-col justify-between">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-white/[0.05]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 mb-4 pb-3 border-b border-white/[0.08]">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-white">
                {editingUser ? `Editar Usuario (${editingUser.email})` : "Crear Nuevo Usuario"}
              </h3>
            </div>

            <form onSubmit={handleSaveUser} className="overflow-y-auto pr-1 space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej. Juan Pérez"
                    className="w-full bg-[#090a0f] border border-white/[0.08] focus:border-amber-500/50 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="usuario@ejemplo.com"
                    className="w-full bg-[#090a0f] border border-white/[0.08] focus:border-amber-500/50 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Rol en la Red *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-[#090a0f] border border-white/[0.08] focus:border-amber-500/50 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none font-semibold"
                  >
                    <option value="USER">USER (Jugador Normal)</option>
                    <option value="PARTNER">PARTNER (Creador / Streamer)</option>
                    <option value="ADMIN">ADMIN (Administrador Completo)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    {editingUser ? "Nueva Contraseña (Opcional)" : "Contraseña *"}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder={editingUser ? "Dejar en blanco para no cambiar" : "Contraseña segura"}
                    className="w-full bg-[#090a0f] border border-white/[0.08] focus:border-amber-500/50 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none"
                    required={!editingUser}
                  />
                </div>
              </div>

              {/* Minecraft Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Minecraft Username (IGN)
                  </label>
                  <input
                    type="text"
                    value={formData.minecraftUsername}
                    onChange={(e) => setFormData({ ...formData, minecraftUsername: e.target.value })}
                    placeholder="Ej. Notch"
                    className="w-full bg-[#090a0f] border border-white/[0.08] focus:border-amber-500/50 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Edición de Minecraft
                  </label>
                  <select
                    value={formData.minecraftEdition}
                    onChange={(e) => setFormData({ ...formData, minecraftEdition: e.target.value })}
                    className="w-full bg-[#090a0f] border border-white/[0.08] focus:border-amber-500/50 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none"
                  >
                    <option value="Java">Java Edition</option>
                    <option value="Bedrock">Bedrock Edition</option>
                  </select>
                </div>
              </div>

              {/* Partner & Creator Code Fields (Visible if PARTNER or ADMIN) */}
              {(formData.role === "PARTNER" || formData.role === "ADMIN") && (
                <div className="bg-[#090a0f] border border-purple-500/30 rounded-xl p-4 space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-bold text-purple-300">
                    <Award className="w-4 h-4 text-purple-400" />
                    <span>Configuración de Creador / Partner</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                        Código de Creador (Support-A-Creator)
                      </label>
                      <input
                        type="text"
                        value={formData.creatorCode}
                        onChange={(e) => setFormData({ ...formData, creatorCode: e.target.value.toUpperCase() })}
                        placeholder="Ej. CUAC, SOLAR"
                        className="w-full bg-[#11131c] border border-white/[0.08] focus:border-purple-500/50 rounded-lg px-3 py-2 text-xs font-mono font-bold text-purple-300 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                        % de Comisión Asignada
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="100"
                        value={formData.creatorCommissionRate}
                        onChange={(e) => setFormData({ ...formData, creatorCommissionRate: e.target.value })}
                        placeholder="10"
                        className="w-full bg-[#11131c] border border-white/[0.08] focus:border-purple-500/50 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

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
                    <span>Guardar Usuario</span>
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
