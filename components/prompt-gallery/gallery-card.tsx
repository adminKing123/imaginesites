import Link from "next/link";
import { GalleryCardMedia } from "./gallery-card-media";
import { GalleryCardMeta } from "./gallery-card-meta";
import type { PromptGalleryItem } from "./types";

type GalleryCardProps = {
  item: PromptGalleryItem;
};

export function GalleryCard({ item }: GalleryCardProps) {
  return (
    <article className="group mb-5 break-inside-avoid">
      <Link href={item.href} className="block">
        <GalleryCardMedia
          title={item.title}
          image={item.image}
          width={item.width}
          height={item.height}
          hasVariations={item.hasVariations}
        />
        <GalleryCardMeta
          title={item.title}
          categoryLabel={item.categoryLabel}
          isPremium={item.isPremium}
        />
      </Link>
    </article>
  );
}
