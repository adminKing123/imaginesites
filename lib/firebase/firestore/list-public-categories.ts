import type { Firestore } from "firebase-admin/firestore";
import { FIRESTORE_COLLECTIONS } from "./collections";
import type { CategoryRecord } from "./categories";

export type PublicCategoryItem = {
  id: string;
  name: string;
};

export async function listPublicCategories(db: Firestore) {
  const snapshot = await db
    .collection(FIRESTORE_COLLECTIONS.categories)
    .orderBy("name")
    .limit(100)
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data() as CategoryRecord | undefined;

    return {
      id: data?.id ?? doc.id,
      name: data?.name ?? "",
    } satisfies PublicCategoryItem;
  });
}
