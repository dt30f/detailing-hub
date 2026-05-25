import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { AdminNav } from "@/components/admin/AdminNav";
import { DatabaseNotice } from "@/components/admin/DatabaseNotice";
import { StatusBadge } from "@/components/public/StatusBadge";
import { getStudioViewSummaries, listStudios } from "@/lib/data";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin studiji",
};

export default async function AdminStudiosPage({
  searchParams,
}: {
  searchParams: Promise<{ database?: string; hidden?: string }>;
}) {
  const [session, params, studios, viewSummaries] = await Promise.all([
    requireAdmin(),
    searchParams,
    listStudios({ includeHidden: true }),
    getStudioViewSummaries(),
  ]);
  const viewsByStudioId = new Map(
    viewSummaries.map((summary) => [summary.studioId, summary]),
  );

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
            <h1 className="text-3xl font-semibold tracking-tight">Studiji</h1>
            <p className="mt-2 text-sm text-zinc-600">
              Upravljanje profilima, statusima i isticanjem.
            </p>
          </div>
          <Link
            href="/admin/studios/new"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            <Plus size={16} />
            Dodaj studio
          </Link>
        </div>

        <div className="mt-6 overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <div className="grid grid-cols-[1.2fr_0.7fr_0.7fr_0.7fr_auto] gap-4 border-b border-zinc-200 bg-zinc-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
            <span>Naziv</span>
            <span>Grad</span>
            <span>Status</span>
            <span>Pregledi</span>
            <span>Akcija</span>
          </div>
          {studios.map((studio) => {
            const views = viewsByStudioId.get(studio.id);

            return (
              <div
                key={studio.id}
                className="grid grid-cols-[1.2fr_0.7fr_0.7fr_0.7fr_auto] items-center gap-4 border-b border-zinc-100 px-4 py-4 text-sm last:border-b-0"
              >
                <div>
                  <p className="font-semibold text-zinc-950">{studio.name}</p>
                  <p className="text-zinc-500">{studio.slug}</p>
                </div>
                <span>{studio.city.name}</span>
                <StatusBadge status={studio.status} />
                <div>
                  <p className="font-semibold text-zinc-950">
                    {views?.total ?? 0}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {views?.last7Days ?? 0} / 7 dana
                  </p>
                </div>
                <Link
                  href={`/admin/studios/${studio.id}`}
                  className="inline-flex items-center gap-2 font-semibold text-zinc-950"
                >
                  Uredi
                  <ArrowRight size={15} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
