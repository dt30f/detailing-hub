"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma, isDatabaseConfigured } from "@/lib/prisma";
import {
  clearOwnerSession,
  createOwnerSession,
  requireOwner,
  verifyOwnerCredentials,
} from "@/lib/auth";
import {
  ownerLoginSchema,
  ownerStudioImageSchema,
  ownerStudioProfileSchema,
  ownerStudioServicesSchema,
} from "@/lib/validators";
import type { ImageType } from "@/lib/types";
import {
  deleteStudioImageFile,
  uploadStudioImageFile,
  validateStudioImageFile,
} from "@/lib/supabase-storage";

function requireDatabase(redirectTo: string) {
  if (!isDatabaseConfigured()) {
    redirect(`${redirectTo}?database=missing`);
  }
}

function toOptionalInt(value?: string) {
  if (!value) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

function revalidatePublicDirectory() {
  revalidatePath("/");
  revalidatePath("/studiji");
}

async function requireOwnedStudio(studioId: string, ownerId: string) {
  const studio = await prisma.detailingStudio.findFirst({
    where: { id: studioId, ownerId },
    select: { id: true, slug: true },
  });

  if (!studio) {
    redirect("/studio?forbidden=1");
  }

  return studio;
}

export async function loginOwnerAction(formData: FormData) {
  requireDatabase("/studio/login");

  const data = ownerLoginSchema.parse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  const verifiedEmail = await verifyOwnerCredentials(data.email, data.password);

  if (!verifiedEmail) {
    redirect("/studio/login?error=1");
  }

  await createOwnerSession(verifiedEmail);
  redirect("/studio");
}

export async function logoutOwnerAction() {
  await clearOwnerSession();
  redirect("/studio/login");
}

export async function updateOwnerStudioProfileAction(formData: FormData) {
  const session = await requireOwner();
  requireDatabase("/studio/profil");

  const data = ownerStudioProfileSchema.parse({
    studioId: formData.get("studioId"),
    shortDescription: formData.get("shortDescription"),
    description: formData.get("description"),
    municipality: formData.get("municipality"),
    address: formData.get("address"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    website: formData.get("website"),
    instagram: formData.get("instagram"),
    whatsapp: formData.get("whatsapp"),
    type: formData.get("type") || "STUDIO",
  });

  const studio = await requireOwnedStudio(data.studioId, session.id);

  await prisma.detailingStudio.update({
    where: { id: data.studioId },
    data: {
      shortDescription: data.shortDescription,
      description: data.description,
      municipality: data.municipality,
      address: data.address,
      phone: data.phone,
      email: data.email,
      website: data.website,
      instagram: data.instagram,
      whatsapp: data.whatsapp,
      type: data.type,
    },
  });

  revalidatePath("/studio");
  revalidatePath("/studio/profil");
  revalidatePublicDirectory();
  revalidatePath(`/studiji/${studio.slug}`);
  redirect(`/studio/profil?studioId=${data.studioId}&saved=1`);
}

export async function updateOwnerStudioServicesAction(formData: FormData) {
  const session = await requireOwner();
  requireDatabase("/studio/usluge");

  const serviceIds = formData.getAll("serviceIds").map(String);
  const keyedValues = (prefix: string) =>
    Object.fromEntries(
      serviceIds.map((serviceId) => [
        serviceId,
        String(formData.get(`${prefix}-${serviceId}`) ?? ""),
      ]),
    );

  const data = ownerStudioServicesSchema.parse({
    studioId: formData.get("studioId"),
    serviceIds,
    priceFrom: keyedValues("priceFrom"),
    priceTo: keyedValues("priceTo"),
    durationMin: keyedValues("durationMin"),
    description: keyedValues("description"),
  });

  const studio = await requireOwnedStudio(data.studioId, session.id);

  await prisma.$transaction([
    prisma.studioService.deleteMany({ where: { studioId: data.studioId } }),
    ...data.serviceIds.map((serviceId) =>
      prisma.studioService.create({
        data: {
          studioId: data.studioId,
          serviceId,
          priceFrom: toOptionalInt(data.priceFrom[serviceId]),
          priceTo: toOptionalInt(data.priceTo[serviceId]),
          durationMin: toOptionalInt(data.durationMin[serviceId]),
          description: data.description[serviceId],
        },
      }),
    ),
  ]);

  revalidatePath("/studio");
  revalidatePath("/studio/usluge");
  revalidatePublicDirectory();
  revalidatePath(`/studiji/${studio.slug}`);
  redirect(`/studio/usluge?studioId=${data.studioId}&saved=1`);
}

export async function addOwnerStudioImageAction(formData: FormData) {
  const session = await requireOwner();
  requireDatabase("/studio/slike");

  const data = ownerStudioImageSchema.parse({
    studioId: formData.get("studioId"),
    alt: formData.get("alt"),
    type: formData.get("type") || "GENERAL",
  });
  const image = formData.get("image");
  const file = image instanceof File ? image : null;
  const fileError = validateStudioImageFile(file);

  if (fileError) {
    redirect(`/studio/slike?studioId=${data.studioId}&image=${fileError}`);
  }

  const studio = await requireOwnedStudio(data.studioId, session.id);
  let upload;

  try {
    upload = await uploadStudioImageFile({
      file: file!,
      studioId: data.studioId,
    });
  } catch (error) {
    console.error("Studio image upload failed.", error);
    redirect(`/studio/slike?studioId=${data.studioId}&image=storage`);
  }

  await prisma.studioImage.create({
    data: {
      studioId: data.studioId,
      url: upload.publicUrl,
      alt: data.alt,
      type: data.type as ImageType,
    },
  });

  revalidatePath("/studio");
  revalidatePath("/studio/slike");
  revalidatePublicDirectory();
  revalidatePath(`/studiji/${studio.slug}`);
  redirect(`/studio/slike?studioId=${data.studioId}&saved=1`);
}

export async function deleteOwnerStudioImageAction(formData: FormData) {
  const session = await requireOwner();
  requireDatabase("/studio/slike");

  const studioId = String(formData.get("studioId") ?? "");
  const imageId = String(formData.get("imageId") ?? "");
  const studio = await requireOwnedStudio(studioId, session.id);
  const image = await prisma.studioImage.findFirst({
    where: {
      id: imageId,
      studioId,
      studio: { ownerId: session.id },
    },
  });

  await prisma.studioImage.deleteMany({
    where: {
      id: imageId,
      studioId,
      studio: { ownerId: session.id },
    },
  });

  if (image?.url) {
    await deleteStudioImageFile(image.url);
  }

  revalidatePath("/studio");
  revalidatePath("/studio/slike");
  revalidatePublicDirectory();
  revalidatePath(`/studiji/${studio.slug}`);
  redirect(`/studio/slike?studioId=${studioId}&deleted=1`);
}
