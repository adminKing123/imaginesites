"use client";

import type { User } from "firebase/auth";
import type { AdminCategoryListItem } from "./fetch-categories";

export type CategoryFormInput = {
  name: string;
};

async function getAuthHeaders(user: User) {
  return { Authorization: `Bearer ${await user.getIdToken()}` };
}

export async function createAdminCategory(user: User, input: CategoryFormInput) {
  const response = await fetch("/api/admin/categories", {
    method: "POST",
    headers: {
      ...(await getAuthHeaders(user)),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const data = (await response.json()) as AdminCategoryListItem & { error?: string };

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to create category.");
  }

  return data;
}

export async function updateAdminCategory(
  user: User,
  id: string,
  input: CategoryFormInput,
) {
  const response = await fetch(`/api/admin/categories/${id}`, {
    method: "PATCH",
    headers: {
      ...(await getAuthHeaders(user)),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const data = (await response.json()) as AdminCategoryListItem & { error?: string };

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to update category.");
  }

  return data;
}

export async function deleteAdminCategory(user: User, id: string) {
  const response = await fetch(`/api/admin/categories/${id}`, {
    method: "DELETE",
    headers: await getAuthHeaders(user),
  });

  const data = (await response.json()) as { error?: string };

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to delete category.");
  }
}
