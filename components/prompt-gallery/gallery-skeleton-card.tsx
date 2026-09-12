type GallerySkeletonCardProps = {
  imageHeight: number;
};

export function GallerySkeletonCard({ imageHeight }: GallerySkeletonCardProps) {
  return (
    <article className="mb-3 break-inside-avoid sm:mb-5">
      <div
        className="animate-pulse rounded-2xl bg-white/10"
        style={{ height: imageHeight }}
      />

      <div className="mt-2 space-y-2">
        <div className="h-4 w-[78%] animate-pulse rounded-md bg-white/10" />
        <div className="h-3 w-[48%] animate-pulse rounded-md bg-white/[0.07]" />
      </div>
    </article>
  );
}
