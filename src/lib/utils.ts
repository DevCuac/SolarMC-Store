import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "$"): string {
  return `${currency}${amount.toFixed(2)}`;
}

export function getMinecraftAvatar(username: string, size = 64): string {
  if (!username || username.trim() === '') {
    return 'https://crafatar.com/avatars/steve?size=64&overlay';
  }
  return `https://crafatar.com/avatars/${encodeURIComponent(username.trim())}?size=${size}&overlay`;
}

export function getMinecraftHeadRender(username: string): string {
  if (!username || username.trim() === '') {
    return 'https://mc-heads.net/head/steve/128';
  }
  return `https://mc-heads.net/head/${encodeURIComponent(username.trim())}/128`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;

  // Try standard modern navigator.clipboard
  if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      console.warn("navigator.clipboard.writeText failed, attempting fallback textarea", e);
    }
  }

  // Fallback using invisible textarea
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "-9999px";
    textArea.style.left = "-9999px";
    textArea.setAttribute("readonly", "");
    document.body.appendChild(textArea);
    textArea.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error("Fallback clipboard copy failed", err);
    return false;
  }
}
