import type { Firestore } from "firebase-admin/firestore";
import { FIRESTORE_COLLECTIONS } from "./collections";
import type { PublicPromptItem } from "./list-public-prompts";
import type { PromptRecord } from "./prompts";
import { EMPTY_PROMPT_IMAGE, PROMPT_USAGE_TYPES } from "./prompt-types";

function serializePublicPrompt(
  id: string,
  data: PromptRecord | undefined,
): PublicPromptItem | null {
  if (!data) {
    return null;
  }

  const isPremium = data.prompt_usage_type === PROMPT_USAGE_TYPES.premium;

  return {
    id: data.id ?? id,
    type: data.type ?? "image",
    prompt_title: data.prompt_title ?? "",
    prompt: isPremium ? null : (data.prompt ?? null),
    before_image: data.before_image ?? EMPTY_PROMPT_IMAGE,
    after_image: data.after_image ?? EMPTY_PROMPT_IMAGE,
    prompt_usage_type: data.prompt_usage_type ?? PROMPT_USAGE_TYPES.free,
    categories: data.categories ?? [],
    createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? null,
  };
}

export async function getPublicPrompt(db: Firestore, id: string) {
  const snapshot = await db.collection(FIRESTORE_COLLECTIONS.prompts).doc(id).get();

  if (!snapshot.exists) {
    return null;
  }

  return serializePublicPrompt(snapshot.id, snapshot.data() as PromptRecord);
}
