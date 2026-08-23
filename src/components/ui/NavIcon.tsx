import React from "react";
import { 
  Home, 
  CheckSquare, 
  BookOpen, 
  Scale, 
  MessageSquare, 
  LifeBuoy, 
  Map, 
  ExternalLink,
  Crown,
  Swords,
  Sparkles,
  Award,
  Globe,
  Radio,
  FileText,
  Shield
} from "lucide-react";

interface NavIconProps {
  name?: string | null;
  className?: string;
}

export function NavIcon({ name = "home", className = "w-4 h-4" }: NavIconProps) {
  const normalized = (name || "").toLowerCase().trim();
  const strokeWidth = 1.75;

  switch (normalized) {
    case "home":
    case "inicio":
      return <Home className={className} strokeWidth={strokeWidth} />;
    case "vote":
    case "votar":
    case "votos":
    case "award":
      return <Award className={className} strokeWidth={strokeWidth} />;
    case "book":
    case "wiki":
    case "guias":
      return <BookOpen className={className} strokeWidth={strokeWidth} />;
    case "scale":
    case "reglas":
    case "rules":
      return <Scale className={className} strokeWidth={strokeWidth} />;
    case "discord":
    case "chat":
    case "message":
      return <MessageSquare className={className} strokeWidth={strokeWidth} />;
    case "support":
    case "soporte":
    case "ayuda":
      return <LifeBuoy className={className} strokeWidth={strokeWidth} />;
    case "map":
    case "mapa":
    case "dynmap":
      return <Map className={className} strokeWidth={strokeWidth} />;
    case "sword":
    case "swords":
    case "pvp":
      return <Swords className={className} strokeWidth={strokeWidth} />;
    case "crown":
    case "ranks":
    case "rangos":
      return <Crown className={className} strokeWidth={strokeWidth} />;
    case "shield":
      return <Shield className={className} strokeWidth={strokeWidth} />;
    case "file":
    case "terms":
      return <FileText className={className} strokeWidth={strokeWidth} />;
    default:
      return <ExternalLink className={className} strokeWidth={strokeWidth} />;
  }
}
