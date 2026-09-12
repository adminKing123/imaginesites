import { GallerySkeletonCard } from "./gallery-skeleton-card";

const SKELETON_IMAGE_HEIGHTS = [
  280, 340, 300, 380, 260, 320, 360, 290, 330, 270, 350, 310, 300, 370, 285, 325,
];

type PromptGallerySkeletonProps = {
  count?: number;
};

export function PromptGallerySkeleton({ count = 12 }: PromptGallerySkeletonProps) {
  return (
    <div
      className="columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4"
      aria-busy="true"
      aria-label="Loading prompts"
    >
      {Array.from({ length: count }, (_, index) => (
        <GallerySkeletonCard
          key={index}
          imageHeight={SKELETON_IMAGE_HEIGHTS[index % SKELETON_IMAGE_HEIGHTS.length]}
        />
      ))}
    </div>
  );
}
