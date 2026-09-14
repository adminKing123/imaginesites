import { GalleryCard } from "./gallery-card";
import { GalleryMasonry } from "./gallery-masonry";
import { GallerySkeletonCard } from "./gallery-skeleton-card";
import type { PromptGalleryItem } from "./types";

const LOAD_MORE_SKELETON_HEIGHTS = [300, 340, 280, 320];

type PromptGalleryGridProps = {
  items: PromptGalleryItem[];
  loadingMore?: boolean;
  linkToPrompt?: boolean;
};

export function PromptGalleryGrid({
  items,
  loadingMore = false,
  linkToPrompt = true,
}: PromptGalleryGridProps) {
  return (
    <GalleryMasonry>
      {items.map((item) => (
        <GalleryCard
          key={item.id}
          item={item}
          href={linkToPrompt ? `/prompt/${item.id}` : undefined}
        />
      ))}

      {loadingMore
        ? LOAD_MORE_SKELETON_HEIGHTS.map((height, index) => (
            <GallerySkeletonCard key={`loading-more-${index}`} imageHeight={height} />
          ))
        : null}
    </GalleryMasonry>
  );
}
