import type { PromptPageData } from "@/lib/prompts/get-prompt-page-data";
import { PromptViewMainCard } from "./prompt-view-main-card";
import { PromptViewRelated } from "./prompt-view-related";
import { PromptViewRelatedProvider } from "./prompt-view-related-context";
import { PromptViewTemplate } from "./prompt-view-template";

type PromptViewContentProps = {
  data: PromptPageData;
};

export function PromptViewContent({ data }: PromptViewContentProps) {
  const { prompt, relatedFilters, initialRelated, initialNextCursor } = data;

  return (
    <PromptViewRelatedProvider
      excludeId={prompt.id}
      relatedFilters={relatedFilters}
      initialRelated={initialRelated}
      initialNextCursor={initialNextCursor}
    >
      <main className="overflow-x-clip px-3 pb-12 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <PromptViewTemplate
            preview={<PromptViewMainCard item={prompt} />}
            gallery={<PromptViewRelated />}
          />
        </div>
      </main>
    </PromptViewRelatedProvider>
  );
}
