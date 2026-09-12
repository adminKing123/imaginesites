"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

type ScrollFadeContainerProps = {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  fadeFromClass?: string;
};

export function ScrollFadeContainer({
  children,
  className = "",
  innerClassName = "",
  fadeFromClass = "from-surface",
}: ScrollFadeContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  const updateFades = useCallback(() => {
    const element = scrollRef.current;
    if (!element) {
      return;
    }

    const maxScroll = element.scrollWidth - element.clientWidth;
    setShowLeftFade(element.scrollLeft > 4);
    setShowRightFade(maxScroll > 4 && element.scrollLeft < maxScroll - 4);
  }, []);

  useEffect(() => {
    updateFades();

    const element = scrollRef.current;
    if (!element) {
      return;
    }

    element.addEventListener("scroll", updateFades, { passive: true });
    window.addEventListener("resize", updateFades);

    const observer = new ResizeObserver(updateFades);
    observer.observe(element);

    return () => {
      element.removeEventListener("scroll", updateFades);
      window.removeEventListener("resize", updateFades);
      observer.disconnect();
    };
  }, [updateFades]);

  return (
    <div className={`relative min-w-0 overflow-hidden ${className}`}>
      <div
        ref={scrollRef}
        className={`scrollbar-none overflow-x-auto overflow-y-hidden ${innerClassName}`}
      >
        {children}
      </div>

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r ${fadeFromClass} via-surface/90 to-transparent transition-opacity duration-200 ${
          showLeftFade ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l ${fadeFromClass} via-surface/90 to-transparent transition-opacity duration-200 ${
          showRightFade ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
