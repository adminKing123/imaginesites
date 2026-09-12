import { NextResponse } from "next/server";
import { AdminAuthError, verifyAdminRequest } from "@/lib/auth/verify-admin-request";
import { validatePromptPayload } from "@/lib/admin/validate-prompt-payload";
import { getFirebaseAdminFirestore } from "@/lib/firebase/admin";
import { deletePrompt, updatePrompt } from "@/lib/firebase/firestore/prompts";
import type { PromptType, PromptUsageType } from "@/lib/firebase/firestore/prompt-types";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await verifyAdminRequest(request);
    const { id } = await context.params;
    const body = await request.json();
    const validationError = validatePromptPayload(body);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const payload = body as {
      type: PromptType;
      promptTitle: string;
      prompt: string;
      beforeImage: { id: string; image_name: string; image_cdn_url: string };
      afterImage: { id: string; image_name: string; image_cdn_url: string };
      promptUsageType: PromptUsageType;
      categories: Array<{ id: string; name: string }>;
    };

    const updated = await updatePrompt(getFirebaseAdminFirestore(), id, {
      type: payload.type,
      promptTitle: payload.promptTitle.trim(),
      prompt: payload.prompt.trim(),
      beforeImage: payload.beforeImage,
      afterImage: payload.afterImage,
      promptUsageType: payload.promptUsageType,
      categories: payload.categories,
    });

    if (!updated) {
      return NextResponse.json({ error: "Prompt not found." }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Failed to update prompt:", error);
    return NextResponse.json({ error: "Failed to update prompt." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await verifyAdminRequest(_request);
    const { id } = await context.params;
    const deleted = await deletePrompt(getFirebaseAdminFirestore(), id);

    if (!deleted) {
      return NextResponse.json({ error: "Prompt not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Failed to delete prompt:", error);
    return NextResponse.json({ error: "Failed to delete prompt." }, { status: 500 });
  }
}
