"use client";

import type { User } from "firebase/auth";

export type AdminUploadListItem = {
  id: string;
  image_name: string;
  image_cdn_url: string;
  createdAt: string | null;
};

type FetchAdminUploadsInput = {
  user: User;
  cursor?: string | null;
  imageId?: string;
  imageName?: string;
  limit?: number;
};

type FetchAdminUploadsResponse = {
  items: AdminUploadListItem[];
  nextCursor: string | null;
};

export async function fetchAdminUploads({
  user,
  cursor,
  imageId,
  imageName,
  limit = 20,
}: FetchAdminUploadsInput): Promise<FetchAdminUploadsResponse> {
  const idToken = await user.getIdToken();
  const params = new URLSearchParams({ limit: String(limit) });

  if (cursor) {
    params.set("cursor", cursor);
  }

  if (imageId?.trim()) {
    params.set("imageId", imageId.trim());
  }

  if (imageName?.trim()) {
    params.set("imageName", imageName.trim());
  }

  const response = await fetch(`/api/admin/uploads?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  const data = (await response.json()) as FetchAdminUploadsResponse & {
    error?: string;
  };

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to load uploads.");
  }

  return data;
}
