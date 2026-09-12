import "server-only";

import { getFirebaseAdminAuth, getFirebaseAdminFirestore } from "@/lib/firebase/admin";
import { FIRESTORE_COLLECTIONS, USER_TYPES } from "@/lib/firebase/firestore/collections";

export class AdminAuthError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function verifyAdminRequest(request: Request) {
  const authorization = request.headers.get("Authorization");

  if (!authorization?.startsWith("Bearer ")) {
    throw new AdminAuthError("Unauthorized", 401);
  }

  const idToken = authorization.slice("Bearer ".length);
  const decodedToken = await getFirebaseAdminAuth().verifyIdToken(idToken);
  const userSnapshot = await getFirebaseAdminFirestore()
    .collection(FIRESTORE_COLLECTIONS.users)
    .doc(decodedToken.uid)
    .get();

  if (!userSnapshot.exists) {
    throw new AdminAuthError("Forbidden", 403);
  }

  const userType = userSnapshot.data()?.user_type;

  if (userType !== USER_TYPES.admin) {
    throw new AdminAuthError("Forbidden", 403);
  }

  return {
    uid: decodedToken.uid,
  };
}
