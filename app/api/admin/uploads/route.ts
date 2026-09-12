import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { validateImageFile } from "@/lib/admin/validate-image-file";
import { AdminAuthError, verifyAdminRequest } from "@/lib/auth/verify-admin-request";
import { getFirebaseAdminFirestore } from "@/lib/firebase/admin";
import { createImageUpload } from "@/lib/firebase/firestore/image-uploads";
import { listImageUploads } from "@/lib/firebase/firestore/list-image-uploads";
import { uploadFileToGitHub } from "@/lib/github/upload-file";
import { slugify } from "@/lib/utils/slugify";

export async function GET(request: Request) {
  try {
    await verifyAdminRequest(request);

    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit") ?? "20");
    const cursor = searchParams.get("cursor") ?? undefined;
    const imageId = searchParams.get("imageId") ?? undefined;
    const imageName = searchParams.get("imageName") ?? undefined;

    const result = await listImageUploads(getFirebaseAdminFirestore(), {
      limit,
      cursor,
      imageId,
      imageName,
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Failed to list uploads:", error);
    return NextResponse.json({ error: "Failed to load uploads." }, { status: 500 });
  }
}

function getFileExtension(fileName: string, mimeType: string) {
  const fromName = fileName.split(".").pop()?.toLowerCase();

  if (fromName && ["jpg", "jpeg", "png", "webp", "gif"].includes(fromName)) {
    return fromName === "jpeg" ? "jpg" : fromName;
  }

  switch (mimeType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "jpg";
  }
}

export async function POST(request: Request) {
  try {
    const admin = await verifyAdminRequest(request);
    const formData = await request.formData();
    const imageName = String(formData.get("imageName") ?? "").trim();
    const file = formData.get("file");

    if (!imageName) {
      return NextResponse.json({ error: "Image name is required." }, { status: 400 });
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Image file is required." }, { status: 400 });
    }

    const validationError = validateImageFile(file);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const uploadId = randomUUID();
    const extension = getFileExtension(file.name, file.type);
    const slug = slugify(imageName) || "image";
    const githubFileName = `${uploadId}-${slug}.${extension}`;

    const { cdnUrl, filePath } = await uploadFileToGitHub({
      fileName: githubFileName,
      fileBuffer,
      mimeType: file.type,
    });

    const record = await createImageUpload(getFirebaseAdminFirestore(), {
      imageName,
      imageCdnUrl: cdnUrl,
      uploadedBy: admin.uid,
      filePath,
      mimeType: file.type,
    });

    return NextResponse.json({
      id: record.id,
      image_name: record.image_name,
      image_cdn_url: record.image_cdn_url,
    });
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Admin upload failed:", error);
    return NextResponse.json({ error: "Failed to upload image." }, { status: 500 });
  }
}
