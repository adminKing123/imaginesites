import {
  FieldValue,
  type Firestore,
  type Timestamp,
} from "firebase-admin/firestore";
import { FIRESTORE_COLLECTIONS, USER_TYPES } from "./collections";

export type UserProfile = {
  user_type: typeof USER_TYPES.user;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export async function ensureUserProfile(
  db: Firestore,
  uid: string,
  profile: Pick<UserProfile, "email" | "displayName" | "photoURL">,
) {
  const userRef = db.collection(FIRESTORE_COLLECTIONS.users).doc(uid);
  const snapshot = await userRef.get();

  if (snapshot.exists) {
    return { created: false };
  }

  await userRef.set({
    user_type: USER_TYPES.user,
    email: profile.email,
    displayName: profile.displayName,
    photoURL: profile.photoURL,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return { created: true };
}
