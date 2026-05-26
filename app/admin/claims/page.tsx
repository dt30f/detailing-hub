import type { Metadata } from "next";
import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { DatabaseNotice } from "@/components/admin/DatabaseNotice";
import {
  approveClaimAndCreateOwnerAction,
  cancelClaimRequestAction,
  updateClaimStatusAction,
} from "@/lib/admin-actions";
import { listClaimRequests } from "@/lib/data";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin claim zahtevi",
};

const statuses = ["PENDING", "APPROVED", "REJECTED"];

export default async function AdminClaimsPage({
  searchParams,
}: {
  searchParams: Promise<{
    approved?: string;
    database?: string;
    missing?: string;
    password?: string;
    role?: string;
    saved?: string;
    cancelled?: string;
  }>;
}) {
  const [session, params, claims] = await Promise.all([
    requireAdmin(),
    searchParams,
    listClaimRequests(),
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
        <h1 className="text-3xl font-semibold tracking-tight">Claim zahtevi</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Zahtevi vlasnika za preuzimanje, izmenu ili uklanjanje profila.
        </p>

        {params.approved ? (
          <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
            Claim je odobren, owner nalog je kreiran ili ažuriran, a studio je
            povezan sa vlasnikom.
          </div>
        ) : null}

        {params.role ? (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800">
            Email sa claim zahteva već postoji kao admin nalog. Koristite drugi
            email za owner pristup.
          </div>
        ) : null}

        {params.password ? (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-900">
            Za novi owner nalog morate uneti privremenu lozinku od najmanje 8
            karaktera.
          </div>
        ) : null}

        {params.cancelled ? (
          <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-4 text-sm font-medium text-zinc-700">
            Claim zahtev je poništen.
          </div>
        ) : null}

        <div className="mt-6 space-y-4">
          {claims.length === 0 ? (
            <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center text-sm text-zinc-600">
              Još nema claim zahteva.
            </div>
          ) : null}

          {claims.map((claim) => (
            <article
              key={claim.id}
              className="rounded-lg border border-zinc-200 bg-white p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-semibold text-zinc-950">{claim.ownerName}</p>
                  <p className="mt-1 text-sm text-zinc-500">
                    {claim.email} · {claim.phone || "Bez telefona"}
                  </p>
                  <p className="mt-2 text-sm text-zinc-600">
                    Studio:{" "}
                    <Link
                      href={`/admin/studios/${claim.studio.id}`}
                      className="font-semibold text-zinc-950"
                    >
                      {claim.studio.name}
                    </Link>
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                    {claim.ownerUser ? (
                      <span className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-sky-800">
                        Email već ima owner nalog
                      </span>
                    ) : (
                      <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-zinc-700">
                        Novi owner nalog
                      </span>
                    )}
                    {claim.studio.owner ? (
                      <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-amber-800">
                        Studio već ima ownera: {claim.studio.owner.email}
                      </span>
                    ) : (
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-800">
                        Studio nema ownera
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <form action={updateClaimStatusAction} className="flex gap-2">
                    <input type="hidden" name="id" value={claim.id} />
                    <select
                      name="status"
                      defaultValue={claim.status}
                      className="h-10 rounded-md border border-zinc-200 px-3 text-sm"
                    >
                      {statuses.map((status) => (
                        <option value={status} key={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <button className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white">
                      Sačuvaj
                    </button>
                  </form>
                  <form action={cancelClaimRequestAction}>
                    <input type="hidden" name="claimId" value={claim.id} />
                    <button
                      className="h-10 rounded-md border border-red-200 px-4 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                      title="Briše claim zahtev iz liste. Ne briše owner nalog."
                    >
                      Poništi claim
                    </button>
                  </form>
                </div>
              </div>
              {claim.ownerUser || claim.studio.owner ? (
                <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm leading-6 text-zinc-700">
                  {claim.ownerUser ? (
                    <p>
                      Postojeći owner nalog:{" "}
                      <Link
                        href="/admin/owners"
                        className="font-semibold text-zinc-950"
                      >
                        {claim.ownerUser.email}
                      </Link>
                      . Ako odobrite claim bez lozinke, ovaj nalog se povezuje
                      sa studijom.
                    </p>
                  ) : null}
                  {claim.studio.owner ? (
                    <p>
                      Trenutni owner studija je {claim.studio.owner.email}.
                      Odobravanje ovog claim-a će prevezati studio na ownera iz
                      zahteva.
                    </p>
                  ) : null}
                </div>
              ) : null}
              {claim.message ? (
                <p className="mt-4 whitespace-pre-line text-sm leading-6 text-zinc-700">
                  {claim.message}
                </p>
              ) : null}
              {claim.status === "PENDING" ? (
                <form
                  action={approveClaimAndCreateOwnerAction}
                  className="mt-5 rounded-lg border border-zinc-200 bg-zinc-50 p-4"
                >
                  <input type="hidden" name="claimId" value={claim.id} />
                  <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                    <label className="space-y-1.5">
                      <span className="text-sm font-medium">
                        Privremena owner lozinka
                      </span>
                      <input
                        minLength={8}
                        name="password"
                        type="text"
                        placeholder={
                          claim.ownerUser
                            ? "Opcionalno: resetuj lozinku postojećem owneru"
                            : "Obavezno za novi owner nalog"
                        }
                        className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-500"
                      />
                    </label>
                    <button className="h-10 rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800">
                      {claim.ownerUser
                        ? "Odobri i poveži ownera"
                        : "Odobri i kreiraj owner nalog"}
                    </button>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-zinc-500">
                    Ova akcija povezuje studio sa owner nalogom, prebacuje
                    status profila na preuzet i omogućava login na /studio.
                  </p>
                </form>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
