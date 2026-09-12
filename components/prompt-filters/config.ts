export type FilterOption = {
  label: string;
  value: string;
};

export const CATEGORIES: FilterOption[] = [
  { label: "All", value: "all" },
  { label: "Apps", value: "apps" },
  { label: "Sections", value: "sections" },
  { label: "Hero", value: "hero" },
  { label: "Landing Page", value: "landing-page" },
  { label: "Saas", value: "saas" },
  { label: "Agency", value: "agency" },
  { label: "Ai", value: "ai" },
  { label: "Travel", value: "travel" },
  { label: "Creative", value: "creative" },
  { label: "Portfolio", value: "portfolio" },
  { label: "Technology", value: "technology" },
  { label: "Wellness", value: "wellness" },
  { label: "3d Website", value: "3d-website" },
];

export const TYPE_OPTIONS: FilterOption[] = [
  { label: "All", value: "all" },
  { label: "Image", value: "image" },
];

export const PRICING_OPTIONS: FilterOption[] = [
  { label: "All", value: "all" },
  { label: "Free", value: "free" },
  { label: "Premium", value: "premium" },
];

export const RECENT_OPTIONS: FilterOption[] = [
  { label: "Recent", value: "recent" },
  { label: "Popular", value: "popular" },
  { label: "Trending", value: "trending" },
];
