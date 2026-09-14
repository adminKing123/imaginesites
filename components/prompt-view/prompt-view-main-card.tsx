import { GalleryCardMedia } from "@/components/prompt-gallery/gallery-card-media";
import type { PromptGalleryItem } from "@/components/prompt-gallery/types";
import { PromptViewBackLink } from "./prompt-view-back-link";
import { PromptViewDetails } from "./prompt-view-details";

type PromptViewMainCardProps = {
  item: PromptGalleryItem;
  className?: string;
};

export function PromptViewMainCard({ item, className = "" }: PromptViewMainCardProps) {
  return (
    <article
      className={`overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] sm:rounded-3xl ${className}`}
    >
      <div className="flex max-h-[800px] flex-col lg:flex-row lg:items-stretch">
        <div className="relative flex min-h-[220px] min-w-0 items-center justify-start bg-black/30 sm:min-h-[260px]">
          <GalleryCardMedia
            item={item}
            variant="hero"
            embedded
            showCopyButton={false}
            roundedClassName="rounded-none"
          />
          <PromptViewBackLink />
        </div>

        <PromptViewDetails item={item} embedded />
      </div>
    </article>
  );
}
