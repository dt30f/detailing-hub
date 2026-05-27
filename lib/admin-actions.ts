"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hash } from "bcryptjs";
import { prisma, isDatabaseConfigured } from "@/lib/prisma";
import {
  adminOwnerIdSchema,
  adminOwnerPasswordSchema,
  adminOwnerStudioSchema,
  adminOwnerUpdateSchema,
  adminStudioImageSchema,
  adminStudioIdSchema,
  approveClaimSchema,
  claimIdSchema,
  cityFormSchema,
  serviceFormSchema,
  studioFormSchema,
} from "@/lib/validators";
import type { ClaimStatus, InquiryStatus } from "@/lib/types";
import {
  clearAdminSession,
  createAdminSession,
  requireAdmin,
  verifyAdminCredentials,
} from "@/lib/auth";
import { slugify } from "@/lib/slug";
import { deleteStudioImageFile } from "@/lib/supabase-storage";

function getBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

function isPublicStudioStatus(status: string) {
  return status === "UNCLAIMED" || status === "CLAIMED" || status === "VERIFIED";
}

function studioPayload(formData: FormData) {
  return studioFormSchema.parse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    shortDescription: formData.get("shortDescription"),
    description: formData.get("description"),
    cityId: formData.get("cityId"),
    municipality: formData.get("municipality"),
    address: formData.get("address"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    website: formData.get("website"),
    instagram: formData.get("instagram"),
    whatsapp: formData.get("whatsapp"),
    type: formData.get("type") || "STUDIO",
    status: formData.get("status") || "UNCLAIMED",
    sourceNote: formData.get("sourceNote"),
    isFeatured: getBoolean(formData, "isFeatured"),
    isPremium: getBoolean(formData, "isPremium"),
    serviceIds: formData.getAll("serviceIds").map(String),
  });
}

function requireDatabase(redirectTo: string) {
  if (!isDatabaseConfigured()) {
    redirect(`${redirectTo}?database=missing`);
  }
}

async function requireOwnerAccount(ownerId: string) {
  const owner = await prisma.user.findFirst({
    where: { id: ownerId, role: "OWNER" },
    select: { id: true },
  });

  if (!owner) {
    redirect("/admin/owners?missing=1");
  }

  return owner;
}

function revalidatePublicDirectory() {
  revalidatePath("/");
  revalidatePath("/studiji");
}

export async function loginAdminAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const verifiedEmail = await verifyAdminCredentials(email, password);

  if (!verifiedEmail) {
    redirect("/admin/login?error=1");
  }

  await createAdminSession(verifiedEmail);
  redirect("/admin");
}

export async function logoutAdminAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function createStudioAction(formData: FormData) {
  await requireAdmin();
  requireDatabase("/admin/studios");

  const data = studioPayload(formData);
  const slug = data.slug || slugify(data.name);

  const studio = await prisma.detailingStudio.create({
    data: {
      name: data.name,
      slug,
      shortDescription: data.shortDescription,
      description: data.description,
      cityId: data.cityId,
      municipality: data.municipality,
      address: data.address,
      phone: data.phone,
      email: data.email,
      website: data.website,
      instagram: data.instagram,
      whatsapp: data.whatsapp,
      type: data.type,
      status: data.status,
      sourceNote:
        data.sourceNote ||
        "Profil je napravljen na osnovu javno dostupnih informacija.",
      isFeatured: data.isFeatured,
      isPremium: data.isPremium,
      isActive: isPublicStudioStatus(data.status),
      services: {
        create: data.serviceIds.map((serviceId) => ({ serviceId })),
      },
    },
  });

  revalidatePublicDirectory();
  revalidatePath("/admin/studios");
  redirect(`/admin/studios/${studio.id}`);
}

export async function updateStudioAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  requireDatabase(`/admin/studios/${id}`);

  const data = studioPayload(formData);
  const slug = data.slug || slugify(data.name);

  await prisma.$transaction([
    prisma.studioService.deleteMany({ where: { studioId: id } }),
    prisma.detailingStudio.update({
      where: { id },
      data: {
        name: data.name,
        slug,
        shortDescription: data.shortDescription,
        description: data.description,
        cityId: data.cityId,
        municipality: data.municipality,
        address: data.address,
        phone: data.phone,
        email: data.email,
        website: data.website,
        instagram: data.instagram,
        whatsapp: data.whatsapp,
        type: data.type,
        status: data.status,
        sourceNote: data.sourceNote,
        isFeatured: data.isFeatured,
        isPremium: data.isPremium,
        isActive: isPublicStudioStatus(data.status),
      },
    }),
  ]);

  if (data.serviceIds.length > 0) {
    await prisma.studioService.createMany({
      data: data.serviceIds.map((serviceId) => ({ studioId: id, serviceId })),
      skipDuplicates: true,
    });
  }

  revalidatePublicDirectory();
  revalidatePath(`/admin/studios/${id}`);
  redirect(`/admin/studios/${id}?saved=1`);
}

