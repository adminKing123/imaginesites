import { NextResponse } from "next/server";
import { validateCategoryPayload } from "@/lib/admin/validate-category-payload";
import { AdminAuthError, verifyAdminRequest } from "@/lib/auth/verify-admin-request";
import { getFirebaseAdminFirestore } from "@/lib/firebase/admin";
import { deleteCategory, updateCategory } from "@/lib/firebase/firestore/categories";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await verifyAdminRequest(request);
    const { id } = await context.params;
    const body = await request.json();
    const validationError = validateCategoryPayload(body);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const payload = body as { name: string };

    const updated = await updateCategory(getFirebaseAdminFirestore(), id, {
      name: payload.name.trim(),
    });

    if (!updated) {
      return NextResponse.json({ error: "Category not found." }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Failed to update category:", error);
    return NextResponse.json({ error: "Failed to update category." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await verifyAdminRequest(_request);
    const { id } = await context.params;
    const deleted = await deleteCategory(getFirebaseAdminFirestore(), id);

    if (!deleted) {
      return NextResponse.json({ error: "Category not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Failed to delete category:", error);
    return NextResponse.json({ error: "Failed to delete category." }, { status: 500 });
  }
}
