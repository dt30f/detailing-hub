import "server-only";

import { prisma, isDatabaseConfigured } from "@/lib/prisma";
import {
  claimRequestSchema,
  inquirySchema,
  studioViewSchema,
} from "@/lib/validators";

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
