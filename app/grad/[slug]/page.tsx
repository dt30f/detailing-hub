import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Filters } from "@/components/public/Filters";
import { StudioCard } from "@/components/public/StudioCard";
import {
  getCities,
  getCityBySlug,
  getServices,
  listCityServiceLandingPages,
  listStudios,
} from "@/lib/data";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const city = await getCityBySlug(slug);

  if (!city) {
    return { title: "Grad nije pronađen" };
  }

  return {
    title: `Auto detailing ${city.name}`,
    description: `Pronađite auto detailing studije u gradu ${city.name}: dubinsko pranje, poliranje, keramika, PPF i mobilne usluge.`,
    alternates: {
      canonical: `/grad/${city.slug}`,
    },
  };
}

export default async function CityPage({ params }: Props) {
  const { slug } = await params;
  const [city, cities, services, studios, landingPages] = await Promise.all([
    getCityBySlug(slug),
    getCities(),
    getServices(),
    listStudios({ city: slug }),
    listCityServiceLandingPages(),
  ]);

  if (!city) {
    notFound();
  }

  const cityServices = landingPages
    .filter((page) => page.city.slug === city.slug)
    .slice(0, 12);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-700">
          SEO grad
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-zinc-950">
          Auto detailing {city.name}
        </h1>
        <p className="mt-4 text-base leading-7 text-zinc-600">
          Pregled studija i mobilnih detailera za dubinsko pranje, poliranje,
          keramičku zaštitu, PPF folije i druge premium usluge u ovom gradu.
        </p>
      </div>

      <div className="mt-8">
        <Filters cities={cities} services={services} selectedCity={city.slug} />
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {studios.map((studio) => (
          <StudioCard studio={studio} key={studio.id} />
        ))}
      </div>

      {cityServices.length > 0 ? (
        <section className="mt-10 rounded-lg border border-zinc-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-zinc-950">
            Popularne usluge u gradu {city.name}
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {cityServices.map((page) => (
              <Link
                href={`/${city.slug}/${page.service.slug}`}
                key={`${city.slug}-${page.service.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-3 py-1 text-sm font-medium text-zinc-700 transition hover:border-zinc-400"
              >
                {page.service.name}
                <span className="text-xs text-zinc-500">{page.studioCount}</span>
                <ArrowRight size={14} />
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
