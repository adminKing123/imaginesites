"use client";

import type { PublicCategoryItem } from "@/lib/firebase/firestore/list-public-categories";

type FetchPublicCategoriesResponse = {
  items: PublicCategoryItem[];
};

export async function fetchPublicCategories() {
  const response = await fetch("/api/categories");
  const data = (await response.json()) as FetchPublicCategoriesResponse & {
    error?: string;
  };

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to load categories.");
  }

  return data.items;
}

export type { PublicCategoryItem };
