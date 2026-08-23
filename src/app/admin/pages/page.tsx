"use client";

import React, { useState, useEffect } from "react";
import { 
  FileText, 
  Save, 
  Loader2, 
  BookOpen, 
  ShieldCheck, 
  Scale, 
  Users, 
  Eye, 
  Edit3,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const availablePages = [
  { slug: "terms", label: "Términos & Condiciones", icon: BookOpen, href: "/terms" },
  { slug: "privacy", label: "Política de Privacidad", icon: ShieldCheck, href: "/privacy" },
  { slug: "impressum", label: "Aviso Legal (Impressum)", icon: Users, href: "/impressum" },
  { slug: "rules", label: "Reglas del Servidor", icon: Scale, href: "/rules" },
];

export default function AdminPagesCMS() {
  const [activeSlug, setActiveSlug] = useState("terms");
  const [pages, setPages] = useState<Record<string, { title: string; content: string }>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const [currentTitle, setCurrentTitle] = useState("");
  const [currentContent, setCurrentContent] = useState("");

  const loadPages = async () => {
    try {
      const res = await fetch("/api/admin/pages");
      const data = await res.json();
      if (data.pages) {
        const map: Record<string, { title: string; content: string }> = {};
        data.pages.forEach((p: any) => {
          map[p.slug] = { title: p.title, content: p.content };
        });
        setPages(map);

        if (map[activeSlug]) {
          setCurrentTitle(map[activeSlug].title);
          setCurrentContent(map[activeSlug].content);
        }
      }
    } catch (e) {
      toast.error("Error al cargar páginas legales");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPages();
  }, []);

  const handleTabChange = (slug: string) => {
    setActiveSlug(slug);
    if (pages[slug]) {
      setCurrentTitle(pages[slug].title);
      setCurrentContent(pages[slug].content);
    } else {
      setCurrentTitle(availablePages.find((p) => p.slug === slug)?.label || "");
      setCurrentContent("");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/pages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: activeSlug,
          title: currentTitle,
          content: currentContent,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`¡"${currentTitle}" actualizada con éxito!`);
        setPages((prev) => ({
          ...prev,
          [activeSlug]: { title: currentTitle, content: currentContent },
        }));
      } else {
        toast.error(data.error || "Error al actualizar página");
      }
    } catch (e) {
      toast.error("Error al guardar página");
    } finally {
      setSaving(false);
    }
  };

  const activePageMeta = availablePages.find((p) => p.slug === activeSlug);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Páginas Legales & CMS
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Edita y personaliza Términos y Condiciones, Política de Privacidad, Aviso Legal y Reglas del Servidor.
          </p>
        </div>

        {activePageMeta && (
          <Link
            href={activePageMeta.href}
            target="_blank"
            className="px-3 py-1.5 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-200 text-xs font-semibold rounded-lg transition-all flex items-center space-x-1.5 self-start sm:self-auto"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Ver Página en Vivo</span>
          </Link>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
        {availablePages.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSlug === tab.slug;
          return (
            <button
              key={tab.slug}
              onClick={() => handleTabChange(tab.slug)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg font-medium text-xs whitespace-nowrap transition-all border ${
                isActive
                  ? "bg-amber-500/10 text-amber-300 border-amber-500/40 font-semibold shadow-sm"
                  : "bg-[#0e1017] text-zinc-400 border-white/[0.06] hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Editor Box */}
      <div className="bg-[#0e1017] border border-white/[0.08] rounded-xl p-5 sm:p-6 shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-7 h-7 animate-spin text-amber-400" />
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            {/* Title & View Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
              <div className="flex-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Título de la Página
                </label>
                <input
                  type="text"
                  value={currentTitle}
                  onChange={(e) => setCurrentTitle(e.target.value)}
                  className="w-full bg-[#090a0f] border border-white/[0.08] focus:border-amber-500/50 rounded-lg px-3 py-1.5 text-xs font-bold text-white outline-none transition-colors"
                  required
                />
              </div>

              <div className="flex items-center space-x-1.5 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => setPreviewMode(false)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
                    !previewMode
                      ? "bg-white/[0.08] text-white"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Editor</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode(true)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
                    previewMode
                      ? "bg-white/[0.08] text-white"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  <span>Vista Previa</span>
                </button>
              </div>
            </div>

            {/* Content Field or Live Preview */}
            {previewMode ? (
              <div className="bg-[#090a0f] border border-white/[0.08] rounded-lg p-5 min-h-[350px] text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed">
                {currentContent || "(El contenido de la página está vacío)"}
              </div>
            ) : (
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Contenido en Markdown
                </label>
                <textarea
                  rows={14}
                  value={currentContent}
                  onChange={(e) => setCurrentContent(e.target.value)}
                  className="w-full bg-[#090a0f] border border-white/[0.08] focus:border-amber-500/50 rounded-lg p-3 text-xs font-mono text-zinc-200 outline-none leading-relaxed"
                  placeholder="Escribe el contenido en formato Markdown aquí..."
                />
              </div>
            )}

            {/* Submit Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]">
              <span className="text-[11px] text-zinc-500">
                Los cambios se publican de inmediato en la tienda.
              </span>

              <button
                type="submit"
                disabled={saving}
                className="px-4 py-1.5 rounded-lg font-bold text-black text-xs bg-amber-500 hover:bg-amber-400 shadow-sm disabled:opacity-50 transition-all flex items-center space-x-1.5"
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
        )}
      </div>
    </div>
  );
}
