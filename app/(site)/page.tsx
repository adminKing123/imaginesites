import { HeroSection } from "@/components/hero";
import { PromptGallerySection } from "@/components/prompt-gallery";
import { PromptFiltersSection } from "@/components/prompt-filters";

export default function Home() {
  return (
    <main className="overflow-x-clip">
      <HeroSection />
      <PromptFiltersSection />
      <PromptGallerySection />
    </main>
  );
}
