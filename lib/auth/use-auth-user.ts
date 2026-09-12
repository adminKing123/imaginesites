"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { isAdminUser } from "@/lib/firebase/firestore/collections";
import { getUserProfile } from "@/lib/firebase/firestore/get-user-profile";
import type { UserProfileData } from "@/lib/firebase/firestore/types";
import { getFirebaseAuth } from "@/lib/firebase/client";

export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), async (nextUser) => {
      if (!isMounted) {
        return;
      }

      setUser(nextUser);

      if (!nextUser) {
        setProfile(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const nextProfile = await getUserProfile(nextUser.uid);

        if (isMounted) {
          setProfile(nextProfile);
        }
      } catch (error) {
        console.error("Failed to load user profile:", error);

        if (isMounted) {
          setProfile(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return {
    user,
    profile,
    loading,
    isAdmin: isAdminUser(profile?.user_type),
  };
}
