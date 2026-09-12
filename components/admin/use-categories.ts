"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { User } from "firebase/auth";
import {
  fetchAdminCategories,
  type AdminCategoryListItem,
} from "@/lib/admin/fetch-categories";

type UseCategoriesInput = {
  user: User;
  categoryId: string;
  categoryName: string;
};

export function useCategories({ user, categoryId, categoryName }: UseCategoriesInput) {
  const [items, setItems] = useState<AdminCategoryListItem[]>([]);
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
        const result = await fetchAdminCategories({
          user,
          cursor,
          categoryId,
          categoryName,
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

        setError(err instanceof Error ? err.message : "Failed to load categories.");
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [categoryId, categoryName, user],
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

  const prependCategory = useCallback((category: AdminCategoryListItem) => {
    setItems((current) => [category, ...current.filter((item) => item.id !== category.id)]);
  }, []);

  const updateCategory = useCallback((updated: AdminCategoryListItem) => {
    setItems((current) =>
      current.map((item) => (item.id === updated.id ? updated : item)),
    );
  }, []);

  const removeCategory = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  return {
    items,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    prependCategory,
    updateCategory,
    removeCategory,
  };
}
