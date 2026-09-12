export type PromptGalleryItem = {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  image: string;
  width: number;
  height: number;
  href: string;
  isPremium?: boolean;
  hasVariations?: boolean;
};
