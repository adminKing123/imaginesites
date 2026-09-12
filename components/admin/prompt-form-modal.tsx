"use client";

import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { FiX } from "react-icons/fi";
import type { AdminPromptListItem } from "@/lib/admin/fetch-prompts";
import {
  createAdminPrompt,
  updateAdminPrompt,
  type PromptFormInput,
} from "@/lib/admin/manage-prompt";
import {
  PROMPT_TYPES,
  PROMPT_USAGE_TYPES,
  type CategoryReference,
  type PromptImageReference,
  type PromptUsageType,
} from "@/lib/firebase/firestore/prompt-types";
import { CategorySelectField } from "./category-select-field";
import { ImageSelectField } from "./image-select-field";

type PromptFormModalProps = {
  open: boolean;
  user: User;
  item?: AdminPromptListItem | null;
  onClose: () => void;
  onSaved: (prompt: AdminPromptListItem) => void;
};

export function PromptFormModal({
  open,
  user,
  item,
  onClose,
  onSaved,
}: PromptFormModalProps) {
  const isEditing = Boolean(item);
  const [type, setType] = useState(PROMPT_TYPES.image);
  const [promptTitle, setPromptTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [promptUsageType, setPromptUsageType] = useState<PromptUsageType>(
    PROMPT_USAGE_TYPES.free,
  );
  const [beforeImage, setBeforeImage] = useState<PromptImageReference | null>(null);
  const [afterImage, setAfterImage] = useState<PromptImageReference | null>(null);
  const [categories, setCategories] = useState<CategoryReference[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (item) {
      setType(item.type);
      setPromptTitle(item.prompt_title);
      setPrompt(item.prompt);
      setPromptUsageType(item.prompt_usage_type);
      setBeforeImage(item.before_image);
      setAfterImage(item.after_image);
      setCategories(item.categories ?? []);
    } else {
      setType(PROMPT_TYPES.image);
      setPromptTitle("");
      setPrompt("");
      setPromptUsageType(PROMPT_USAGE_TYPES.free);
      setBeforeImage(null);
      setAfterImage(null);
      setCategories([]);
    }

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

    if (!beforeImage || !afterImage) {
      setError("Before and after images are required for image prompts.");
      return;
    }

    const payload: PromptFormInput = {
      type,
      promptTitle: promptTitle.trim(),
      prompt: prompt.trim(),
      beforeImage,
      afterImage,
      promptUsageType,
      categories,
    };

    setSaving(true);

    try {
      const saved = isEditing && item
        ? await updateAdminPrompt(user, item.id, payload)
        : await createAdminPrompt(user, payload);

      onSaved(saved);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save prompt.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <button
        type="button"
        aria-label="Close prompt modal"
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="prompt-form-title"
        className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#121212] p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="prompt-form-title" className="text-lg font-semibold text-white">
              {isEditing ? "Update prompt" : "Create a new prompt"}
            </h2>
            <p className="mt-1 text-sm text-muted">
              Add prompt details and connect before/after images.
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
            <span className="mb-2 block text-sm font-medium text-white">Prompt type</span>
            <select
              value={type}
              onChange={(event) => setType(event.target.value as typeof PROMPT_TYPES.image)}
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-white/20"
            >
              <option value={PROMPT_TYPES.image}>Image</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-white">Prompt title</span>
            <input
              type="text"
              value={promptTitle}
              onChange={(event) => setPromptTitle(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-white/20"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-white">Prompt</span>
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              rows={5}
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-white/20"
            />
          </label>

          <CategorySelectField
            label="Categories"
            user={user}
            value={categories}
            onChange={setCategories}
          />

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-white">Access</span>
            <select
              value={promptUsageType}
              onChange={(event) =>
                setPromptUsageType(event.target.value as PromptUsageType)
              }
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-white/20"
            >
              <option value={PROMPT_USAGE_TYPES.free}>Free</option>
              <option value={PROMPT_USAGE_TYPES.premium}>Premium</option>
            </select>
          </label>

          {type === PROMPT_TYPES.image ? (
            <>
              <ImageSelectField
                label="Before image"
                user={user}
                value={beforeImage}
                onChange={setBeforeImage}
              />
              <ImageSelectField
                label="After image"
                user={user}
                value={afterImage}
                onChange={setAfterImage}
              />
            </>
          ) : null}

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
            {saving ? "Saving..." : isEditing ? "Save changes" : "Create prompt"}
          </button>
        </form>
      </div>
    </div>
  );
}
