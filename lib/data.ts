import { cache } from "react";
import type { Prisma } from "@/lib/generated/prisma/client";
import { prisma, isDatabaseConfigured } from "@/lib/prisma";
import { sampleCities, sampleServices, sampleStudios } from "@/lib/sample-data";
import type {
  PublicCity,
  PublicClaimRequest,
  PublicInquiry,
  PublicService,
  PublicStudio,
  PublicStudioImage,
  PublicStudioService,
  StudioType,
  StudioStatus,
} from "@/lib/types";

export type StudioFilters = {
  city?: string;
  service?: string;
  q?: string;
  type?: StudioType | "";
  includeHidden?: boolean;
};

export type CityServiceLandingPage = {
  city: PublicCity;
  service: PublicService;
  studioCount: number;
};

export type StudioViewSummary = {
  studioId: string;
  total: number;
  last7Days: number;
};

export type StudioAnalyticsRow = {
  studioId: string;
  name: string;
  slug: string;
  city: PublicCity;
  status: StudioStatus;
  totalViews: number;
  viewsLast7Days: number;
  viewsLast30Days: number;
  lastViewedAt?: Date | null;
};

type StudioRecord = Omit<PublicStudio, "services" | "images"> & {
  services?: PublicStudioService[];
  images?: PublicStudioImage[];
};

function mapStudio(studio: StudioRecord): PublicStudio {
  return {
    id: studio.id,
    name: studio.name,
    slug: studio.slug,
    shortDescription: studio.shortDescription,
    description: studio.description,
    cityId: studio.cityId,
    city: studio.city,
    address: studio.address,
    municipality: studio.municipality,
    latitude: studio.latitude,
    longitude: studio.longitude,
    phone: studio.phone,
    email: studio.email,
    website: studio.website,
    instagram: studio.instagram,
    whatsapp: studio.whatsapp,
    workingHours: studio.workingHours,
    type: studio.type,
    status: studio.status,
    sourceNote: studio.sourceNote,
    isFeatured: studio.isFeatured,
    isPremium: studio.isPremium,
    isActive: studio.isActive,
    services: (studio.services ?? []).map((item) => ({
      id: item.id,
      priceFrom: item.priceFrom,
      priceTo: item.priceTo,
      durationMin: item.durationMin,
      description: item.description,
      service: item.service,
    })),
    images: studio.images ?? [],
    createdAt: studio.createdAt,
    updatedAt: studio.updatedAt,
  };
}

function matchesType(studioType: StudioType, requested?: StudioType | "") {
  if (!requested) {
    return true;
  }

  if (requested === "BOTH") {
    return studioType === "BOTH";
  }

  return studioType === requested || studioType === "BOTH";
}

function filterSampleStudios(filters: StudioFilters = {}) {
  const query = filters.q?.trim().toLowerCase();

  return sampleStudios
    .filter((studio) => filters.includeHidden || studio.status !== "HIDDEN")
    .filter((studio) => filters.includeHidden || studio.isActive)
    .filter((studio) => !filters.city || studio.city.slug === filters.city)
    .filter(
      (studio) =>
        !filters.service ||
        studio.services.some((item) => item.service.slug === filters.service),
    )
    .filter((studio) => matchesType(studio.type, filters.type))
    .filter((studio) => {
      if (!query) {
        return true;
      }

      const haystack = [
        studio.name,
        studio.city.name,
        studio.municipality,
        ...studio.services.map((item) => item.service.name),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    })
    .sort((a, b) => {
      if (a.isFeatured !== b.isFeatured) {
        return Number(b.isFeatured) - Number(a.isFeatured);
      }

      if (a.isPremium !== b.isPremium) {
        return Number(b.isPremium) - Number(a.isPremium);
      }

      return a.name.localeCompare(b.name, "sr");
    });
}

async function withFallback<T>(query: () => Promise<T>, fallback: T) {
  if (!isDatabaseConfigured()) {
    return fallback;
  }

  try {
    return await query();
  } catch (error) {
    console.warn("Database query failed, using sample data fallback.", error);
    return fallback;
  }
}

const studioInclude = {
  city: true,
  images: true,
  services: {
    include: {
      service: true,
    },
    orderBy: {
      service: {
        name: "asc",
      },
    },
  },
} as const;

function typeWhere(
  type?: StudioType | "",
): Prisma.DetailingStudioWhereInput["type"] | undefined {
  if (!type) {
    return undefined;
  }

  if (type === "STUDIO") {
    return { in: ["STUDIO", "BOTH"] };
  }

  if (type === "MOBILE") {
    return { in: ["MOBILE", "BOTH"] };
  }

  return type;
}

export const getCities = cache(async (): Promise<PublicCity[]> => {
  return withFallback(
    () => prisma.city.findMany({ orderBy: { name: "asc" } }),
    sampleCities,
  );
});

export const getServices = cache(async (): Promise<PublicService[]> => {
  return withFallback(
    () => prisma.service.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] }),
    sampleServices,
  );
});

