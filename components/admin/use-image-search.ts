"use client";

import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { ADMIN_DROPDOWN_SEARCH_LIMIT } from "@/lib/admin/dropdown-search-limit";
import {
  fetchAdminUploads,
  type AdminUploadListItem,
} from "@/lib/admin/fetch-uploads";

function isLikelyImageId(value: string) {
  return /^[a-zA-Z0-9]{15,}$/.test(value.trim());
}

export function useImageSearch(user: User, query: string, enabled: boolean) {
  const [results, setResults] = useState<AdminUploadListItem[]>([]);
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
        const response = await fetchAdminUploads({
          user,
          limit: ADMIN_DROPDOWN_SEARCH_LIMIT,
          imageId: trimmedQuery && isLikelyImageId(trimmedQuery) ? trimmedQuery : undefined,
          imageName: trimmedQuery && !isLikelyImageId(trimmedQuery) ? trimmedQuery : undefined,
        });

        if (!cancelled) {
          setResults(response.items);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to search images.");
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
