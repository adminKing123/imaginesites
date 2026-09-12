"use client";

import { FiEdit2, FiTrash2 } from "react-icons/fi";
import type { AdminUploadListItem } from "@/lib/admin/fetch-uploads";

type UploadedImageRowProps = {
  item: AdminUploadListItem;
  onEdit: (item: AdminUploadListItem) => void;
  onDelete: (item: AdminUploadListItem) => void;
  deleting?: boolean;
};

export function UploadedImageRow({
  item,
  onEdit,
  onDelete,
  deleting = false,
}: UploadedImageRowProps) {
  return (
    <article className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-[120px_1fr_auto]">
      <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image_cdn_url}
          alt={item.image_name}
          className="h-28 w-full object-cover sm:h-full sm:min-h-[96px]"
        />
      </div>

      <div className="min-w-0">
        <h3 className="truncate text-base font-semibold text-white">{item.image_name}</h3>
        <dl className="mt-3 space-y-2 text-sm">
          <div>
            <dt className="text-muted">Image ID</dt>
            <dd className="mt-0.5 break-all text-white">{item.id}</dd>
          </div>
          <div>
            <dt className="text-muted">CDN URL</dt>
            <dd className="mt-0.5 break-all text-white/80">{item.image_cdn_url}</dd>
          </div>
        </dl>
      </div>

      <div className="flex items-start gap-2 sm:flex-col">
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
