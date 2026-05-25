import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { DatabaseNotice } from "@/components/admin/DatabaseNotice";
import { StudioForm } from "@/components/admin/StudioForm";
import { hideStudioAction, updateStudioAction } from "@/lib/admin-actions";
import {
  getCities,
  getServices,
  getStudioAnalytics,
  getStudioById,
} from "@/lib/data";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Uredi studio",
};

export default async function EditStudioPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ database?: string; saved?: string }>;
}) {
  const [{ id }, flags, session] = await Promise.all([
    params,
    searchParams,
    requireAdmin(),
  ]);
  const [studio, cities, services, analytics] = await Promise.all([
    getStudioById(id),
    getCities(),
    getServices(),
    getStudioAnalytics(id),
  ]);

  if (!studio) {
    notFound();
  }

  return (
    <div>
      <AdminNav email={session.email} />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {flags.database ? (
          <div className="mb-6">
            <DatabaseNotice />
          </div>
        ) : null}
        {flags.saved ? (
          <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
            Profil je sačuvan.
          </div>
        ) : null}

        <h1 className="text-3xl font-semibold tracking-tight">{studio.name}</h1>
        <p className="mt-2 text-sm text-zinc-600">Izmena profila studija.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <p className="text-sm font-medium text-zinc-500">Ukupno pregleda</p>
            <p className="mt-2 text-3xl font-semibold text-zinc-950">
              {analytics.totalViews}
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <p className="text-sm font-medium text-zinc-500">
              Pregledi u poslednjih 7 dana
            </p>
            <p className="mt-2 text-3xl font-semibold text-zinc-950">
              {analytics.viewsLast7Days}
            </p>
          </div>
        </div>
        <div className="mt-6">
          <StudioForm
            action={updateStudioAction}
            cities={cities}
            services={services}
            studio={studio}
          />
        </div>

        <form action={hideStudioAction} className="mt-8 rounded-lg border border-red-200 bg-red-50 p-5">
          <input type="hidden" name="id" value={studio.id} />
          <h2 className="font-semibold text-red-950">Sakrij profil</h2>
          <p className="mt-2 text-sm leading-6 text-red-800">
            Profil ostaje u bazi, ali više nije aktivan u javnom direktorijumu.
          </p>
          <button className="mt-4 h-10 rounded-md bg-red-700 px-4 text-sm font-semibold text-white transition hover:bg-red-800">
            Sakrij profil
          </button>
        </form>
      </div>
    </div>
  );
}
