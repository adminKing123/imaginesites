"use client";

import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { FiX } from "react-icons/fi";
import type { AdminCategoryListItem } from "@/lib/admin/fetch-categories";
import {
  createAdminCategory,
  updateAdminCategory,
} from "@/lib/admin/manage-category";

type CategoryFormModalProps = {
  open: boolean;
  user: User;
  item?: AdminCategoryListItem | null;
  onClose: () => void;
  onSaved: (category: AdminCategoryListItem) => void;
};

export function CategoryFormModal({
  open,
  user,
  item,
  onClose,
  onSaved,
}: CategoryFormModalProps) {
  const isEditing = Boolean(item);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setName(item?.name ?? "");
    setError(null);
  }, [item, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const saved = isEditing && item
        ? await updateAdminCategory(user, item.id, { name: name.trim() })
        : await createAdminCategory(user, { name: name.trim() });

      onSaved(saved);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save category.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <button
        type="button"
        aria-label="Close category modal"
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-form-title"
        className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-[#121212] p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="category-form-title" className="text-lg font-semibold text-white">
              {isEditing ? "Update category" : "Create a new category"}
            </h2>
            <p className="mt-1 text-sm text-muted">
              Categories can be linked to multiple prompts.
            </p>
          </div>

          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-white/5 hover:text-white"
          >
            <FiX className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-white">Category name</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Portrait, Landscape, Product"
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-muted focus:border-white/20"
            />
          </label>

          {error ? (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={saving}
            className="inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : isEditing ? "Save changes" : "Create category"}
          </button>
        </form>
      </div>
    </div>
  );
}
