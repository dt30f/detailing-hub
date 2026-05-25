import type { PublicCity, PublicService, PublicStudio } from "@/lib/types";

type JsonLdObject = Record<string, unknown>;

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
    /\/$/,
    "",
  );
}

export function absoluteUrl(path: string) {
  return new URL(path, getSiteUrl()).toString();
}

function cleanJsonLd(value: unknown): unknown {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (Array.isArray(value)) {
    const items = value
      .map((item) => cleanJsonLd(item))
      .filter((item) => item !== undefined);

    return items.length > 0 ? items : undefined;
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as JsonLdObject)
      .map(([key, item]) => [key, cleanJsonLd(item)] as const)
      .filter(([, item]) => item !== undefined);

    return entries.length > 0 ? Object.fromEntries(entries) : undefined;
  }

  return value;
}

export function jsonLdScriptProps(data: JsonLdObject) {
  return {
    __html: JSON.stringify(cleanJsonLd(data)).replace(/</g, "\\u003c"),
  };
}

export function buildWebsiteJsonLd() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: "DetailingHub",
    url: siteUrl,
    inLanguage: "sr-RS",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/studiji?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildStudioJsonLd(studio: PublicStudio) {
  const profileUrl = absoluteUrl(`/studiji/${studio.slug}`);
  const image = studio.images.find((item) => item.url)?.url;
  const sameAs = [studio.website, studio.instagram].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${profileUrl}#webpage`,
        url: profileUrl,
        name: `${studio.name} - ${studio.city.name}`,
        description:
          studio.shortDescription ||
          `${studio.name}: auto detailing usluge u gradu ${studio.city.name}.`,
        inLanguage: "sr-RS",
        isPartOf: {
          "@id": `${getSiteUrl()}/#website`,
        },
        mainEntity: {
          "@id": `${profileUrl}#localbusiness`,
        },
      },
      {
        "@type": "LocalBusiness",
        "@id": `${profileUrl}#localbusiness`,
        name: studio.name,
        description: studio.description || studio.shortDescription,
        url: studio.website || profileUrl,
        mainEntityOfPage: profileUrl,
        telephone: studio.phone,
        email: studio.email,
        image: image ? absoluteUrl(image) : undefined,
        sameAs,
        address: {
          "@type": "PostalAddress",
          streetAddress: studio.address,
          addressLocality: studio.city.name,
          addressCountry: "RS",
        },
        areaServed: {
          "@type": "City",
          name: studio.city.name,
        },
        makesOffer: studio.services.map((item) => ({
          "@type": "Offer",
          name: item.service.name,
          priceCurrency: item.priceFrom || item.priceTo ? "RSD" : undefined,
          priceSpecification:
            item.priceFrom || item.priceTo
              ? {
                  "@type": "PriceSpecification",
                  minPrice: item.priceFrom,
                  maxPrice: item.priceTo,
                  priceCurrency: "RSD",
                }
              : undefined,
          itemOffered: {
            "@type": "Service",
            name: item.service.name,
            serviceType: item.service.category,
            description: item.service.description,
          },
        })),
        additionalProperty: [
          {
            "@type": "PropertyValue",
            name: "profileStatus",
            value: studio.status,
          },
          {
            "@type": "PropertyValue",
            name: "unverifiedProfileNotice",
            value:
              studio.status === "UNCLAIMED"
                ? "Profil nije preuzet od strane vlasnika."
                : undefined,
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${profileUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Studiji",
            item: absoluteUrl("/studiji"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: studio.city.name,
            item: absoluteUrl(`/grad/${studio.city.slug}`),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: studio.name,
            item: profileUrl,
          },
        ],
      },
    ],
  };
}

export function buildCityServiceJsonLd({
  city,
  service,
  studios,
}: {
  city: PublicCity;
  service: PublicService;
  studios: PublicStudio[];
}) {
  const pageUrl = absoluteUrl(`/${city.slug}/${service.slug}`);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: `${service.name} ${city.name}`,
        description: `Pregled detailing profila koji nude uslugu ${service.name.toLowerCase()} u gradu ${city.name}.`,
        inLanguage: "sr-RS",
        isPartOf: {
          "@id": `${getSiteUrl()}/#website`,
        },
        about: {
          "@id": `${pageUrl}#service`,
        },
        mainEntity: {
          "@id": `${pageUrl}#itemlist`,
        },
      },
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        name: service.name,
        serviceType: service.category,
        description: service.description,
        areaServed: {
          "@type": "City",
          name: city.name,
        },
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#itemlist`,
        numberOfItems: studios.length,
        itemListElement: studios.map((studio, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: studio.name,
          url: absoluteUrl(`/studiji/${studio.slug}`),
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Studiji",
            item: absoluteUrl("/studiji"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: city.name,
            item: absoluteUrl(`/grad/${city.slug}`),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: service.name,
            item: pageUrl,
          },
        ],
      },
    ],
  };
}
