"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { 
  X, 
  Mail, 
  Lock, 
  Loader2, 
  MessageSquare,
  Laptop,
  Smartphone
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { usePlayer } from "@/context/PlayerContext";
import { getMinecraftHeadRender } from "@/lib/utils";
import { toast } from "sonner";

export function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, authModalTab, setAuthModalTab } = useCart();
  const { setMinecraftUsername, setMinecraftEdition } = usePlayer();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mcUsername, setMcUsername] = useState("");
  const [mcEditionForm, setMcEditionForm] = useState<"Java" | "Bedrock">("Java");
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Por favor ingresa tu correo y contraseña");
      return;
    }

    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error(res.error || "Credenciales incorrectas");
      } else {
        toast.success("¡Sesión iniciada con éxito!");
        setIsAuthModalOpen(false);
        window.location.reload();
      }
    } catch (e) {
      toast.error("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("El correo y la contraseña son obligatorios");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          minecraftUsername: mcUsername,
          minecraftEdition: mcEditionForm,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("¡Cuenta creada con éxito! Iniciando sesión...");
        if (mcUsername) setMinecraftUsername(mcUsername);
        await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        setIsAuthModalOpen(false);
        window.location.reload();
      } else {
        toast.error(data.error || "No se pudo crear la cuenta");
      }
    } catch (e) {
      toast.error("Error en el registro");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mcUsername.trim()) {
      toast.error("Por favor ingresa tu usuario de Minecraft");
      return;
    }

    setLoading(true);
    try {
      const clean = mcUsername.trim();
      setMinecraftUsername(clean);
      setMinecraftEdition(mcEditionForm);

      await signIn("credentials", {
        minecraftUsername: clean,
        isMinecraftQuickLogin: "true",
        redirect: false,
      });

      toast.success(`¡Perfil de jugador conectado a ${clean}!`);
      setIsAuthModalOpen(false);
    } catch (e) {
      toast.error("Error al vincular el jugador");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-modal">
      <div className="bg-[#121522] border border-[#242b40] rounded-xl max-w-md w-full p-6 relative shadow-2xl overflow-hidden">

        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-[#181d2e] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Switcher */}
        <div className="flex items-center justify-center space-x-1 bg-[#0e1019] p-1 rounded-lg mb-5 border border-[#1e2336]">
          <button
            onClick={() => setAuthModalTab("signin")}
            className={`flex-1 py-1.5 px-3 rounded text-xs font-bold transition-all ${
              authModalTab === "signin"
                ? "bg-[#181d2e] text-white shadow-sm"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => setAuthModalTab("signup")}
            className={`flex-1 py-1.5 px-3 rounded text-xs font-bold transition-all ${
              authModalTab === "signup"
                ? "bg-[#181d2e] text-white shadow-sm"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Registrarse
          </button>
          <button
            onClick={() => setAuthModalTab("quick")}
            className={`flex-1 py-1.5 px-3 rounded text-xs font-bold transition-all ${
              authModalTab === "quick"
                ? "bg-[#181d2e] text-amber-300 shadow-sm"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Rápido MC
          </button>
        </div>

        {/* OAuth Social Login Buttons */}
        {authModalTab !== "quick" && (
          <div className="space-y-2 mb-5">
            <button
              onClick={() => signIn("discord")}
              className="w-full py-2 px-3 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-lg text-xs font-bold flex items-center justify-center space-x-2 shadow-sm transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Continuar con Discord</span>
            </button>

            <button
              onClick={() => signIn("google")}
              className="w-full py-2 px-3 bg-[#ffffff] hover:bg-gray-100 text-gray-800 rounded-lg text-xs font-bold flex items-center justify-center space-x-2 shadow-sm transition-all"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continuar con Google</span>
            </button>

            <div className="relative my-3 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#1e2336]"></div>
              </div>
              <span className="relative bg-[#121522] px-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                O con Correo Electrónico
              </span>
            </div>
          </div>
        )}

        {/* Tab Content: Iniciar Sesión */}
        {authModalTab === "signin" && (
          <form onSubmit={handleSignIn} className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu_correo@ejemplo.com"
                  className="w-full bg-[#0e1019] border border-[#1e2336] focus:border-[#ff9d00] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0e1019] border border-[#1e2336] focus:border-[#ff9d00] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg font-black text-black text-xs sm:text-sm bg-[#ff9d00] hover:bg-[#ffad26] shadow-[0_0_15px_rgba(255,157,0,0.3)] disabled:opacity-50 transition-all flex items-center justify-center space-x-2 mt-4"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : <span>Ingresar</span>}
            </button>
          </form>
        )}

        {/* Tab Content: Registrarse */}
        {authModalTab === "signup" && (
          <form onSubmit={handleSignUp} className="space-y-2.5">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                Nombre de Pantalla
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu Nombre"
                className="w-full bg-[#0e1019] border border-[#1e2336] focus:border-[#ff9d00] rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jugador@solarmc.net"
                className="w-full bg-[#0e1019] border border-[#1e2336] focus:border-[#ff9d00] rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0e1019] border border-[#1e2336] focus:border-[#ff9d00] rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                Usuario de Minecraft (IGN)
              </label>
              <input
                type="text"
                value={mcUsername}
                onChange={(e) => setMcUsername(e.target.value)}
                placeholder="ej. cuac_xdpe"
                className="w-full bg-[#0e1019] border border-[#1e2336] focus:border-[#ff9d00] rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg font-black text-black text-xs sm:text-sm bg-[#ff9d00] hover:bg-[#ffad26] shadow-[0_0_15px_rgba(255,157,0,0.3)] disabled:opacity-50 transition-all flex items-center justify-center space-x-2 mt-3"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : <span>Crear Cuenta</span>}
            </button>
          </form>
        )}

        {/* Tab Content: Rápido Minecraft */}
        {authModalTab === "quick" && (
          <form onSubmit={handleQuickLink} className="space-y-3.5">
            <div className="text-center">
              <div className="w-14 h-14 rounded-lg bg-[#181d2e] border border-[#242b40] mx-auto flex items-center justify-center p-1.5 mb-2 shadow-inner">
                <img
                  src={getMinecraftHeadRender(mcUsername || "steve")}
                  alt="Skin Preview"
                  className="w-10 h-10 rounded object-contain"
                />
              </div>
              <h4 className="text-sm font-black text-white">
                Vínculo Rápido de Minecraft
              </h4>
              <p className="text-xs text-gray-400 mt-0.5">
                Ingresa tu nombre de usuario del juego para asociar la entrega de tus paquetes.
              </p>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                Tu Nick de Minecraft
              </label>
              <input
                type="text"
                value={mcUsername}
                onChange={(e) => setMcUsername(e.target.value)}
                placeholder="ej. cuac_xdpe"
                className="w-full bg-[#0e1019] border border-[#1e2336] focus:border-[#ff9d00] rounded-lg px-3 py-2 text-xs font-bold text-white placeholder-gray-500 outline-none transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMcEditionForm("Java")}
                className={`py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center justify-center space-x-1.5 ${
                  mcEditionForm === "Java"
                    ? "bg-[#181d2e] text-amber-300 border-amber-500/50"
                    : "bg-[#0e1019] text-gray-400 border-[#1e2336]"
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>Edición Java</span>
              </button>
              <button
                type="button"
                onClick={() => setMcEditionForm("Bedrock")}
                className={`py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center justify-center space-x-1.5 ${
                  mcEditionForm === "Bedrock"
                    ? "bg-[#181d2e] text-amber-300 border-amber-500/50"
                    : "bg-[#0e1019] text-gray-400 border-[#1e2336]"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Edición Bedrock</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || !mcUsername.trim()}
              className="w-full py-2.5 rounded-lg font-black text-black text-xs sm:text-sm bg-[#ff9d00] hover:bg-[#ffad26] shadow-[0_0_15px_rgba(255,157,0,0.3)] disabled:opacity-50 transition-all flex items-center justify-center space-x-2 mt-3"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : <span>Establecer Jugador & Continuar</span>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
