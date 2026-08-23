"use client";

import React, { useState } from "react";
import { X, Shield, Check, Loader2, Sparkles, Laptop, Smartphone } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { usePlayer } from "@/context/PlayerContext";
import { getMinecraftHeadRender } from "@/lib/utils";
import { toast } from "sonner";
import confetti from "canvas-confetti";

export function FreeRankModal() {
  const { isRankModalOpen, setIsRankModalOpen } = useCart();
  const { minecraftUsername, minecraftEdition, setMinecraftUsername, setMinecraftEdition } = usePlayer();
  const [playerInput, setPlayerInput] = useState(minecraftUsername);
  const [loading, setLoading] = useState(false);

  if (!isRankModalOpen) return null;

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerInput.trim()) {
      toast.error("Por favor ingresa tu usuario de Minecraft");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/claim-rank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          minecraftUsername: playerInput.trim(),
          minecraftEdition,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMinecraftUsername(playerInput.trim());
        try {
          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.5 },
          });
        } catch {}

        toast.success("¡Rango Gratuito Reclamado!", {
          description: data.message,
        });
        setIsRankModalOpen(false);
      } else {
        toast.error(data.error || "No se pudo reclamar el rango");
      }
    } catch (e) {
      toast.error("Error al conectar con el servidor de reclamos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-modal">
      <div className="bg-[#121522] border border-[#242b40] rounded-xl max-w-md w-full p-6 relative shadow-2xl overflow-hidden">
        
        <button
          onClick={() => setIsRankModalOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-[#181d2e] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Shield */}
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-lg bg-[#181d2e] border border-[#242b40] flex items-center justify-center text-[#ff9d00] mb-2.5">
            <Shield className="w-7 h-7 text-[#ff9d00] fill-[#ff9d00]/20" />
          </div>

          <h3 className="text-xl font-black text-white tracking-wide">
            Reclama Tu Rango Inicial Gratis
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            ¡Desbloquea kits exclusivos, baúles de jugador y ventajas permanentes sin costo!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleClaim} className="mt-5 space-y-3.5">
          {/* Avatar Preview & Username Input */}
          <div className="flex items-center space-x-3 bg-[#0e1019] border border-[#1a1f30] rounded-lg p-3">
            <img
              src={getMinecraftHeadRender(playerInput || "steve")}
              alt="Skin Preview"
              className="w-10 h-10 rounded-md border border-[#242b40] object-contain flex-shrink-0"
              onError={(e) => {
                (e.target as HTMLElement).setAttribute(
                  "src",
                  "https://mc-heads.net/head/steve/128"
                );
              }}
            />
            <div className="flex-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
                Usuario de Minecraft
              </label>
              <input
                type="text"
                value={playerInput}
                onChange={(e) => setPlayerInput(e.target.value)}
                placeholder="Ingresa tu usuario (ej. cuac_xdpe)"
                className="w-full bg-[#181d2e] border border-[#242b40] focus:border-[#ff9d00] rounded px-2.5 py-1 text-xs text-white font-bold placeholder-gray-500 outline-none transition-colors"
                required
              />
            </div>
          </div>

          {/* Edition Selector */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMinecraftEdition("Java")}
              className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all flex items-center justify-center space-x-1.5 ${
                minecraftEdition === "Java"
                  ? "bg-[#181d2e] text-amber-300 border-amber-500/50 shadow-sm"
                  : "bg-[#0e1019] text-gray-400 border-[#1a1f30] hover:bg-[#181d2e]"
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Edición Java</span>
            </button>
            <button
              type="button"
              onClick={() => setMinecraftEdition("Bedrock")}
              className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all flex items-center justify-center space-x-1.5 ${
                minecraftEdition === "Bedrock"
                  ? "bg-[#181d2e] text-amber-300 border-amber-500/50 shadow-sm"
                  : "bg-[#0e1019] text-gray-400 border-[#1a1f30] hover:bg-[#181d2e]"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Edición Bedrock</span>
            </button>
          </div>

          {/* Included Perks Summary */}
          <div className="bg-[#0e1019] rounded-lg p-3.5 border border-[#1a1f30] space-y-1.5 text-xs">
            <div className="font-bold text-gray-300 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Lo que recibes al instante:</span>
            </div>
            <div className="space-y-1 text-gray-400">
              <div className="flex items-center space-x-2">
                <Check className="w-3 h-3 text-[#ff9d00]" />
                <span>1x Baúl Privado de Jugador (/pv 1)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-3 h-3 text-[#ff9d00]" />
                <span>Kit Especial de Inicio con armadura y herramientas</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-3 h-3 text-[#ff9d00]" />
                <span>Acceso a /feed y comandos comunitarios</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !playerInput.trim()}
            className="w-full py-3 rounded-lg font-black text-black text-xs sm:text-sm bg-[#ff9d00] hover:bg-[#ffad26] shadow-[0_0_15px_rgba(255,157,0,0.3)] hover:shadow-[0_0_20px_rgba(255,157,0,0.5)] disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>Entregando Rango...</span>
              </>
            ) : (
              <span>Confirmar & Reclamar Rango</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
