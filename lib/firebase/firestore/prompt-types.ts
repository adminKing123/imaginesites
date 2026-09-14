import type { CategoryReference } from "./category-types";

export type { CategoryReference };

export const PROMPT_TYPES = {
  image: "image",
  html: "html",
} as const;

export type PromptType = (typeof PROMPT_TYPES)[keyof typeof PROMPT_TYPES];

export function isPromptType(value: string): value is PromptType {
  return value === PROMPT_TYPES.image || value === PROMPT_TYPES.html;
}

export const PROMPT_USAGE_TYPES = {
  free: "free",
  premium: "premium",
} as const;

export type PromptUsageType =
  (typeof PROMPT_USAGE_TYPES)[keyof typeof PROMPT_USAGE_TYPES];

export type PromptImageReference = {
  id: string;
  image_name: string;
  image_cdn_url: string;
};

export const EMPTY_PROMPT_IMAGE: PromptImageReference = {
  id: "",
  image_name: "",
  image_cdn_url: "",
};
