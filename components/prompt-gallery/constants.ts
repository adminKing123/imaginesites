/** Flex row wrapper for masonry columns. */
export const GALLERY_MASONRY_CLASS = "flex gap-x-3 sm:gap-x-4";

/** Single masonry column; cards stack top-to-bottom with consistent gap. */
export const GALLERY_MASONRY_COLUMN_CLASS =
  "flex min-w-0 flex-1 flex-col gap-3 sm:gap-4 lg:gap-5";

/** Masonry card item — full column width, no row coupling. */
export const GALLERY_CARD_CLASS = "w-full";

/** @deprecated Use GalleryMasonry instead. */
export const GALLERY_GRID_CLASS = GALLERY_MASONRY_CLASS;
