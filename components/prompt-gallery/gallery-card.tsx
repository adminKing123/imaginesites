"use client";

import Link from "next/link";
import { useState } from "react";
import { GALLERY_CARD_CLASS } from "./constants";
import { GalleryCardMedia, GalleryCardMediaControls } from "./gallery-card-media";
import { GalleryCardMeta } from "./gallery-card-meta";
import type { PromptGalleryItem } from "./types";

type GalleryCardProps = {
  item: PromptGalleryItem;
  href?: string;
  className?: string;
};

export function GalleryCard({ item, href, className = "" }: GalleryCardProps) {
  const [showBefore, setShowBefore] = useState(false);

  if (href) {
    return (
      <article className={`group ${GALLERY_CARD_CLASS} ${className}`}>
        <div className="relative">
          <GalleryCardMedia
            item={item}
            showCopyButton={false}
            showFlipButton={false}
            showHtmlBadge={false}
            showBefore={showBefore}
            onShowBeforeChange={setShowBefore}
          />
          <Link
            href={href}
            className="absolute inset-0 z-[1]"
            aria-label={`View ${item.prompt_title}`}
          />
          <GalleryCardMediaControls
            item={item}
            showBefore={showBefore}
            onShowBeforeChange={setShowBefore}
            className="z-[2]"
          />
        </div>

        <Link href={href} className="mt-2 block cursor-pointer">
          <GalleryCardMeta item={item} />
        </Link>
      </article>
    );
  }

  return (
    <article className={`group ${GALLERY_CARD_CLASS} ${className}`}>
      <GalleryCardMedia item={item} />
      <GalleryCardMeta item={item} />
    </article>
  );
}
