import { PROMPT_GALLERY_ITEMS } from "./data";
import { PromptGalleryGrid } from "./prompt-gallery-grid";

export function PromptGallerySection() {
  return (
    <section className="w-full px-6 pb-16 pt-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <PromptGalleryGrid items={PROMPT_GALLERY_ITEMS} />
      </div>
    </section>
  );
}