export const listStudios = cache(
  async (filters: StudioFilters = {}): Promise<PublicStudio[]> => {
    const fallback = filterSampleStudios(filters);

    return withFallback(async () => {
      const where: Prisma.DetailingStudioWhereInput = {};

      if (!filters.includeHidden) {
        where.isActive = true;
        where.status = { not: "HIDDEN" };
      }

      if (filters.city) {
        where.city = { slug: filters.city };
      }

      if (filters.service) {
        where.services = { some: { service: { slug: filters.service } } };
      }

      const resolvedType = typeWhere(filters.type);
      if (resolvedType) {
        where.type = resolvedType;
      }

      if (filters.q?.trim()) {
        where.OR = [
          { name: { contains: filters.q.trim(), mode: "insensitive" } },
          {
            shortDescription: {
              contains: filters.q.trim(),
              mode: "insensitive",
            },
          },
          {
            municipality: {
              contains: filters.q.trim(),
              mode: "insensitive",
            },
          },
        ];
      }

      const studios = await prisma.detailingStudio.findMany({
        where,
        include: studioInclude,
        orderBy: [
          { isFeatured: "desc" },
          { isPremium: "desc" },
          { updatedAt: "desc" },
        ],
      });

      return studios.map(mapStudio);
    }, fallback);
  },
);

export const getFeaturedStudios = cache(async () => {
  const studios = await listStudios();
  return studios.filter((studio) => studio.isFeatured || studio.isPremium).slice(0, 6);
});

function getViewsSinceDate(days = 7) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

export const getStudioViewSummaries = cache(
  async (): Promise<StudioViewSummary[]> => {
    return withFallback(async () => {
      const since = getViewsSinceDate();
      const [totalRows, recentRows] = await Promise.all([
        prisma.studioView.groupBy({
          by: ["studioId"],
          _count: { id: true },
        }),
        prisma.studioView.groupBy({
          by: ["studioId"],
          where: { createdAt: { gte: since } },
          _count: { id: true },
        }),
      ]);

      const summaries = new Map<string, StudioViewSummary>();

      for (const row of totalRows) {
        summaries.set(row.studioId, {
          studioId: row.studioId,
          total: row._count.id,
          last7Days: 0,
        });
      }

      for (const row of recentRows) {
        const existing = summaries.get(row.studioId);

        if (existing) {
          existing.last7Days = row._count.id;
        } else {
          summaries.set(row.studioId, {
            studioId: row.studioId,
            total: 0,
            last7Days: row._count.id,
          });
        }
      }

      return Array.from(summaries.values());
    }, []);
  },
);

export const getStudioAnalytics = cache(async (studioId: string) => {
  return withFallback(async () => {
    const since = getViewsSinceDate();
    const [totalViews, viewsLast7Days] = await Promise.all([
      prisma.studioView.count({ where: { studioId } }),
      prisma.studioView.count({
        where: {
          studioId,
          createdAt: { gte: since },
        },
      }),
    ]);

    return { totalViews, viewsLast7Days };
  }, { totalViews: 0, viewsLast7Days: 0 });
});

export const listStudioAnalyticsRows = cache(
  async (): Promise<StudioAnalyticsRow[]> => {
    return withFallback(async () => {
      const since7Days = getViewsSinceDate(7);
      const since30Days = getViewsSinceDate(30);
      const [totalRows, sevenDayRows, thirtyDayRows] = await Promise.all([
        prisma.studioView.groupBy({
          by: ["studioId"],
          _count: { id: true },
          _max: { createdAt: true },
        }),
        prisma.studioView.groupBy({
          by: ["studioId"],
          where: { createdAt: { gte: since7Days } },
          _count: { id: true },
        }),
        prisma.studioView.groupBy({
          by: ["studioId"],
          where: { createdAt: { gte: since30Days } },
          _count: { id: true },
        }),
      ]);

      const studioIds = totalRows.map((row) => row.studioId);

      if (studioIds.length === 0) {
        return [];
      }

      const studios = await prisma.detailingStudio.findMany({
        where: { id: { in: studioIds } },
        select: {
          id: true,
          name: true,
          slug: true,
          status: true,
          city: true,
        },
      });
      const studiosById = new Map(studios.map((studio) => [studio.id, studio]));
      const sevenDayViewsByStudioId = new Map(
        sevenDayRows.map((row) => [row.studioId, row._count.id]),
      );
      const thirtyDayViewsByStudioId = new Map(
        thirtyDayRows.map((row) => [row.studioId, row._count.id]),
      );

      const rows: StudioAnalyticsRow[] = [];

      for (const row of totalRows) {
        const studio = studiosById.get(row.studioId);

        if (!studio) {
          continue;
        }

        rows.push({
          studioId: studio.id,
          name: studio.name,
          slug: studio.slug,
          city: studio.city,
          status: studio.status,
          totalViews: row._count.id,
          viewsLast7Days: sevenDayViewsByStudioId.get(studio.id) ?? 0,
          viewsLast30Days: thirtyDayViewsByStudioId.get(studio.id) ?? 0,
          lastViewedAt: row._max.createdAt,
        });
      }

      return rows.sort((a, b) => {
          if (a.totalViews !== b.totalViews) {
            return b.totalViews - a.totalViews;
          }

          return (
            new Date(b.lastViewedAt || 0).getTime() -
            new Date(a.lastViewedAt || 0).getTime()
          );
        });
    }, []);
  },
);

