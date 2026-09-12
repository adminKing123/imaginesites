"use client";

import { useState } from "react";
import { CategoryBar } from "./category-bar";

export function PromptFiltersSection() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [recentValue, setRecentValue] = useState("recent");
  const [pricingValue, setPricingValue] = useState("all");
  const [typeValue, setTypeValue] = useState("all");

  return (
    <CategoryBar
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
