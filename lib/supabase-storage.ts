import "server-only";

import { randomUUID } from "crypto";
import { createClient } from "@supabase/supabase-js";

const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET || "studio-images";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

let bucketReady = false;

function getSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase Storage nije podešen.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function extensionForType(type: string) {
  if (type === "image/png") {
    return "png";
  }

  if (type === "image/webp") {
    return "webp";
  }

  return "jpg";
}

function sanitizePathPart(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 80);
}

async function ensureStudioImagesBucket() {
  if (bucketReady) {
    return;
  }

  const supabase = getSupabaseAdminClient();
  const { data: bucket } = await supabase.storage.getBucket(BUCKET_NAME);

  if (!bucket) {
    const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
      fileSizeLimit: `${MAX_IMAGE_SIZE}`,
    });

    if (error) {
      throw error;
    }
  }

  bucketReady = true;
}

export function validateStudioImageFile(file: File | null) {
  if (!file || file.size === 0) {
    return "missing";
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return "type";
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return "size";
  }

  return null;
}

export async function uploadStudioImageFile({
  file,
  studioId,
}: {
  file: File;
  studioId: string;
}) {
  await ensureStudioImagesBucket();

  const supabase = getSupabaseAdminClient();
  const path = `${sanitizePathPart(studioId)}/${Date.now()}-${randomUUID()}.${extensionForType(file.type)}`;
  const bytes = await file.arrayBuffer();

  const { error } = await supabase.storage.from(BUCKET_NAME).upload(path, bytes, {
    cacheControl: "31536000",
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);

  return {
    path,
    publicUrl: data.publicUrl,
  };
}

export async function deleteStudioImageFile(publicUrl: string) {
  const marker = `/storage/v1/object/public/${BUCKET_NAME}/`;
  const markerIndex = publicUrl.indexOf(marker);

  if (markerIndex === -1) {
    return;
  }

  const rawPath = publicUrl.slice(markerIndex + marker.length);
  const path = decodeURIComponent(rawPath.split("?")[0] || "");

  if (!path) {
    return;
  }

  const supabase = getSupabaseAdminClient();
  await supabase.storage.from(BUCKET_NAME).remove([path]);
}
