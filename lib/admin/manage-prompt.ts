"use client";

import type { User } from "firebase/auth";
import type { AdminPromptListItem } from "./fetch-prompts";
import type {
  CategoryReference,
  PromptImageReference,
  PromptType,
  PromptUsageType,
} from "@/lib/firebase/firestore/prompt-types";

export type PromptFormInput = {
  type: PromptType;
  promptTitle: string;
  prompt: string;
  beforeImage: PromptImageReference;
  afterImage: PromptImageReference;
  promptUsageType: PromptUsageType;
  categories: CategoryReference[];
};

async function getAuthHeaders(user: User) {
  return { Authorization: `Bearer ${await user.getIdToken()}` };
}

export async function createAdminPrompt(user: User, input: PromptFormInput) {
  const response = await fetch("/api/admin/prompts", {
    method: "POST",
    headers: {
      ...(await getAuthHeaders(user)),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const data = (await response.json()) as AdminPromptListItem & { error?: string };

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to create prompt.");
  }

  return data;
}

export async function updateAdminPrompt(
  user: User,
  id: string,
  input: PromptFormInput,
) {
  const response = await fetch(`/api/admin/prompts/${id}`, {
    method: "PATCH",
    headers: {
      ...(await getAuthHeaders(user)),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const data = (await response.json()) as AdminPromptListItem & { error?: string };

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to update prompt.");
  }

  return data;
}

export async function deleteAdminPrompt(user: User, id: string) {
  const response = await fetch(`/api/admin/prompts/${id}`, {
    method: "DELETE",
    headers: await getAuthHeaders(user),
  });

  const data = (await response.json()) as { error?: string };

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to delete prompt.");
  }
}
