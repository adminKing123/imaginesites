"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { PublicPromptItem } from "@/lib/firebase/firestore/list-public-prompts";
import type { PromptType } from "@/lib/firebase/firestore/prompt-types";
import { fetchPublicPrompts } from "@/lib/prompts/fetch-public-prompts";
import type { PromptRelatedFilters } from "@/lib/prompts/get-prompt-page-data";

type PromptViewRelatedContextValue = {
  items: PublicPromptItem[];
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
};

const PromptViewRelatedContext = createContext<PromptViewRelatedContextValue | null>(null);

type PromptViewRelatedProviderProps = {
  excludeId: string;
  relatedFilters: PromptRelatedFilters;
  initialRelated: PublicPromptItem[];
  initialNextCursor: string | null;
  children: ReactNode;
};

export function PromptViewRelatedProvider({
  excludeId,
  relatedFilters,
  initialRelated,
  initialNextCursor,
  children,
}: PromptViewRelatedProviderProps) {
  const [items, setItems] = useState(initialRelated);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [hasMore, setHasMore] = useState(Boolean(initialNextCursor));
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const loadPage = useCallback(
    async (cursor: string, append: boolean) => {
      const requestId = ++requestIdRef.current;
      setLoadingMore(true);
      setError(null);

      try {
        const result = await fetchPublicPrompts({
          cursor,
          categoryIds:
            relatedFilters.categoryIds.length > 0 ? relatedFilters.categoryIds : undefined,
          type: relatedFilters.type as PromptType,
          excludeId,
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

        setError(err instanceof Error ? err.message : "Failed to load related prompts.");
      } finally {
        if (requestId === requestIdRef.current) {
          setLoadingMore(false);
        }
      }
    },
    [excludeId, relatedFilters.categoryIds, relatedFilters.type],
  );

  const loadMore = useCallback(() => {
    if (!hasMore || loadingMore || !nextCursor) {
      return;
    }

    void loadPage(nextCursor, true);
  }, [hasMore, loadPage, loadingMore, nextCursor]);

  const value = useMemo(
    () => ({
      items,
      loadingMore,
      error,
      hasMore,
      loadMore,
    }),
    [error, hasMore, items, loadMore, loadingMore],
  );

  return (
    <PromptViewRelatedContext.Provider value={value}>
      {children}
    </PromptViewRelatedContext.Provider>
  );
}

export function usePromptViewRelated() {
  const context = useContext(PromptViewRelatedContext);

  if (!context) {
    throw new Error("usePromptViewRelated must be used within PromptViewRelatedProvider.");
  }

  return context;
}
