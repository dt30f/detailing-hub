import type { Metadata } from "next";
import { AdminNav } from "@/components/admin/AdminNav";
import { DatabaseNotice } from "@/components/admin/DatabaseNotice";
import { createServiceAction } from "@/lib/admin-actions";
import { getServices } from "@/lib/data";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin usluge",
};

export default async function AdminServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ database?: string; saved?: string }>;
}) {
  const [session, params, services] = await Promise.all([
    requireAdmin(),
    searchParams,
    getServices(),
  ]);

  return (
    <div>
      <AdminNav email={session.email} />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div>
          {params.database ? (
            <div className="mb-6">
              <DatabaseNotice />
            </div>
          ) : null}
          <h1 className="text-3xl font-semibold tracking-tight">Usluge</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Osnovni katalog usluga koji se povezuje sa studijima.
          </p>
          <form action={createServiceAction} className="mt-6 space-y-4 rounded-lg border border-zinc-200 bg-white p-5">
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">Naziv</span>
              <input
                required
                name="name"
                className="h-11 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-500"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">Slug</span>
              <input
                name="slug"
                placeholder="automatski ako ostane prazno"
                className="h-11 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-500"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">Kategorija</span>
              <input
                name="category"
                className="h-11 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-500"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">Opis</span>
              <textarea
                name="description"
                rows={4}
                className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-500"
              />
            </label>
            <button className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800">
              Dodaj uslugu
            </button>
          </form>
        </div>

        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
            Postojeće usluge
          </div>
          {services.map((service) => (
            <div key={service.id} className="border-b border-zinc-100 px-4 py-4 last:border-b-0">
              <p className="font-semibold text-zinc-950">{service.name}</p>
              <p className="text-sm text-zinc-500">{service.slug}</p>
              {service.description ? (
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  {service.description}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
