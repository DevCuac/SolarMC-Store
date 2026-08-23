"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Terminal, Copy, Check } from "lucide-react";
import { toast } from "sonner";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") || "SOL-948102";
  const [copied, setCopied] = useState(false);

  const copyOrder = () => {
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    toast.success("¡Número de orden copiado al portapapeles!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <div className="bg-[#121522] border border-[#1e2336] rounded-2xl p-8 sm:p-10 shadow-2xl">
        
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-5 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white">
          ¡Pago & Pedido Exitoso!
        </h1>
        
        <p className="text-xs text-gray-400 mt-2">
          Gracias por apoyar a SolarMC. Tus ventajas y paquetes digitales han sido encolados y enviados al servidor.
        </p>

        {/* Order Number Box */}
        <div className="mt-6 bg-[#0e1019] border border-[#1a1f30] rounded-xl p-4 flex items-center justify-between">
          <div className="text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Número de Referencia de la Orden
            </span>
            <div className="text-base font-black text-amber-300 font-mono">{orderNumber}</div>
          </div>

          <button
            onClick={copyOrder}
            className="p-2 bg-[#181d2e] hover:bg-[#22283e] border border-[#242b40] rounded-lg text-gray-300 hover:text-white transition-colors"
            title="Copiar ID de Orden"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
          </button>
        </div>

        {/* In-Game Instructions */}
        <div className="mt-5 text-left bg-[#0e1019] border border-[#1a1f30] rounded-xl p-4 space-y-2 text-xs text-gray-300">
          <div className="font-bold text-white flex items-center space-x-1.5">
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            <span>Cómo recibir tus artículos en el juego:</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-gray-400 leading-relaxed">
            <li>Conéctate al servidor con tu cuenta (<code className="text-amber-300 font-mono">play.solarmc.net</code>).</li>
            <li>Asegúrate de tener espacio libre en tu inventario.</li>
            <li>Tus rangos, créditos y ventajas se activarán automáticamente en 1 a 3 minutos.</li>
          </ol>
        </div>

        {/* Back to Store Action */}
        <div className="mt-6">
          <Link
            href="/"
            className="w-full py-3 px-6 rounded-xl font-bold text-black text-xs sm:text-sm bg-[#ff9d00] hover:bg-[#ffad26] shadow-[0_0_15px_rgba(255,157,0,0.3)] hover:shadow-[0_0_20px_rgba(255,157,0,0.5)] transition-all inline-flex items-center justify-center space-x-2"
          >
            <span>Volver a la Tienda</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-400 text-xs">Cargando recibo de la orden...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
