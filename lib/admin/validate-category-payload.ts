export function validateCategoryPayload(body: unknown) {
  if (!body || typeof body !== "object") {
    return "Invalid category payload.";
  }

  const payload = body as Record<string, unknown>;

  if (typeof payload.name !== "string" || !payload.name.trim()) {
    return "Category name is required.";
  }

  return null;
}
