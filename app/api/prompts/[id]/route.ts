import { NextResponse } from "next/server";
import { getPromptPageData } from "@/lib/prompts/get-prompt-page-data";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const data = await getPromptPageData(id);

    if (!data) {
      return NextResponse.json({ error: "Prompt not found." }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to load prompt:", error);
    return NextResponse.json({ error: "Failed to load prompt." }, { status: 500 });
  }
}