export async function createServiceAction(formData: FormData) {
  await requireAdmin();
  requireDatabase("/admin/services");

  const data = serviceFormSchema.parse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    category: formData.get("category"),
    description: formData.get("description"),
  });

  await prisma.service.create({
    data: {
      name: data.name,
      slug: data.slug || slugify(data.name),
      category: data.category,
      description: data.description,
    },
  });

  revalidatePath("/admin/services");
  revalidatePublicDirectory();
  redirect("/admin/services?saved=1");
}

export async function createCityAction(formData: FormData) {
  await requireAdmin();
  requireDatabase("/admin/cities");

  const data = cityFormSchema.parse({
    name: formData.get("name"),
    slug: formData.get("slug"),
  });

  await prisma.city.create({
    data: {
      name: data.name,
      slug: data.slug || slugify(data.name),
    },
  });

  revalidatePath("/admin/cities");
  revalidatePublicDirectory();
  redirect("/admin/cities?saved=1");
}

export async function updateInquiryStatusAction(formData: FormData) {
  await requireAdmin();
  requireDatabase("/admin/inquiries");

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "NEW") as InquiryStatus;

  await prisma.inquiry.update({ where: { id }, data: { status } });

  revalidatePath("/admin/inquiries");
  redirect("/admin/inquiries?saved=1");
}

export async function updateClaimStatusAction(formData: FormData) {
  await requireAdmin();
  requireDatabase("/admin/claims");

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "PENDING") as ClaimStatus;

  await prisma.claimRequest.update({ where: { id }, data: { status } });

  revalidatePath("/admin/claims");
  redirect("/admin/claims?saved=1");
}

export async function approveClaimAndCreateOwnerAction(formData: FormData) {
  await requireAdmin();
  requireDatabase("/admin/claims");

  const data = approveClaimSchema.parse({
    claimId: formData.get("claimId"),
    password: formData.get("password"),
  });

  const claim = await prisma.claimRequest.findUnique({
    where: { id: data.claimId },
    include: { studio: true },
  });

  if (!claim) {
    redirect("/admin/claims?missing=1");
  }

  const normalizedEmail = claim.email.trim().toLowerCase();
  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser && existingUser.role !== "OWNER") {
    redirect("/admin/claims?role=invalid");
  }

  if (!existingUser && (!data.password || data.password.length < 8)) {
    redirect("/admin/claims?password=missing");
  }

  const passwordHash = data.password ? await hash(data.password, 10) : null;

  await prisma.$transaction(async (tx) => {
    const owner = existingUser
      ? await tx.user.update({
          where: { id: existingUser.id },
          data: {
            name: claim.ownerName,
            ...(passwordHash ? { passwordHash } : {}),
          },
        })
      : await tx.user.create({
          data: {
            email: normalizedEmail,
            name: claim.ownerName,
            passwordHash: passwordHash!,
            role: "OWNER",
          },
        });

    await tx.detailingStudio.update({
      where: { id: claim.studioId },
      data: {
        ownerId: owner.id,
        status: claim.studio.status === "VERIFIED" ? "VERIFIED" : "CLAIMED",
        isActive: true,
        sourceNote:
          claim.studio.status === "VERIFIED"
            ? "Profil je verifikovan i podaci su potvrđeni."
            : "Profil je preuzeo vlasnik i podaci su ažurirani iz studio panela.",
      },
    });

    await tx.claimRequest.update({
      where: { id: claim.id },
      data: { status: "APPROVED" },
    });
  });

  revalidatePath("/admin/claims");
  revalidatePath("/admin/studios");
  revalidatePath(`/admin/studios/${claim.studioId}`);
  revalidatePublicDirectory();
  revalidatePath(`/studiji/${claim.studio.slug}`);
  redirect("/admin/claims?approved=1");
}

export async function cancelClaimRequestAction(formData: FormData) {
  await requireAdmin();
  requireDatabase("/admin/claims");

  const data = claimIdSchema.parse({
    claimId: formData.get("claimId"),
  });

  await prisma.claimRequest.delete({ where: { id: data.claimId } });

  revalidatePath("/admin/claims");
  redirect("/admin/claims?cancelled=1");
}

export async function updateOwnerAccountAction(formData: FormData) {
  await requireAdmin();
  requireDatabase("/admin/owners");

  const data = adminOwnerUpdateSchema.parse({
    ownerId: formData.get("ownerId"),
    name: formData.get("name"),
    email: formData.get("email"),
  });
  await requireOwnerAccount(data.ownerId);

  await prisma.user.update({
    where: { id: data.ownerId },
    data: {
      name: data.name,
      email: data.email.trim().toLowerCase(),
    },
  });

  revalidatePath("/admin/owners");
  redirect("/admin/owners?updated=1");
}

export async function resetOwnerPasswordAction(formData: FormData) {
  await requireAdmin();
  requireDatabase("/admin/owners");

  const data = adminOwnerPasswordSchema.parse({
    ownerId: formData.get("ownerId"),
    password: formData.get("password"),
  });
  await requireOwnerAccount(data.ownerId);

  await prisma.user.update({
    where: { id: data.ownerId },
    data: { passwordHash: await hash(data.password, 10) },
  });

  revalidatePath("/admin/owners");
  redirect("/admin/owners?reset=1");
}

