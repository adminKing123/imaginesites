"use client";

import { useEffect, useRef } from "react";
import { usePromptDiscovery } from "./prompt-discovery-context";
import { PromptGalleryGrid } from "./prompt-gallery-grid";
import { PromptGallerySkeleton } from "./prompt-gallery-skeleton";

export function PromptGallerySection() {
  const { items, loading, loadingMore, error, hasMore, loadMore } = usePromptDiscovery();
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

  return (
    <section className="w-full px-6 pb-16 pt-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {loading ? (
          <PromptGallerySkeleton />
        ) : error ? (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 px-6 py-16 text-center">
            <p className="text-sm text-muted">No prompts found for the selected filters.</p>
          </div>
        ) : (
          <PromptGalleryGrid items={items} loadingMore={loadingMore} />
        )}

        <div ref={loadMoreRef} className="h-8" />

        {!loading && !hasMore && items.length > 0 ? (
          <p className="py-4 text-center text-xs text-muted">You have reached the end.</p>
        ) : null}
      </div>
    </section>
  );
}
