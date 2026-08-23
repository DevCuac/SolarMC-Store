"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Tag, Check, X, Loader2 } from "lucide-react";

export function CouponSection() {
  const { coupon, applyCoupon, removeCoupon } = useCart();
  const [inputCode, setInputCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    setLoading(true);
    const res = await applyCoupon(inputCode);
    setLoading(false);
    if (res.success) {
      setInputCode("");
    }
  };

  return (
    <div className="bg-[#121522] border border-[#1e2336] hover:border-[#28314a] rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300">
      {/* Text Info */}
      <div className="flex items-center space-x-3.5 w-full md:w-auto">
        <div className="hidden sm:flex w-10 h-10 rounded-lg bg-[#181d2e] border border-[#242b40] items-center justify-center text-[#ff9d00] flex-shrink-0">
          <Tag className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-base font-black text-white tracking-wide">
            Have a Coupon Code?
          </h4>
          <p className="text-xs text-gray-400">
            Enter your code below and it will be applied at checkout
          </p>
        </div>
      </div>

      {/* Input or Applied Coupon Badge */}
      <div className="w-full md:w-auto flex-shrink-0">
        {coupon ? (
          <div className="flex items-center justify-between sm:justify-start space-x-3 bg-amber-950/30 border border-amber-500/30 px-3.5 py-2 rounded-lg">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-amber-300">
                Code: {coupon.code} (
                {coupon.discountType === "PERCENTAGE"
                  ? `${coupon.discountValue}% OFF`
                  : `$${coupon.discountValue.toFixed(2)} OFF`}
                )
              </span>
            </div>
            <button
              onClick={removeCoupon}
              className="p-1 text-gray-400 hover:text-red-400 transition-colors"
              title="Remove coupon"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleApply} className="flex items-center space-x-2 w-full sm:w-auto">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Coupon code (e.g. WELCOME10)"
              className="w-full sm:w-60 bg-[#0e1019] border border-[#1e2336] focus:border-[#ff9d00] rounded-lg px-3.5 py-2 text-xs text-white placeholder-gray-500 outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !inputCode.trim()}
              className="px-4 py-2 rounded-lg font-black text-black text-xs bg-[#ff9d00] hover:bg-[#ffad26] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_12px_rgba(255,157,0,0.25)] hover:shadow-[0_0_18px_rgba(255,157,0,0.4)] transition-all flex items-center space-x-1.5 flex-shrink-0"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-black" />
              ) : (
                <span>Apply</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
