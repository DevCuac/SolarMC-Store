import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/store/CartDrawer";
import { FreeRankModal } from "@/components/store/FreeRankModal";
import { AuthModal } from "@/components/store/AuthModal";
import { ProductDetailModal } from "@/components/store/ProductDetailModal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SolarMC | Official Minecraft Store",
  description: "Official server store for SolarMC Minecraft Network. Purchase credits, ranks, perks, and cosmic packages.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#11141e] text-white min-h-screen flex flex-col justify-between selection:bg-[#52b824] selection:text-white`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 w-full">{children}</main>
            <Footer />
          </div>

          {/* Interactive Global Modals & Drawers */}
          <CartDrawer />
          <FreeRankModal />
          <AuthModal />
          <ProductDetailModal />
        </Providers>
      </body>
    </html>
  );
}
