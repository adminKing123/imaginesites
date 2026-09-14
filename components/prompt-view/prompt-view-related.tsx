"use client";

import { useEffect, useRef } from "react";
import { PromptGalleryGrid } from "@/components/prompt-gallery/prompt-gallery-grid";
import { usePromptViewRelated } from "./prompt-view-related-context";

export function PromptViewRelated() {
  const { items, loadingMore, error, hasMore, loadMore } = usePromptViewRelated();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = loadMoreRef.current;

    if (!node || !hasMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "240px" },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [hasMore, loadMore, items.length]);

  if (items.length === 0 && !loadingMore) {
    return null;
  }

  return (
    <>
      <PromptGalleryGrid items={items} loadingMore={loadingMore} />

      {error ? (
        <p className="mt-4 text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      <div ref={loadMoreRef} className="h-8" />

      {!hasMore && items.length > 0 && !loadingMore ? (
        <p className="py-4 text-center text-xs text-muted">You have reached the end.</p>
      ) : null}
    </>
  );
}
