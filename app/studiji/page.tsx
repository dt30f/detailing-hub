import type { Metadata } from "next";
import { Filters } from "@/components/public/Filters";
import { StudioCard } from "@/components/public/StudioCard";
import { getCities, getServices, listStudios } from "@/lib/data";
import type { StudioType } from "@/lib/types";

export const metadata: Metadata = {
  title: "Auto detailing studiji",
  description:
    "Pretraga auto detailing studija u Srbiji po gradu, usluzi, tipu i nazivu.",
};

type Search = {
  city?: string;
  service?: string;
  q?: string;
  type?: StudioType;
  sent?: string;
  claim?: string;
  database?: string;
};

export default async function StudiosPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const params = await searchParams;
  const [cities, services, studios] = await Promise.all([
    getCities(),
    getServices(),
    listStudios({
      city: params.city,
      service: params.service,
      q: params.q,
      type: params.type,
    }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-700">
          Direktorijum
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-zinc-950">
          Auto detailing studiji u Srbiji
        </h1>
        <p className="mt-4 text-base leading-7 text-zinc-600">
          Filtrirajte profile po gradu, usluzi, tipu rada i nazivu. Neovereni
          profili su posebno označeni dok ih vlasnici ne preuzmu.
        </p>
      </div>

      {params.sent ? (
        <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
          Upit je poslat. Ako je baza lokalno nepovezana, ovo je demo potvrda.
        </div>
      ) : null}

      {params.claim ? (
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-900">
          Zahtev za preuzimanje profila je evidentiran.
        </div>
      ) : null}

      <div className="mt-8">
        <Filters
          cities={cities}
          services={services}
          selectedCity={params.city}
          selectedService={params.service}
          selectedType={params.type}
          query={params.q}
        />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm text-zinc-600">
          Pronađeno profila:{" "}
          <span className="font-semibold text-zinc-950">{studios.length}</span>
        </p>
      </div>

      {studios.length > 0 ? (
        <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {studios.map((studio) => (
            <StudioCard studio={studio} key={studio.id} />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-lg border border-dashed border-zinc-300 bg-white p-10 text-center">
          <h2 className="text-xl font-semibold text-zinc-950">
            Nema rezultata za izabrane filtere
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            Probajte drugi grad, uslugu ili širu pretragu po nazivu.
          </p>
        </div>
      )}
    </div>
  );
}
