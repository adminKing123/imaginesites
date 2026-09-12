"use client";

import { useState } from "react";
import { FiCopy } from "react-icons/fi";
import { MdOutlineFlip } from "react-icons/md";
import type { PromptGalleryItem } from "./types";
import { isFreePrompt } from "./types";

type GalleryCardMediaProps = {
  item: PromptGalleryItem;
};

const iconOverlayClassName =
  "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-black/45 text-white backdrop-blur-md transition-colors hover:bg-black/60 active:bg-black/70";

export function GalleryCardMedia({ item }: GalleryCardMediaProps) {
  const [showBefore, setShowBefore] = useState(false);
  const [copied, setCopied] = useState(false);

  const afterUrl = item.after_image?.image_cdn_url;
  const beforeUrl = item.before_image?.image_cdn_url;
  const canCopy = isFreePrompt(item) && Boolean(item.prompt);

  const handleCopy = async (event: React.MouseEvent) => {
    event.stopPropagation();

    if (!item.prompt) {
      return;
    }

    try {
      await navigator.clipboard.writeText(item.prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.alert("Could not copy prompt to clipboard.");
    }
  };

  if (!afterUrl) {
    return (
      <div className="flex aspect-[4/5] items-center justify-center rounded-2xl bg-white/5 text-sm text-muted">
        No preview available
      </div>
    );
  }

  return (
    <div className="group/media relative overflow-hidden rounded-2xl bg-white/5">
      <div className="relative w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={afterUrl}
          alt={`${item.prompt_title} after`}
          className={`h-auto w-full object-cover transition-opacity duration-300 ${
            showBefore && beforeUrl ? "opacity-0" : "opacity-100"
          }`}
        />

        {beforeUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={beforeUrl}
            alt={`${item.prompt_title} before`}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              showBefore ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : null}
      </div>

      {canCopy ? (
        <button
          type="button"
          onClick={(event) => void handleCopy(event)}
          aria-label={copied ? "Prompt copied" : "Copy prompt"}
          title={copied ? "Copied!" : "Copy prompt"}
          className={`absolute right-2 top-2 ${iconOverlayClassName}`}
        >
          <FiCopy className="h-4 w-4" aria-hidden="true" />
        </button>
      ) : null}

      {beforeUrl ? (
        <button
          type="button"
          aria-pressed={showBefore}
          aria-label="Hold to show before image"
          title={showBefore ? "Showing before image" : "Hold for before image"}
          onPointerDown={(event) => {
            event.preventDefault();
            setShowBefore(true);
          }}
          onPointerUp={() => setShowBefore(false)}
          onPointerLeave={() => setShowBefore(false)}
          onPointerCancel={() => setShowBefore(false)}
          className={`absolute bottom-2 right-2 ${iconOverlayClassName}`}
        >
          <MdOutlineFlip className="h-4 w-4" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}
