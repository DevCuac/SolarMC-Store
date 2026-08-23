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
  const supportEmail = settings?.support_email || "angelriveradeveloper@gmail.com";
  const disclaimer1 = settings?.disclaimer_text_1 || "Credits are only usable under the terms of the SolarMC Credits Disclaimers. Credits are a virtual intangible currency which cannot be transferred outside of the SolarMC Network.";
  const disclaimer2 = settings?.disclaimer_text_2 || "Please make sure you are well informed of our rules, terms of service, and privacy policy before making any purchase on our web store. All players are judged against the rules equally no matter their store purchases.";
  const disclaimer3 = settings?.disclaimer_text_3 || "Purchases cannot be refunded under any circumstance. Opening a chargeback or dispute will result in an automatic and permanent ban from our Minecraft Network, our Tebex Store and other Tebex Stores.";

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-4">
        {/* Support & Assistance (5 cols) */}
        <div className="lg:col-span-5 bg-[#121522] border border-[#1e2336] hover:border-[#28314a] rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex flex-col justify-between transition-all duration-300">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-[#181d2e] border border-[#242b40] flex items-center justify-center text-[#ff9d00]">
                <Headphones className="w-4.5 h-4.5" />
              </div>
              <h4 className="text-base font-black text-white tracking-wide">
                Support & Assistance
              </h4>
            </div>
            <p className="text-xs text-gray-400">
              Need help with your order? Got any questions before you buy?
            </p>
          </div>

          <div className="mt-5 space-y-2.5">
            {/* More Information Button */}
            <button
              onClick={() => setInfoModalOpen(true)}
              className="w-full py-2.5 px-4 rounded-lg font-black text-black text-xs bg-[#ff9d00] hover:bg-[#ffad26] shadow-[0_0_12px_rgba(255,157,0,0.25)] hover:shadow-[0_0_18px_rgba(255,157,0,0.4)] transition-all flex items-center justify-center space-x-2"
            >
              <Info className="w-3.5 h-3.5 text-black" />
              <span>More Information</span>
            </button>

            {/* Join Our Discord Button */}
            <a
              href={discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-lg font-bold text-white text-xs bg-[#5865F2] hover:bg-[#4752C4] shadow-sm transition-all flex items-center justify-center space-x-2"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Join Our Discord</span>
            </a>
          </div>

          <div className="mt-5 text-center text-xs text-gray-400 flex items-center justify-center space-x-1">
            <Mail className="w-3.5 h-3.5 text-gray-500" />
            <span>
              Or email us at{" "}
              <a
                href={`mailto:${supportEmail}`}
                className="text-amber-400 hover:underline font-semibold"
              >
                {supportEmail}
              </a>
            </span>
          </div>
        </div>

        {/* Disclaimer (7 cols) */}
        <div className="lg:col-span-7 bg-[#121522] border border-[#1e2336] hover:border-[#28314a] rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex flex-col justify-between transition-all duration-300">
          <div className="flex items-center space-x-3 mb-3.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-4.5 h-4.5" />
            </div>
            <h4 className="text-base font-black text-white tracking-wide">
              Disclaimer
            </h4>
          </div>

          <div className="space-y-2.5">
            {/* Block 1 */}
            <div className="bg-[#0e1019] border-l-2 border-amber-500/70 border-y border-r border-[#1a1f30] rounded-lg p-3 text-xs text-gray-300 leading-relaxed">
              <span>{disclaimer1}</span>
            </div>

            {/* Block 2 */}
            <div className="bg-[#0e1019] border-l-2 border-blue-500/70 border-y border-r border-[#1a1f30] rounded-lg p-3 text-xs text-gray-300 leading-relaxed">
              <span>
                Please make sure you are well informed of our{" "}
                <Link href="/rules" className="text-white font-bold hover:underline">
                  rules
                </Link>
                ,{" "}
                <Link href="/terms" className="text-white font-bold hover:underline">
                  terms of service
                </Link>
                , and{" "}
                <Link href="/privacy" className="text-white font-bold hover:underline">
                  privacy policy
                </Link>{" "}
                before making any purchase on our web store. All players are judged against the{" "}
                <Link href="/rules" className="text-white font-bold hover:underline">
                  rules
                </Link>{" "}
                equally no matter their store purchases.
              </span>
            </div>

            {/* Block 3 */}
            <div className="bg-[#0e1019] border-l-2 border-red-500/70 border-y border-r border-[#1a1f30] rounded-lg p-3 text-xs text-gray-300 leading-relaxed">
              <span>{disclaimer3}</span>
            </div>
          </div>
        </div>
      </div>

      {/* More Information Modal */}
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
                Frequently Asked Questions
              </h3>
            </div>

            <div className="space-y-3 text-xs text-gray-300 max-h-[60vh] overflow-y-auto pr-2">
              <div className="bg-[#0e1019] p-3.5 rounded-lg border border-[#1a1f30]">
                <h5 className="font-bold text-white mb-1">
                  How long does delivery take?
                </h5>
                <p className="text-gray-400 leading-relaxed">
                  Delivery is instant (1-3 minutes). Make sure you are connected to <code className="text-amber-300 font-mono">play.solarmc.net</code> with your Minecraft player profile.
                </p>
              </div>

              <div className="bg-[#0e1019] p-3.5 rounded-lg border border-[#1a1f30]">
                <h5 className="font-bold text-white mb-1">
                  What payment methods are accepted?
                </h5>
                <p className="text-gray-400 leading-relaxed">
                  We accept Credit/Debit cards, PayPal, Apple Pay, Google Pay, and international local payment options via our secure checkout.
                </p>
              </div>

              <div className="bg-[#0e1019] p-3.5 rounded-lg border border-[#1a1f30]">
                <h5 className="font-bold text-white mb-1">
                  Need custom assistance or support?
                </h5>
                <p className="text-gray-400 leading-relaxed">
                  Join our official Discord server or contact us at <span className="text-amber-300 font-semibold">{supportEmail}</span>.
                </p>
              </div>
            </div>

            <button
              onClick={() => setInfoModalOpen(false)}
              className="mt-5 w-full py-2.5 rounded-lg font-bold text-xs text-white bg-[#1a1f30] hover:bg-[#22283e] transition-colors"
            >
              Close FAQ
            </button>
          </div>
        </div>
      )}
    </>
  );
}
