"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, ProductItem, CategoryItem, DEFAULT_CATEGORIES } from "@/types";
import { toast } from "sonner";

interface AppliedCoupon {
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  discountAmount: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: ProductItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  discountTotal: number;
  total: number;
  totalItemsCount: number;
  coupon: AppliedCoupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  creatorCode: string | null;
  creatorName: string | null;
  applyCreatorCode: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCreatorCode: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isRankModalOpen: boolean;
  setIsRankModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalTab: "signin" | "signup" | "quick";
  setAuthModalTab: (tab: "signin" | "signup" | "quick") => void;
  selectedProduct: ProductItem | null;
  setSelectedProduct: (product: ProductItem | null) => void;
  selectedCategory: string;
  setSelectedCategory: (slug: string) => void;
  categories: CategoryItem[];
  setCategories: (cats: CategoryItem[]) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);
  const [creatorCode, setCreatorCode] = useState<string | null>(null);
  const [creatorName, setCreatorName] = useState<string | null>(null);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isRankModalOpen, setIsRankModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"signin" | "signup" | "quick">("signin");
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("home");
  const [categories, setCategories] = useState<CategoryItem[]>(DEFAULT_CATEGORIES);
  const [mounted, setMounted] = useState(false);

  // Fetch categories from database
  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories && data.categories.length > 0) {
          setCategories(data.categories);
        }
      })
      .catch(() => {});
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true);
    try {
      const savedItems = localStorage.getItem("solar_cart_items");
      if (savedItems) {
        setItems(JSON.parse(savedItems));
      }
      const savedCoupon = localStorage.getItem("solar_cart_coupon");
      if (savedCoupon) {
        setCoupon(JSON.parse(savedCoupon));
      }
      const savedCreator = localStorage.getItem("solar_creator_code");
      if (savedCreator) {
        setCreatorCode(savedCreator);
      }
      const savedCreatorName = localStorage.getItem("solar_creator_name");
      if (savedCreatorName) {
        setCreatorName(savedCreatorName);
      }
    } catch (e) {
      console.error("Failed to load cart from storage", e);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem("solar_cart_items", JSON.stringify(items));
      if (coupon) {
        localStorage.setItem("solar_cart_coupon", JSON.stringify(coupon));
      } else {
        localStorage.removeItem("solar_cart_coupon");
      }
      if (creatorCode) {
        localStorage.setItem("solar_creator_code", creatorCode);
      } else {
        localStorage.removeItem("solar_creator_code");
      }
      if (creatorName) {
        localStorage.setItem("solar_creator_name", creatorName);
      } else {
        localStorage.removeItem("solar_creator_name");
      }
    } catch (e) {
      console.error("Failed to save cart to storage", e);
    }
  }, [items, coupon, creatorCode, creatorName, mounted]);

  const addToCart = (product: ProductItem) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        toast.success(`Updated quantity for ${product.name}!`, {
          description: `Total in cart: ${existing.quantity + 1}`,
        });
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      toast.success(`Added ${product.name} to cart!`, {
        description: `$${product.price.toFixed(2)}`,
      });
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          originalPrice: product.originalPrice,
          badge: product.badge,
          quantity: 1,
          icon: product.icon,
          perks: product.perks,
          commands: product.commands,
        },
      ];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
    toast.info("Item removed from cart");
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let discountTotal = 0;
  if (coupon) {
    if (coupon.discountType === "PERCENTAGE") {
      discountTotal = (subtotal * coupon.discountValue) / 100;
    } else {
      discountTotal = Math.min(coupon.discountValue, subtotal);
    }
  }

  const total = Math.max(0, subtotal - discountTotal);
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    if (!code || code.trim() === "") {
      return { success: false, message: "Ingresa un código de descuento" };
    }

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim(), subtotal }),
      });

      const data = await res.json();

      if (res.ok && data.valid) {
        setCoupon(data.coupon);
        toast.success(data.message);
        return { success: true, message: data.message };
      } else {
        toast.error(data.message || "Código de descuento inválido");
        return { success: false, message: data.message || "Código inválido" };
      }
    } catch (e) {
      toast.error("Error al validar cupón");
      return { success: false, message: "Error al validar cupón" };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    toast.info("Cupón eliminado");
  };

  const applyCreatorCode = async (code: string): Promise<{ success: boolean; message: string }> => {
    if (!code || code.trim() === "") {
      return { success: false, message: "Ingresa un código de creador" };
    }

    try {
      const res = await fetch("/api/creator-code/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.valid) {
        setCreatorCode(data.creator.code);
        setCreatorName(data.creator.name);
        toast.success(`¡Apoyando al creador ${data.creator.name} (${data.creator.code})!`);
        return { success: true, message: `Apoyando a ${data.creator.name}` };
      } else {
        toast.error(data.error || "Código de creador no encontrado");
        return { success: false, message: data.error || "No encontrado" };
      }
    } catch (e) {
      toast.error("Error al verificar código de creador");
      return { success: false, message: "Error al conectar con el servidor" };
    }
  };

  const removeCreatorCode = () => {
    setCreatorCode(null);
    setCreatorName(null);
    toast.info("Código de creador eliminado");
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        discountTotal,
        total,
        totalItemsCount,
        coupon,
        applyCoupon,
        removeCoupon,
        creatorCode,
        creatorName,
        applyCreatorCode,
        removeCreatorCode,
        isCartOpen,
        setIsCartOpen,
        isRankModalOpen,
        setIsRankModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        selectedProduct,
        setSelectedProduct,
        selectedCategory,
        setSelectedCategory,
        categories,
        setCategories,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
