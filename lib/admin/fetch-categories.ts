"use client";

import type { User } from "firebase/auth";

export type AdminCategoryListItem = {
  id: string;
  name: string;
  createdAt: string | null;
};

type FetchAdminCategoriesInput = {
  user: User;
  cursor?: string | null;
  categoryId?: string;
  categoryName?: string;
  limit?: number;
};

type FetchAdminCategoriesResponse = {
  items: AdminCategoryListItem[];
  nextCursor: string | null;
};

export async function fetchAdminCategories({
  user,
  cursor,
  categoryId,
  categoryName,
  limit = 20,
}: FetchAdminCategoriesInput): Promise<FetchAdminCategoriesResponse> {
  const idToken = await user.getIdToken();
  const params = new URLSearchParams({ limit: String(limit) });

  if (cursor) params.set("cursor", cursor);
  if (categoryId?.trim()) params.set("categoryId", categoryId.trim());
  if (categoryName?.trim()) params.set("categoryName", categoryName.trim());

  const response = await fetch(`/api/admin/categories?${params.toString()}`, {
    headers: { Authorization: `Bearer ${idToken}` },
  });

  const data = (await response.json()) as FetchAdminCategoriesResponse & {
    error?: string;
  };

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to load categories.");
  }

  return data;
}
