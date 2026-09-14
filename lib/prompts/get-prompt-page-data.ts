import "server-only";

import { getFirebaseAdminFirestore } from "@/lib/firebase/admin";
import { getPublicPrompt } from "@/lib/firebase/firestore/get-public-prompt";
import type { PublicPromptItem } from "@/lib/firebase/firestore/list-public-prompts";
import { listPublicPrompts } from "@/lib/firebase/firestore/list-public-prompts";
import type { PromptType } from "@/lib/firebase/firestore/prompt-types";

export type PromptRelatedFilters = {
  categoryIds: string[];
  type: PromptType;
};

export type PromptPageData = {
  prompt: PublicPromptItem;
  relatedFilters: PromptRelatedFilters;
  initialRelated: PublicPromptItem[];
  initialNextCursor: string | null;
};

export async function getPromptPageData(id: string): Promise<PromptPageData | null> {
  const db = getFirebaseAdminFirestore();
  const prompt = await getPublicPrompt(db, id);

  if (!prompt) {
    return null;
  }

  const categoryIds = prompt.categories.map((category) => category.id);
  const related = await listPublicPrompts(db, {
    limit: 20,
    categoryIds: categoryIds.length > 0 ? categoryIds : undefined,
    type: prompt.type,
    excludeId: id,
  });

  return {
    prompt,
    relatedFilters: {
      categoryIds,
      type: prompt.type,
    },
    initialRelated: related.items,
    initialNextCursor: related.nextCursor,
  };
}
