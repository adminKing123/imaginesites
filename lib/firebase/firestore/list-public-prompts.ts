import type { Firestore, Query, QueryDocumentSnapshot } from "firebase-admin/firestore";
import { FIRESTORE_COLLECTIONS } from "./collections";
import type { PromptRecord } from "./prompts";
import type { PromptType, PromptUsageType } from "./prompt-types";
import { EMPTY_PROMPT_IMAGE, PROMPT_USAGE_TYPES } from "./prompt-types";

type ListPublicPromptsInput = {
  limit: number;
  cursor?: string;
  categoryId?: string;
  type?: PromptType;
  promptUsageType?: PromptUsageType;
};

export type PublicPromptItem = {
  id: string;
  type: PromptType;
  prompt_title: string;
  prompt: string | null;
  before_image: PromptRecord["before_image"];
  after_image: PromptRecord["after_image"];
  prompt_usage_type: PromptUsageType;
  categories: PromptRecord["categories"];
  createdAt: string | null;
};

type ListPublicPromptsResult = {
  items: PublicPromptItem[];
  nextCursor: string | null;
};

function serializePublicPrompt(
  doc: QueryDocumentSnapshot | FirebaseFirestore.DocumentSnapshot,
): PublicPromptItem {
  const data = doc.data() as PromptRecord | undefined;
  const isPremium = data?.prompt_usage_type === PROMPT_USAGE_TYPES.premium;

  return {
    id: data?.id ?? doc.id,
    type: data?.type ?? "image",
    prompt_title: data?.prompt_title ?? "",
    prompt: isPremium ? null : (data?.prompt ?? null),
    before_image: data?.before_image ?? EMPTY_PROMPT_IMAGE,
    after_image: data?.after_image ?? EMPTY_PROMPT_IMAGE,
    prompt_usage_type: data?.prompt_usage_type ?? PROMPT_USAGE_TYPES.free,
    categories: data?.categories ?? [],
    createdAt: data?.createdAt?.toDate?.()?.toISOString?.() ?? null,
  };
}

export async function listPublicPrompts(
  db: Firestore,
  input: ListPublicPromptsInput,
): Promise<ListPublicPromptsResult> {
  const limit = Math.min(Math.max(input.limit, 1), 50);
  let query: Query = db.collection(FIRESTORE_COLLECTIONS.prompts);

  if (input.type) {
    query = query.where("type", "==", input.type);
  }

  if (input.promptUsageType) {
    query = query.where("prompt_usage_type", "==", input.promptUsageType);
  }

  if (input.categoryId) {
    query = query.where("category_ids", "array-contains", input.categoryId);
  }

  query = query.orderBy("createdAt", "desc");

  if (input.cursor) {
    const cursorSnapshot = await db
      .collection(FIRESTORE_COLLECTIONS.prompts)
      .doc(input.cursor)
      .get();

    if (cursorSnapshot.exists) {
      query = query.startAfter(cursorSnapshot);
    }
  }

  const snapshot = await query.limit(limit + 1).get();
  const docs = snapshot.docs;
  const hasMore = docs.length > limit;
  const pageDocs = hasMore ? docs.slice(0, limit) : docs;

  return {
    items: pageDocs.map(serializePublicPrompt),
    nextCursor: hasMore ? pageDocs[pageDocs.length - 1]?.id ?? null : null,
  };
}
