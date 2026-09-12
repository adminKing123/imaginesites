import type { PublicPromptItem } from "@/lib/firebase/firestore/list-public-prompts";

export type PromptGalleryItem = PublicPromptItem;

export function isFreePrompt(item: PromptGalleryItem) {
  return item.prompt_usage_type === "free";
}

export function isPremiumPrompt(item: PromptGalleryItem) {
  return item.prompt_usage_type === "premium";
}
