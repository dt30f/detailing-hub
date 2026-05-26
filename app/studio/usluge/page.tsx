import type { Metadata } from "next";
import Link from "next/link";
import { OwnerNav } from "@/components/owner/OwnerNav";
import { requireOwner } from "@/lib/auth";
import { getOwnerStudioById, getServices } from "@/lib/data";
import { updateOwnerStudioServicesAction } from "@/lib/owner-actions";

export const metadata: Metadata = {
  title: "Usluge i cene",
};

export default async function StudioServicesEditPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; studioId?: string }>;
}) {
  const [session, params, services] = await Promise.all([
    requireOwner(),
    searchParams,
    getServices(),
  ]);
  const studio = await getOwnerStudioById(session.id, params.studioId);
  const selected = new Map(
    studio?.services.map((item) => [item.service.id, item]) ?? [],
  );

  return (
    <div>
      <OwnerNav email={session.email} />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-700">
              Usluge
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-zinc-950">
              Usluge i cene
            </h1>
          </div>
          <Link
            href="/studio"
            className="text-sm font-semibold text-zinc-950"
          >
            Nazad na pregled
          </Link>
        </div>

        {params.saved ? (
          <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
            Usluge su sačuvane.
          </div>
        ) : null}

        {!studio ? (
          <div className="mt-8 rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center text-sm text-zinc-600">
            Nema povezanog studija za ovaj nalog.
          </div>
        ) : (
          <form action={updateOwnerStudioServicesAction} className="mt-8">
            <input type="hidden" name="studioId" value={studio.id} />
            <div className="space-y-4">
              {services.map((service) => {
                const current = selected.get(service.id);

                return (
                  <section
                    className="rounded-lg border border-zinc-200 bg-white p-5"
                    key={service.id}
                  >
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        name="serviceIds"
                        value={service.id}
                        defaultChecked={Boolean(current)}
                        className="mt-1 size-4 rounded border-zinc-300"
                      />
                      <div>
                        <p className="font-semibold text-zinc-950">
                          {service.name}
                        </p>
                        {service.category ? (
                          <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-zinc-500">
                            {service.category}
                          </p>
                        ) : null}
                      </div>
                    </label>

                    <div className="mt-4 grid gap-3 md:grid-cols-4">
                      <label className="space-y-1.5">
                        <span className="text-sm font-medium">Cena od</span>
                        <input
                          name={`priceFrom-${service.id}`}
                          inputMode="numeric"
                          defaultValue={current?.priceFrom || ""}
                          className="h-10 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-500"
                        />
                      </label>
                      <label className="space-y-1.5">
                        <span className="text-sm font-medium">Cena do</span>
                        <input
                          name={`priceTo-${service.id}`}
                          inputMode="numeric"
                          defaultValue={current?.priceTo || ""}
                          className="h-10 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-500"
                        />
                      </label>
                      <label className="space-y-1.5">
                        <span className="text-sm font-medium">Trajanje min.</span>
                        <input
                          name={`durationMin-${service.id}`}
                          inputMode="numeric"
                          defaultValue={current?.durationMin || ""}
                          className="h-10 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-500"
                        />
                      </label>
                      <label className="space-y-1.5">
                        <span className="text-sm font-medium">Opis</span>
                        <input
                          name={`description-${service.id}`}
                          defaultValue={current?.description || ""}
                          className="h-10 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-500"
                        />
                      </label>
                    </div>
                  </section>
                );
              })}
            </div>
            <button className="mt-6 h-11 rounded-md bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800">
              Sačuvaj usluge
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
