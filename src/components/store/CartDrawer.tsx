"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  CreditCard, 
  Loader2,
  Tag,
  ShieldCheck
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { usePlayer } from "@/context/PlayerContext";
import { formatCurrency, getMinecraftHeadRender } from "@/lib/utils";
import { toast } from "sonner";
import confetti from "canvas-confetti";

export function CartDrawer() {
  const router = useRouter();
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    discountTotal,
    total,
    coupon,
    applyCoupon,
    removeCoupon,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const { minecraftUsername, minecraftEdition, setMinecraftUsername } = usePlayer();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [isCouponSubmitting, setIsCouponSubmitting] = useState(false);
  const [customUsername, setCustomUsername] = useState(minecraftUsername);
  const [isEditingUsername, setIsEditingUsername] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsCouponSubmitting(true);
    const res = await applyCoupon(couponInput);
    setIsCouponSubmitting(false);
    if (res.success) setCouponInput("");
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const recipientPlayer = isEditingUsername ? customUsername.trim() : minecraftUsername.trim();
    if (!recipientPlayer) {
      toast.error("Please enter your Minecraft username for delivery");
      setIsEditingUsername(true);
      return;
    }

    setCheckoutLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          minecraftUsername: recipientPlayer,
          minecraftEdition,
          couponCode: coupon ? coupon.code : null,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
          });
        } catch {}

        clearCart();
        setIsCartOpen(false);
        toast.success("Order completed successfully!", {
          description: `Order #${data.orderNumber} dispatched to ${data.minecraftUsername}`,
        });
        router.push(`/checkout/success?orderNumber=${data.orderNumber}`);
      } else {
        toast.error(data.error || "Failed to process checkout");
      }
    } catch (e) {
      toast.error("An unexpected error occurred during checkout");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const currentUsername = isEditingUsername ? customUsername : minecraftUsername;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-modal">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#121522] border-l border-[#1e2336] text-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-[#1e2336] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-[#181d2e] border border-[#242b40] flex items-center justify-center text-[#ff9d00]">
                <ShoppingBag className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Your Shopping Cart</h3>
                <p className="text-xs text-gray-400">
                  {items.length} {items.length === 1 ? "item" : "items"} in cart
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#181d2e] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Minecraft Player Delivery Preview */}
          <div className="bg-[#0e1019] px-5 py-2.5 border-b border-[#1e2336] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <img
                src={getMinecraftHeadRender(currentUsername)}
                alt="Minecraft Skin"
                className="w-8 h-8 rounded border border-[#242b40] object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).setAttribute(
                    "src",
                    "https://mc-heads.net/head/steve/128"
                  );
                }}
              />
              <div>
                <div className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">
                  Delivering to
                </div>
                {isEditingUsername ? (
                  <input
                    type="text"
                    value={customUsername}
                    onChange={(e) => setCustomUsername(e.target.value)}
                    placeholder="Enter MC Username"
                    className="bg-[#181d2e] border border-[#242b40] rounded px-2 py-0.5 text-xs text-white outline-none w-32"
                  />
                ) : (
                  <div className="text-xs font-bold text-amber-300">
                    {minecraftUsername} ({minecraftEdition})
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                if (isEditingUsername) {
                  if (customUsername.trim()) {
                    setMinecraftUsername(customUsername.trim());
                  }
                  setIsEditingUsername(false);
                } else {
                  setCustomUsername(minecraftUsername);
                  setIsEditingUsername(true);
                }
              }}
              className="text-xs text-amber-400 hover:underline font-semibold"
            >
              {isEditingUsername ? "Save" : "Change"}
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-10 h-10 text-gray-600 mx-auto mb-2.5" />
                <p className="text-sm font-bold text-gray-300">Your cart is empty</p>
                <p className="text-xs text-gray-500 mt-1">
                  Add ranks, credits or packages to continue
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.productId}
                  className="bg-[#181d2e] border border-[#22293e] rounded-lg p-3.5 flex flex-col space-y-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      {item.badge && (
                        <span className="inline-block text-[9px] font-extrabold uppercase px-1.5 py-0.2 bg-[#22293e] text-amber-300 rounded mb-1 border border-[#2b334a]">
                          {item.badge}
                        </span>
                      )}
                      <h4 className="text-xs font-bold text-white">{item.name}</h4>
                      <p className="text-xs font-semibold text-amber-400 mt-0.5">
                        {formatCurrency(item.price)} each
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-gray-500 hover:text-red-400 p-1 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Quantity Controls & Subtotal */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#1e2438]">
                    <div className="flex items-center space-x-2 bg-[#0e1019] border border-[#202638] rounded-md p-1">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="p-0.5 text-gray-400 hover:text-white rounded hover:bg-[#181d2e] transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold px-1.5 text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="p-0.5 text-gray-400 hover:text-white rounded hover:bg-[#181d2e] transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-xs font-bold text-white">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Summary & Checkout */}
          {items.length > 0 && (
            <div className="p-5 bg-[#0e1019] border-t border-[#1e2336] space-y-3.5">
              {/* Coupon Form */}
              {coupon ? (
                <div className="flex items-center justify-between bg-amber-950/30 border border-amber-500/30 px-3 py-1.5 rounded-lg text-xs">
                  <div className="flex items-center space-x-1.5 text-amber-300 font-bold">
                    <Tag className="w-3.5 h-3.5" />
                    <span>
                      {coupon.code} (
                      {coupon.discountType === "PERCENTAGE"
                        ? `${coupon.discountValue}% OFF`
                        : `$${coupon.discountValue.toFixed(2)} OFF`}
                      )
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Coupon code (e.g. WELCOME10)"
                    className="flex-1 bg-[#181d2e] border border-[#22293e] focus:border-[#ff9d00] rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isCouponSubmitting || !couponInput.trim()}
                    className="px-3.5 py-1.5 bg-[#20263b] hover:bg-[#28314a] disabled:opacity-50 text-xs font-bold text-white rounded-lg transition-colors"
                  >
                    {isCouponSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Apply"}
                  </button>
                </form>
              )}

              {/* Price Calculations */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {discountTotal > 0 && (
                  <div className="flex justify-between text-amber-400 font-semibold">
                    <span>Discount</span>
                    <span>-{formatCurrency(discountTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-extrabold text-white pt-1.5 border-t border-[#1e2336]">
                  <span>Total</span>
                  <span className="text-amber-300 font-black">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="w-full py-3 px-4 rounded-lg font-black text-black text-xs sm:text-sm bg-[#ff9d00] hover:bg-[#ffad26] shadow-[0_0_15px_rgba(255,157,0,0.3)] hover:shadow-[0_0_20px_rgba(255,157,0,0.5)] disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
              >
                {checkoutLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 text-black" />
                    <span>Complete Order ({formatCurrency(total)})</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center space-x-1.5 text-[10px] text-gray-500">
                <ShieldCheck className="w-3 h-3 text-[#ff9d00]" />
                <span>Instant In-Game Delivery • Secure Checkout</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
