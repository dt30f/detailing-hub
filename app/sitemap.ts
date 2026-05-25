import type { MetadataRoute } from "next";
import {
  getCities,
  getServices,
  listCityServiceLandingPages,
  listStudios,
} from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const [cities, services, studios, landingPages] = await Promise.all([
    getCities(),
    getServices(),
    listStudios(),
    listCityServiceLandingPages(),
  ]);

  return [
    { url: siteUrl, lastModified: new Date() },
    { url: `${siteUrl}/studiji`, lastModified: new Date() },
    ...cities.map((city) => ({
      url: `${siteUrl}/grad/${city.slug}`,
      lastModified: new Date(),
    })),
    ...services.map((service) => ({
      url: `${siteUrl}/usluge/${service.slug}`,
      lastModified: new Date(),
    })),
    ...landingPages.map((page) => ({
      url: `${siteUrl}/${page.city.slug}/${page.service.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...studios.map((studio) => ({
      url: `${siteUrl}/studiji/${studio.slug}`,
      lastModified: new Date(studio.updatedAt || Date.now()),
    })),
  ];
}
