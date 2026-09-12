import { FieldValue, type Firestore, type Timestamp } from "firebase-admin/firestore";
import { FIRESTORE_COLLECTIONS } from "./collections";

export type CategoryRecord = {
  id: string;
  name: string;
  created_by: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type CategoryPayload = {
  name: string;
};

export type SerializedCategory = {
  id: string;
  name: string;
  createdAt: string | null;
};

function serializeCategory(data: CategoryRecord, id: string): SerializedCategory {
  return {
    id: data.id ?? id,
    name: data.name,
    createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? null,
  };
}

export async function getCategory(db: Firestore, id: string) {
  const snapshot = await db.collection(FIRESTORE_COLLECTIONS.categories).doc(id).get();

  if (!snapshot.exists) {
    return null;
  }

  return snapshot.data() as CategoryRecord;
}

export async function createCategory(
  db: Firestore,
  input: CategoryPayload & { createdBy: string },
) {
  const docRef = db.collection(FIRESTORE_COLLECTIONS.categories).doc();

  await docRef.set({
    id: docRef.id,
    name: input.name,
    created_by: input.createdBy,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  const snapshot = await docRef.get();
  const data = snapshot.data() as CategoryRecord;

  return serializeCategory(data, snapshot.id);
}

export async function updateCategory(db: Firestore, id: string, input: CategoryPayload) {
  const docRef = db.collection(FIRESTORE_COLLECTIONS.categories).doc(id);
  const snapshot = await docRef.get();

  if (!snapshot.exists) {
    return null;
  }

  await docRef.update({
    name: input.name,
    updatedAt: FieldValue.serverTimestamp(),
  });

  const updatedSnapshot = await docRef.get();
  const data = updatedSnapshot.data() as CategoryRecord;

  return serializeCategory(data, updatedSnapshot.id);
}

export async function deleteCategory(db: Firestore, id: string) {
  const docRef = db.collection(FIRESTORE_COLLECTIONS.categories).doc(id);
  const snapshot = await docRef.get();

  if (!snapshot.exists) {
    return null;
  }

  await docRef.delete();

  return snapshot.data() as CategoryRecord;
}
