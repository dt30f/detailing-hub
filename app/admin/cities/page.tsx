import type { Metadata } from "next";
import { AdminNav } from "@/components/admin/AdminNav";
import { DatabaseNotice } from "@/components/admin/DatabaseNotice";
import { createCityAction } from "@/lib/admin-actions";
import { getCities } from "@/lib/data";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin gradovi",
};

export default async function AdminCitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ database?: string; saved?: string }>;
}) {
  const [session, params, cities] = await Promise.all([
    requireAdmin(),
    searchParams,
    getCities(),
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
          <h1 className="text-3xl font-semibold tracking-tight">Gradovi</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Gradovi se koriste za filtere i SEO landing stranice.
          </p>
          <form action={createCityAction} className="mt-6 space-y-4 rounded-lg border border-zinc-200 bg-white p-5">
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
            <button className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800">
              Dodaj grad
            </button>
          </form>
        </div>

        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
            Postojeći gradovi
          </div>
          {cities.map((city) => (
            <div
              key={city.id}
              className="grid grid-cols-2 gap-4 border-b border-zinc-100 px-4 py-4 text-sm last:border-b-0"
            >
              <span className="font-semibold text-zinc-950">{city.name}</span>
              <span className="text-zinc-500">{city.slug}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
