"use client";

import type { PublicPromptItem } from "@/lib/firebase/firestore/list-public-prompts";
import type { PromptType, PromptUsageType } from "@/lib/firebase/firestore/prompt-types";

type FetchPublicPromptsInput = {
  cursor?: string | null;
  categoryId?: string;
  categoryIds?: string[];
  type?: PromptType;
  promptUsageType?: PromptUsageType;
  excludeId?: string;
  limit?: number;
};

type FetchPublicPromptsResponse = {
  items: PublicPromptItem[];
  nextCursor: string | null;
};

export async function fetchPublicPrompts({
  cursor,
  categoryId,
  categoryIds,
  type,
  promptUsageType,
  excludeId,
  limit = 20,
}: FetchPublicPromptsInput): Promise<FetchPublicPromptsResponse> {
  const params = new URLSearchParams({ limit: String(limit) });

  if (cursor) params.set("cursor", cursor);
  if (categoryId) params.set("categoryId", categoryId);
  if (categoryIds && categoryIds.length > 0) {
    params.set("categoryIds", categoryIds.join(","));
  }
  if (type) params.set("type", type);
  if (promptUsageType) params.set("promptUsageType", promptUsageType);
  if (excludeId) params.set("excludeId", excludeId);

  const response = await fetch(`/api/prompts?${params.toString()}`);
  const data = (await response.json()) as FetchPublicPromptsResponse & {
    error?: string;
  };

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to load prompts.");
  }

  return data;
}

export type { PublicPromptItem };
