"use client";

import { useState } from "react";
import { FiCheck, FiCopy } from "react-icons/fi";
import { MdOutlineCode, MdOutlineFlip } from "react-icons/md";
import { PROMPT_TYPES } from "@/lib/firebase/firestore/prompt-types";
import type { PromptGalleryItem } from "./types";
import { isFreePrompt } from "./types";

type GalleryCardMediaProps = {
  item: PromptGalleryItem;
};

const iconOverlayClassName =
  "inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-black/45 text-white backdrop-blur-md transition-colors hover:bg-black/60 active:bg-black/70 sm:h-8 sm:w-8 sm:rounded-lg";

const iconBadgeClassName =
  "inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-black/45 text-white backdrop-blur-md sm:h-8 sm:w-8 sm:rounded-lg";

export function GalleryCardMedia({ item }: GalleryCardMediaProps) {
  const [showBefore, setShowBefore] = useState(false);
  const [copied, setCopied] = useState(false);

  const isImagePrompt = item.type === PROMPT_TYPES.image;
  const isHtmlPrompt = item.type === PROMPT_TYPES.html;
  const afterUrl = item.after_image?.image_cdn_url;
  const beforeUrl = isImagePrompt ? item.before_image?.image_cdn_url : undefined;
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
          alt={isImagePrompt ? `${item.prompt_title} after` : `${item.prompt_title} thumbnail`}
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
          className={`absolute right-1.5 top-1.5 sm:right-2 sm:top-2 ${iconOverlayClassName}`}
        >
          {copied ? (
            <FiCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
          ) : (
            <FiCopy className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
          )}
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
          className={`absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 ${iconOverlayClassName}`}
        >
          <MdOutlineFlip className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
        </button>
      ) : null}

      {isHtmlPrompt ? (
        <span
          aria-label="HTML prompt"
          title="HTML prompt"
          className={`absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 ${iconBadgeClassName}`}
        >
          <MdOutlineCode className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
        </span>
      ) : null}
    </div>
  );
}
