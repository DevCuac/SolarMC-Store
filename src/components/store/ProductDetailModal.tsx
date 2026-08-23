"use client";

import React from "react";
import { X, Check, ShoppingCart, Sparkles, Terminal } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";

export function ProductDetailModal() {
  const { selectedProduct, setSelectedProduct, addToCart, items } = useCart();

  if (!selectedProduct) return null;

  const inCartItem = items.find((i) => i.productId === selectedProduct.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-modal">
      <div className="bg-[#121522] border border-[#242b40] rounded-xl max-w-lg w-full p-6 relative shadow-2xl overflow-hidden max-h-[90vh] flex flex-col justify-between">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-[#181d2e] transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto pr-1 space-y-4">
          {/* Header */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              {selectedProduct.badge && (
                <span className="px-2.5 py-0.5 bg-[#181d2e] border border-[#242b40] text-[10px] font-black uppercase tracking-wider text-amber-300 rounded">
                  {selectedProduct.badge}
                </span>
              )}
              {selectedProduct.category && (
                <span className="px-2 py-0.5 bg-[#181d2e] text-[10px] font-bold text-gray-300 rounded border border-[#202638]">
                  {selectedProduct.category.name}
                </span>
              )}
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              {selectedProduct.name}
            </h3>

            <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">
              {selectedProduct.description}
            </p>
          </div>

          {/* Perks Section */}
          {selectedProduct.perks && selectedProduct.perks.length > 0 && (
            <div className="bg-[#0e1019] rounded-lg p-4 border border-[#1a1f30] space-y-2.5">
              <div className="flex items-center space-x-2 text-xs font-bold text-gray-300 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#ff9d00]" />
                <span>Package Perks & Features</span>
              </div>

              <div className="space-y-2">
                {selectedProduct.perks.map((perk, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-xs text-gray-200">
                    <div className="w-3.5 h-3.5 rounded bg-[#ff9d00]/20 text-[#ff9d00] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 text-[#ff9d00]" />
                    </div>
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* In-Game Commands preview */}
          {selectedProduct.commands && selectedProduct.commands.length > 0 && (
            <div className="bg-[#0b0d14] rounded-lg p-3 border border-[#181c2b] space-y-1.5">
              <div className="flex items-center space-x-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <Terminal className="w-3 h-3 text-amber-400" />
                <span>Instant In-Game Delivery</span>
              </div>
              <p className="text-[11px] text-gray-400">
                Commands are dispatched automatically to your Minecraft account upon purchase.
              </p>
            </div>
          )}
        </div>

        {/* Footer with Price and Add to Cart */}
        <div className="pt-4 mt-4 border-t border-[#1a1f30] flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-gray-400 font-medium block">Price</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-black text-white">
                {formatCurrency(selectedProduct.price)}
              </span>
              {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price && (
                <span className="text-xs text-gray-500 line-through">
                  {formatCurrency(selectedProduct.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              addToCart(selectedProduct);
              setSelectedProduct(null);
            }}
            className="flex-1 py-3 px-5 rounded-lg font-black text-black text-xs sm:text-sm bg-[#ff9d00] hover:bg-[#ffad26] shadow-[0_0_15px_rgba(255,157,0,0.3)] hover:shadow-[0_0_20px_rgba(255,157,0,0.5)] transition-all flex items-center justify-center space-x-2"
          >
            <ShoppingCart className="w-4 h-4 text-black" />
            <span>{inCartItem ? "Add Another" : "Add to Cart"}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
