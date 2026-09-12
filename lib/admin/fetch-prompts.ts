"use client";

import type { User } from "firebase/auth";
import type {
  CategoryReference,
  PromptType,
  PromptUsageType,
} from "@/lib/firebase/firestore/prompt-types";

export type AdminPromptListItem = {
  id: string;
  type: PromptType;
  prompt_title: string;
  prompt: string;
  before_image: {
    id: string;
    image_name: string;
    image_cdn_url: string;
  };
  after_image: {
    id: string;
    image_name: string;
    image_cdn_url: string;
  };
  prompt_usage_type: PromptUsageType;
  categories: CategoryReference[];
  createdAt: string | null;
};

type FetchAdminPromptsInput = {
  user: User;
  cursor?: string | null;
  promptId?: string;
  promptTitle?: string;
  type?: PromptType;
  promptUsageType?: PromptUsageType;
  limit?: number;
};

type FetchAdminPromptsResponse = {
  items: AdminPromptListItem[];
  nextCursor: string | null;
};

export async function fetchAdminPrompts({
  user,
  cursor,
  promptId,
  promptTitle,
  type,
  promptUsageType,
  limit = 20,
}: FetchAdminPromptsInput): Promise<FetchAdminPromptsResponse> {
  const idToken = await user.getIdToken();
  const params = new URLSearchParams({ limit: String(limit) });

  if (cursor) params.set("cursor", cursor);
  if (promptId?.trim()) params.set("promptId", promptId.trim());
  if (promptTitle?.trim()) params.set("promptTitle", promptTitle.trim());
  if (type) params.set("type", type);
  if (promptUsageType) params.set("promptUsageType", promptUsageType);

  const response = await fetch(`/api/admin/prompts?${params.toString()}`, {
    headers: { Authorization: `Bearer ${idToken}` },
  });

  const data = (await response.json()) as FetchAdminPromptsResponse & {
    error?: string;
  };

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to load prompts.");
  }

  return data;
}
