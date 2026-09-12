import { GalleryCardMedia } from "./gallery-card-media";
import { GalleryCardMeta } from "./gallery-card-meta";
import type { PromptGalleryItem } from "./types";

type GalleryCardProps = {
  item: PromptGalleryItem;
};

export function GalleryCard({ item }: GalleryCardProps) {
  return (
    <article className="group mb-5 break-inside-avoid">
      <GalleryCardMedia item={item} />
      <GalleryCardMeta item={item} />
    </article>
  );
}
