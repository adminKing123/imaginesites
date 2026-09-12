"use client";

import { useEffect, useRef, useState } from "react";
import type { User } from "firebase/auth";
import { FiPlus } from "react-icons/fi";
import type { AdminUploadListItem } from "@/lib/admin/fetch-uploads";
import { deleteAdminUpload } from "@/lib/admin/manage-upload";
import { ImageEditModal } from "./image-edit-modal";
import { ImageUploadModal } from "./image-upload-modal";
import { UploadedImageRow } from "./uploaded-image-row";
import { useUploadedImages } from "./use-uploaded-images";

type UploadedImagesPanelProps = {
  user: User;
};

export function UploadedImagesPanel({ user }: UploadedImagesPanelProps) {
  const [imageIdFilter, setImageIdFilter] = useState("");
  const [imageNameFilter, setImageNameFilter] = useState("");
  const [appliedImageId, setAppliedImageId] = useState("");
  const [appliedImageName, setAppliedImageName] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<AdminUploadListItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const {
    items,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    prependUpload,
    updateUpload,
    removeUpload,
  } = useUploadedImages({
    user,
    imageId: appliedImageId,
    imageName: appliedImageName,
  });

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
      { rootMargin: "200px" },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [hasMore, loadMore, items.length]);

  const applyFilters = () => {
    setAppliedImageId(imageIdFilter.trim());
    setAppliedImageName(imageNameFilter.trim());
  };

  const handleDelete = async (item: AdminUploadListItem) => {
    const confirmed = window.confirm(`Delete "${item.image_name}"? This cannot be undone.`);

    if (!confirmed) {
      return;
    }

    setDeletingId(item.id);

    try {
      await deleteAdminUpload(user, item.id);
      removeUpload(item.id);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Failed to delete image.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <div className="flex h-full flex-col">
        <header className="border-b border-white/10 px-4 py-5 lg:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-white">Uploaded images</h1>
              <p className="mt-1 text-sm text-muted">
                Browse uploaded CDN images with filters and infinite scroll.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setCreateModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
            >
              <FiPlus className="h-4 w-4" aria-hidden="true" />
              Create a new image
            </button>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <label className="block">
              <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted">
                Image ID
              </span>
              <input
                type="text"
                value={imageIdFilter}
                onChange={(event) => setImageIdFilter(event.target.value)}
                placeholder="Filter by image ID"
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-muted focus:border-white/20"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted">
                Image name
              </span>
              <input
                type="text"
                value={imageNameFilter}
                onChange={(event) => setImageNameFilter(event.target.value)}
                placeholder="Filter by image name"
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-muted focus:border-white/20"
              />
            </label>

            <button
              type="button"
              onClick={applyFilters}
              className="h-[42px] rounded-xl border border-white/10 px-4 text-sm font-medium text-white transition-colors hover:bg-white/5 md:mt-6"
            >
              Apply filters
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-5 lg:px-6">
          {loading ? (
            <p className="text-sm text-muted">Loading uploaded images...</p>
          ) : error ? (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 px-6 py-12 text-center">
              <p className="text-sm text-muted">No uploaded images found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <UploadedImageRow
                  key={item.id}
                  item={item}
                  onEdit={setEditItem}
                  onDelete={handleDelete}
                  deleting={deletingId === item.id}
                />
              ))}
            </div>
          )}

          <div ref={loadMoreRef} className="h-8" />

          {loadingMore ? (
            <p className="py-4 text-center text-sm text-muted">Loading more...</p>
          ) : null}

          {!loading && !hasMore && items.length > 0 ? (
            <p className="py-4 text-center text-xs text-muted">You have reached the end.</p>
          ) : null}
        </div>
      </div>

      <ImageUploadModal
        open={createModalOpen}
        user={user}
        onClose={() => setCreateModalOpen(false)}
        onUploaded={prependUpload}
      />

      <ImageEditModal
        open={Boolean(editItem)}
        user={user}
        item={editItem}
        onClose={() => setEditItem(null)}
        onUpdated={updateUpload}
      />
    </>
  );
}
