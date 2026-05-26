import "server-only";

import { compare, hash } from "bcryptjs";
import { prisma, isDatabaseConfigured } from "@/lib/prisma";
import {
  claimRequestSchema,
  inquirySchema,
  submitStudioSchema,
  studioViewSchema,
} from "@/lib/validators";
import { slugify } from "@/lib/slug";

async function createUniqueStudioSlug(name: string) {
  const baseSlug = slugify(name);
  let slug = baseSlug;
  let suffix = 2;

  while (await prisma.detailingStudio.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

export async function createInquiry(input: unknown) {
  const data = inquirySchema.parse(input);

  if (!isDatabaseConfigured()) {
    return { id: "demo-inquiry", persisted: false };
  }

  const inquiry = await prisma.inquiry.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      studioId: data.studioId,
      serviceId: data.serviceId,
    },
  });

  return { id: inquiry.id, persisted: true };
}

export async function createClaimRequest(input: unknown) {
  const data = claimRequestSchema.parse(input);

  if (!isDatabaseConfigured()) {
    return { id: "demo-claim-request", persisted: false };
  }

  const claim = await prisma.claimRequest.create({
    data: {
      ownerName: data.ownerName,
      email: data.email,
      phone: data.phone,
      message: data.message,
      studioId: data.studioId,
    },
  });

  return { id: claim.id, persisted: true };
}

export async function createSubmittedStudio(input: unknown) {
  const data = submitStudioSchema.parse({
    ...Object.fromEntries(
      Object.entries(input as Record<string, unknown>).filter(
        ([key]) => key !== "serviceIds",
      ),
    ),
    serviceIds: Array.isArray((input as Record<string, unknown>).serviceIds)
      ? (input as Record<string, unknown>).serviceIds
      : [(input as Record<string, unknown>).serviceIds].filter(Boolean),
  });

  if (data.websiteTrap) {
    return { status: "spam" as const, persisted: false };
  }

  if (!isDatabaseConfigured()) {
    return { status: "database-missing" as const, persisted: false };
  }

  const ownerEmail = data.ownerEmail.trim().toLowerCase();
  const existingUser = await prisma.user.findUnique({
    where: { email: ownerEmail },
  });

  if (existingUser?.role === "ADMIN") {
    return { status: "email-role-conflict" as const, persisted: false };
  }

  if (existingUser && !(await compare(data.password, existingUser.passwordHash))) {
    return { status: "invalid-password" as const, persisted: false };
  }

  const slug = await createUniqueStudioSlug(data.studioName);

  const result = await prisma.$transaction(async (tx) => {
    const owner = existingUser
      ? await tx.user.update({
          where: { id: existingUser.id },
          data: { name: data.ownerName },
        })
      : await tx.user.create({
          data: {
            email: ownerEmail,
            name: data.ownerName,
            passwordHash: await hash(data.password, 10),
            role: "OWNER",
          },
        });

    const studio = await tx.detailingStudio.create({
      data: {
        name: data.studioName,
        slug,
        cityId: data.cityId,
        municipality: data.municipality,
        address: data.address,
        phone: data.phone,
        email: data.email,
        website: data.website,
        instagram: data.instagram,
        whatsapp: data.whatsapp,
        type: data.type,
        shortDescription: data.shortDescription,
        description: data.description,
        status: "PENDING_REVIEW",
        isActive: false,
        ownerId: owner.id,
        sourceNote: "Profil je poslao vlasnik i čeka admin proveru.",
        services: {
          create: data.serviceIds.map((serviceId) => ({ serviceId })),
        },
      },
    });

    return { owner, studio };
  });

  return {
    status: "created" as const,
    persisted: true,
    ownerEmail: result.owner.email,
    studioId: result.studio.id,
    studioSlug: result.studio.slug,
  };
}

export async function createStudioView(
  input: unknown,
  meta: {
    viewerHash?: string;
    referrer?: string | null;
    userAgent?: string | null;
  },
) {
  const data = studioViewSchema.parse(input);

  if (!isDatabaseConfigured()) {
    return { id: "demo-studio-view", persisted: false };
  }

  const studio = await prisma.detailingStudio.findFirst({
    where: {
      id: data.studioId,
      isActive: true,
      status: { not: "HIDDEN" },
    },
    select: { id: true },
  });

  if (!studio) {
    return { id: null, persisted: false };
  }

  const view = await prisma.studioView.create({
    data: {
      studioId: studio.id,
      viewerHash: meta.viewerHash,
      referrer: meta.referrer?.slice(0, 500),
      userAgent: meta.userAgent?.slice(0, 500),
      pathname: data.pathname,
    },
  });

  return { id: view.id, persisted: true };
}
