"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getMinecraftAvatar } from "@/lib/utils";

interface PlayerContextType {
  minecraftUsername: string;
  minecraftEdition: "Java" | "Bedrock";
  avatarUrl: string;
  setMinecraftUsername: (username: string) => void;
  setMinecraftEdition: (edition: "Java" | "Bedrock") => void;
  isQuickLoginOpen: boolean;
  setIsQuickLoginOpen: (open: boolean) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [minecraftUsername, setMinecraftUsernameState] = useState<string>("cuac_xdpe");
  const [minecraftEdition, setMinecraftEditionState] = useState<"Java" | "Bedrock">("Java");
  const [isQuickLoginOpen, setIsQuickLoginOpen] = useState(false);

  // Initialize from session or localStorage
  useEffect(() => {
    if (session?.user) {
      const userMc = (session.user as any).minecraftUsername;
      const userEd = (session.user as any).minecraftEdition;
      if (userMc) {
        setMinecraftUsernameState(userMc);
        localStorage.setItem("solar_mc_username", userMc);
      }
      if (userEd) {
        setMinecraftEditionState(userEd);
        localStorage.setItem("solar_mc_edition", userEd);
      }
    } else {
      const savedUsername = localStorage.getItem("solar_mc_username");
      const savedEdition = localStorage.getItem("solar_mc_edition") as "Java" | "Bedrock" | null;
      if (savedUsername) setMinecraftUsernameState(savedUsername);
      if (savedEdition) setMinecraftEditionState(savedEdition);
    }
  }, [session]);

  const setMinecraftUsername = (username: string) => {
    const clean = username.trim();
    setMinecraftUsernameState(clean);
    if (typeof window !== "undefined") {
      localStorage.setItem("solar_mc_username", clean);
    }
  };

  const setMinecraftEdition = (edition: "Java" | "Bedrock") => {
    setMinecraftEditionState(edition);
    if (typeof window !== "undefined") {
      localStorage.setItem("solar_mc_edition", edition);
    }
  };

  const avatarUrl = getMinecraftAvatar(minecraftUsername);

  return (
    <PlayerContext.Provider
      value={{
        minecraftUsername,
        minecraftEdition,
        avatarUrl,
        setMinecraftUsername,
        setMinecraftEdition,
        isQuickLoginOpen,
        setIsQuickLoginOpen,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}
