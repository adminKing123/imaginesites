import { NextResponse } from "next/server";
import { AdminAuthError, verifyAdminRequest } from "@/lib/auth/verify-admin-request";
import { validatePromptPayload } from "@/lib/admin/validate-prompt-payload";
import { getFirebaseAdminFirestore } from "@/lib/firebase/admin";
import { listPrompts } from "@/lib/firebase/firestore/list-prompts";
import { createPrompt } from "@/lib/firebase/firestore/prompts";
import {
  isPromptType,
  PROMPT_USAGE_TYPES,
  type PromptType,
  type PromptUsageType,
} from "@/lib/firebase/firestore/prompt-types";

function isPromptUsageType(value: string): value is PromptUsageType {
  return value === PROMPT_USAGE_TYPES.free || value === PROMPT_USAGE_TYPES.premium;
}

export async function GET(request: Request) {
  try {
    await verifyAdminRequest(request);

    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit") ?? "20");
    const cursor = searchParams.get("cursor") ?? undefined;
    const promptId = searchParams.get("promptId") ?? undefined;
    const promptTitle = searchParams.get("promptTitle") ?? undefined;
    const typeParam = searchParams.get("type") ?? undefined;
    const usageParam = searchParams.get("promptUsageType") ?? undefined;

    const result = await listPrompts(getFirebaseAdminFirestore(), {
      limit,
      cursor,
      promptId,
      promptTitle,
      type: typeParam && isPromptType(typeParam) ? typeParam : undefined,
      promptUsageType:
        usageParam && isPromptUsageType(usageParam) ? usageParam : undefined,
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Failed to list prompts:", error);
    return NextResponse.json({ error: "Failed to load prompts." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await verifyAdminRequest(request);
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

    const record = await createPrompt(getFirebaseAdminFirestore(), {
      type: payload.type,
      promptTitle: payload.promptTitle.trim(),
      prompt: payload.prompt.trim(),
      beforeImage: payload.beforeImage,
      afterImage: payload.afterImage,
      promptUsageType: payload.promptUsageType,
      categories: payload.categories,
      createdBy: admin.uid,
    });

    return NextResponse.json(record);
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Failed to create prompt:", error);
    return NextResponse.json({ error: "Failed to create prompt." }, { status: 500 });
  }
}
