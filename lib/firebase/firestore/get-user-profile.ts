"use client";

import { doc, getDoc } from "firebase/firestore";
import { getFirebaseFirestore } from "../client";
import { FIRESTORE_COLLECTIONS } from "./collections";
import type { UserProfileData } from "./types";

export async function getUserProfile(uid: string): Promise<UserProfileData | null> {
  const snapshot = await getDoc(
    doc(getFirebaseFirestore(), FIRESTORE_COLLECTIONS.users, uid),
  );

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as UserProfileData;
}
