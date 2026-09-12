import { HeroSection } from "@/components/hero";
import {
  PromptDiscoveryProvider,
  PromptGallerySection,
} from "@/components/prompt-gallery";
import { PromptFiltersSection } from "@/components/prompt-filters";

export default function Home() {
  return (
    <main className="overflow-x-clip">
      <HeroSection />
      <PromptDiscoveryProvider>
        <PromptFiltersSection />
        <PromptGallerySection />
      </PromptDiscoveryProvider>
    </main>
  );
}
