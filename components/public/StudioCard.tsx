import Link from "next/link";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import type { PublicStudio } from "@/lib/types";
import { StatusBadge } from "@/components/public/StatusBadge";
import { StudioVisual } from "@/components/public/StudioVisual";

export function StudioCard({ studio }: { studio: PublicStudio }) {
  const services = studio.services.slice(0, 4);

  return (
    <article className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <StudioVisual studio={studio} />
      <div className="space-y-4 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={studio.status} />
          {studio.isPremium || studio.isFeatured ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800">
              <Sparkles size={13} />
              Istaknut
            </span>
          ) : null}
        </div>

        <div>
          <h2 className="text-xl font-semibold text-zinc-950">{studio.name}</h2>
          <p className="mt-2 flex items-center gap-2 text-sm text-zinc-600">
            <MapPin size={15} />
            {[studio.city.name, studio.municipality].filter(Boolean).join(", ")}
          </p>
        </div>

        {studio.shortDescription ? (
          <p className="line-clamp-3 text-sm leading-6 text-zinc-600">
            {studio.shortDescription}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {services.map((item) => (
            <span
              key={item.id}
              className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700"
            >
              {item.service.name}
            </span>
          ))}
        </div>

        <Link
          href={`/studiji/${studio.slug}`}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800"
        >
          Pogledaj profil
          <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}