export const listCityServiceLandingPages = cache(
  async (): Promise<CityServiceLandingPage[]> => {
    const studios = await listStudios();
    const landingPages = new Map<string, CityServiceLandingPage>();

    for (const studio of studios) {
      for (const studioService of studio.services) {
        const key = `${studio.city.slug}/${studioService.service.slug}`;
        const existing = landingPages.get(key);

        if (existing) {
          existing.studioCount += 1;
        } else {
          landingPages.set(key, {
            city: studio.city,
            service: studioService.service,
            studioCount: 1,
          });
        }
      }
    }

    return Array.from(landingPages.values()).sort((a, b) => {
      const cityCompare = a.city.name.localeCompare(b.city.name, "sr");

      if (cityCompare !== 0) {
        return cityCompare;
      }

      return a.service.name.localeCompare(b.service.name, "sr");
    });
  },
);

export const getStudioBySlug = cache(
  async (slug: string): Promise<PublicStudio | null> => {
    const fallback =
      sampleStudios.find(
        (studio) => studio.slug === slug && studio.status !== "HIDDEN",
      ) ?? null;

    return withFallback(async () => {
      const studio = await prisma.detailingStudio.findFirst({
        where: { slug, status: { not: "HIDDEN" }, isActive: true },
        include: studioInclude,
      });

      return studio ? mapStudio(studio) : null;
    }, fallback);
  },
);

export const getStudioById = cache(
  async (id: string): Promise<PublicStudio | null> => {
    const fallback = sampleStudios.find((studio) => studio.id === id) ?? null;

    return withFallback(async () => {
      const studio = await prisma.detailingStudio.findUnique({
        where: { id },
        include: studioInclude,
      });

      return studio ? mapStudio(studio) : null;
    }, fallback);
  },
);

export const getCityBySlug = cache(
  async (slug: string): Promise<PublicCity | null> => {
    const fallback = sampleCities.find((city) => city.slug === slug) ?? null;

    return withFallback(
      () => prisma.city.findUnique({ where: { slug } }),
      fallback,
    );
  },
);

export const getServiceBySlug = cache(
  async (slug: string): Promise<PublicService | null> => {
    const fallback =
      sampleServices.find((service) => service.slug === slug) ?? null;

    return withFallback(
      () => prisma.service.findUnique({ where: { slug } }),
      fallback,
    );
  },
);

export const getDashboardStats = cache(async () => {
  const fallback = {
    studios: sampleStudios.length,
    unclaimed: sampleStudios.filter((studio) => studio.status === "UNCLAIMED")
      .length,
    services: sampleServices.length,
    cities: sampleCities.length,
    inquiries: 0,
    claims: 0,
    profileViews: 0,
    profileViews7Days: 0,
  };

  return withFallback(async () => {
    const since = getViewsSinceDate();
    const [
      studios,
      unclaimed,
      services,
      cities,
      inquiries,
      claims,
      profileViews,
      profileViews7Days,
    ] =
      await Promise.all([
        prisma.detailingStudio.count(),
        prisma.detailingStudio.count({ where: { status: "UNCLAIMED" } }),
        prisma.service.count(),
        prisma.city.count(),
        prisma.inquiry.count({ where: { status: "NEW" } }),
        prisma.claimRequest.count({ where: { status: "PENDING" } }),
        prisma.studioView.count(),
        prisma.studioView.count({ where: { createdAt: { gte: since } } }),
      ]);

    return {
      studios,
      unclaimed,
      services,
      cities,
      inquiries,
      claims,
      profileViews,
      profileViews7Days,
    };
  }, fallback);
});

export const listInquiries = cache(async (): Promise<PublicInquiry[]> => {
  return withFallback(async () => {
    const inquiries = await prisma.inquiry.findMany({
      include: {
        studio: { select: { id: true, name: true, slug: true } },
        service: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return inquiries;
  }, []);
});

export const listClaimRequests = cache(
  async (): Promise<PublicClaimRequest[]> => {
    return withFallback(async () => {
      const claims = await prisma.claimRequest.findMany({
        include: {
          studio: { select: { id: true, name: true, slug: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      return claims;
    }, []);
  },
);
