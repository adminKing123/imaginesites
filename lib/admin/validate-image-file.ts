const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function validateImageFile(file: File) {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return "Only image files are allowed.";
  }

  if (file.size > MAX_FILE_SIZE) {
    return "Image must be 5MB or smaller.";
  }

  return null;
}
