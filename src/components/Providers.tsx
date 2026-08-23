"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { PlayerProvider } from "@/context/PlayerContext";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <PlayerProvider>
        <CartProvider>
          {children}
          <Toaster
            position="top-right"
            theme="dark"
            toastOptions={{
              style: {
                background: "#1e2232",
                border: "1px solid #2e364e",
                color: "#ffffff",
              },
            }}
          />
        </CartProvider>
      </PlayerProvider>
    </SessionProvider>
  );
}
