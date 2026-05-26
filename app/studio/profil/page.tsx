import type { Metadata } from "next";
import Link from "next/link";
import { OwnerNav } from "@/components/owner/OwnerNav";
import { requireOwner } from "@/lib/auth";
import { getOwnerStudioById } from "@/lib/data";
import { updateOwnerStudioProfileAction } from "@/lib/owner-actions";

export const metadata: Metadata = {
  title: "Uredi studio profil",
};

export default async function StudioProfileEditPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; studioId?: string }>;
}) {
  const [session, params] = await Promise.all([requireOwner(), searchParams]);
  const studio = await getOwnerStudioById(session.id, params.studioId);

  return (
    <div>
      <OwnerNav email={session.email} />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-700">
              Profil
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-zinc-950">
              Uredi podatke studija
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
            Profil je sačuvan.
          </div>
        ) : null}

        {!studio ? (
          <div className="mt-8 rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center text-sm text-zinc-600">
            Nema povezanog studija za ovaj nalog.
          </div>
        ) : (
          <form action={updateOwnerStudioProfileAction} className="mt-8 space-y-6">
            <input type="hidden" name="studioId" value={studio.id} />

            <section className="rounded-lg border border-zinc-200 bg-white p-5">
              <h2 className="text-lg font-semibold text-zinc-950">
                Osnovni podaci
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Naziv, grad, status i premium oznake menja samo admin.
              </p>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium">Naziv</span>
                  <input
                    value={studio.name}
                    disabled
                    className="h-11 w-full rounded-md border border-zinc-200 bg-zinc-100 px-3 text-sm text-zinc-500"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-sm font-medium">Grad</span>
                  <input
                    value={studio.city.name}
                    disabled
                    className="h-11 w-full rounded-md border border-zinc-200 bg-zinc-100 px-3 text-sm text-zinc-500"
                  />
                </label>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium">Opština</span>
                  <input
                    name="municipality"
                    defaultValue={studio.municipality || ""}
                    className="h-11 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-500"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-sm font-medium">Tip</span>
                  <select
                    name="type"
                    defaultValue={studio.type}
                    className="h-11 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-500"
                  >
                    <option value="STUDIO">Studio</option>
                    <option value="MOBILE">Mobilna usluga</option>
                    <option value="BOTH">Studio i mobilno</option>
                  </select>
                </label>
              </div>

              <label className="mt-4 block space-y-1.5">
                <span className="text-sm font-medium">Kratak opis</span>
                <input
                  name="shortDescription"
                  defaultValue={studio.shortDescription || ""}
                  className="h-11 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-500"
                />
              </label>

              <label className="mt-4 block space-y-1.5">
                <span className="text-sm font-medium">Opis</span>
                <textarea
                  name="description"
                  defaultValue={studio.description || ""}
                  rows={5}
                  className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                />
              </label>
            </section>

            <section className="rounded-lg border border-zinc-200 bg-white p-5">
              <h2 className="text-lg font-semibold text-zinc-950">Kontakt</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {(
                  [
                  ["address", "Adresa", studio.address],
                  ["phone", "Telefon", studio.phone],
                  ["email", "Email", studio.email],
                  ["website", "Web sajt", studio.website],
                  ["instagram", "Instagram", studio.instagram],
                  ["whatsapp", "WhatsApp", studio.whatsapp],
                ] as Array<[string, string, string | null | undefined]>
                ).map(([name, label, value]) => (
                  <label className="space-y-1.5" key={name}>
                    <span className="text-sm font-medium">{label}</span>
                    <input
                      name={name}
                      defaultValue={value || ""}
                      className="h-11 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-500"
                    />
                  </label>
                ))}
              </div>
            </section>

            <button className="h-11 rounded-md bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800">
              Sačuvaj profil
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
