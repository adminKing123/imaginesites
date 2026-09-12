"use client";

import { FiEdit2, FiTrash2 } from "react-icons/fi";
import type { AdminCategoryListItem } from "@/lib/admin/fetch-categories";

type CategoryRowProps = {
  item: AdminCategoryListItem;
  onEdit: (item: AdminCategoryListItem) => void;
  onDelete: (item: AdminCategoryListItem) => void;
  deleting?: boolean;
};

export function CategoryRow({ item, onEdit, onDelete, deleting = false }: CategoryRowProps) {
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h3 className="text-base font-semibold text-white">{item.name}</h3>
        <p className="mt-1 break-all text-xs text-muted">ID: {item.id}</p>
      </div>

      <div className="flex items-start gap-2">
        <button
          type="button"
          onClick={() => onEdit(item)}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/5"
        >
          <FiEdit2 className="h-4 w-4" aria-hidden="true" />
          Update
        </button>

        <button
          type="button"
          onClick={() => onDelete(item)}
          disabled={deleting}
          className="inline-flex items-center gap-2 rounded-xl border border-red-400/20 px-3 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiTrash2 className="h-4 w-4" aria-hidden="true" />
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </article>
  );
}