export async function unlinkOwnerStudioAction(formData: FormData) {
  await requireAdmin();
  requireDatabase("/admin/owners");

  const data = adminOwnerStudioSchema.parse({
    ownerId: formData.get("ownerId"),
    studioId: formData.get("studioId"),
  });

  await prisma.detailingStudio.updateMany({
    where: { id: data.studioId, ownerId: data.ownerId },
    data: {
      ownerId: null,
      status: "UNCLAIMED",
      isActive: true,
      sourceNote:
        "Profil je napravljen na osnovu javno dostupnih informacija.",
    },
  });

  revalidatePath("/admin/owners");
  revalidatePath("/admin/studios");
  revalidatePath(`/admin/studios/${data.studioId}`);
  revalidatePublicDirectory();
  redirect("/admin/owners?unlinked=1");
}

export async function deleteOwnerAccountAction(formData: FormData) {
  await requireAdmin();
  requireDatabase("/admin/owners");

  const data = adminOwnerIdSchema.parse({
    ownerId: formData.get("ownerId"),
  });
  await requireOwnerAccount(data.ownerId);

  const connectedStudios = await prisma.detailingStudio.count({
    where: { ownerId: data.ownerId },
  });

  if (connectedStudios > 0) {
    redirect("/admin/owners?connected=1");
  }

  await prisma.user.delete({
    where: { id: data.ownerId },
  });

  revalidatePath("/admin/owners");
  redirect("/admin/owners?deleted=1");
}

export async function approvePendingStudioAction(formData: FormData) {
  await requireAdmin();
  requireDatabase("/admin/studios");

  const data = adminStudioIdSchema.parse({
    studioId: formData.get("studioId"),
  });

  const studio = await prisma.detailingStudio.update({
    where: { id: data.studioId },
    data: {
      status: "CLAIMED",
      isActive: true,
      sourceNote: "Profil je poslao vlasnik i odobren je od strane admina.",
    },
  });

  revalidatePath("/admin/studios");
  revalidatePath(`/admin/studios/${studio.id}`);
  revalidatePublicDirectory();
  revalidatePath(`/studiji/${studio.slug}`);
  redirect("/admin/studios?approved=1");
}

export async function rejectPendingStudioAction(formData: FormData) {
  await requireAdmin();
  requireDatabase("/admin/studios");

  const data = adminStudioIdSchema.parse({
    studioId: formData.get("studioId"),
  });

  const studio = await prisma.detailingStudio.update({
    where: { id: data.studioId },
    data: {
      status: "HIDDEN",
      isActive: false,
      sourceNote: "Profil je poslao vlasnik, ali nije odobren za javni prikaz.",
    },
  });

  revalidatePath("/admin/studios");
  revalidatePath(`/admin/studios/${studio.id}`);
  revalidatePublicDirectory();
  revalidatePath(`/studiji/${studio.slug}`);
  redirect("/admin/studios?rejected=1");
}

export async function deleteStudioAction(formData: FormData) {
  await requireAdmin();
  requireDatabase("/admin/studios");

  const data = adminStudioIdSchema.parse({
    studioId: formData.get("studioId"),
  });

  const studio = await prisma.detailingStudio.findUnique({
    where: { id: data.studioId },
    select: {
      slug: true,
      images: { select: { url: true } },
    },
  });

  if (!studio) {
    redirect("/admin/studios?missing=1");
  }

  for (const image of studio.images) {
    try {
      await deleteStudioImageFile(image.url);
    } catch (error) {
      console.warn("Studio image file delete failed", error);
    }
  }

  await prisma.$transaction([
    prisma.subscription.deleteMany({ where: { studioId: data.studioId } }),
    prisma.detailingStudio.delete({ where: { id: data.studioId } }),
  ]);

  revalidatePath("/admin/studios");
  revalidatePath("/admin/owners");
  revalidatePath("/admin/analytics");
  revalidatePublicDirectory();
  revalidatePath(`/studiji/${studio.slug}`);
  redirect("/admin/studios?deleted=1");
}

export async function deleteAdminStudioImageAction(formData: FormData) {
  await requireAdmin();
  requireDatabase("/admin/studios");

  const data = adminStudioImageSchema.parse({
    studioId: formData.get("studioId"),
    imageId: formData.get("imageId"),
  });
  const image = await prisma.studioImage.findFirst({
    where: { id: data.imageId, studioId: data.studioId },
    include: { studio: { select: { slug: true } } },
  });

  await prisma.studioImage.deleteMany({
    where: { id: data.imageId, studioId: data.studioId },
  });

  if (image?.url) {
    await deleteStudioImageFile(image.url);
  }

  revalidatePath("/admin/studios");
  revalidatePath(`/admin/studios/${data.studioId}`);
  revalidatePublicDirectory();

  if (image?.studio.slug) {
    revalidatePath(`/studiji/${image.studio.slug}`);
  }

  redirect(`/admin/studios/${data.studioId}?imageDeleted=1`);
}
