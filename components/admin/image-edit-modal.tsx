"use client";

import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { FiX } from "react-icons/fi";
import type { AdminUploadListItem } from "@/lib/admin/fetch-uploads";
import { updateAdminUpload } from "@/lib/admin/manage-upload";

type ImageEditModalProps = {
  open: boolean;
  user: User;
  item: AdminUploadListItem | null;
  onClose: () => void;
  onUpdated: (item: AdminUploadListItem) => void;
};

export function ImageEditModal({
  open,
  user,
  item,
  onClose,
  onUpdated,
}: ImageEditModalProps) {
  const [imageName, setImageName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setImageName(item.image_name);
      setFile(null);
      setError(null);
    }
  }, [item]);

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

  if (!open || !item) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const updated = await updateAdminUpload(user, item.id, {
        imageName: imageName.trim(),
        file,
      });

      onUpdated({
        ...item,
        ...updated,
        image_cdn_url: file
          ? `${updated.image_cdn_url}?t=${Date.now()}`
          : updated.image_cdn_url,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close edit modal"
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-image-title"
        className="relative z-10 w-full max-w-lg rounded-2xl border border-white/10 bg-[#121212] p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="edit-image-title" className="text-lg font-semibold text-white">
              Update image
            </h2>
            <p className="mt-1 text-sm text-muted">
              Change the image name or replace the file on CDN.
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
            <span className="mb-2 block text-sm font-medium text-white">Image name</span>
            <input
              type="text"
              value={imageName}
              onChange={(event) => setImageName(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-muted focus:border-white/20"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-white">
              Replace image file (optional)
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className="block w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black"
            />
          </label>

          <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image_cdn_url}
              alt={item.image_name}
              className="max-h-48 w-full object-contain"
            />
          </div>

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
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
