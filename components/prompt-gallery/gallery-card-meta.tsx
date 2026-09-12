import { FaCrown } from "react-icons/fa6";
import type { PromptGalleryItem } from "./types";
import { isPremiumPrompt } from "./types";

type GalleryCardMetaProps = {
  item: PromptGalleryItem;
};

export function GalleryCardMeta({ item }: GalleryCardMetaProps) {
  const categoryLabel =
    item.categories.length > 0
      ? item.categories.map((category) => category.name).join(", ")
      : "Uncategorized";

  return (
    <div className="mt-2">
      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 truncate text-sm font-semibold text-white sm:text-base">
          {item.prompt_title}
        </h3>

        {isPremiumPrompt(item) ? (
          <FaCrown
            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/80"
            aria-label="Premium prompt"
          />
        ) : null}
      </div>

      <p className="mt-0.5 truncate text-sm text-muted">{categoryLabel}</p>
    </div>
  );
}
