import type { Metadata } from "next";
import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { DatabaseNotice } from "@/components/admin/DatabaseNotice";
import {
  deleteOwnerAccountAction,
  resetOwnerPasswordAction,
  unlinkOwnerStudioAction,
  updateOwnerAccountAction,
} from "@/lib/admin-actions";
import { requireAdmin } from "@/lib/auth";
import { listOwnerAccounts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Admin owner nalozi",
};

export default async function AdminOwnersPage({
  searchParams,
}: {
  searchParams: Promise<{
    connected?: string;
    database?: string;
    deleted?: string;
    missing?: string;
    reset?: string;
    unlinked?: string;
    updated?: string;
  }>;
}) {
  const [session, params, owners] = await Promise.all([
    requireAdmin(),
    searchParams,
    listOwnerAccounts(),
  ]);

  return (
    <div>
      <AdminNav email={session.email} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {params.database ? (
          <div className="mb-6">
            <DatabaseNotice />
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Owner nalozi</h1>
            <p className="mt-2 text-sm text-zinc-600">
              Upravljanje nalozima studija koji su preuzeli profile.
            </p>
          </div>
          <Link
            href="/admin/claims"
            className="inline-flex h-10 items-center rounded-md border border-zinc-200 px-4 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100"
          >
            Claim zahtevi
          </Link>
        </div>

        {params.updated || params.reset || params.unlinked || params.deleted ? (
          <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
            Izmena owner naloga je sačuvana.
          </div>
        ) : null}

        {params.connected ? (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-900">
            Owner nalog je povezan sa studijom. Prvo odvežite sve studije, pa
            zatim obrišite nalog.
          </div>
        ) : null}

        {params.missing ? (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800">
            Owner nalog nije pronađen.
          </div>
        ) : null}

        <div className="mt-6 space-y-5">
          {owners.length === 0 ? (
            <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center text-sm text-zinc-600">
              Još nema owner naloga.
            </div>
          ) : null}

          {owners.map((owner) => (
            <article
              key={owner.id}
              className="rounded-lg border border-zinc-200 bg-white p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-lg font-semibold text-zinc-950">
                    {owner.name || "Bez imena"}
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">{owner.email}</p>
                  <p className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-zinc-400">
                    {owner.ownedStudios.length} povezanih profila
                  </p>
                </div>

                <form
                  action={deleteOwnerAccountAction}
                  className="flex flex-col gap-2 sm:flex-row"
                >
                  <input type="hidden" name="ownerId" value={owner.id} />
                  <button
                    disabled={owner.ownedStudios.length > 0}
                    className="h-10 rounded-md border border-red-200 px-4 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    Obriši owner nalog
                  </button>
                </form>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <form
                  action={updateOwnerAccountAction}
                  className="rounded-lg border border-zinc-200 bg-zinc-50 p-4"
                >
                  <input type="hidden" name="ownerId" value={owner.id} />
                  <h2 className="font-semibold text-zinc-950">
                    Podaci naloga
                  </h2>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <label className="space-y-1.5">
                      <span className="text-sm font-medium">Ime</span>
                      <input
                        name="name"
                        defaultValue={owner.name || ""}
                        className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-500"
                      />
                    </label>
                    <label className="space-y-1.5">
                      <span className="text-sm font-medium">Email</span>
                      <input
                        required
                        type="email"
                        name="email"
                        defaultValue={owner.email}
                        className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-500"
                      />
                    </label>
                  </div>
                  <button className="mt-4 h-10 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800">
                    Sačuvaj nalog
                  </button>
                </form>

                <form
                  action={resetOwnerPasswordAction}
                  className="rounded-lg border border-zinc-200 bg-zinc-50 p-4"
                >
                  <input type="hidden" name="ownerId" value={owner.id} />
                  <h2 className="font-semibold text-zinc-950">
                    Reset lozinke
                  </h2>
                  <label className="mt-4 block space-y-1.5">
                    <span className="text-sm font-medium">Nova lozinka</span>
                    <input
                      required
                      minLength={8}
                      name="password"
                      type="text"
                      placeholder="Privremena lozinka"
                      className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-500"
                    />
                  </label>
                  <button className="mt-4 h-10 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800">
                    Resetuj lozinku
                  </button>
                </form>
              </div>

              <section className="mt-5 rounded-lg border border-zinc-200 p-4">
                <h2 className="font-semibold text-zinc-950">
                  Povezani studiji
                </h2>
                {owner.ownedStudios.length === 0 ? (
                  <p className="mt-3 text-sm text-zinc-600">
                    Ovaj owner trenutno nema povezan studio.
                  </p>
                ) : null}
                <div className="mt-4 grid gap-3">
                  {owner.ownedStudios.map((studio) => (
                    <div
                      key={studio.id}
                      className="flex flex-col gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <Link
                          href={`/admin/studios/${studio.id}`}
                          className="font-semibold text-zinc-950"
                        >
                          {studio.name}
                        </Link>
                        <p className="mt-1 text-sm text-zinc-500">
                          {studio.city.name} · {studio.status}
                        </p>
                      </div>
                      <form action={unlinkOwnerStudioAction}>
                        <input
                          type="hidden"
                          name="ownerId"
                          value={owner.id}
                        />
                        <input
                          type="hidden"
                          name="studioId"
                          value={studio.id}
                        />
                        <button className="h-10 rounded-md border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100">
                          Odveži studio
                        </button>
                      </form>
                    </div>
                  ))}
                </div>
              </section>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
