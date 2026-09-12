"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { User } from "firebase/auth";
import {
  fetchAdminUploads,
  type AdminUploadListItem,
} from "@/lib/admin/fetch-uploads";
import type { UploadedImage } from "@/lib/admin/upload-image";

type UseUploadedImagesInput = {
  user: User;
  imageId: string;
  imageName: string;
};

export function useUploadedImages({ user, imageId, imageName }: UseUploadedImagesInput) {
  const [items, setItems] = useState<AdminUploadListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const requestIdRef = useRef(0);

  const loadPage = useCallback(
    async (cursor?: string | null, append = false) => {
      const requestId = ++requestIdRef.current;

      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      setError(null);

      try {
        const result = await fetchAdminUploads({
          user,
          cursor,
          imageId,
          imageName,
        });

        if (requestId !== requestIdRef.current) {
          return;
        }

        setItems((current) => (append ? [...current, ...result.items] : result.items));
        setNextCursor(result.nextCursor);
        setHasMore(Boolean(result.nextCursor));
      } catch (err) {
        if (requestId !== requestIdRef.current) {
          return;
        }

        setError(err instanceof Error ? err.message : "Failed to load uploads.");
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [imageId, imageName, user],
  );

  useEffect(() => {
    void loadPage();
  }, [loadPage]);

  const loadMore = useCallback(() => {
    if (!hasMore || loadingMore || loading || !nextCursor) {
      return;
    }

    void loadPage(nextCursor, true);
  }, [hasMore, loadPage, loading, loadingMore, nextCursor]);

  const prependUpload = useCallback((upload: UploadedImage) => {
    setItems((current) => [
      {
        id: upload.id,
        image_name: upload.image_name,
        image_cdn_url: upload.image_cdn_url,
        createdAt: new Date().toISOString(),
      },
      ...current.filter((item) => item.id !== upload.id),
    ]);
  }, []);

  const updateUpload = useCallback((updated: AdminUploadListItem) => {
    setItems((current) =>
      current.map((item) => (item.id === updated.id ? { ...item, ...updated } : item)),
    );
  }, []);

  const removeUpload = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const refresh = useCallback(() => {
    void loadPage();
  }, [loadPage]);

  return {
    items,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    prependUpload,
    updateUpload,
    removeUpload,
    refresh,
  };
}
