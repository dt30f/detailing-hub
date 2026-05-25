import type { Metadata } from "next";
import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { DatabaseNotice } from "@/components/admin/DatabaseNotice";
import { updateInquiryStatusAction } from "@/lib/admin-actions";
import { listInquiries } from "@/lib/data";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin upiti",
};

const statuses = ["NEW", "CONTACTED", "CLOSED", "SPAM"];

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ database?: string; saved?: string }>;
}) {
  const [session, params, inquiries] = await Promise.all([
    requireAdmin(),
    searchParams,
    listInquiries(),
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
        <h1 className="text-3xl font-semibold tracking-tight">Upiti</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Pregled poruka koje korisnici šalju studijima.
        </p>

        <div className="mt-6 space-y-4">
          {inquiries.length === 0 ? (
            <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center text-sm text-zinc-600">
              Još nema upita.
            </div>
          ) : null}

          {inquiries.map((inquiry) => (
            <article
              key={inquiry.id}
              className="rounded-lg border border-zinc-200 bg-white p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-semibold text-zinc-950">{inquiry.name}</p>
                  <p className="mt-1 text-sm text-zinc-500">
                    {inquiry.phone || "Bez telefona"} · {inquiry.email || "Bez emaila"}
                  </p>
                  <p className="mt-2 text-sm text-zinc-600">
                    Studio:{" "}
                    <Link
                      href={`/studiji/${inquiry.studio.slug}`}
                      className="font-semibold text-zinc-950"
                    >
                      {inquiry.studio.name}
                    </Link>
                  </p>
                </div>
                <form action={updateInquiryStatusAction} className="flex gap-2">
                  <input type="hidden" name="id" value={inquiry.id} />
                  <select
                    name="status"
                    defaultValue={inquiry.status}
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
              <p className="mt-4 whitespace-pre-line text-sm leading-6 text-zinc-700">
                {inquiry.message}
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
