import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin } from "lucide-react";
import { Filters } from "@/components/public/Filters";
import { StudioCard } from "@/components/public/StudioCard";
import {
  getCities,
  getCityBySlug,
  getServiceBySlug,
  getServices,
  listCityServiceLandingPages,
  listStudios,
} from "@/lib/data";
import { buildCityServiceJsonLd, jsonLdScriptProps } from "@/lib/seo";

type Props = {
  params: Promise<{ citySlug: string; serviceSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { citySlug, serviceSlug } = await params;
  const [city, service, studios] = await Promise.all([
    getCityBySlug(citySlug),
    getServiceBySlug(serviceSlug),
    listStudios({ city: citySlug, service: serviceSlug }),
  ]);

  if (!city || !service || studios.length === 0) {
    return {
      title: "Stranica nije pronađena",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `${service.name} ${city.name}`,
    description: `Pronađite studije za ${service.name.toLowerCase()} u gradu ${city.name}. Uporedite neoverene profile, usluge i kontakt kanale.`,
    alternates: {
      canonical: `/${city.slug}/${service.slug}`,
    },
  };
}

export default async function CityServicePage({ params }: Props) {
  const { citySlug, serviceSlug } = await params;
  const [city, service, cities, services, studios, landingPages] =
    await Promise.all([
      getCityBySlug(citySlug),
      getServiceBySlug(serviceSlug),
      getCities(),
      getServices(),
      listStudios({ city: citySlug, service: serviceSlug }),
      listCityServiceLandingPages(),
    ]);

  if (!city || !service || studios.length === 0) {
    notFound();
  }

  const cityServiceJsonLd = buildCityServiceJsonLd({
    city,
    service,
    studios,
  });

  const relatedServices = landingPages
    .filter(
      (page) =>
        page.city.slug === city.slug && page.service.slug !== service.slug,
    )
    .slice(0, 8);

  const relatedCities = landingPages
    .filter(
      (page) =>
        page.service.slug === service.slug && page.city.slug !== city.slug,
    )
    .slice(0, 8);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScriptProps(cityServiceJsonLd)}
      />
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-700">
          SEO pretraga
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-zinc-950">
          {service.name} {city.name}
        </h1>
        <p className="mt-4 text-base leading-7 text-zinc-600">
          Pregled detailing profila koji nude uslugu {service.name.toLowerCase()} u
          gradu {city.name}. Profili koji nisu preuzeti jasno su označeni, a
          kontakt podatke i dostupnost treba proveriti direktno sa studijom.
        </p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm text-zinc-600">
          <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5">
            <MapPin size={15} />
            {city.name}
          </span>
          <span className="rounded-full border border-zinc-200 bg-white px-3 py-1.5">
            {studios.length} profila
          </span>
        </div>
      </div>

      <div className="mt-8">
        <Filters
          cities={cities}
          services={services}
          selectedCity={city.slug}
          selectedService={service.slug}
        />
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {studios.map((studio) => (
          <StudioCard studio={studio} key={studio.id} />
        ))}
      </div>

      {relatedServices.length > 0 || relatedCities.length > 0 ? (
        <section className="mt-12 grid gap-6 lg:grid-cols-2">
          {relatedServices.length > 0 ? (
            <div>
              <h2 className="text-xl font-semibold text-zinc-950">
                Još usluga u gradu {city.name}
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {relatedServices.map((page) => (
                  <Link
                    href={`/${page.city.slug}/${page.service.slug}`}
                    key={`${page.city.slug}-${page.service.slug}`}
                    className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:border-zinc-400"
                  >
                    {page.service.name}
                    <span className="text-xs text-zinc-500">
                      {page.studioCount}
                    </span>
                    <ArrowRight size={14} />
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          {relatedCities.length > 0 ? (
            <div>
              <h2 className="text-xl font-semibold text-zinc-950">
                {service.name} u drugim gradovima
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {relatedCities.map((page) => (
                  <Link
                    href={`/${page.city.slug}/${page.service.slug}`}
                    key={`${page.city.slug}-${page.service.slug}`}
                    className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:border-zinc-400"
                  >
                    {page.city.name}
                    <span className="text-xs text-zinc-500">
                      {page.studioCount}
                    </span>
                    <ArrowRight size={14} />
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
