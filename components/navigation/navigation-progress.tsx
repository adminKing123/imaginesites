"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function isSamePage(url: URL, pathname: string, search: string) {
  const current = `${pathname}${search ? `?${search}` : ""}`;
  const target = `${url.pathname}${url.search}`;

  return target === current;
}

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();

  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const trickleRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRef = useRef(0);
  const isFirstRouteRender = useRef(true);

  const clearTimers = useCallback(() => {
    if (trickleRef.current) {
      clearInterval(trickleRef.current);
      trickleRef.current = null;
    }

    if (hideRef.current) {
      clearTimeout(hideRef.current);
      hideRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    clearTimers();
    progressRef.current = 0;
    setVisible(true);
    setProgress(0);

    trickleRef.current = setInterval(() => {
      progressRef.current = Math.min(progressRef.current + Math.random() * 12, 90);
      setProgress(progressRef.current);
    }, 200);
  }, [clearTimers]);

  const complete = useCallback(() => {
    clearTimers();
    progressRef.current = 100;
    setProgress(100);

    hideRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
      progressRef.current = 0;
    }, 250);
  }, [clearTimers]);

  useEffect(() => {
    if (isFirstRouteRender.current) {
      isFirstRouteRender.current = false;
      return;
    }

    complete();
  }, [pathname, search, complete]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) {
        return;
      }

      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest("a");
      if (!anchor?.href) {
        return;
      }

      if (anchor.target && anchor.target !== "_self") {
        return;
      }

      if (anchor.hasAttribute("download")) {
        return;
      }

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) {
        return;
      }

      if (isSamePage(url, pathname, search)) {
        return;
      }

      start();
    };

    document.addEventListener("click", handleClick, true);

    return () => document.removeEventListener("click", handleClick, true);
  }, [pathname, search, start]);

  useEffect(() => {
    const handlePopState = () => start();
    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, [start]);

  useEffect(() => clearTimers, [clearTimers]);

  if (!visible) {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[9999] h-[3px]"
      role="progressbar"
      aria-hidden={!visible}
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-accent shadow-[0_0_10px_rgba(59,130,246,0.55)] transition-[width] duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
