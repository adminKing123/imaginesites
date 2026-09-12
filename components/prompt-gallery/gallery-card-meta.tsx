import { FaCrown } from "react-icons/fa6";
import type { PromptGalleryItem } from "./types";

type GalleryCardMetaProps = Pick<
  PromptGalleryItem,
  "title" | "categoryLabel" | "isPremium"
>;

export function GalleryCardMeta({
  title,
  categoryLabel,
  isPremium,
}: GalleryCardMetaProps) {
  return (
    <div className="mt-2 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h3 className="truncate text-sm font-semibold text-white sm:text-base">
          {title}
        </h3>
        <p className="mt-0.5 text-sm text-muted">{categoryLabel}</p>
      </div>

      {isPremium ? (
        <FaCrown
          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/80"
          aria-label="Premium prompt"
        />
      ) : null}
    </div>
  );
}
