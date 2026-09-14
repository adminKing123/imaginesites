import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PromptViewContent } from "@/components/prompt-view";
import { getPromptPageData } from "@/lib/prompts/get-prompt-page-data";

type PromptPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PromptPageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getPromptPageData(id);

  if (!data) {
    return { title: "Prompt not found" };
  }

  return {
    title: data.prompt.prompt_title,
    description: data.prompt.categories.map((category) => category.name).join(", "),
  };
}

export default async function PromptPage({ params }: PromptPageProps) {
  const { id } = await params;
  const data = await getPromptPageData(id);

  if (!data) {
    notFound();
  }

  return <PromptViewContent data={data} />;
}
