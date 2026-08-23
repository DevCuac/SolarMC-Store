"use client";

import React, { useEffect, useState } from "react";
import { HeroRankClaim } from "@/components/store/HeroRankClaim";
import { PlayerCard } from "@/components/store/PlayerCard";
import { ProductCard } from "@/components/store/ProductCard";
import { CouponSection } from "@/components/store/CouponSection";
import { SupportDisclaimer } from "@/components/store/SupportDisclaimer";
import { ProductItem, DEFAULT_CATEGORIES } from "@/types";
import { useCart } from "@/context/CartContext";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { Loader2, PackageOpen } from "lucide-react";

export default function HomePage() {
  const { selectedCategory, categories } = useCart();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodsRes, setsRes] = await Promise.all([
          fetch("/api/admin/products"),
          fetch("/api/settings"),
        ]);

        const prodsData = await prodsRes.json();
        const setsData = await setsRes.json();

        if (prodsData.products) {
          const parsed = prodsData.products.map((p: any) => ({
            ...p,
            perks: typeof p.perks === "string" ? JSON.parse(p.perks || "[]") : p.perks || [],
            commands: typeof p.commands === "string" ? JSON.parse(p.commands || "[]") : p.commands || [],
          }));
          setProducts(parsed);
        }
        if (setsData.settings) setSettings(setsData.settings);
      } catch (e) {
        console.error("Failed to load store data", e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const allCategories = categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES;
  const activeCategoryObj = allCategories.find((c) => c.slug === selectedCategory);

  // Filter products based on selected category
  const filteredProducts = products.filter((product) => {
    if (selectedCategory === "home") {
      return (
        product.category?.slug === "home" ||
        product.badge === "BEST SELLER" ||
        product.badge === "MONTHLY" ||
        product.slug.includes("solar-credits")
      );
    }
    return product.category?.slug === selectedCategory;
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pb-12 space-y-6">
      
      {/* Hero Section: Free Rank Claim & Player Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col">
          <HeroRankClaim />
        </div>
        <div className="lg:col-span-4 flex flex-col">
          <PlayerCard />
        </div>
      </div>

      {/* Products Grid Section */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between pb-2 border-b border-[#1a1f30]">
          <h2 className="text-lg sm:text-xl font-black text-white tracking-wide flex items-center space-x-2.5">
            <CategoryIcon iconName={activeCategoryObj?.icon || selectedCategory} className="w-5 h-5 text-[#ff9d00]" />
            <span>
              {activeCategoryObj?.name || "Featured Packages"}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded bg-[#181d2e] text-amber-300 font-extrabold border border-[#242b40]">
              {filteredProducts.length} items
            </span>
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#ff9d00]" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-[#121522] border border-[#1e2336] rounded-xl p-12 text-center shadow-card">
            <PackageOpen className="w-10 h-10 text-gray-500 mx-auto mb-2" />
            <p className="text-gray-300 font-bold text-sm">No packages found in this category</p>
            <p className="text-xs text-gray-500 mt-1">Browse another gamemode category in the navigation bar.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Coupon Code Strip */}
      <CouponSection />

      {/* Support & Assistance / Disclaimer Section */}
      <SupportDisclaimer settings={settings} />

    </div>
  );
}
