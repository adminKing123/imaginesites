"use client";

import { FiEdit2, FiTrash2 } from "react-icons/fi";
import type { AdminPromptListItem } from "@/lib/admin/fetch-prompts";
import { PROMPT_TYPES } from "@/lib/firebase/firestore/prompt-types";

type PromptRowProps = {
  item: AdminPromptListItem;
  onEdit: (item: AdminPromptListItem) => void;
  onDelete: (item: AdminPromptListItem) => void;
  deleting?: boolean;
};

function ImagePreview({ label, url }: { label: string; url: string }) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <div className="mx-auto h-24 w-24 overflow-hidden rounded-xl border border-white/10 bg-black/20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt={label} className="h-full w-full object-cover" />
      </div>
    </div>
  );
}

export function PromptRow({ item, onEdit, onDelete, deleting = false }: PromptRowProps) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-white">{item.prompt_title}</h3>
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium uppercase text-white">
              {item.type}
            </span>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium uppercase ${
                item.prompt_usage_type === "premium"
                  ? "bg-orange-400/10 text-orange-200"
                  : "bg-emerald-400/10 text-emerald-200"
              }`}
            >
              {item.prompt_usage_type}
            </span>
          </div>

          <p className="mt-3 line-clamp-3 text-sm text-muted">{item.prompt}</p>

          {item.categories.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {item.categories.map((category) => (
                <span
                  key={category.id}
                  className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white"
                >
                  {category.name}
                </span>
              ))}
            </div>
          ) : null}

          <p className="mt-3 break-all text-xs text-muted">ID: {item.id}</p>
        </div>

        {item.type === PROMPT_TYPES.image &&
        item.before_image.image_cdn_url &&
        item.after_image.image_cdn_url ? (
          <div className="flex gap-4">
            <ImagePreview label="Before" url={item.before_image.image_cdn_url} />
            <ImagePreview label="After" url={item.after_image.image_cdn_url} />
          </div>
        ) : null}

        {item.type === PROMPT_TYPES.html && item.after_image.image_cdn_url ? (
          <ImagePreview label="Thumbnail" url={item.after_image.image_cdn_url} />
        ) : null}

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
      </div>
    </article>
  );
}
