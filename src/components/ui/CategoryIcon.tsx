import React from "react";
import { 
  Zap, 
  Pickaxe, 
  Orbit, 
  Swords, 
  Boxes, 
  TreePine, 
  Globe2, 
  Sparkles, 
  Flame, 
  Crown, 
  Shield, 
  Package, 
  Coins,
  Layers,
  Compass
} from "lucide-react";

interface CategoryIconProps {
  iconName?: string | null;
  className?: string;
}

export function CategoryIcon({ iconName = "home", className = "w-4 h-4" }: CategoryIconProps) {
  const normalized = (iconName || "").toLowerCase().trim();
  const strokeWidth = 1.75;

  switch (normalized) {
    case "home":
    case "zap":
    case "lightning":
    case "⚡":
      return <Zap className={className} strokeWidth={strokeWidth} />;
    case "prison":
    case "pickaxe":
    case "⛏️":
    case "⛏":
      return <Pickaxe className={className} strokeWidth={strokeWidth} />;
    case "universes":
    case "orbit":
    case "galaxy":
    case "cosmos":
    case "🌌":
    case "🪐":
      return <Orbit className={className} strokeWidth={strokeWidth} />;
    case "dungeons":
    case "swords":
    case "combat":
    case "⚔️":
    case "⚔":
      return <Swords className={className} strokeWidth={strokeWidth} />;
    case "gens":
    case "boxes":
    case "box":
    case "📦":
    case "🟩":
      return <Boxes className={className} strokeWidth={strokeWidth} />;
    case "survival":
    case "treepine":
    case "tree":
    case "sprout":
    case "🌱":
    case "🌲":
      return <TreePine className={className} strokeWidth={strokeWidth} />;
    case "global":
    case "globe":
    case "network":
    case "🌐":
      return <Globe2 className={className} strokeWidth={strokeWidth} />;
    case "crown":
    case "king":
    case "👑":
      return <Crown className={className} strokeWidth={strokeWidth} />;
    case "shield":
    case "🛡️":
    case "🛡":
      return <Shield className={className} strokeWidth={strokeWidth} />;
    case "flame":
    case "fire":
    case "🔥":
      return <Flame className={className} strokeWidth={strokeWidth} />;
    case "sparkles":
    case "magic":
    case "✨":
      return <Sparkles className={className} strokeWidth={strokeWidth} />;
    case "coins":
    case "credits":
    case "💰":
    case "🪙":
      return <Coins className={className} strokeWidth={strokeWidth} />;
    default:
      return <Layers className={className} strokeWidth={strokeWidth} />;
  }
}
