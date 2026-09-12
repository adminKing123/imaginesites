import { NextResponse } from "next/server";
import { validateImageFile } from "@/lib/admin/validate-image-file";
import { AdminAuthError, verifyAdminRequest } from "@/lib/auth/verify-admin-request";
import { getFirebaseAdminFirestore } from "@/lib/firebase/admin";
import {
  deleteImageUpload,
  getImageUpload,
  updateImageUpload,
} from "@/lib/firebase/firestore/image-uploads";
import { deleteGitHubFile } from "@/lib/github/delete-file";
import { updateGitHubFile } from "@/lib/github/update-file";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await verifyAdminRequest(request);
    const { id } = await context.params;
    const existing = await getImageUpload(getFirebaseAdminFirestore(), id);

    if (!existing) {
      return NextResponse.json({ error: "Image not found." }, { status: 404 });
    }

    const formData = await request.formData();
    const imageName = String(formData.get("imageName") ?? "").trim();
    const file = formData.get("file");

    if (!imageName) {
      return NextResponse.json({ error: "Image name is required." }, { status: 400 });
    }

    let mimeType: string | undefined;

    if (file instanceof File) {
      const validationError = validateImageFile(file);

      if (validationError) {
        return NextResponse.json({ error: validationError }, { status: 400 });
      }

      const fileBuffer = Buffer.from(await file.arrayBuffer());
      await updateGitHubFile({
        filePath: existing.file_path,
        fileBuffer,
      });
      mimeType = file.type;
    }

    const updated = await updateImageUpload(getFirebaseAdminFirestore(), id, {
      imageName,
      mimeType,
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Failed to update upload:", error);
    return NextResponse.json({ error: "Failed to update image." }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    await verifyAdminRequest(request);
    const { id } = await context.params;
    const existing = await deleteImageUpload(getFirebaseAdminFirestore(), id);

    if (!existing) {
      return NextResponse.json({ error: "Image not found." }, { status: 404 });
    }

    try {
      await deleteGitHubFile(existing.file_path);
    } catch (error) {
      console.error("Failed to delete GitHub file:", error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Failed to delete upload:", error);
    return NextResponse.json({ error: "Failed to delete image." }, { status: 500 });
  }
}
