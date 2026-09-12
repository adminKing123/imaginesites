import {
  PROMPT_TYPES,
  PROMPT_USAGE_TYPES,
  type PromptType,
  type PromptUsageType,
} from "@/lib/firebase/firestore/prompt-types";

function isPromptType(value: string): value is PromptType {
  return value === PROMPT_TYPES.image;
}

function isPromptUsageType(value: string): value is PromptUsageType {
  return value === PROMPT_USAGE_TYPES.free || value === PROMPT_USAGE_TYPES.premium;
}

export function validatePromptPayload(body: unknown) {
  if (!body || typeof body !== "object") {
    return "Invalid prompt payload.";
  }

  const payload = body as Record<string, unknown>;

  if (typeof payload.promptTitle !== "string" || !payload.promptTitle.trim()) {
    return "Prompt title is required.";
  }

  if (typeof payload.prompt !== "string" || !payload.prompt.trim()) {
    return "Prompt text is required.";
  }

  if (typeof payload.type !== "string" || !isPromptType(payload.type)) {
    return "Prompt type is invalid.";
  }

  if (
    typeof payload.promptUsageType !== "string" ||
    !isPromptUsageType(payload.promptUsageType)
  ) {
    return "Prompt usage type is invalid.";
  }

  const validateImage = (value: unknown, label: string) => {
    if (!value || typeof value !== "object") {
      return `${label} is required.`;
    }

    const image = value as Record<string, unknown>;

    if (typeof image.id !== "string" || !image.id.trim()) {
      return `${label} id is required.`;
    }

    if (typeof image.image_name !== "string" || !image.image_name.trim()) {
      return `${label} name is required.`;
    }

    if (typeof image.image_cdn_url !== "string" || !image.image_cdn_url.trim()) {
      return `${label} CDN URL is required.`;
    }

    return null;
  };

  if (payload.type === PROMPT_TYPES.image) {
    const beforeError = validateImage(payload.beforeImage, "Before image");
    if (beforeError) return beforeError;

    const afterError = validateImage(payload.afterImage, "After image");
    if (afterError) return afterError;
  }

  if (!Array.isArray(payload.categories)) {
    return "Categories must be an array.";
  }

  for (const category of payload.categories) {
    if (!category || typeof category !== "object") {
      return "Each category must be an object.";
    }

    const entry = category as Record<string, unknown>;

    if (typeof entry.id !== "string" || !entry.id.trim()) {
      return "Each category must have an id.";
    }

    if (typeof entry.name !== "string" || !entry.name.trim()) {
      return "Each category must have a name.";
    }
  }

  return null;
}
