import { NextResponse } from "next/server";
import { getFirebaseAdminAuth, getFirebaseAdminFirestore } from "@/lib/firebase/admin";
import { ensureUserProfile } from "@/lib/firebase/firestore/user-profile";

export async function POST(request: Request) {
  try {
    const authorization = request.headers.get("Authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const idToken = authorization.slice("Bearer ".length);
    const decodedToken = await getFirebaseAdminAuth().verifyIdToken(idToken);
    const authUser = await getFirebaseAdminAuth().getUser(decodedToken.uid);

    const result = await ensureUserProfile(getFirebaseAdminFirestore(), authUser.uid, {
      email: authUser.email ?? null,
      displayName: authUser.displayName ?? null,
      photoURL: authUser.photoURL ?? null,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to sync user profile:", error);
    return NextResponse.json({ error: "Failed to sync user profile" }, { status: 500 });
  }
}
