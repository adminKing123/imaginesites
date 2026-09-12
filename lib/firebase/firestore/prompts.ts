import { FieldValue, type Firestore, type Timestamp } from "firebase-admin/firestore";
import { FIRESTORE_COLLECTIONS } from "./collections";
import type { CategoryReference } from "./category-types";
import type {
  PromptImageReference,
  PromptType,
  PromptUsageType,
} from "./prompt-types";

export type PromptRecord = {
  id: string;
  type: PromptType;
  prompt_title: string;
  prompt: string;
  before_image: PromptImageReference;
  after_image: PromptImageReference;
  prompt_usage_type: PromptUsageType;
  categories: CategoryReference[];
  category_ids: string[];
  created_by: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type PromptPayload = {
  type: PromptType;
  promptTitle: string;
  prompt: string;
  beforeImage: PromptImageReference;
  afterImage: PromptImageReference;
  promptUsageType: PromptUsageType;
  categories: CategoryReference[];
};

export type SerializedPrompt = {
  id: string;
  type: PromptType;
  prompt_title: string;
  prompt: string;
  before_image: PromptImageReference;
  after_image: PromptImageReference;
  prompt_usage_type: PromptUsageType;
  categories: CategoryReference[];
  createdAt: string | null;
};

function serializePrompt(data: PromptRecord, id: string): SerializedPrompt {
  return {
    id: data.id ?? id,
    type: data.type,
    prompt_title: data.prompt_title,
    prompt: data.prompt,
    before_image: data.before_image,
    after_image: data.after_image,
    prompt_usage_type: data.prompt_usage_type,
    categories: data.categories ?? [],
    createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? null,
  };
}

export async function getPrompt(db: Firestore, id: string) {
  const snapshot = await db.collection(FIRESTORE_COLLECTIONS.prompts).doc(id).get();

  if (!snapshot.exists) {
    return null;
  }

  return snapshot.data() as PromptRecord;
}

export async function createPrompt(
  db: Firestore,
  input: PromptPayload & { createdBy: string },
) {
  const docRef = db.collection(FIRESTORE_COLLECTIONS.prompts).doc();

  await docRef.set({
    id: docRef.id,
    type: input.type,
    prompt_title: input.promptTitle,
    prompt: input.prompt,
    before_image: input.beforeImage,
    after_image: input.afterImage,
    prompt_usage_type: input.promptUsageType,
    categories: input.categories,
    category_ids: input.categories.map((category) => category.id),
    created_by: input.createdBy,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  const snapshot = await docRef.get();
  const data = snapshot.data() as PromptRecord;

  return serializePrompt(data, snapshot.id);
}

export async function updatePrompt(db: Firestore, id: string, input: PromptPayload) {
  const docRef = db.collection(FIRESTORE_COLLECTIONS.prompts).doc(id);
  const snapshot = await docRef.get();

  if (!snapshot.exists) {
    return null;
  }

  await docRef.update({
    type: input.type,
    prompt_title: input.promptTitle,
    prompt: input.prompt,
    before_image: input.beforeImage,
    after_image: input.afterImage,
    prompt_usage_type: input.promptUsageType,
    categories: input.categories,
    category_ids: input.categories.map((category) => category.id),
    updatedAt: FieldValue.serverTimestamp(),
  });

  const updatedSnapshot = await docRef.get();
  const data = updatedSnapshot.data() as PromptRecord;

  return serializePrompt(data, updatedSnapshot.id);
}

export async function deletePrompt(db: Firestore, id: string) {
  const docRef = db.collection(FIRESTORE_COLLECTIONS.prompts).doc(id);
  const snapshot = await docRef.get();

  if (!snapshot.exists) {
    return null;
  }

  await docRef.delete();

  return snapshot.data() as PromptRecord;
}
