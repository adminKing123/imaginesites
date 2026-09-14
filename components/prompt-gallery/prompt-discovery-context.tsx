"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { fetchPublicCategories } from "@/lib/prompts/fetch-public-categories";
import {
  fetchPublicPrompts,
  type PublicPromptItem,
} from "@/lib/prompts/fetch-public-prompts";
import {
  isPromptType,
  PROMPT_USAGE_TYPES,
  type PromptUsageType,
} from "@/lib/firebase/firestore/prompt-types";

type CategoryFilterOption = {
  label: string;
  value: string;
};

type PromptDiscoveryContextValue = {
  categories: CategoryFilterOption[];
  categoriesLoading: boolean;
  activeCategory: string;
  setActiveCategory: (value: string) => void;
  pricingValue: string;
  setPricingValue: (value: string) => void;
  recentValue: string;
  setRecentValue: (value: string) => void;
  typeValue: string;
  setTypeValue: (value: string) => void;
  items: PublicPromptItem[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
};

const PromptDiscoveryContext = createContext<PromptDiscoveryContextValue | null>(null);

export function PromptDiscoveryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<CategoryFilterOption[]>([
    { label: "All", value: "all" },
  ]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [pricingValue, setPricingValue] = useState("all");
  const [recentValue, setRecentValue] = useState("recent");
  const [typeValue, setTypeValue] = useState("all");
  const [items, setItems] = useState<PublicPromptItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const requestIdRef = useRef(0);

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      setCategoriesLoading(true);

      try {
        const result = await fetchPublicCategories();

        if (!cancelled) {
          setCategories([
            { label: "All", value: "all" },
            ...result.map((category) => ({
              label: category.name,
              value: category.id,
            })),
          ]);
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err);
        }
      } finally {
        if (!cancelled) {
          setCategoriesLoading(false);
        }
      }
    }

    void loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  const promptUsageType = useMemo<PromptUsageType | undefined>(() => {
    if (pricingValue === PROMPT_USAGE_TYPES.free) {
      return PROMPT_USAGE_TYPES.free;
    }

    if (pricingValue === PROMPT_USAGE_TYPES.premium) {
      return PROMPT_USAGE_TYPES.premium;
    }

    return undefined;
  }, [pricingValue]);

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
        const result = await fetchPublicPrompts({
          cursor,
          categoryId: activeCategory !== "all" ? activeCategory : undefined,
          type: typeValue === "all" ? undefined : isPromptType(typeValue) ? typeValue : undefined,
          promptUsageType,
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
    [activeCategory, promptUsageType, typeValue],
  );

  useEffect(() => {
    void loadPage();
  }, [loadPage, recentValue]);

  const loadMore = useCallback(() => {
    if (!hasMore || loadingMore || loading || !nextCursor) {
      return;
    }

    void loadPage(nextCursor, true);
  }, [hasMore, loadPage, loading, loadingMore, nextCursor]);

  const value = useMemo(
    () => ({
      categories,
      categoriesLoading,
      activeCategory,
      setActiveCategory,
      pricingValue,
      setPricingValue,
      recentValue,
      setRecentValue,
      typeValue,
      setTypeValue,
      items,
      loading,
      loadingMore,
      error,
      hasMore,
      loadMore,
    }),
    [
      activeCategory,
      categories,
      categoriesLoading,
      error,
      hasMore,
      items,
      loadMore,
      loading,
      loadingMore,
      pricingValue,
      recentValue,
      typeValue,
    ],
  );

  return (
    <PromptDiscoveryContext.Provider value={value}>
      {children}
    </PromptDiscoveryContext.Provider>
  );
}

export function usePromptDiscovery() {
  const context = useContext(PromptDiscoveryContext);

  if (!context) {
    throw new Error("usePromptDiscovery must be used within PromptDiscoveryProvider.");
  }

  return context;
}
