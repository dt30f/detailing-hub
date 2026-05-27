import { z } from "zod";

const optionalString = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : undefined))
  .optional();

const optionalUrl = optionalString.refine(
  (value) => !value || value.startsWith("http://") || value.startsWith("https://"),
  "URL mora početi sa http:// ili https://",
);

export const inquirySchema = z
  .object({
    name: z.string().trim().min(2, "Ime je obavezno"),
    email: optionalString,
    phone: optionalString,
    message: z.string().trim().min(10, "Poruka mora imati bar 10 karaktera"),
    studioId: z.string().min(1),
    serviceId: optionalString,
    website: optionalString,
  })
  .refine((data) => data.email || data.phone, {
    message: "Unesite telefon ili email",
    path: ["email"],
  })
  .refine((data) => !data.website, {
    message: "Spam detektovan",
    path: ["website"],
  });

export const claimRequestSchema = z
  .object({
    ownerName: z.string().trim().min(2, "Ime vlasnika je obavezno"),
    email: z.string().trim().email("Email nije validan"),
    phone: optionalString,
    message: optionalString,
    studioId: z.string().min(1),
    website: optionalString,
  })
  .refine((data) => !data.website, {
    message: "Spam detektovan",
    path: ["website"],
  });

export const ownerLoginSchema = z.object({
  email: z.string().trim().email("Email nije validan"),
  password: z.string().min(8, "Lozinka mora imati bar 8 karaktera"),
});

export const ownerPasswordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Trenutna lozinka je obavezna"),
    newPassword: z.string().min(8, "Nova lozinka mora imati bar 8 karaktera"),
    confirmPassword: z.string().min(8, "Potvrdite novu lozinku"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Nove lozinke se ne poklapaju",
    path: ["confirmPassword"],
  });

export const approveClaimSchema = z.object({
  claimId: z.string().min(1),
  password: optionalString,
});

export const claimIdSchema = z.object({
  claimId: z.string().min(1),
});

export const adminOwnerUpdateSchema = z.object({
  ownerId: z.string().min(1),
  name: optionalString,
  email: z.string().trim().email("Email nije validan"),
});

export const adminOwnerPasswordSchema = z.object({
  ownerId: z.string().min(1),
  password: z.string().min(8, "Lozinka mora imati bar 8 karaktera"),
});

export const adminOwnerIdSchema = z.object({
  ownerId: z.string().min(1),
});

export const adminOwnerStudioSchema = z.object({
  ownerId: z.string().min(1),
  studioId: z.string().min(1),
});

export const adminStudioIdSchema = z.object({
  studioId: z.string().min(1),
});

export const adminStudioImageSchema = z.object({
  studioId: z.string().min(1),
  imageId: z.string().min(1),
});

export const studioViewSchema = z.object({
  studioId: z.string().min(1),
  pathname: optionalString,
});

export const ownerStudioProfileSchema = z.object({
  studioId: z.string().min(1),
  shortDescription: optionalString,
  description: optionalString,
  municipality: optionalString,
  address: optionalString,
  phone: optionalString,
  email: optionalString,
  website: optionalUrl,
  instagram: optionalUrl,
  whatsapp: optionalString,
  type: z.enum(["STUDIO", "MOBILE", "BOTH"]),
});

export const ownerStudioServicesSchema = z.object({
  studioId: z.string().min(1),
  serviceIds: z.array(z.string()),
  priceFrom: z.record(z.string(), optionalString),
  priceTo: z.record(z.string(), optionalString),
  durationMin: z.record(z.string(), optionalString),
  description: z.record(z.string(), optionalString),
});

export const ownerStudioImageSchema = z.object({
  studioId: z.string().min(1),
  alt: optionalString,
  type: z.enum(["GENERAL", "BEFORE_AFTER", "WORKSHOP", "EXTERIOR"]),
});

export const submitStudioSchema = z.object({
  studioName: z.string().trim().min(2, "Naziv studija je obavezan"),
  cityId: z.string().min(1, "Grad je obavezan"),
  municipality: optionalString,
  address: optionalString,
  phone: optionalString,
  email: optionalString,
  website: optionalUrl,
  instagram: optionalUrl,
  whatsapp: optionalString,
  type: z.enum(["STUDIO", "MOBILE", "BOTH"]),
  shortDescription: optionalString,
  description: optionalString,
  serviceIds: z.array(z.string()).min(1, "Izaberite bar jednu uslugu"),
  ownerName: z.string().trim().min(2, "Ime vlasnika je obavezno"),
  ownerEmail: z.string().trim().email("Owner email nije validan"),
  password: z.string().min(8, "Lozinka mora imati bar 8 karaktera"),
  websiteTrap: optionalString,
});

export const studioFormSchema = z.object({
  name: z.string().trim().min(2),
  slug: optionalString,
  shortDescription: optionalString,
  description: optionalString,
  cityId: z.string().min(1),
  municipality: optionalString,
  address: optionalString,
  phone: optionalString,
  email: optionalString,
  website: optionalUrl,
  instagram: optionalUrl,
  whatsapp: optionalString,
  type: z.enum(["STUDIO", "MOBILE", "BOTH"]),
  status: z.enum([
    "UNCLAIMED",
    "PENDING_REVIEW",
    "CLAIMED",
    "VERIFIED",
    "HIDDEN",
  ]),
  sourceNote: optionalString,
  isFeatured: z.boolean(),
  isPremium: z.boolean(),
  serviceIds: z.array(z.string()),
});

export const serviceFormSchema = z.object({
  name: z.string().trim().min(2),
  slug: optionalString,
  category: optionalString,
  description: optionalString,
});

export const cityFormSchema = z.object({
  name: z.string().trim().min(2),
  slug: optionalString,
});
