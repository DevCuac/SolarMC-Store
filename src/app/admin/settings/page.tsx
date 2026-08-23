"use client";

import React, { useState, useEffect } from "react";
import { 
  Settings, 
  Save, 
  Loader2, 
  Landmark, 
  MessageSquare, 
  ShieldAlert, 
  Mail, 
  Plus, 
  Trash2, 
  Megaphone, 
  Navigation, 
  ExternalLink,
  Edit2,
  X
} from "lucide-react";
import { toast } from "sonner";
import { DEFAULT_NAV_LINKS, DEFAULT_ANNOUNCEMENTS, NavLinkItem } from "@/types";
import { NavIcon } from "@/components/ui/NavIcon";

const availableNavIcons = [
  { key: "home", label: "Inicio / Home" },
  { key: "vote", label: "Votar / Award" },
  { key: "wiki", label: "Wiki / Guías" },
  { key: "reglas", label: "Reglas / Balanza" },
  { key: "discord", label: "Discord / Chat" },
  { key: "support", label: "Soporte / Ayuda" },
  { key: "map", label: "Mapa / Dynmap" },
  { key: "swords", label: "PvP / Espadas" },
  { key: "crown", label: "Rangos / Corona" },
  { key: "file", label: "Documento / Términos" },
  { key: "link", label: "Enlace Externo" },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({
    server_name: "SolarMC",
    server_ip: "play.solarmc.net",
    server_port: "25565",
    discord_url: "https://discord.gg/solarmc",
    discord_online_count: "2611",
    server_online_count: "861",
    support_email: "soporte@solarmc.net",
    currency_symbol: "$",
    disclaimer_text_1: "Credits are only usable under the terms of the SolarMC Credits Disclaimers. Credits are a virtual intangible currency which cannot be transferred outside of the SolarMC Network.",
    disclaimer_text_2: "Please make sure you are well informed of our rules, terms of service, and privacy policy before making any purchase on our web store.",
    disclaimer_text_3: "Purchases cannot be refunded under any circumstance. Opening a chargeback or dispute will result in an automatic and permanent ban from our Minecraft Network, our Tebex Store and other Tebex Stores.",
  });

  const [announcements, setAnnouncements] = useState<string[]>(DEFAULT_ANNOUNCEMENTS);
  const [navLinks, setNavLinks] = useState<NavLinkItem[]>(DEFAULT_NAV_LINKS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // New Link modal or form state
  const [newAnnouncement, setNewAnnouncement] = useState("");

  const loadSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.settings) {
        setSettings((prev) => ({ ...prev, ...data.settings }));

        if (data.settings.announcements) {
          try {
            const parsed = JSON.parse(data.settings.announcements);
            if (Array.isArray(parsed) && parsed.length > 0) setAnnouncements(parsed);
          } catch (e) {}
        }

        if (data.settings.nav_links) {
          try {
            const parsed = JSON.parse(data.settings.nav_links);
            if (Array.isArray(parsed) && parsed.length > 0) setNavLinks(parsed);
          } catch (e) {}
        }
      }
    } catch (e) {
      toast.error("Failed to load store settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleChange = (key: string, val: string) => {
    setSettings((prev) => ({ ...prev, [key]: val }));
  };

  const handleAddAnnouncement = () => {
    if (!newAnnouncement.trim()) return;
    setAnnouncements([...announcements, newAnnouncement.trim()]);
    setNewAnnouncement("");
    toast.success("Anuncio añadido");
  };

  const handleRemoveAnnouncement = (index: number) => {
    setAnnouncements(announcements.filter((_, i) => i !== index));
  };

  const handleAddNavLink = () => {
    const newId = `nav-${Date.now()}`;
    setNavLinks([
      ...navLinks,
      { id: newId, label: "Nuevo Link", url: "/", icon: "link", isExternal: false },
    ]);
  };

  const handleUpdateNavLink = (index: number, field: keyof NavLinkItem, val: any) => {
    const copy = [...navLinks];
    copy[index] = { ...copy[index], [field]: val };
    setNavLinks(copy);
  };

  const handleRemoveNavLink = (index: number) => {
    setNavLinks(navLinks.filter((_, i) => i !== index));
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...settings,
      announcements: JSON.stringify(announcements),
      announcement_banner: announcements[0] || "",
      nav_links: JSON.stringify(navLinks),
    };

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("¡Configuración y enlaces del Navbar guardados correctamente!");
      } else {
        toast.error(data.error || "Error al guardar configuración");
      }
    } catch (e) {
      toast.error("Error al conectar con el servidor");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Configuración del Servidor & Navbar
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Gestiona anuncios rotativos, enlaces del menú superior, conexión de Minecraft, Discord y avisos legales.
        </p>
      </div>

      <div className="bg-[#0e1017] border border-white/[0.08] rounded-xl p-5 sm:p-6 shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-7 h-7 animate-spin text-amber-400" />
          </div>
        ) : (
          <form onSubmit={handleSaveAll} className="space-y-6">
            
            {/* 1. SECCIÓN: ANUNCIOS ROTATIVOS */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-zinc-200">
                  <Megaphone className="w-4 h-4 text-amber-400" />
                  <span>Banner de Anuncios Rotativos (Superior)</span>
                </div>
                <span className="text-[11px] text-zinc-500">
                  Rotación automática cada 4.5 segundos
                </span>
              </div>

              {/* Lista de anuncios */}
              <div className="space-y-2">
                {announcements.map((ann, idx) => (
                  <div key={idx} className="flex items-center space-x-2 bg-[#090a0f] border border-white/[0.08] rounded-lg p-2">
                    <span className="w-5 h-5 rounded bg-amber-500/10 text-amber-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={ann}
                      onChange={(e) => {
                        const copy = [...announcements];
                        copy[idx] = e.target.value;
                        setAnnouncements(copy);
                      }}
                      className="flex-1 bg-transparent text-xs text-zinc-100 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveAnnouncement(idx)}
                      className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                      title="Eliminar anuncio"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Añadir nuevo anuncio */}
              <div className="flex space-x-2 pt-1">
                <input
                  type="text"
                  value={newAnnouncement}
                  onChange={(e) => setNewAnnouncement(e.target.value)}
                  placeholder="Escribe un nuevo texto de anuncio (ej: 🔥 2x1 en Créditos este Fin de Semana)..."
                  className="flex-1 bg-[#090a0f] border border-white/[0.08] focus:border-amber-500/50 rounded-lg px-3 py-1.5 text-xs text-zinc-100 outline-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddAnnouncement();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddAnnouncement}
                  className="px-3 py-1.5 bg-white/[0.06] hover:bg-white/[0.1] text-zinc-200 text-xs font-semibold rounded-lg transition-all flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir</span>
                </button>
              </div>
            </div>

            {/* 2. SECCIÓN: ENLACES DEL NAVBAR SUPERIOR */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-zinc-200">
                  <Navigation className="w-4 h-4 text-amber-400" />
                  <span>Enlaces de Navegación del Navbar (Inicio, Votos, Wiki, Reglas, etc.)</span>
                </div>
                <button
                  type="button"
                  onClick={handleAddNavLink}
                  className="text-xs text-amber-400 hover:underline font-semibold flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir Enlace</span>
                </button>
              </div>

              {/* Lista de enlaces */}
              <div className="space-y-2.5">
                {navLinks.map((link, idx) => (
                  <div key={link.id || idx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-[#090a0f] border border-white/[0.08] rounded-lg p-2.5 items-center">
                    
                    {/* Icon Selector */}
                    <div className="sm:col-span-3">
                      <label className="text-[9px] uppercase font-bold text-zinc-500 block mb-0.5">Icono</label>
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-amber-400 flex-shrink-0">
                          <NavIcon name={link.icon} className="w-3.5 h-3.5" />
                        </div>
                        <select
                          value={link.icon}
                          onChange={(e) => handleUpdateNavLink(idx, "icon", e.target.value)}
                          className="w-full bg-[#11131c] border border-white/[0.08] rounded px-2 py-1 text-xs text-zinc-200 outline-none"
                        >
                          {availableNavIcons.map((ic) => (
                            <option key={ic.key} value={ic.key}>
                              {ic.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Label */}
                    <div className="sm:col-span-3">
                      <label className="text-[9px] uppercase font-bold text-zinc-500 block mb-0.5">Nombre / Texto</label>
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => handleUpdateNavLink(idx, "label", e.target.value)}
                        placeholder="Ej. Votar"
                        className="w-full bg-[#11131c] border border-white/[0.08] rounded px-2.5 py-1 text-xs text-zinc-100 outline-none font-semibold"
                        required
                      />
                    </div>

                    {/* URL */}
                    <div className="sm:col-span-4">
                      <label className="text-[9px] uppercase font-bold text-zinc-500 block mb-0.5">Enlace / URL</label>
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) => handleUpdateNavLink(idx, "url", e.target.value)}
                        placeholder="https://... o /rules"
                        className="w-full bg-[#11131c] border border-white/[0.08] rounded px-2.5 py-1 text-xs text-zinc-100 font-mono outline-none"
                        required
                      />
                    </div>

                    {/* Actions & Target */}
                    <div className="sm:col-span-2 flex items-center justify-between sm:justify-end space-x-2 pt-1 sm:pt-4">
                      <label className="flex items-center space-x-1 text-[11px] text-zinc-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={link.isExternal}
                          onChange={(e) => handleUpdateNavLink(idx, "isExternal", e.target.checked)}
                          className="w-3.5 h-3.5 rounded text-amber-500 bg-zinc-900 border-white/[0.2]"
                        />
                        <span title="Abrir en pestaña nueva">Nueva Pestaña</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => handleRemoveNavLink(idx)}
                        className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                        title="Eliminar enlace"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* 3. SECCIÓN: SERVIDOR MINECRAFT & DISCORD */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-zinc-200 border-b border-white/[0.08] pb-2">
                <Landmark className="w-4 h-4 text-amber-400" />
                <span>Servidor Minecraft & Discord (Sección Hero de 3 Columnas)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Nombre de la Red
                  </label>
                  <input
                    type="text"
                    value={settings.server_name || ""}
                    onChange={(e) => handleChange("server_name", e.target.value)}
                    className="w-full bg-[#090a0f] border border-white/[0.08] focus:border-amber-500/50 rounded-lg px-3 py-1.5 text-xs text-zinc-100 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    IP del Servidor (Caja Izquierda del Hero)
                  </label>
                  <input
                    type="text"
                    value={settings.server_ip || ""}
                    onChange={(e) => handleChange("server_ip", e.target.value)}
                    className="w-full bg-[#090a0f] border border-white/[0.08] focus:border-amber-500/50 rounded-lg px-3 py-1.5 text-xs font-mono text-amber-300 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    URL de Invitación de Discord (Caja Derecha)
                  </label>
                  <input
                    type="text"
                    value={settings.discord_url || ""}
                    onChange={(e) => handleChange("discord_url", e.target.value)}
                    className="w-full bg-[#090a0f] border border-white/[0.08] focus:border-amber-500/50 rounded-lg px-3 py-1.5 text-xs text-zinc-100 outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* 4. SECCIÓN: SOPORTE Y DISCLAIMERS */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-zinc-200 border-b border-white/[0.08] pb-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Correo de Soporte y Avisos de la Tienda</span>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Correo de Soporte Oficial
                </label>
                <input
                  type="email"
                  value={settings.support_email || ""}
                  onChange={(e) => handleChange("support_email", e.target.value)}
                  className="w-full bg-[#090a0f] border border-white/[0.08] focus:border-amber-500/50 rounded-lg px-3 py-1.5 text-xs text-zinc-100 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Aviso 1: Moneda Virtual e Intangibilidad
                </label>
                <textarea
                  rows={2}
                  value={settings.disclaimer_text_1 || ""}
                  onChange={(e) => handleChange("disclaimer_text_1", e.target.value)}
                  className="w-full bg-[#090a0f] border border-white/[0.08] focus:border-amber-500/50 rounded-lg p-2.5 text-xs text-zinc-200 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Aviso 3: Política de No Reembolso y Disputas
                </label>
                <textarea
                  rows={2}
                  value={settings.disclaimer_text_3 || ""}
                  onChange={(e) => handleChange("disclaimer_text_3", e.target.value)}
                  className="w-full bg-[#090a0f] border border-white/[0.08] focus:border-amber-500/50 rounded-lg p-2.5 text-xs text-zinc-200 outline-none"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-3 border-t border-white/[0.08] flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-lg font-bold text-black text-xs bg-amber-500 hover:bg-amber-400 shadow-sm disabled:opacity-50 transition-all flex items-center space-x-1.5"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                    <span>Guardando Todo...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Guardar Toda la Configuración</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}
