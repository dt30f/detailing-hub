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

export const approveClaimSchema = z.object({
  claimId: z.string().min(1),
  password: z.string().min(8, "Privremena lozinka mora imati bar 8 karaktera"),
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
  url: optionalUrl,
  alt: optionalString,
  type: z.enum(["GENERAL", "BEFORE_AFTER", "WORKSHOP", "EXTERIOR"]),
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
  status: z.enum(["UNCLAIMED", "CLAIMED", "VERIFIED", "HIDDEN"]),
  sourceNote: optionalString,
  isFeatured: z.boolean(),
  isPremium: z.boolean(),
  isActive: z.boolean(),
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
