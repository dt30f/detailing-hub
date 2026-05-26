export type StudioStatus =
  | "UNCLAIMED"
  | "PENDING_REVIEW"
  | "CLAIMED"
  | "VERIFIED"
  | "HIDDEN";
export type StudioType = "STUDIO" | "MOBILE" | "BOTH";
export type ImageType =
  | "GENERAL"
  | "BEFORE_AFTER"
  | "WORKSHOP"
  | "EXTERIOR"
  | "PLACEHOLDER";
export type InquiryStatus = "NEW" | "CONTACTED" | "CLOSED" | "SPAM";
export type ClaimStatus = "PENDING" | "APPROVED" | "REJECTED";

export type PublicCity = {
  id: string;
  name: string;
  slug: string;
};

export type PublicService = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  category?: string | null;
};

export type PublicStudioService = {
  id: string;
  priceFrom?: number | null;
  priceTo?: number | null;
  durationMin?: number | null;
  description?: string | null;
  service: PublicService;
};

export type PublicStudioImage = {
  id: string;
  url: string;
  alt?: string | null;
  type: ImageType;
};

export type PublicStudio = {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string | null;
  description?: string | null;
  city: PublicCity;
  cityId: string;
  address?: string | null;
  municipality?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  instagram?: string | null;
  whatsapp?: string | null;
  workingHours?: unknown;
  type: StudioType;
  status: StudioStatus;
  sourceNote?: string | null;
  isFeatured: boolean;
  isPremium: boolean;
  isActive: boolean;
  services: PublicStudioService[];
  images: PublicStudioImage[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type PublicInquiry = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  message: string;
  status: InquiryStatus;
  createdAt: Date | string;
  studio: Pick<PublicStudio, "id" | "name" | "slug">;
  service?: PublicService | null;
};

export type PublicClaimRequest = {
  id: string;
  ownerName: string;
  email: string;
  phone?: string | null;
  message?: string | null;
  status: ClaimStatus;
  createdAt: Date | string;
  studio: Pick<PublicStudio, "id" | "name" | "slug"> & {
    owner?: Pick<PublicOwnerAccount, "id" | "email" | "name"> | null;
  };
  ownerUser?: Pick<PublicOwnerAccount, "id" | "email" | "name"> | null;
};

export type PublicOwnerAccount = {
  id: string;
  email: string;
  name?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  ownedStudios: Array<
    Pick<PublicStudio, "id" | "name" | "slug" | "status"> & {
      city: PublicCity;
    }
  >;
};
