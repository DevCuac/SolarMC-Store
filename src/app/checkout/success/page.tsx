"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ShoppingBag, ArrowRight, ShieldCheck, Terminal, Copy, Check } from "lucide-react";
import { toast } from "sonner";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") || "OPL-948102";
  const [copied, setCopied] = useState(false);

  const copyOrder = () => {
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    toast.success("Order ID copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <div className="bg-[#181b27] border border-[#2e364e] rounded-3xl p-8 sm:p-10 shadow-card">
        
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-[#52b824] flex items-center justify-center mx-auto mb-6 shadow-green-glow">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Payment & Order Successful!
        </h1>
        
        <p className="text-sm text-gray-400 mt-2">
          Thank you for supporting our Minecraft server. Your perks and digital packages have been queued and dispatched.
        </p>

        {/* Order Number Box */}
        <div className="mt-6 bg-[#131520] border border-[#23293c] rounded-2xl p-4 flex items-center justify-between">
          <div className="text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Order Reference Number
            </span>
            <div className="text-lg font-black text-white">{orderNumber}</div>
          </div>

          <button
            onClick={copyOrder}
            className="p-2 bg-[#1e2333] hover:bg-[#282f45] border border-[#2e374f] rounded-xl text-gray-300 hover:text-white transition-colors"
            title="Copy Order ID"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* In-Game Instructions */}
        <div className="mt-6 text-left bg-[#131520] border border-[#23293c] rounded-2xl p-4 space-y-2 text-xs text-gray-300">
          <div className="font-bold text-white flex items-center space-x-1.5">
            <Terminal className="w-3.5 h-3.5 text-amber-300" />
            <span>How to receive your items in-game:</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-gray-400">
            <li>Log into the server (<code className="text-amber-300">play.oplegends.com</code>).</li>
            <li>Make sure you have enough free inventory space.</li>
            <li>Your ranks, credits, and perks will activate automatically in 1-3 minutes.</li>
          </ol>
        </div>

        {/* Back to Store Action */}
        <div className="mt-8">
          <Link
            href="/"
            className="w-full py-3.5 px-6 rounded-xl font-bold text-white text-base bg-[#52b824] hover:bg-[#5ecf2b] active:bg-[#43961d] shadow-green-glow transition-all inline-flex items-center justify-center space-x-2"
          >
            <span>Return to Webstore</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-400">Loading order receipt...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
