import type { Firestore, Query, QueryDocumentSnapshot } from "firebase-admin/firestore";
import { FIRESTORE_COLLECTIONS } from "./collections";
import type { CategoryRecord } from "./categories";

type ListCategoriesInput = {
  limit: number;
  cursor?: string;
  categoryId?: string;
  categoryName?: string;
};

type ListCategoriesResult = {
  items: Array<{
    id: string;
    name: string;
    createdAt: string | null;
  }>;
  nextCursor: string | null;
};

function serializeCategory(doc: QueryDocumentSnapshot | FirebaseFirestore.DocumentSnapshot) {
  const data = doc.data() as CategoryRecord | undefined;

  return {
    id: data?.id ?? doc.id,
    name: data?.name ?? "",
    createdAt: data?.createdAt?.toDate?.()?.toISOString?.() ?? null,
  };
}

export async function listCategories(
  db: Firestore,
  input: ListCategoriesInput,
): Promise<ListCategoriesResult> {
  const categoryId = input.categoryId?.trim();
  const categoryName = input.categoryName?.trim();
  const limit = Math.min(Math.max(input.limit, 1), 50);

  if (categoryId) {
    const snapshot = await db
      .collection(FIRESTORE_COLLECTIONS.categories)
      .doc(categoryId)
      .get();

    if (!snapshot.exists) {
      return { items: [], nextCursor: null };
    }

    return {
      items: [serializeCategory(snapshot)],
      nextCursor: null,
    };
  }

  let query: Query = db.collection(FIRESTORE_COLLECTIONS.categories);

  if (categoryName) {
    query = query
      .where("name", ">=", categoryName)
      .where("name", "<=", `${categoryName}\uf8ff`)
      .orderBy("name");
  } else {
    query = query.orderBy("createdAt", "desc");
  }

  if (input.cursor) {
    const cursorSnapshot = await db
      .collection(FIRESTORE_COLLECTIONS.categories)
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
    items: pageDocs.map(serializeCategory),
    nextCursor: hasMore ? pageDocs[pageDocs.length - 1]?.id ?? null : null,
  };
}
