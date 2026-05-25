import type { Metadata } from "next";
import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { DatabaseNotice } from "@/components/admin/DatabaseNotice";
import { updateClaimStatusAction } from "@/lib/admin-actions";
import { listClaimRequests } from "@/lib/data";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin claim zahtevi",
};

const statuses = ["PENDING", "APPROVED", "REJECTED"];

export default async function AdminClaimsPage({
  searchParams,
}: {
  searchParams: Promise<{ database?: string; saved?: string }>;
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
                </div>
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
              </div>
              {claim.message ? (
                <p className="mt-4 whitespace-pre-line text-sm leading-6 text-zinc-700">
                  {claim.message}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
