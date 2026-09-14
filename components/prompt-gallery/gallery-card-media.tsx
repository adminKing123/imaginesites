"use client";

import { useState } from "react";
import { MdOutlineCode, MdOutlineFlip } from "react-icons/md";
import { PROMPT_TYPES } from "@/lib/firebase/firestore/prompt-types";
import { PromptCopyButton } from "./prompt-copy-button";
import type { PromptGalleryItem } from "./types";
import { isFreePrompt } from "./types";

type GalleryCardMediaProps = {
  item: PromptGalleryItem;
  showCopyButton?: boolean;
  showFlipButton?: boolean;
  showHtmlBadge?: boolean;
  showBefore?: boolean;
  onShowBeforeChange?: (value: boolean) => void;
  roundedClassName?: string;
  variant?: "card" | "hero";
  embedded?: boolean;
};

type GalleryCardMediaControlsProps = {
  item: PromptGalleryItem;
  showCopyButton?: boolean;
  showFlipButton?: boolean;
  showHtmlBadge?: boolean;
  showBefore?: boolean;
  onShowBeforeChange?: (value: boolean) => void;
  className?: string;
};

const HERO_MAX_HEIGHT_CLASS = "max-h-[400px] md:max-h-[680px]";

const iconOverlayClassName =
  "inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-black/45 text-white backdrop-blur-md transition-colors hover:bg-black/60 active:bg-black/70 sm:h-8 sm:w-8 sm:rounded-lg";

const iconBadgeClassName =
  "inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-black/45 text-white backdrop-blur-md sm:h-8 sm:w-8 sm:rounded-lg";

function stopNavigation(event: React.SyntheticEvent) {
  event.preventDefault();
  event.stopPropagation();
}

export function GalleryCardMediaControls({
  item,
  showCopyButton = true,
  showFlipButton = true,
  showHtmlBadge = true,
  showBefore,
  onShowBeforeChange,
  className = "",
}: GalleryCardMediaControlsProps) {
  const isImagePrompt = item.type === PROMPT_TYPES.image;
  const isHtmlPrompt = item.type === PROMPT_TYPES.html;
  const beforeUrl = isImagePrompt ? item.before_image?.image_cdn_url : undefined;
  const canCopy = showCopyButton && isFreePrompt(item) && Boolean(item.prompt);

  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`}>
      {canCopy && item.prompt ? (
        <PromptCopyButton
          prompt={item.prompt}
          className="pointer-events-auto absolute right-1.5 top-1.5 sm:right-2 sm:top-2"
        />
      ) : null}

      {showFlipButton && beforeUrl ? (
        <button
          type="button"
          aria-pressed={showBefore}
          aria-label="Hold to show before image"
          title={showBefore ? "Showing before image" : "Hold for before image"}
          onPointerDown={(event) => {
            stopNavigation(event);
            onShowBeforeChange?.(true);
          }}
          onPointerUp={(event) => {
            stopNavigation(event);
            onShowBeforeChange?.(false);
          }}
          onPointerLeave={(event) => {
            stopNavigation(event);
            onShowBeforeChange?.(false);
          }}
          onPointerCancel={(event) => {
            stopNavigation(event);
            onShowBeforeChange?.(false);
          }}
          onClick={stopNavigation}
          onMouseDown={stopNavigation}
          className={`pointer-events-auto absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 ${iconOverlayClassName}`}
        >
          <MdOutlineFlip className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
        </button>
      ) : null}

      {showHtmlBadge && isHtmlPrompt ? (
        <span
          aria-label="HTML prompt"
          title="HTML prompt"
          className={`pointer-events-auto absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 ${iconBadgeClassName}`}
        >
          <MdOutlineCode className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
        </span>
      ) : null}
    </div>
  );
}

export function GalleryCardMedia({
  item,
  showCopyButton = true,
  showFlipButton = true,
  showHtmlBadge = true,
  showBefore: controlledShowBefore,
  onShowBeforeChange,
  roundedClassName = "rounded-2xl",
  variant = "card",
  embedded = false,
}: GalleryCardMediaProps) {
  const [uncontrolledShowBefore, setUncontrolledShowBefore] = useState(false);
  const showBefore = controlledShowBefore ?? uncontrolledShowBefore;
  const setShowBefore = onShowBeforeChange ?? setUncontrolledShowBefore;

  const isHero = variant === "hero";
  const isEmbeddedHero = isHero && embedded;
  const isImagePrompt = item.type === PROMPT_TYPES.image;
  const afterUrl = item.after_image?.image_cdn_url;
  const beforeUrl = isImagePrompt ? item.before_image?.image_cdn_url : undefined;
  const showControls = showCopyButton || showFlipButton || showHtmlBadge;

  const afterImageClassName = isHero
    ? `block h-auto w-auto ${HERO_MAX_HEIGHT_CLASS} max-w-full object-contain`
    : "h-auto w-full object-cover";

  const beforeImageClassName = isHero
    ? `absolute inset-0 h-full w-full object-contain`
    : `absolute inset-0 h-full w-full object-cover`;

  if (!afterUrl) {
    return (
      <div
        className={`flex aspect-[4/5] items-center justify-center bg-white/5 text-sm text-muted ${roundedClassName} ${
          isHero ? HERO_MAX_HEIGHT_CLASS : ""
        }`}
      >
        No preview available
      </div>
    );
  }

  return (
    <div
      className={`group/media relative overflow-hidden ${roundedClassName} ${
        isEmbeddedHero
          ? "flex h-full w-full items-center justify-center"
          : isHero
            ? "w-fit max-w-full"
            : "bg-white/5"
      }`}
    >
      <div
        className={`relative ${
          isEmbeddedHero
            ? `${HERO_MAX_HEIGHT_CLASS} max-w-full`
            : isHero
              ? `${HERO_MAX_HEIGHT_CLASS} w-fit max-w-full`
              : "w-full"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={afterUrl}
          alt={isImagePrompt ? `${item.prompt_title} after` : `${item.prompt_title} thumbnail`}
          className={`${afterImageClassName} transition-opacity duration-300 ${
            showBefore && beforeUrl ? "opacity-0" : "opacity-100"
          }`}
        />

        {beforeUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={beforeUrl}
            alt={`${item.prompt_title} before`}
            className={`${beforeImageClassName} transition-opacity duration-300 ${
              showBefore ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : null}
      </div>

      {showControls ? (
        <GalleryCardMediaControls
          item={item}
          showCopyButton={showCopyButton}
          showFlipButton={showFlipButton}
          showHtmlBadge={showHtmlBadge}
          showBefore={showBefore}
          onShowBeforeChange={setShowBefore}
          className="z-[2]"
        />
      ) : null}
    </div>
  );
}
