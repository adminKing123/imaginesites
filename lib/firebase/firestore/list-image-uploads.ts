import type { Firestore, Query, QueryDocumentSnapshot } from "firebase-admin/firestore";
import { FIRESTORE_COLLECTIONS } from "./collections";
import type { ImageUploadRecord } from "./image-uploads";

type ListImageUploadsInput = {
  limit: number;
  cursor?: string;
  imageId?: string;
  imageName?: string;
};

type SerializedUpload = {
  id: string;
  image_name: string;
  image_cdn_url: string;
  createdAt: string | null;
};

type ListImageUploadsResult = {
  items: SerializedUpload[];
  nextCursor: string | null;
};

function serializeUpload(
  doc: QueryDocumentSnapshot | FirebaseFirestore.DocumentSnapshot,
): SerializedUpload {
  const data = doc.data() as ImageUploadRecord | undefined;

  return {
    id: data?.id ?? doc.id,
    image_name: data?.image_name ?? "",
    image_cdn_url: data?.image_cdn_url ?? "",
    createdAt: data?.createdAt?.toDate?.()?.toISOString?.() ?? null,
  };
}

export async function listImageUploads(
  db: Firestore,
  input: ListImageUploadsInput,
): Promise<ListImageUploadsResult> {
  const imageId = input.imageId?.trim();
  const imageName = input.imageName?.trim();
  const limit = Math.min(Math.max(input.limit, 1), 50);

  if (imageId) {
    const snapshot = await db
      .collection(FIRESTORE_COLLECTIONS.imageUploads)
      .doc(imageId)
      .get();

    if (!snapshot.exists) {
      return { items: [], nextCursor: null };
    }

    return {
      items: [serializeUpload(snapshot)],
      nextCursor: null,
    };
  }

  let query: Query = db.collection(FIRESTORE_COLLECTIONS.imageUploads);

  if (imageName) {
    query = query
      .where("image_name", ">=", imageName)
      .where("image_name", "<=", `${imageName}\uf8ff`)
      .orderBy("image_name");
  } else {
    query = query.orderBy("createdAt", "desc");
  }

  if (input.cursor) {
    const cursorSnapshot = await db
      .collection(FIRESTORE_COLLECTIONS.imageUploads)
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
    items: pageDocs.map(serializeUpload),
    nextCursor: hasMore ? pageDocs[pageDocs.length - 1]?.id ?? null : null,
  };
}
