import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Eye, Inbox, Settings } from "lucide-react";
import { OwnerNav } from "@/components/owner/OwnerNav";
import { requireOwner } from "@/lib/auth";
import { listOwnerInquiries, listOwnerStudioSummaries } from "@/lib/data";

export const metadata: Metadata = {
  title: "Studio panel",
};

function statLabel(value: number) {
  return new Intl.NumberFormat("sr-RS").format(value);
}

export default async function StudioDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ forbidden?: string }>;
}) {
  const [session, params] = await Promise.all([requireOwner(), searchParams]);
  const [summaries, inquiries] = await Promise.all([
    listOwnerStudioSummaries(session.id),
    listOwnerInquiries(session.id),
  ]);

  return (
    <div>
      <OwnerNav email={session.email} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {params.forbidden ? (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800">
            Nemate pristup tom profilu.
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-700">
              Studio panel
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-zinc-950">
              Pregled profila
            </h1>
          </div>
          <Link
            href="/studiji"
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-950"
          >
            Otvori javni direktorijum
            <ArrowRight size={16} />
          </Link>
        </div>

        {summaries.length === 0 ? (
          <div className="mt-8 rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center">
            <h2 className="text-xl font-semibold text-zinc-950">
              Još nemate povezan studio
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Kada admin odobri claim zahtev, studio će se pojaviti ovde.
            </p>
          </div>
        ) : null}

        <div className="mt-8 grid gap-5">
          {summaries.map(({ studio, totalViews, viewsLast7Days, viewsLast30Days, inquiries: inquiryCount, newInquiries }) => (
            <article
              className="rounded-lg border border-zinc-200 bg-white p-6"
              key={studio.id}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-zinc-950">
                    {studio.name}
                  </h2>
                  <p className="mt-1 text-sm text-zinc-600">
                    {studio.city.name}
                    {studio.municipality ? `, ${studio.municipality}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/studio/profil?studioId=${studio.id}`}
                    className="inline-flex h-10 items-center gap-2 rounded-md border border-zinc-200 px-4 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100"
                  >
                    <Settings size={16} />
                    Uredi profil
                  </Link>
                  <Link
                    href={`/studiji/${studio.slug}`}
                    className="inline-flex h-10 items-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800"
                  >
                    Javni profil
                  </Link>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {[
                  ["Ukupni pregledi", totalViews],
                  ["Pregledi 30 dana", viewsLast30Days],
                  ["Pregledi 7 dana", viewsLast7Days],
                  ["Ukupni upiti", inquiryCount],
                  ["Novi upiti", newInquiries],
                ].map(([label, value]) => (
                  <div
                    className="rounded-lg border border-zinc-200 bg-zinc-50 p-4"
                    key={label}
                  >
                    <p className="text-sm text-zinc-500">{label}</p>
                    <p className="mt-2 text-2xl font-semibold text-zinc-950">
                      {statLabel(Number(value))}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        <section className="mt-8 rounded-lg border border-zinc-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <Inbox className="text-teal-700" size={22} />
            <h2 className="text-xl font-semibold text-zinc-950">
              Poslednji upiti
            </h2>
          </div>
          <div className="mt-5 space-y-4">
            {inquiries.length === 0 ? (
              <p className="text-sm text-zinc-600">Još nema poslatih upita.</p>
            ) : null}
            {inquiries.map((inquiry) => (
              <article
                className="rounded-lg border border-zinc-200 bg-zinc-50 p-4"
                key={inquiry.id}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-semibold text-zinc-950">{inquiry.name}</p>
                    <p className="mt-1 text-sm text-zinc-500">
                      {inquiry.email || "Bez emaila"} ·{" "}
                      {inquiry.phone || "Bez telefona"}
                    </p>
                  </div>
                  <span className="inline-flex w-fit items-center gap-1 rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-700">
                    <Eye size={13} />
                    {inquiry.status}
                  </span>
                </div>
                <p className="mt-3 whitespace-pre-line text-sm leading-6 text-zinc-700">
                  {inquiry.message}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
