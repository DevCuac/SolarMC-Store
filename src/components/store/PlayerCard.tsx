"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, LogOut, User, RefreshCw, Laptop, Smartphone } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import { useCart } from "@/context/CartContext";
import { getMinecraftHeadRender } from "@/lib/utils";

export function PlayerCard() {
  const { data: session } = useSession();
  const { minecraftUsername, minecraftEdition, setMinecraftEdition } = usePlayer();
  const { totalItemsCount, setIsCartOpen, setIsAuthModalOpen, setAuthModalTab } = useCart();

  const activeUsername = session?.user?.name || minecraftUsername || "cuac_xdpe";
  const avatarUrl = getMinecraftHeadRender(activeUsername);

  const toggleEdition = () => {
    setMinecraftEdition(minecraftEdition === "Java" ? "Bedrock" : "Java");
  };

  return (
    <div className="bg-[#121522] border border-[#1e2336] hover:border-[#ff9d00]/40 rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_10px_35px_rgba(255,157,0,0.08)] flex flex-col items-center justify-between text-center relative overflow-hidden transition-all duration-300">
      
      <div className="flex flex-col items-center w-full">
        {/* Minecraft Head Avatar */}
        <div 
          onClick={() => {
            setAuthModalTab("quick");
            setIsAuthModalOpen(true);
          }}
          title="Haz clic para cambiar tu usuario de Minecraft"
          className="cursor-pointer group relative w-16 h-16 rounded-lg bg-[#181d2e] border border-[#242b40] hover:border-[#ff9d00]/50 p-1.5 flex items-center justify-center transition-all duration-200 hover:scale-105"
        >
          <img
            src={avatarUrl}
            alt={activeUsername}
            className="w-13 h-13 rounded-md object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
            onError={(e) => {
              (e.target as HTMLElement).setAttribute(
                "src",
                "https://mc-heads.net/head/steve/128"
              );
            }}
          />
          <div className="absolute -bottom-1 -right-1 p-1 bg-[#121522] rounded-md border border-[#242b40] text-gray-400 group-hover:text-amber-400 transition-colors">
            <RefreshCw className="w-2.5 h-2.5" />
          </div>
        </div>

        {/* User Info */}
        <div className="mt-2.5">
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400/80">
            BIENVENIDO DE NUEVO
          </div>
          <div className="text-lg font-black text-white tracking-wide mt-0.5">
            {activeUsername}
          </div>
          <button
            onClick={toggleEdition}
            className="text-xs text-gray-400 hover:text-amber-300 transition-colors font-semibold mt-1 flex items-center justify-center space-x-1.5 mx-auto bg-[#0e1019] px-2.5 py-0.5 rounded-md border border-[#1e2438]"
            title="Haz clic para alternar edición"
          >
            {minecraftEdition === "Java" ? (
              <Laptop className="w-3 h-3 text-amber-400" />
            ) : (
              <Smartphone className="w-3 h-3 text-cyan-400" />
            )}
            <span>Edición {minecraftEdition}</span>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full mt-5 space-y-2">
        <button
          onClick={() => setIsCartOpen(true)}
          className="w-full py-2.5 px-4 rounded-lg font-black text-xs tracking-wider uppercase bg-[#ff9d00] hover:bg-[#ffad26] text-black shadow-[0_0_15px_rgba(255,157,0,0.3)] hover:shadow-[0_0_20px_rgba(255,157,0,0.5)] transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <ShoppingCart className="w-4 h-4 text-black" />
          <span>CARRITO</span>
          {totalItemsCount > 0 && (
            <span className="ml-1 px-1.5 py-0.2 bg-black text-[#ff9d00] rounded-md text-[10px] font-black">
              {totalItemsCount}
            </span>
          )}
        </button>

        {session ? (
          <button
            onClick={() => signOut()}
            className="w-full py-2 px-3 rounded-lg font-bold text-xs uppercase bg-[#181d2e] hover:bg-[#22283e] text-gray-300 hover:text-white border border-[#22293e] transition-all flex items-center justify-center space-x-1.5"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span>CERRAR SESIÓN</span>
          </button>
        ) : (
          <button
            onClick={() => {
              setAuthModalTab("quick");
              setIsAuthModalOpen(true);
            }}
            className="w-full py-2 px-3 rounded-lg font-bold text-xs uppercase bg-[#181d2e] hover:bg-[#22283e] text-gray-300 hover:text-white border border-[#22293e] transition-all flex items-center justify-center space-x-1.5"
          >
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span>CAMBIAR JUGADOR</span>
          </button>
        )}
      </div>
    </div>
  );
}
