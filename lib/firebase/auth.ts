"use client";

import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { getFirebaseAuth } from "./client";

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(getFirebaseAuth(), googleProvider);
  const { syncUserProfile } = await import("./sync-user-profile");
  await syncUserProfile(result.user);
  return result.user;
}

export async function signOutUser() {
  await signOut(getFirebaseAuth());
}
