"use client";

import React, { useState, useEffect } from "react";
import { Settings, Save, Loader2, Landmark, MessageSquare, ShieldAlert, Mail, Radio } from "lucide-react";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({
    server_name: "SolarMC",
    server_ip: "play.solarmc.net",
    server_port: "25565",
    discord_url: "https://discord.gg/solarmc",
    discord_online_count: "2611",
    server_online_count: "861",
    announcement_banner: "🔥 SOLAR SALE: Use code WELCOME10 for 10% OFF! Claim your Free Starter Rank today!",
    support_email: "angelriveradeveloper@gmail.com",
    currency_symbol: "$",
    disclaimer_text_1: "Credits are only usable under the terms of the SolarMC Credits Disclaimers. Credits are a virtual intangible currency which cannot be transferred outside of the SolarMC Network.",
    disclaimer_text_2: "Please make sure you are well informed of our rules, terms of service, and privacy policy before making any purchase on our web store.",
    disclaimer_text_3: "Purchases cannot be refunded under any circumstance. Opening a chargeback or dispute will result in an automatic and permanent ban from our Minecraft Network, our Tebex Store and other Tebex Stores.",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.settings) {
        setSettings((prev) => ({ ...prev, ...data.settings }));
      }
    } catch (e) {
      toast.error("Failed to load store settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleChange = (key: string, val: string) => {
    setSettings((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Server settings updated successfully!");
      } else {
        toast.error(data.error || "Failed to update settings");
      }
    } catch (e) {
      toast.error("Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Server & Store Settings
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Configure server address, dynamic player ping, Discord invite integration, banner announcements, and legal text.
        </p>
      </div>

      <div className="bg-[#0e1017] border border-white/[0.08] rounded-xl p-5 sm:p-6 shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-7 h-7 animate-spin text-amber-400" />
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-5">
            
            {/* Server Identity & IP */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-zinc-200 border-b border-white/[0.08] pb-2">
                <Landmark className="w-4 h-4 text-amber-400" />
                <span>Minecraft Server Connection & Live Ping</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Server Name
                  </label>
                  <input
                    type="text"
                    value={settings.server_name || ""}
                    onChange={(e) => handleChange("server_name", e.target.value)}
                    className="w-full bg-[#090a0f] border border-white/[0.08] focus:border-amber-500/50 rounded-lg px-3 py-1.5 text-xs text-zinc-100 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Server IP (Auto Ping & Copy)
                  </label>
                  <input
                    type="text"
                    value={settings.server_ip || ""}
                    onChange={(e) => handleChange("server_ip", e.target.value)}
                    className="w-full bg-[#090a0f] border border-white/[0.08] focus:border-amber-500/50 rounded-lg px-3 py-1.5 text-xs font-mono text-amber-300 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Fallback Online Count
                  </label>
                  <input
                    type="text"
                    value={settings.server_online_count || ""}
                    onChange={(e) => handleChange("server_online_count", e.target.value)}
                    className="w-full bg-[#090a0f] border border-white/[0.08] focus:border-amber-500/50 rounded-lg px-3 py-1.5 text-xs text-zinc-100 outline-none"
                    placeholder="861"
                  />
                </div>
              </div>
            </div>

            {/* Discord Integration */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-zinc-200 border-b border-white/[0.08] pb-2">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <span>Discord Community Integration (Live Member Count)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Discord Invite URL
                  </label>
                  <input
                    type="text"
                    value={settings.discord_url || ""}
                    onChange={(e) => handleChange("discord_url", e.target.value)}
                    className="w-full bg-[#090a0f] border border-white/[0.08] focus:border-amber-500/50 rounded-lg px-3 py-1.5 text-xs text-zinc-100 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Fallback Discord Online Count
                  </label>
                  <input
                    type="text"
                    value={settings.discord_online_count || ""}
                    onChange={(e) => handleChange("discord_online_count", e.target.value)}
                    className="w-full bg-[#090a0f] border border-white/[0.08] focus:border-amber-500/50 rounded-lg px-3 py-1.5 text-xs text-zinc-100 outline-none"
                    placeholder="2611"
                  />
                </div>
              </div>
            </div>

            {/* Announcements & Support */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-zinc-200 border-b border-white/[0.08] pb-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>Storefront Announcements & Support Desk</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Top Announcement Banner Text
                  </label>
                  <input
                    type="text"
                    value={settings.announcement_banner || ""}
                    onChange={(e) => handleChange("announcement_banner", e.target.value)}
                    className="w-full bg-[#090a0f] border border-white/[0.08] focus:border-amber-500/50 rounded-lg px-3 py-1.5 text-xs text-zinc-100 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Support Email
                  </label>
                  <input
                    type="email"
                    value={settings.support_email || ""}
                    onChange={(e) => handleChange("support_email", e.target.value)}
                    className="w-full bg-[#090a0f] border border-white/[0.08] focus:border-amber-500/50 rounded-lg px-3 py-1.5 text-xs text-zinc-100 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Storefront Disclaimers */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-zinc-200 border-b border-white/[0.08] pb-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Storefront Legal Disclaimers</span>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Disclaimer 1: Virtual Credits & Intangibility Notice
                </label>
                <textarea
                  rows={2}
                  value={settings.disclaimer_text_1 || ""}
                  onChange={(e) => handleChange("disclaimer_text_1", e.target.value)}
                  className="w-full bg-[#090a0f] border border-white/[0.08] focus:border-amber-500/50 rounded-lg p-2.5 text-xs text-zinc-200 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Disclaimer 2: Rules & Legal Awareness
                </label>
                <textarea
                  rows={2}
                  value={settings.disclaimer_text_2 || ""}
                  onChange={(e) => handleChange("disclaimer_text_2", e.target.value)}
                  className="w-full bg-[#090a0f] border border-white/[0.08] focus:border-amber-500/50 rounded-lg p-2.5 text-xs text-zinc-200 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Disclaimer 3: No-Refund & Dispute Notice
                </label>
                <textarea
                  rows={2}
                  value={settings.disclaimer_text_3 || ""}
                  onChange={(e) => handleChange("disclaimer_text_3", e.target.value)}
                  className="w-full bg-[#090a0f] border border-white/[0.08] focus:border-amber-500/50 rounded-lg p-2.5 text-xs text-zinc-200 outline-none"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-3 border-t border-white/[0.08] flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-1.5 rounded-lg font-bold text-black text-xs bg-amber-500 hover:bg-amber-400 shadow-sm disabled:opacity-50 transition-all flex items-center space-x-1.5"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save All Settings</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}
