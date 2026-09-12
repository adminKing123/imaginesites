"use client";

import { useEffect, useRef, useState } from "react";
import type { User } from "firebase/auth";
import { FiPlus } from "react-icons/fi";
import type { AdminCategoryListItem } from "@/lib/admin/fetch-categories";
import { deleteAdminCategory } from "@/lib/admin/manage-category";
import { CategoryFormModal } from "./category-form-modal";
import { CategoryRow } from "./category-row";
import { useCategories } from "./use-categories";

type CategoriesPanelProps = {
  user: User;
};

export function CategoriesPanel({ user }: CategoriesPanelProps) {
  const [categoryIdFilter, setCategoryIdFilter] = useState("");
  const [categoryNameFilter, setCategoryNameFilter] = useState("");
  const [appliedCategoryId, setAppliedCategoryId] = useState("");
  const [appliedCategoryName, setAppliedCategoryName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<AdminCategoryListItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const {
    items,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    prependCategory,
    updateCategory,
    removeCategory,
  } = useCategories({
    user,
    categoryId: appliedCategoryId,
    categoryName: appliedCategoryName,
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
    setAppliedCategoryId(categoryIdFilter.trim());
    setAppliedCategoryName(categoryNameFilter.trim());
  };

  const handleDelete = async (item: AdminCategoryListItem) => {
    const confirmed = window.confirm(`Delete "${item.name}"? This cannot be undone.`);

    if (!confirmed) {
      return;
    }

    setDeletingId(item.id);

    try {
      await deleteAdminCategory(user, item.id);
      removeCategory(item.id);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Failed to delete category.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaved = (category: AdminCategoryListItem) => {
    if (editItem) {
      updateCategory(category);
      return;
    }

    prependCategory(category);
  };

  return (
    <>
      <div className="flex h-full flex-col">
        <header className="border-b border-white/10 px-4 py-5 lg:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-white">Categories</h1>
              <p className="mt-1 text-sm text-muted">
                Create and manage categories to organize prompts.
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
              Create a new category
            </button>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <label className="block">
              <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted">
                Category ID
              </span>
              <input
                type="text"
                value={categoryIdFilter}
                onChange={(event) => setCategoryIdFilter(event.target.value)}
                placeholder="Filter by category ID"
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white outline-none placeholder:text-muted focus:border-white/20"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted">
                Category name
              </span>
              <input
                type="text"
                value={categoryNameFilter}
                onChange={(event) => setCategoryNameFilter(event.target.value)}
                placeholder="Filter by category name"
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white outline-none placeholder:text-muted focus:border-white/20"
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
            <p className="text-sm text-muted">Loading categories...</p>
          ) : error ? (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 px-6 py-12 text-center">
              <p className="text-sm text-muted">No categories found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <CategoryRow
                  key={item.id}
                  item={item}
                  onEdit={(category) => {
                    setEditItem(category);
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

      <CategoryFormModal
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
