"use client";

import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import {
  fetchAdminCategories,
  type AdminCategoryListItem,
} from "@/lib/admin/fetch-categories";
import { ADMIN_DROPDOWN_SEARCH_LIMIT } from "@/lib/admin/dropdown-search-limit";

function isLikelyCategoryId(value: string) {
  return /^[a-zA-Z0-9]{15,}$/.test(value.trim());
}

export function useCategorySearch(user: User, query: string, enabled: boolean) {
  const [results, setResults] = useState<AdminCategoryListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const trimmedQuery = query.trim();
    let cancelled = false;

    async function runSearch() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchAdminCategories({
          user,
          limit: ADMIN_DROPDOWN_SEARCH_LIMIT,
          categoryId: trimmedQuery && isLikelyCategoryId(trimmedQuery) ? trimmedQuery : undefined,
          categoryName: trimmedQuery && !isLikelyCategoryId(trimmedQuery) ? trimmedQuery : undefined,
        });

        if (!cancelled) {
          setResults(response.items);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to search categories.");
          setResults([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    const timeoutId = window.setTimeout(() => {
      void runSearch();
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [enabled, query, user]);

  return { results, loading, error };
}
