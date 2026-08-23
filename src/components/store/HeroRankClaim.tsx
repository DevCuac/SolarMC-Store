"use client";

import React from "react";
import { Shield, ChevronRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function HeroRankClaim() {
  const { setIsRankModalOpen } = useCart();

  return (
    <div className="bg-[#121522] border border-[#1e2336] hover:border-[#ff9d00]/40 rounded-xl p-6 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_10px_35px_rgba(255,157,0,0.08)] flex flex-col justify-between transition-all duration-300">
      {/* Background Subtle Solar Flare */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff9d00]/5 rounded-full blur-3xl pointer-events-none" />

      <div>
        <div className="flex items-start gap-4">
          {/* Linear Solar Shield */}
          <div className="w-12 h-12 rounded-lg bg-[#181d2e] border border-[#242b40] flex items-center justify-center text-[#ff9d00] flex-shrink-0">
            <Shield className="w-6 h-6 text-[#ff9d00] fill-[#ff9d00]/20" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-[#ff9d00]/15 text-[#ff9d00] font-black text-[10px] tracking-wider uppercase border border-[#ff9d00]/30">
                Free Starter
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide mt-1">
              Claim Your Free Rank
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Unlock awesome in-game perks instantly when you claim your starter rank.
            </p>
          </div>
        </div>

        {/* 2x2 Perks Grid (Linear & Sharp) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-5">
          <div className="flex items-center space-x-2.5 bg-[#0e1019] border border-[#1a1f30] hover:border-[#28314a] rounded-lg px-3.5 py-2.5 transition-colors">
            <span className="w-2 h-2 rounded-full bg-[#ff9d00] shadow-[0_0_6px_#ff9d00] flex-shrink-0" />
            <span className="text-xs font-semibold text-gray-200">
              More Player Vaults
            </span>
          </div>

          <div className="flex items-center space-x-2.5 bg-[#0e1019] border border-[#1a1f30] hover:border-[#28314a] rounded-lg px-3.5 py-2.5 transition-colors">
            <span className="w-2 h-2 rounded-full bg-[#ff9d00] shadow-[0_0_6px_#ff9d00] flex-shrink-0" />
            <span className="text-xs font-semibold text-gray-200">
              Special Starter Kit
            </span>
          </div>

          <div className="flex items-center space-x-2.5 bg-[#0e1019] border border-[#1a1f30] hover:border-[#28314a] rounded-lg px-3.5 py-2.5 transition-colors">
            <span className="w-2 h-2 rounded-full bg-[#ff9d00] shadow-[0_0_6px_#ff9d00] flex-shrink-0" />
            <span className="text-xs font-semibold text-gray-200">
              Gamemode specific perks
            </span>
          </div>

          <div className="flex items-center space-x-2.5 bg-[#0e1019] border border-[#1a1f30] hover:border-[#28314a] rounded-lg px-3.5 py-2.5 transition-colors">
            <span className="w-2 h-2 rounded-full bg-[#ff9d00] shadow-[0_0_6px_#ff9d00] flex-shrink-0" />
            <span className="text-xs font-semibold text-gray-200">
              ...and much, much more!
            </span>
          </div>
        </div>
      </div>

      {/* Button with linear style & hover glow */}
      <button
        onClick={() => setIsRankModalOpen(true)}
        className="mt-5 w-full py-3 px-5 rounded-lg font-black text-black text-xs sm:text-sm tracking-wide bg-[#ff9d00] hover:bg-[#ffad26] shadow-[0_0_15px_rgba(255,157,0,0.3)] hover:shadow-[0_0_25px_rgba(255,157,0,0.5)] active:scale-[0.99] transition-all duration-200 flex items-center justify-center space-x-2"
      >
        <span>Claim your free rank now</span>
        <ChevronRight className="w-4 h-4 text-black" />
      </button>
    </div>
  );
}
