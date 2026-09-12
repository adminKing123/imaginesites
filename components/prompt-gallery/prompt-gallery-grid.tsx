import { GalleryCard } from "./gallery-card";
import type { PromptGalleryItem } from "./types";

type PromptGalleryGridProps = {
  items: PromptGalleryItem[];
};

export function PromptGalleryGrid({ items }: PromptGalleryGridProps) {
  return (
    <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4">
      {items.map((item) => (
        <GalleryCard key={item.id} item={item} />
      ))}
    </div>
  );
}
