import { NextResponse } from "next/server";
import { getFirebaseAdminFirestore } from "@/lib/firebase/admin";
import { listPublicCategories } from "@/lib/firebase/firestore/list-public-categories";

export async function GET() {
  try {
    const items = await listPublicCategories(getFirebaseAdminFirestore());
    return NextResponse.json({ items });
  } catch (error) {
    console.error("Failed to list public categories:", error);
    return NextResponse.json({ error: "Failed to load categories." }, { status: 500 });
  }
}
