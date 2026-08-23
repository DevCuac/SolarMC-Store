"use client";

import React from "react";
import { ProductItem } from "@/types";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import { Plus, Check, Eye } from "lucide-react";

interface ProductCardProps {
  product: ProductItem;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, items, setSelectedProduct } = useCart();
  const inCartItem = items.find((i) => i.productId === product.id);

  const isMonthly = product.badge === "MONTHLY" || product.slug.includes("plus");

  return (
    <div className="bg-[#121522] border border-[#1e2336] hover:border-[#ff9d00]/40 rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_35px_rgba(255,157,0,0.09)] hover:-translate-y-1 flex flex-col justify-between transition-all duration-300 group relative">
      
      <div>
        {/* Top Badge & Details Trigger */}
        <div className="flex items-center justify-between mb-3">
          {product.badge ? (
            <span className="inline-block px-2.5 py-0.5 bg-[#181d2e] border border-[#242b40] text-[10px] font-black uppercase tracking-wider text-amber-300 rounded">
              {product.badge}
            </span>
          ) : (
            <span className="inline-block px-2.5 py-0.5 bg-[#181d2e]/60 text-[10px] font-bold uppercase tracking-wider text-gray-400 rounded">
              PACKAGE
            </span>
          )}

          <button
            onClick={() => setSelectedProduct(product)}
            className="text-xs font-semibold text-gray-400 hover:text-amber-300 flex items-center space-x-1 transition-colors px-2 py-0.5 rounded hover:bg-[#181d2e]"
            title="View full perks and details"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Perks</span>
          </button>
        </div>

        {/* Title */}
        <h3 className="text-xl font-black text-white tracking-wide group-hover:text-amber-200 transition-colors">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Perks snippet */}
        {product.perks && product.perks.length > 0 && (
          <div className="mt-4 space-y-1.5 border-t border-[#1a1f30] pt-3">
            {product.perks.slice(0, 2).map((perk, idx) => (
              <div key={idx} className="flex items-center space-x-2 text-xs text-gray-300">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff9d00] flex-shrink-0" />
                <span className="truncate">{perk}</span>
              </div>
            ))}
            {product.perks.length > 2 && (
              <button
                onClick={() => setSelectedProduct(product)}
                className="text-[11px] text-amber-400 hover:underline font-bold pt-0.5"
              >
                +{product.perks.length - 2} more perks...
              </button>
            )}
          </div>
        )}
      </div>

      {/* Price & Action Button */}
      <div className="mt-6">
        <div className="flex items-baseline space-x-2 mb-3.5">
          <span className="text-2xl font-black text-white tracking-tight">
            {isMonthly ? `From ${formatCurrency(product.price)}/mo` : formatCurrency(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-gray-500 line-through font-semibold">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>

        <button
          onClick={() => addToCart(product)}
          className="w-full py-3 px-4 rounded-lg font-black text-black text-xs sm:text-sm tracking-wide bg-[#ff9d00] hover:bg-[#ffad26] shadow-[0_0_12px_rgba(255,157,0,0.25)] hover:shadow-[0_0_20px_rgba(255,157,0,0.45)] active:scale-[0.99] transition-all duration-200 flex items-center justify-center space-x-2"
        >
          {inCartItem ? (
            <>
              <Check className="w-4 h-4 text-black" />
              <span>Add Another ({inCartItem.quantity} in cart)</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 text-black" />
              <span>{isMonthly ? "View Plans / Add" : "Add to Cart"}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
