import { NextResponse } from "next/server";
import { getFirebaseAdminFirestore } from "@/lib/firebase/admin";
import { listPublicPrompts } from "@/lib/firebase/firestore/list-public-prompts";
import {
  PROMPT_TYPES,
  PROMPT_USAGE_TYPES,
  type PromptType,
  type PromptUsageType,
} from "@/lib/firebase/firestore/prompt-types";

function isPromptType(value: string): value is PromptType {
  return value === PROMPT_TYPES.image;
}

function isPromptUsageType(value: string): value is PromptUsageType {
  return value === PROMPT_USAGE_TYPES.free || value === PROMPT_USAGE_TYPES.premium;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit") ?? "20");
    const cursor = searchParams.get("cursor") ?? undefined;
    const categoryId = searchParams.get("categoryId") ?? undefined;
    const typeParam = searchParams.get("type") ?? undefined;
    const usageParam = searchParams.get("promptUsageType") ?? undefined;

    const result = await listPublicPrompts(getFirebaseAdminFirestore(), {
      limit,
      cursor,
      categoryId: categoryId?.trim() || undefined,
      type: typeParam && isPromptType(typeParam) ? typeParam : undefined,
      promptUsageType:
        usageParam && isPromptUsageType(usageParam) ? usageParam : undefined,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to list public prompts:", error);
    return NextResponse.json({ error: "Failed to load prompts." }, { status: 500 });
  }
}
