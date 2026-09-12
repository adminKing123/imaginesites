"use client";

import { useEffect, useRef, useState } from "react";
import type { User } from "firebase/auth";
import { FiPlus } from "react-icons/fi";
import type { AdminPromptListItem } from "@/lib/admin/fetch-prompts";
import { deleteAdminPrompt } from "@/lib/admin/manage-prompt";
import {
  PROMPT_TYPES,
  PROMPT_USAGE_TYPES,
  type PromptUsageType,
} from "@/lib/firebase/firestore/prompt-types";
import { PromptFormModal } from "./prompt-form-modal";
import { PromptRow } from "./prompt-row";
import { usePrompts } from "./use-prompts";

type PromptsPanelProps = {
  user: User;
};

export function PromptsPanel({ user }: PromptsPanelProps) {
  const [promptIdFilter, setPromptIdFilter] = useState("");
  const [promptTitleFilter, setPromptTitleFilter] = useState("");
  const [usageFilter, setUsageFilter] = useState<PromptUsageType | "">("");
  const [appliedPromptId, setAppliedPromptId] = useState("");
  const [appliedPromptTitle, setAppliedPromptTitle] = useState("");
  const [appliedUsage, setAppliedUsage] = useState<PromptUsageType | "">("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<AdminPromptListItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const {
    items,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    prependPrompt,
    updatePrompt,
    removePrompt,
  } = usePrompts({
    user,
    promptId: appliedPromptId,
    promptTitle: appliedPromptTitle,
    type: PROMPT_TYPES.image,
    promptUsageType: appliedUsage,
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
    setAppliedPromptId(promptIdFilter.trim());
    setAppliedPromptTitle(promptTitleFilter.trim());
    setAppliedUsage(usageFilter);
  };

  const handleDelete = async (item: AdminPromptListItem) => {
    const confirmed = window.confirm(`Delete "${item.prompt_title}"? This cannot be undone.`);

    if (!confirmed) {
      return;
    }

    setDeletingId(item.id);

    try {
      await deleteAdminPrompt(user, item.id);
      removePrompt(item.id);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Failed to delete prompt.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaved = (prompt: AdminPromptListItem) => {
    if (editItem) {
      updatePrompt(prompt);
      return;
    }

    prependPrompt(prompt);
  };

  return (
    <>
      <div className="flex h-full flex-col">
        <header className="border-b border-white/10 px-4 py-5 lg:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-white">Prompts</h1>
              <p className="mt-1 text-sm text-muted">
                Manage image prompts with before/after references and access type.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditItem(null);
                setModalOpen(true);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
            >
              <FiPlus className="h-4 w-4" aria-hidden="true" />
              Create a new prompt
            </button>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-[1fr_1fr_180px_auto]">
            <label className="block">
              <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted">
                Prompt ID
              </span>
              <input
                type="text"
                value={promptIdFilter}
                onChange={(event) => setPromptIdFilter(event.target.value)}
                placeholder="Filter by prompt ID"
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white outline-none placeholder:text-muted focus:border-white/20"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted">
                Prompt title
              </span>
              <input
                type="text"
                value={promptTitleFilter}
                onChange={(event) => setPromptTitleFilter(event.target.value)}
                placeholder="Filter by prompt title"
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white outline-none placeholder:text-muted focus:border-white/20"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted">
                Access
              </span>
              <select
                value={usageFilter}
                onChange={(event) =>
                  setUsageFilter(event.target.value as PromptUsageType | "")
                }
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white outline-none focus:border-white/20"
              >
                <option value="">All</option>
                <option value={PROMPT_USAGE_TYPES.free}>Free</option>
                <option value={PROMPT_USAGE_TYPES.premium}>Premium</option>
              </select>
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
            <p className="text-sm text-muted">Loading prompts...</p>
          ) : error ? (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 px-6 py-12 text-center">
              <p className="text-sm text-muted">No prompts found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <PromptRow
                  key={item.id}
                  item={item}
                  onEdit={(prompt) => {
                    setEditItem(prompt);
                    setModalOpen(true);
                  }}
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

      <PromptFormModal
        open={modalOpen}
        user={user}
        item={editItem}
        onClose={() => {
          setModalOpen(false);
          setEditItem(null);
        }}
        onSaved={handleSaved}
      />
    </>
  );
}
