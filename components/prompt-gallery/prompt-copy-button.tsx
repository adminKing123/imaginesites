"use client";

import { useState } from "react";
import { FiCheck, FiCopy } from "react-icons/fi";

type PromptCopyButtonProps = {
  prompt: string;
  variant?: "icon" | "full";
  className?: string;
  iconClassName?: string;
  label?: string;
  copiedLabel?: string;
  onClick?: (event: React.MouseEvent) => void;
};

const iconOverlayClassName =
  "inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-black/45 text-white backdrop-blur-md transition-colors hover:bg-black/60 active:bg-black/70 sm:h-8 sm:w-8 sm:rounded-lg";

export function PromptCopyButton({
  prompt,
  variant = "icon",
  className = "",
  iconClassName = "h-3.5 w-3.5 sm:h-4 sm:w-4",
  label = "Copy prompt",
  copiedLabel = "Copied!",
  onClick,
}: PromptCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const stopNavigation = (event: React.SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleCopy = async (event: React.MouseEvent) => {
    stopNavigation(event);
    onClick?.(event);

    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.alert("Could not copy prompt to clipboard.");
    }
  };

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={(event) => void handleCopy(event)}
        onPointerDown={stopNavigation}
        onMouseDown={stopNavigation}
        className={`inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90 ${className}`}
      >
        {copied ? (
          <FiCheck className="h-4 w-4" aria-hidden="true" />
        ) : (
          <FiCopy className="h-4 w-4" aria-hidden="true" />
        )}
        {copied ? copiedLabel : label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={(event) => void handleCopy(event)}
      onPointerDown={stopNavigation}
      onMouseDown={stopNavigation}
      aria-label={copied ? copiedLabel : label}
      title={copied ? copiedLabel : label}
      className={`${iconOverlayClassName} ${className}`}
    >
      {copied ? (
        <FiCheck className={iconClassName} aria-hidden="true" />
      ) : (
        <FiCopy className={iconClassName} aria-hidden="true" />
      )}
    </button>
  );
}
