"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { User } from "firebase/auth";
import {
  fetchAdminPrompts,
  type AdminPromptListItem,
} from "@/lib/admin/fetch-prompts";
import type { PromptType, PromptUsageType } from "@/lib/firebase/firestore/prompt-types";

type UsePromptsInput = {
  user: User;
  promptId: string;
  promptTitle: string;
  type?: PromptType;
  promptUsageType?: PromptUsageType | "";
};

export function usePrompts({
  user,
  promptId,
  promptTitle,
  type,
  promptUsageType,
}: UsePromptsInput) {
  const [items, setItems] = useState<AdminPromptListItem[]>([]);
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
        const result = await fetchAdminPrompts({
          user,
          cursor,
          promptId,
          promptTitle,
          type,
          promptUsageType: promptUsageType || undefined,
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

        setError(err instanceof Error ? err.message : "Failed to load prompts.");
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [promptId, promptTitle, promptUsageType, type, user],
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

  const prependPrompt = useCallback((prompt: AdminPromptListItem) => {
    setItems((current) => [prompt, ...current.filter((item) => item.id !== prompt.id)]);
  }, []);

  const updatePrompt = useCallback((updated: AdminPromptListItem) => {
    setItems((current) =>
      current.map((item) => (item.id === updated.id ? updated : item)),
    );
  }, []);

  const removePrompt = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  return {
    items,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    prependPrompt,
    updatePrompt,
    removePrompt,
  };
}
