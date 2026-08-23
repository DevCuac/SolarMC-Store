"use client";

import React from "react";
import { CategoryItem } from "@/types";
import { CategoryIcon } from "@/components/ui/CategoryIcon";

interface CategoryNavProps {
  categories: CategoryItem[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
}

export function CategoryNav({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryNavProps) {
  return null; // Now integrated directly into the clean main Navbar
}
