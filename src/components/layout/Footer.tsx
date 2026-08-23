"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Sword } from "lucide-react";

export function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Do not render storefront footer on admin dashboard
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="w-full mt-16 border-t border-[#1a1f30] bg-[#090b12]">
      {/* Top Disclaimer & Copyright Area */}
      <div className="max-w-6xl mx-auto px-4 py-8 text-center space-y-2">
        <p className="text-xs sm:text-sm font-semibold text-gray-300">
          © 2020–{currentYear}{" "}
          <span className="text-[#ff9d00] font-black">SolarMC</span>, asociado con{" "}
          <span className="text-gray-200 font-bold">SolarMC Services LLC</span>. Todos los derechos reservados.
        </p>
        <p className="text-[10px] sm:text-[11px] font-bold tracking-wider text-gray-500 uppercase">
          MINECRAFT ES © MOJANG STUDIOS 2009–{currentYear}. NO ESTAMOS AFILIADOS CON MOJANG STUDIOS NI MICROSOFT.
        </p>
      </div>

      {/* Bottom Tebex / Merchant of Record Bar */}
      <div className="border-t border-[#141724] bg-[#07080e] py-4">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          {/* Left Tebex Notice */}
          <div className="flex items-center space-x-2 text-center md:text-left">
            <div className="flex items-center space-x-1 font-bold text-gray-300">
              <Sword className="w-3.5 h-3.5 text-[#ff9d00] rotate-45" />
              <span className="tracking-tight lowercase text-gray-200 font-black">tebex</span>
            </div>
            <span className="text-gray-600 hidden sm:inline">|</span>
            <span className="text-[11px] text-gray-400 leading-tight">
              Este sitio web y su proceso de compra son operados por nuestro revendedor oficial & Merchant of Record, Tebex Limited.
            </span>
          </div>

          {/* Right Legal Links */}
          <div className="flex items-center space-x-5 text-xs text-gray-400 flex-shrink-0">
            <Link
              href="/impressum"
              className="hover:text-amber-300 transition-colors"
            >
              Aviso Legal (Impressum)
            </Link>
            <Link
              href="/terms"
              className="hover:text-amber-300 transition-colors"
            >
              Términos & Condiciones
            </Link>
            <Link
              href="/privacy"
              className="hover:text-amber-300 transition-colors"
            >
              Política de Privacidad
            </Link>
            <Link
              href="/rules"
              className="hover:text-amber-300 transition-colors"
            >
              Reglas del Servidor
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
