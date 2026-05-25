import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Filters } from "@/components/public/Filters";
import { StudioCard } from "@/components/public/StudioCard";
import {
  getCities,
  getServiceBySlug,
  getServices,
  listCityServiceLandingPages,
  listStudios,
} from "@/lib/data";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return { title: "Usluga nije pronađena" };
  }

  return {
    title: `${service.name} u Srbiji`,
    description:
      service.description ||
      `Pronađite studije koji nude uslugu: ${service.name}.`,
    alternates: {
      canonical: `/usluge/${service.slug}`,
    },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const [service, cities, services, studios, landingPages] = await Promise.all([
    getServiceBySlug(slug),
    getCities(),
    getServices(),
    listStudios({ service: slug }),
    listCityServiceLandingPages(),
  ]);

  if (!service) {
    notFound();
  }

  const serviceCities = landingPages
    .filter((page) => page.service.slug === service.slug)
    .slice(0, 10);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-700">
          SEO usluga
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-zinc-950">
          {service.name} u Srbiji
        </h1>
        <p className="mt-4 text-base leading-7 text-zinc-600">
          {service.description ||
            "Pronađite detailing studije koji nude ovu uslugu i kontaktirajte ih direktno."}
        </p>
      </div>

      <div className="mt-8">
        <Filters
          cities={cities}
          services={services}
          selectedService={service.slug}
        />
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {studios.map((studio) => (
          <StudioCard studio={studio} key={studio.id} />
        ))}
      </div>

      <div className="mt-10 rounded-lg border border-zinc-200 bg-white p-6">
        <h2 className="text-xl font-semibold">Popularni gradovi za ovu uslugu</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {serviceCities.map((page) => (
            <Link
              href={`/${page.city.slug}/${service.slug}`}
              key={`${page.city.slug}-${service.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-3 py-1 text-sm font-medium text-zinc-700 transition hover:border-zinc-400"
            >
              {service.name} {page.city.name}
              <span className="text-xs text-zinc-500">{page.studioCount}</span>
              <ArrowRight size={14} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
