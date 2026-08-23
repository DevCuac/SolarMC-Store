"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  User, 
  ShoppingBag, 
  DollarSign, 
  Shield, 
  Key, 
  Save, 
  Loader2, 
  CheckCircle2, 
  MessageSquare, 
  Sparkles, 
  Award, 
  TrendingUp, 
  Laptop, 
  Smartphone, 
  ArrowLeft, 
  Eye, 
  X,
  LogOut,
  Flame,
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import { toast } from "sonner";
import { formatCurrency, getMinecraftHeadRender } from "@/lib/utils";

function ProfileDashboardContent() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<"account" | "orders" | "finances">("account");
  const [profileData, setProfileData] = useState<any>(null);
  const [financesData, setFinancesData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State initialized with session values for zero-latency UI
  const sessionUser = session?.user as any;
  const initialName = session?.user?.name || "";
  const initialEmail = session?.user?.email || "";
  const initialMcUsername = sessionUser?.minecraftUsername || session?.user?.name || "";
  const initialEdition = (sessionUser?.minecraftEdition as "Java" | "Bedrock") || "Java";
  const sessionRole = sessionUser?.role || (initialEmail === "admin@solarmc.net" ? "ADMIN" : "USER");

  const [name, setName] = useState(initialName);
  const [minecraftUsername, setMinecraftUsername] = useState(initialMcUsername);
  const [minecraftEdition, setMinecraftEdition] = useState<"Java" | "Bedrock">(initialEdition);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Selected order modal
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Sync tab from URL
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "orders") setActiveTab("orders");
    if (tabParam === "finances") setActiveTab("finances");
  }, [searchParams]);

  // Auth redirect and data loading
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }

    if (status === "authenticated") {
      loadProfile();
    }
  }, [status]);

  const loadProfile = async () => {
    try {
      const res = await fetch("/api/user/profile");
      const data = await res.json();
      if (data.user) {
        setProfileData(data.user);
        setName(data.user.name || session?.user?.name || "");
        setMinecraftUsername(data.user.minecraftUsername || sessionUser?.minecraftUsername || "");
        setMinecraftEdition(data.user.minecraftEdition || "Java");

        if (data.user.role === "PARTNER" || data.user.role === "ADMIN" || sessionRole === "ADMIN" || sessionRole === "PARTNER") {
          fetchFinances();
        }
      } else {
        // Fallback to session user if API didn't return user object
        setProfileData({
          name: session?.user?.name || "Jugador SolarMC",
          email: session?.user?.email || "",
          role: sessionRole,
          minecraftUsername: sessionUser?.minecraftUsername || "Steve",
          minecraftEdition: sessionUser?.minecraftEdition || "Java",
          orders: [],
        });
      }
    } catch (e) {
      console.error("Error loading profile", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchFinances = async () => {
    try {
      const res = await fetch("/api/user/finances");
      const data = await res.json();
      if (data.isPartner) {
        setFinancesData(data);
      }
    } catch (e) {}
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword && newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setSaving(true);
    try {
      const payload: any = {
        name,
        minecraftUsername,
        minecraftEdition,
      };

      if (newPassword) {
        payload.newPassword = newPassword;
        payload.currentPassword = currentPassword;
      }

      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("¡Perfil actualizado con éxito!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        loadProfile();

        if (update) {
          update({
            name,
            minecraftUsername,
            minecraftEdition,
          });
        }
      } else {
        toast.error(data.error || "Error al actualizar perfil");
      }
    } catch (e) {
      toast.error("Error al conectar con el servidor");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || (loading && !profileData)) {
    return (
      <div className="min-h-screen bg-[#090a0f] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
      </div>
    );
  }

  const effectiveRole = profileData?.role || sessionRole || "USER";
  const effectiveName = profileData?.name || session?.user?.name || minecraftUsername || "Mi Perfil";
  const effectiveEmail = profileData?.email || session?.user?.email || "";
  const effectiveMcUsername = profileData?.minecraftUsername || minecraftUsername || "Steve";
  const isPartnerOrAdmin = effectiveRole === "PARTNER" || effectiveRole === "ADMIN";
  const isAdmin = effectiveRole === "ADMIN";

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-6">
      
      {/* Profile Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div className="flex items-center space-x-3.5">
          <img
            src={getMinecraftHeadRender(effectiveMcUsername)}
            alt="Skin Head"
            className="w-12 h-12 rounded-xl border border-white/[0.12] object-contain shadow-lg"
            onError={(e) => {
              (e.target as HTMLElement).setAttribute("src", "https://mc-heads.net/head/steve/128");
            }}
          />
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-xl font-bold text-white tracking-tight">{effectiveName}</h1>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                effectiveRole === "ADMIN"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : effectiveRole === "PARTNER"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                  : "bg-white/[0.06] text-zinc-300 border border-white/[0.08]"
              }`}>
                {effectiveRole}
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">{effectiveEmail}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          {isAdmin && (
            <Link
              href="/admin"
              className="px-3.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Dashboard</span>
            </Link>
          )}

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="px-3.5 py-1.5 text-zinc-300 hover:text-red-400 bg-white/[0.04] hover:bg-red-500/10 border border-white/[0.08] rounded-lg transition-colors text-xs font-semibold flex items-center space-x-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-1 gap-2 flex-wrap">
        <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none py-1">
          <button
            onClick={() => setActiveTab("account")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold text-xs transition-all ${
              activeTab === "account"
                ? "bg-white/[0.08] text-white border-b-2 border-amber-500 shadow-sm font-bold"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
            }`}
          >
            <User className="w-4 h-4 text-amber-400" />
            <span>Mi Cuenta & Seguridad</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold text-xs transition-all ${
              activeTab === "orders"
                ? "bg-white/[0.08] text-white border-b-2 border-amber-500 shadow-sm font-bold"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-blue-400" />
            <span>Historial de Compras ({profileData?.orders?.length || 0})</span>
          </button>

          {isPartnerOrAdmin && (
            <button
              onClick={() => setActiveTab("finances")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold text-xs transition-all ${
                activeTab === "finances"
                  ? "bg-purple-500/20 text-purple-200 border-b-2 border-purple-400 shadow-sm font-bold"
                : "text-zinc-400 hover:text-purple-300 hover:bg-purple-500/10"
              }`}
            >
              <Award className="w-4 h-4 text-purple-400" />
              <span>Finanzas de Partner</span>
            </button>
          )}
        </div>
      </div>

        {/* Tab 1: Mi Cuenta & Seguridad */}
        {activeTab === "account" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Formulario Principal */}
            <div className="md:col-span-2 bg-[#0e1017] border border-white/[0.08] rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">Información Personal & Minecraft</h3>
                </div>
                <span className="text-xs font-mono text-zinc-400">{effectiveEmail}</span>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#090a0f] border border-white/[0.08] focus:border-amber-500/50 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none"
                      placeholder="Tu nombre"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      value={effectiveEmail}
                      disabled
                      className="w-full bg-[#090a0f]/60 border border-white/[0.05] rounded-lg px-3 py-2 text-xs text-zinc-500 outline-none cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Minecraft Delivery Configuration */}
                <div className="bg-[#090a0f] border border-white/[0.08] rounded-xl p-4 space-y-3">
                  <span className="text-xs font-bold text-zinc-200 block">
                    Perfil de Minecraft (Recepción de Compras & Ventajas)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                        Nombre de Usuario (IGN)
                      </label>
                      <input
                        type="text"
                        value={minecraftUsername}
                        onChange={(e) => setMinecraftUsername(e.target.value)}
                        placeholder="Ej: Steve o TuNick"
                        className="w-full bg-[#11131c] border border-white/[0.08] focus:border-amber-500/50 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none font-semibold"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                        Edición de Minecraft
                      </label>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => setMinecraftEdition("Java")}
                          className={`flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-lg text-xs font-bold transition-all border ${
                            minecraftEdition === "Java"
                              ? "bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-sm"
                              : "bg-[#11131c] border-white/[0.08] text-zinc-400"
                          }`}
                        >
                          <Laptop className="w-3.5 h-3.5" />
                          <span>Java</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setMinecraftEdition("Bedrock")}
                          className={`flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-lg text-xs font-bold transition-all border ${
                            minecraftEdition === "Bedrock"
                              ? "bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-sm"
                              : "bg-[#11131c] border-white/[0.08] text-zinc-400"
                          }`}
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>Bedrock</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Password Change */}
                <div className="bg-[#090a0f] border border-white/[0.08] rounded-xl p-4 space-y-3">
                  <span className="text-xs font-bold text-zinc-200 flex items-center space-x-1.5">
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    <span>Cambiar Contraseña (Opcional)</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                        Contraseña Actual
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#11131c] border border-white/[0.08] focus:border-amber-500/50 rounded-lg px-3 py-1.5 text-xs text-zinc-100 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                        Nueva Contraseña
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#11131c] border border-white/[0.08] focus:border-amber-500/50 rounded-lg px-3 py-1.5 text-xs text-zinc-100 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                        Confirmar Nueva
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#11131c] border border-white/[0.08] focus:border-amber-500/50 rounded-lg px-3 py-1.5 text-xs text-zinc-100 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-lg font-bold text-black text-xs bg-amber-500 hover:bg-amber-400 shadow-sm disabled:opacity-50 transition-all flex items-center space-x-1.5"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                        <span>Guardando...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Guardar Cambios</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Cuentas Vinculadas & Resumen de Estado */}
            <div className="space-y-4">
              <div className="bg-[#0e1017] border border-white/[0.08] rounded-xl p-5 shadow-sm space-y-3.5">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Cuentas Vinculadas</span>
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Vincula tu Discord y Google para iniciar sesión rápidamente y sincronizar tus compras con tu perfil.
                </p>

                {/* Discord Status */}
                <div className="bg-[#090a0f] border border-white/[0.08] rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#5865F2]/10 border border-[#5865F2]/20 flex items-center justify-center text-[#5865F2]">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Discord</div>
                      <div className="text-[10px] text-zinc-400">
                        {profileData?.discordUsername ? `@${profileData.discordUsername}` : "Conectado"}
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold rounded">
                    Vinculado
                  </span>
                </div>

                {/* Google Status */}
                <div className="bg-[#090a0f] border border-white/[0.08] rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                      <span className="text-xs font-black">G</span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Google</div>
                      <div className="text-[10px] text-zinc-400">{effectiveEmail}</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold rounded">
                    Activo
                  </span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Historial de Compras */}
        {activeTab === "orders" && (
          <div className="bg-[#0e1017] border border-white/[0.08] rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Tus Pedidos & Paquetes Comprados</h3>
                <p className="text-xs text-zinc-400">Registro histórico de transacciones asociadas a tu cuenta.</p>
              </div>
              <span className="text-xs font-semibold text-zinc-400">
                Total: {profileData?.orders?.length || 0} compras
              </span>
            </div>

            {!profileData?.orders || profileData.orders.length === 0 ? (
              <div className="py-16 text-center text-zinc-500 text-xs">
                Aún no has realizado ninguna compra en la tienda con esta cuenta.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/[0.08] text-zinc-400 uppercase text-[10px] font-bold tracking-wider bg-white/[0.02]">
                      <th className="py-3 px-4">Orden #</th>
                      <th className="py-3 px-4">Artículos</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Cupón</th>
                      <th className="py-3 px-4">Estado</th>
                      <th className="py-3 px-4">Fecha</th>
                      <th className="py-3 px-4 text-right">Detalles</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.05]">
                    {profileData.orders.map((ord: any) => (
                      <tr key={ord.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-white">
                          {ord.orderNumber}
                        </td>
                        <td className="py-3 px-4 text-zinc-300">
                          {Array.isArray(ord.items)
                            ? ord.items.map((i: any) => i.name).join(", ")
                            : "Paquete Store"}
                        </td>
                        <td className="py-3 px-4 font-bold text-amber-300">
                          {formatCurrency(ord.total)}
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-zinc-400">
                          {ord.couponCode || "—"}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-bold">
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-zinc-400">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/[0.06] rounded transition-colors"
                            title="Ver recibo"
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
        )}

        {/* Tab 3: Finanzas de Partner */}
        {activeTab === "finances" && isPartnerOrAdmin && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Creator Code Card */}
              <div className="bg-[#0e1017] border border-white/[0.08] rounded-xl p-4 shadow-sm relative overflow-hidden group">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Tu Código de Creador
                  </span>
                  <Award className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-black text-purple-300 font-mono mt-2 tracking-tight">
                  {profileData?.creatorCode || "SOLAR"}
                </div>
                <div className="text-[11px] text-zinc-400 mt-1">
                  Comisión asignada: <strong className="text-amber-300">{profileData?.creatorCommissionRate || 10}%</strong>
                </div>
              </div>

              {/* Total Sales Generated */}
              <div className="bg-[#0e1017] border border-white/[0.08] rounded-xl p-4 shadow-sm relative overflow-hidden group">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Ventas Generadas
                  </span>
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-black text-white mt-2 tracking-tight">
                  {formatCurrency(financesData?.partner?.totalVolumeGenerated || 0)}
                </div>
                <div className="text-[11px] text-zinc-400 mt-1">
                  {financesData?.partner?.totalSalesCount || 0} compras con tu código
                </div>
              </div>

              {/* Total Commission Earned */}
              <div className="bg-[#0e1017] border border-white/[0.08] rounded-xl p-4 shadow-sm relative overflow-hidden group border-amber-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Comisión Acumulada
                  </span>
                  <DollarSign className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-amber-300 mt-2 tracking-tight">
                  {formatCurrency(financesData?.partner?.totalCommissionsEarned || 0)}
                </div>
                <div className="text-[11px] text-emerald-400 font-semibold mt-1">
                  Disponible para canje / pago
                </div>
              </div>

            </div>

            {/* Sales table */}
            <div className="bg-[#0e1017] border border-white/[0.08] rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Compras Realizadas por tus Fans</h3>
                  <p className="text-xs text-zinc-400">Desglose de comisiones ganadas por cada pedido con tu código de creador.</p>
                </div>
              </div>

              {!financesData?.salesHistory || financesData.salesHistory.length === 0 ? (
                <div className="py-16 text-center text-zinc-500 text-xs">
                  Aún no hay compras registradas con tu código de creador.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/[0.08] text-zinc-400 uppercase text-[10px] font-bold tracking-wider bg-white/[0.02]">
                        <th className="py-3 px-4">Orden #</th>
                        <th className="py-3 px-4">Jugador Comprador</th>
                        <th className="py-3 px-4">Monto Venta</th>
                        <th className="py-3 px-4">Tu Ganancia</th>
                        <th className="py-3 px-4">Fecha</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05]">
                      {financesData.salesHistory.map((sale: any) => (
                        <tr key={sale.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-white">
                            {sale.orderNumber}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <img
                                src={getMinecraftHeadRender(sale.buyerPlayer)}
                                alt="Buyer Head"
                                className="w-5 h-5 rounded border border-white/[0.1] object-contain"
                              />
                              <span className="font-semibold text-zinc-200">{sale.buyerPlayer}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-zinc-300">
                            {formatCurrency(sale.orderTotal)}
                          </td>
                          <td className="py-3 px-4 font-extrabold text-amber-300">
                            +{formatCurrency(sale.commissionEarned)}
                          </td>
                          <td className="py-3 px-4 text-zinc-400">
                            {new Date(sale.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Order Receipt Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-modal">
            <div className="bg-[#11131c] border border-white/[0.1] rounded-xl max-w-md w-full p-6 relative shadow-2xl">
              <button
                onClick={() => setSelectedOrder(null)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-white/[0.05]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-2.5 mb-4 pb-3 border-b border-white/[0.08]">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Recibo #{selectedOrder.orderNumber}
                  </h3>
                  <span className="text-[11px] text-zinc-400">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-[#090a0f] p-3 rounded-lg border border-white/[0.08] space-y-1">
                  <div className="font-bold text-zinc-300 mb-1">Paquetes Adquiridos</div>
                  {Array.isArray(selectedOrder.items) &&
                    selectedOrder.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between py-0.5">
                        <span className="text-zinc-200">{item.name} x{item.quantity}</span>
                        <span className="font-bold text-amber-300">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                </div>

                <div className="bg-[#090a0f] p-3 rounded-lg border border-white/[0.08] space-y-1">
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
                  <div className="flex justify-between font-bold text-white pt-1 border-t border-white/[0.06]">
                    <span>Total Pagado</span>
                    <span className="text-amber-300 font-extrabold">{formatCurrency(selectedOrder.total)}</span>
                  </div>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2.5 flex items-center space-x-2 text-emerald-300 text-[11px]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Recompensas entregadas en el servidor SolarMC.</span>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-white/[0.08] flex justify-end">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-full py-2 rounded-lg text-xs font-semibold text-white bg-white/[0.06] hover:bg-white/[0.1]"
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

export default function UserProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#090a0f] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
        </div>
      }
    >
      <ProfileDashboardContent />
    </Suspense>
  );
}
