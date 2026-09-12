"use client";

import type { User } from "firebase/auth";

export type UploadedImage = {
  id: string;
  image_name: string;
  image_cdn_url: string;
};

export async function uploadAdminImage(
  user: User,
  input: { imageName: string; file: File },
): Promise<UploadedImage> {
  const idToken = await user.getIdToken();
  const formData = new FormData();
  formData.append("imageName", input.imageName);
  formData.append("file", input.file);

  const response = await fetch("/api/admin/uploads", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
    body: formData,
  });

  const data = (await response.json()) as UploadedImage & { error?: string };

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to upload image.");
  }

  return data;
}
