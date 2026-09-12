"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useDisclosure() {
  const [open, setOpen] = useState(false);
  const triggerNodeRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const setTriggerRef = useCallback((node: HTMLElement | null) => {
    triggerNodeRef.current = node;
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    triggerNodeRef.current?.focus();
  }, []);

  const toggle = useCallback(() => {
    setOpen((current) => !current);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;

      if (
        triggerNodeRef.current?.contains(target) ||
        panelRef.current?.contains(target)
      ) {
        return;
      }

      setOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, close]);

  return {
    open,
    toggle,
    close,
    setTriggerRef,
    panelRef,
  };
}
