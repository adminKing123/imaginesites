"use client";

import { FiLock } from "react-icons/fi";
import { PromptCopyButton } from "@/components/prompt-gallery/prompt-copy-button";
import type { PromptGalleryItem } from "@/components/prompt-gallery/types";
import { isFreePrompt, isPremiumPrompt } from "@/components/prompt-gallery/types";

type PromptViewDetailsProps = {
  item: PromptGalleryItem;
  embedded?: boolean;
  className?: string;
};

export function PromptViewDetails({
  item,
  embedded = false,
  className = "",
}: PromptViewDetailsProps) {
  const categoryLabel =
    item.categories.length > 0
      ? item.categories.map((category) => category.name).join(", ")
      : "Uncategorized";

  const containerClassName = embedded
    ? "flex flex-1 flex-col border-t border-white/10 p-5 sm:p-6 lg:shrink-0 lg:border-l lg:border-t-0"
    : "flex min-h-[220px] max-h-[800px] flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:min-h-[260px] sm:p-6";

  return (
    <div className={`${containerClassName} ${className}`}>
      <div>
        <h1 className="text-xl font-semibold leading-snug text-white sm:text-2xl">
          {item.prompt_title}
        </h1>
        <p className="mt-1.5 text-sm text-muted">{categoryLabel}</p>
      </div>

      <div className="mt-auto pt-5">
        {isFreePrompt(item) && item.prompt ? (
          <PromptCopyButton
            prompt={item.prompt}
            variant="full"
            label="Copy full prompt"
            copiedLabel="Copied!"
          />
        ) : isPremiumPrompt(item) ? (
          <div className="flex items-center justify-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/5 px-5 py-3 text-sm font-medium text-orange-100">
            <FiLock className="h-4 w-4 shrink-0" aria-hidden="true" />
            Premium prompt
          </div>
        ) : null}
      </div>
    </div>
  );
}
