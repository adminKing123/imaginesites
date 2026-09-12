"use client";

import { usePromptDiscovery } from "@/components/prompt-gallery/prompt-discovery-context";
import { CategoryBar } from "./category-bar";

export function PromptFiltersSection() {
  const {
    categories,
    activeCategory,
    setActiveCategory,
    recentValue,
    setRecentValue,
    pricingValue,
    setPricingValue,
    typeValue,
    setTypeValue,
  } = usePromptDiscovery();

  return (
    <CategoryBar
      categories={categories}
      activeCategory={activeCategory}
      onCategoryChange={setActiveCategory}
      recentValue={recentValue}
      onRecentChange={setRecentValue}
      pricingValue={pricingValue}
      onPricingChange={setPricingValue}
      typeValue={typeValue}
      onTypeChange={setTypeValue}
    />
  );
}
