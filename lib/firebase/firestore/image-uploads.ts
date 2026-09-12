import { FieldValue, type Firestore, type Timestamp } from "firebase-admin/firestore";
import { FIRESTORE_COLLECTIONS } from "./collections";

export type ImageUploadRecord = {
  id: string;
  image_name: string;
  image_cdn_url: string;
  uploaded_by: string;
  file_path: string;
  mime_type: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

type CreateImageUploadInput = {
  imageName: string;
  imageCdnUrl: string;
  uploadedBy: string;
  filePath: string;
  mimeType: string;
};

type UpdateImageUploadInput = {
  imageName?: string;
  mimeType?: string;
};

export async function getImageUpload(db: Firestore, id: string) {
  const snapshot = await db.collection(FIRESTORE_COLLECTIONS.imageUploads).doc(id).get();

  if (!snapshot.exists) {
    return null;
  }

  return snapshot.data() as ImageUploadRecord;
}

export async function createImageUpload(
  db: Firestore,
  input: CreateImageUploadInput,
) {
  const docRef = db.collection(FIRESTORE_COLLECTIONS.imageUploads).doc();

  await docRef.set({
    id: docRef.id,
    image_name: input.imageName,
    image_cdn_url: input.imageCdnUrl,
    uploaded_by: input.uploadedBy,
    file_path: input.filePath,
    mime_type: input.mimeType,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  const snapshot = await docRef.get();

  return snapshot.data() as Omit<ImageUploadRecord, "createdAt" | "updatedAt"> & {
    createdAt: Timestamp | null;
    updatedAt: Timestamp | null;
  };
}

export async function updateImageUpload(
  db: Firestore,
  id: string,
  input: UpdateImageUploadInput,
) {
  const docRef = db.collection(FIRESTORE_COLLECTIONS.imageUploads).doc(id);
  const snapshot = await docRef.get();

  if (!snapshot.exists) {
    return null;
  }

  await docRef.update({
    ...(input.imageName !== undefined ? { image_name: input.imageName } : {}),
    ...(input.mimeType !== undefined ? { mime_type: input.mimeType } : {}),
    updatedAt: FieldValue.serverTimestamp(),
  });

  const updatedSnapshot = await docRef.get();
  const data = updatedSnapshot.data() as ImageUploadRecord;

  return {
    id: data.id,
    image_name: data.image_name,
    image_cdn_url: data.image_cdn_url,
    createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? null,
  };
}

export async function deleteImageUpload(db: Firestore, id: string) {
  const docRef = db.collection(FIRESTORE_COLLECTIONS.imageUploads).doc(id);
  const snapshot = await docRef.get();

  if (!snapshot.exists) {
    return null;
  }

  const data = snapshot.data() as ImageUploadRecord;
  await docRef.delete();

  return data;
}
