"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Headphones, ShieldAlert, MessageSquare, Info, X, HelpCircle, Mail } from "lucide-react";

interface SupportDisclaimerProps {
  settings?: Record<string, string>;
}

export function SupportDisclaimer({ settings }: SupportDisclaimerProps) {
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  const discordUrl = settings?.discord_url || "https://discord.gg/solarmc";
  const supportEmail = settings?.support_email || "soporte@solarmc.net";
  const disclaimer1 = settings?.disclaimer_text_1 || "Los créditos solo son utilizables bajo los términos de descargo de responsabilidad de SolarMC. Los créditos son una moneda virtual intangible que no se puede transferir fuera de la red SolarMC.";
  const disclaimer2 = settings?.disclaimer_text_2 || "Por favor asegúrate de estar informado de nuestras reglas, términos de servicio y política de privacidad antes de realizar cualquier compra en nuestra tienda. Todos los jugadores son juzgados por igual ante las reglas sin importar sus compras en la tienda.";
  const disclaimer3 = settings?.disclaimer_text_3 || "Las compras no se pueden reembolsar bajo ninguna circunstancia. Abrir un contracargo o disputa resultará en un baneo automático y permanente de nuestra red de Minecraft, nuestra tienda Tebex y otras tiendas Tebex.";

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-4">
        {/* Soporte y Asistencia (5 cols) */}
        <div className="lg:col-span-5 bg-[#121522] border border-[#1e2336] hover:border-[#28314a] rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex flex-col justify-between transition-all duration-300">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-[#181d2e] border border-[#242b40] flex items-center justify-center text-[#ff9d00]">
                <Headphones className="w-4.5 h-4.5" />
              </div>
              <h4 className="text-base font-black text-white tracking-wide">
                Soporte & Asistencia
              </h4>
            </div>
            <p className="text-xs text-gray-400">
              ¿Necesitas ayuda con tu pedido? ¿Tienes alguna duda antes de comprar?
            </p>
          </div>

          <div className="mt-5 space-y-2.5">
            {/* Botón Más Información */}
            <button
              onClick={() => setInfoModalOpen(true)}
              className="w-full py-2.5 px-4 rounded-lg font-black text-black text-xs bg-[#ff9d00] hover:bg-[#ffad26] shadow-[0_0_12px_rgba(255,157,0,0.25)] hover:shadow-[0_0_18px_rgba(255,157,0,0.4)] transition-all flex items-center justify-center space-x-2"
            >
              <Info className="w-3.5 h-3.5 text-black" />
              <span>Preguntas Frecuentes</span>
            </button>

            {/* Botón Discord */}
            <a
              href={discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-lg font-bold text-white text-xs bg-[#5865F2] hover:bg-[#4752C4] shadow-sm transition-all flex items-center justify-center space-x-2"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Unirse a Nuestro Discord</span>
            </a>
          </div>

          <div className="mt-5 text-center text-xs text-gray-400 flex items-center justify-center space-x-1">
            <Mail className="w-3.5 h-3.5 text-gray-500" />
            <span>
              O contáctanos en{" "}
              <a
                href={`mailto:${supportEmail}`}
                className="text-amber-400 hover:underline font-semibold"
              >
                {supportEmail}
              </a>
            </span>
          </div>
        </div>

        {/* Descargo de Responsabilidad (7 cols) */}
        <div className="lg:col-span-7 bg-[#121522] border border-[#1e2336] hover:border-[#28314a] rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex flex-col justify-between transition-all duration-300">
          <div className="flex items-center space-x-3 mb-3.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-4.5 h-4.5" />
            </div>
            <h4 className="text-base font-black text-white tracking-wide">
              Avisos Importantes de la Tienda
            </h4>
          </div>

          <div className="space-y-2.5">
            {/* Bloque 1 */}
            <div className="bg-[#0e1019] border-l-2 border-amber-500/70 border-y border-r border-[#1a1f30] rounded-lg p-3 text-xs text-gray-300 leading-relaxed">
              <span>{disclaimer1}</span>
            </div>

            {/* Bloque 2 */}
            <div className="bg-[#0e1019] border-l-2 border-blue-500/70 border-y border-r border-[#1a1f30] rounded-lg p-3 text-xs text-gray-300 leading-relaxed">
              <span>
                Por favor asegúrate de estar bien informado de nuestras{" "}
                <Link href="/rules" className="text-white font-bold hover:underline">
                  reglas del servidor
                </Link>
                ,{" "}
                <Link href="/terms" className="text-white font-bold hover:underline">
                  términos de servicio
                </Link>
                , y{" "}
                <Link href="/privacy" className="text-white font-bold hover:underline">
                  política de privacidad
                </Link>{" "}
                antes de realizar cualquier compra.
              </span>
            </div>

            {/* Bloque 3 */}
            <div className="bg-[#0e1019] border-l-2 border-red-500/70 border-y border-r border-[#1a1f30] rounded-lg p-3 text-xs text-gray-300 leading-relaxed">
              <span>{disclaimer3}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Preguntas Frecuentes */}
      {infoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-modal">
          <div className="bg-[#121522] border border-[#242b40] rounded-xl max-w-lg w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setInfoModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-[#181d2e]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#181d2e] border border-[#242b40] flex items-center justify-center text-[#ff9d00]">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-white">
                Preguntas Frecuentes
              </h3>
            </div>

            <div className="space-y-3 text-xs text-gray-300 max-h-[60vh] overflow-y-auto pr-2">
              <div className="bg-[#0e1019] p-3.5 rounded-lg border border-[#1a1f30]">
                <h5 className="font-bold text-white mb-1">
                  ¿Cuánto tarda en entregarse mi paquete?
                </h5>
                <p className="text-gray-400 leading-relaxed">
                  La entrega es prácticamente instantánea (1-3 minutos). Asegúrate de haber ingresado tu usuario correcto y estar conectado a <code className="text-amber-300 font-mono">play.solarmc.net</code>.
                </p>
              </div>

              <div className="bg-[#0e1019] p-3.5 rounded-lg border border-[#1a1f30]">
                <h5 className="font-bold text-white mb-1">
                  ¿Qué métodos de pago se aceptan?
                </h5>
                <p className="text-gray-400 leading-relaxed">
                  Aceptamos Tarjetas de Débito/Crédito, PayPal, Apple Pay, Google Pay y opciones locales internacionales a través de nuestro pasarela segura Tebex.
                </p>
              </div>

              <div className="bg-[#0e1019] p-3.5 rounded-lg border border-[#1a1f30]">
                <h5 className="font-bold text-white mb-1">
                  ¿Necesitas asistencia personalizada?
                </h5>
                <p className="text-gray-400 leading-relaxed">
                  Únete a nuestro servidor de Discord o contáctanos al correo <span className="text-amber-300 font-semibold">{supportEmail}</span>.
                </p>
              </div>
            </div>

            <button
              onClick={() => setInfoModalOpen(false)}
              className="mt-5 w-full py-2.5 rounded-lg font-bold text-xs text-white bg-[#1a1f30] hover:bg-[#22283e] transition-colors"
            >
              Cerrar Preguntas
            </button>
          </div>
        </div>
      )}
    </>
  );
}
