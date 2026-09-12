import { NextResponse } from "next/server";
import { validateCategoryPayload } from "@/lib/admin/validate-category-payload";
import { AdminAuthError, verifyAdminRequest } from "@/lib/auth/verify-admin-request";
import { getFirebaseAdminFirestore } from "@/lib/firebase/admin";
import { createCategory } from "@/lib/firebase/firestore/categories";
import { listCategories } from "@/lib/firebase/firestore/list-categories";

export async function GET(request: Request) {
  try {
    await verifyAdminRequest(request);

    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit") ?? "20");
    const cursor = searchParams.get("cursor") ?? undefined;
    const categoryId = searchParams.get("categoryId") ?? undefined;
    const categoryName = searchParams.get("categoryName") ?? undefined;

    const result = await listCategories(getFirebaseAdminFirestore(), {
      limit,
      cursor,
      categoryId,
      categoryName,
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Failed to list categories:", error);
    return NextResponse.json({ error: "Failed to load categories." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await verifyAdminRequest(request);
    const body = await request.json();
    const validationError = validateCategoryPayload(body);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const payload = body as { name: string };

    const record = await createCategory(getFirebaseAdminFirestore(), {
      name: payload.name.trim(),
      createdBy: admin.uid,
    });

    return NextResponse.json(record);
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Failed to create category:", error);
    return NextResponse.json({ error: "Failed to create category." }, { status: 500 });
  }
}
