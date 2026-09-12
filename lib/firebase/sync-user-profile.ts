"use client";

import type { User } from "firebase/auth";

export async function syncUserProfile(user: User) {
  const idToken = await user.getIdToken();

  const response = await fetch("/api/auth/sync-user", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to sync user profile.");
  }

  return response.json() as Promise<{ created: boolean }>;
}
