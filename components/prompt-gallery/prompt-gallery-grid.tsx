import { GalleryCard } from "./gallery-card";
import { GALLERY_GRID_CLASS } from "./constants";
import { GallerySkeletonCard } from "./gallery-skeleton-card";
import type { PromptGalleryItem } from "./types";

const LOAD_MORE_SKELETON_HEIGHTS = [300, 340, 280, 320];

type PromptGalleryGridProps = {
  items: PromptGalleryItem[];
  loadingMore?: boolean;
};

export function PromptGalleryGrid({ items, loadingMore = false }: PromptGalleryGridProps) {
  return (
    <div className={GALLERY_GRID_CLASS}>
      {items.map((item) => (
        <GalleryCard key={item.id} item={item} />
      ))}

      {loadingMore
        ? LOAD_MORE_SKELETON_HEIGHTS.map((height, index) => (
            <GallerySkeletonCard key={`loading-more-${index}`} imageHeight={height} />
          ))
        : null}
    </div>
  );
}
