"use client";

import {
  Children,
  isValidElement,
  useMemo,
  useSyncExternalStore,
  type ComponentPropsWithoutRef,
  type ReactElement,
  type ReactNode,
} from "react";
import { GALLERY_MASONRY_CLASS, GALLERY_MASONRY_COLUMN_CLASS } from "./constants";

function getColumnCount(width: number) {
  if (width >= 901) {
    return 3;
  }

  return 2;
}

function subscribeToColumnCount(onStoreChange: () => void) {
  const mediaQueries = [window.matchMedia("(min-width: 901px)")];

  mediaQueries.forEach((query) => query.addEventListener("change", onStoreChange));

  return () => {
    mediaQueries.forEach((query) => query.removeEventListener("change", onStoreChange));
  };
}

function getClientColumnCount() {
  return getColumnCount(window.innerWidth);
}

function getServerColumnCount() {
  return 2;
}

function useColumnCount() {
  return useSyncExternalStore(
    subscribeToColumnCount,
    getClientColumnCount,
    getServerColumnCount,
  );
}

function distributeRoundRobin<T>(items: T[], columnCount: number) {
  const columns: T[][] = Array.from({ length: columnCount }, () => []);

  items.forEach((item, index) => {
    columns[index % columnCount].push(item);
  });

  return columns;
}

type GalleryMasonryProps = ComponentPropsWithoutRef<"div"> & {
  children: ReactNode;
};

export function GalleryMasonry({ children, className = "", ...props }: GalleryMasonryProps) {
  const columnCount = useColumnCount();

  const items = useMemo(
    () => Children.toArray(children).filter(isValidElement) as ReactElement[],
    [children],
  );

  const columns = useMemo(
    () => distributeRoundRobin(items, columnCount),
    [columnCount, items],
  );

  return (
    <div className={`${GALLERY_MASONRY_CLASS} ${className}`} {...props}>
      {columns.map((columnItems, columnIndex) => (
        <div key={columnIndex} className={GALLERY_MASONRY_COLUMN_CLASS}>
          {columnItems.map((child) => child)}
        </div>
      ))}
    </div>
  );
}
