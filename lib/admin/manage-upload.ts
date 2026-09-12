"use client";

import type { User } from "firebase/auth";
import type { AdminUploadListItem } from "./fetch-uploads";

async function getAuthHeaders(user: User) {
  const idToken = await user.getIdToken();

  return {
    Authorization: `Bearer ${idToken}`,
  };
}

export async function updateAdminUpload(
  user: User,
  id: string,
  input: { imageName: string; file?: File | null },
): Promise<AdminUploadListItem> {
  const formData = new FormData();
  formData.append("imageName", input.imageName);

  if (input.file) {
    formData.append("file", input.file);
  }

  const response = await fetch(`/api/admin/uploads/${id}`, {
    method: "PATCH",
    headers: await getAuthHeaders(user),
    body: formData,
  });

  const data = (await response.json()) as AdminUploadListItem & { error?: string };

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to update image.");
  }

  return data;
}

export async function deleteAdminUpload(user: User, id: string) {
  const response = await fetch(`/api/admin/uploads/${id}`, {
    method: "DELETE",
    headers: await getAuthHeaders(user),
  });

  const data = (await response.json()) as { error?: string };

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to delete image.");
  }
}
