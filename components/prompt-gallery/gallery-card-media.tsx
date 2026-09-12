import Image from "next/image";
import { FiLayers } from "react-icons/fi";
import type { PromptGalleryItem } from "./types";

type GalleryCardMediaProps = Pick<
  PromptGalleryItem,
  "title" | "image" | "width" | "height" | "hasVariations"
>;

export function GalleryCardMedia({
  title,
  image,
  width,
  height,
  hasVariations,
}: GalleryCardMediaProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/5">
      <Image
        src={image}
        alt={title}
        width={width}
        height={height}
        className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      />

      {hasVariations ? (
        <span className="absolute bottom-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-black/50 text-white backdrop-blur-sm">
          <FiLayers className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Multiple variations</span>
        </span>
      ) : null}
    </div>
  );
}
