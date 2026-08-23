export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  description?: string | null;
  sortOrder: number;
}

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: "cat-home", name: "Home", slug: "home", icon: "home", sortOrder: 0, description: "Featured bestsellers and store packages" },
  { id: "cat-prison", name: "Prison", slug: "prison", icon: "prison", sortOrder: 1, description: "Ranks, pickaxes, and cell upgrades" },
  { id: "cat-universes", name: "Universes", slug: "universes", icon: "universes", sortOrder: 2, description: "Cosmic passes and dimension keys" },
  { id: "cat-dungeons", name: "Dungeons", slug: "dungeons", icon: "dungeons", sortOrder: 3, description: "Boss keys and raid boosters" },
  { id: "cat-gens", name: "Gens", slug: "gens", icon: "gens", sortOrder: 4, description: "Generators and tycoon multipliers" },
  { id: "cat-survival", name: "Survival", slug: "survival", icon: "survival", sortOrder: 5, description: "Survival ranks and claim blocks" },
  { id: "cat-global", name: "Global", slug: "global", icon: "global", sortOrder: 6, description: "Global credits and cosmetics" },
];

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  badge?: string | null;
  icon?: string | null;
  perks: string[];
  commands?: string[];
  isActive: boolean;
  sortOrder: number;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
    icon?: string | null;
  };
}

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number | null;
  badge?: string | null;
  quantity: number;
  icon?: string | null;
  perks?: string[];
  commands?: string[];
}

export interface CouponItem {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minSpend: number;
  maxUses?: number | null;
  usesCount: number;
  expiresAt?: string | null;
  isActive: boolean;
}

export interface OrderItem {
  id: string;
  orderNumber: string;
  userId?: string | null;
  customerEmail?: string | null;
  minecraftUsername: string;
  minecraftEdition: string;
  total: number;
  subtotal: number;
  discountTotal: number;
  couponCode?: string | null;
  status: 'COMPLETED' | 'PENDING' | 'REFUNDED' | 'CANCELLED';
  items: CartItem[];
  commandsExecuted: boolean;
  createdAt: string;
}

export interface ContentPageItem {
  id: string;
  slug: string;
  title: string;
  content: string;
  updatedAt: string;
}
