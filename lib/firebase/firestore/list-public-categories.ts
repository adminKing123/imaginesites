import type { Firestore } from "firebase-admin/firestore";
import { FIRESTORE_COLLECTIONS } from "./collections";
import type { CategoryRecord } from "./categories";

export type PublicCategoryItem = {
  id: string;
  name: string;
};

export const PUBLIC_CATEGORY_FILTER_LIMIT = 10;

export async function listPublicCategories(db: Firestore) {
  const snapshot = await db
    .collection(FIRESTORE_COLLECTIONS.categories)
    .orderBy("name")
    .limit(PUBLIC_CATEGORY_FILTER_LIMIT)
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data() as CategoryRecord | undefined;

    return {
      id: data?.id ?? doc.id,
      name: data?.name ?? "",
    } satisfies PublicCategoryItem;
  });
}
