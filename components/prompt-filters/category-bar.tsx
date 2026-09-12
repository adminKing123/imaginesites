"use client";

import {
  CATEGORIES,
  PRICING_OPTIONS,
  RECENT_OPTIONS,
  TYPE_OPTIONS,
} from "./config";
import { CategoryPill } from "./category-pill";
import { FilterDropdown } from "./filter-dropdown";
import { MobileFilterMenu } from "./mobile-filter-menu";
import { ScrollFadeContainer } from "./scroll-fade-container";

type CategoryBarProps = {
  activeCategory: string;
  onCategoryChange: (value: string) => void;
  recentValue: string;
  onRecentChange: (value: string) => void;
  pricingValue: string;
  onPricingChange: (value: string) => void;
  typeValue: string;
  onTypeChange: (value: string) => void;
};

export function CategoryBar({
  activeCategory,
  onCategoryChange,
  recentValue,
  onRecentChange,
  pricingValue,
  onPricingChange,
  typeValue,
  onTypeChange,
}: CategoryBarProps) {
  return (
    <section className="w-full px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center gap-3 lg:gap-4">
        <ScrollFadeContainer
          className="min-w-0 flex-1 rounded-full border border-white/10"
          innerClassName="flex items-center gap-2 px-1 py-1"
        >
          {CATEGORIES.map((category) => (
            <CategoryPill
              key={category.value}
              label={category.label}
              active={activeCategory === category.value}
              onClick={() => onCategoryChange(category.value)}
            />
          ))}
        </ScrollFadeContainer>

        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <FilterDropdown
            label="Recent"
            options={RECENT_OPTIONS}
            value={recentValue}
            onChange={onRecentChange}
          />
          <FilterDropdown
            label="Pricing"
            options={PRICING_OPTIONS}
            value={pricingValue}
            onChange={onPricingChange}
          />
        </div>

        <MobileFilterMenu
          typeValue={typeValue}
          pricingValue={pricingValue}
          onTypeChange={onTypeChange}
          onPricingChange={onPricingChange}
          typeOptions={TYPE_OPTIONS}
          pricingOptions={PRICING_OPTIONS}
        />
      </div>
    </section>
  );
}
