import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BarChart3, CalendarDays, Eye, ExternalLink } from "lucide-react";
import { AdminNav } from "@/components/admin/AdminNav";
import { StatusBadge } from "@/components/public/StatusBadge";
import { getDashboardStats, listStudioAnalyticsRows } from "@/lib/data";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin analitika",
};

function formatDate(value?: Date | string | null) {
  if (!value) {
    return "Nema pregleda";
  }

  return new Intl.DateTimeFormat("sr-RS", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function AdminAnalyticsPage() {
  const [session, stats, rows] = await Promise.all([
    requireAdmin(),
    getDashboardStats(),
    listStudioAnalyticsRows(),
  ]);
  const topRows = rows.slice(0, 25);

  const cards = [
    {
      label: "Ukupno pregleda",
      value: stats.profileViews,
      icon: Eye,
    },
    {
      label: "Pregledi 7 dana",
      value: stats.profileViews7Days,
      icon: CalendarDays,
    },
    {
      label: "Profili sa pregledima",
      value: rows.length,
      icon: BarChart3,
    },
  ];

  return (
    <div>
      <AdminNav email={session.email} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-700">
              Analitika
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Pregledi profila
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
              Osnovna MVP metrika za procenu interesovanja po studiju. Pregledi
              se beleže bez čuvanja sirove IP adrese.
            </p>
          </div>
          <Link
            href="/admin/studios"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Svi studiji
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.label}
                className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
              >
                <Icon className="text-teal-700" size={22} />
                <p className="mt-5 text-3xl font-semibold">{card.value}</p>
                <p className="mt-1 text-sm text-zinc-600">{card.label}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <div className="grid grid-cols-[1.2fr_0.7fr_0.55fr_0.55fr_0.55fr_0.85fr_auto] gap-4 border-b border-zinc-200 bg-zinc-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
            <span>Studio</span>
            <span>Grad</span>
            <span>Status</span>
            <span>Ukupno</span>
            <span>7 dana</span>
            <span>Zadnji pregled</span>
            <span>Akcija</span>
          </div>

          {topRows.length > 0 ? (
            topRows.map((row) => (
              <div
                key={row.studioId}
                className="grid grid-cols-[1.2fr_0.7fr_0.55fr_0.55fr_0.55fr_0.85fr_auto] items-center gap-4 border-b border-zinc-100 px-4 py-4 text-sm last:border-b-0"
              >
                <div>
                  <p className="font-semibold text-zinc-950">{row.name}</p>
                  <p className="text-zinc-500">{row.slug}</p>
                </div>
                <span>{row.city.name}</span>
                <StatusBadge status={row.status} />
                <span className="font-semibold text-zinc-950">
                  {row.totalViews}
                </span>
                <div>
                  <p className="font-semibold text-zinc-950">
                    {row.viewsLast7Days}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {row.viewsLast30Days} / 30 dana
                  </p>
                </div>
                <span className="text-zinc-600">
                  {formatDate(row.lastViewedAt)}
                </span>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/studiji/${row.slug}`}
                    className="inline-flex items-center gap-1 font-semibold text-zinc-950"
                  >
                    Profil
                    <ExternalLink size={14} />
                  </Link>
                  <Link
                    href={`/admin/studios/${row.studioId}`}
                    className="inline-flex items-center gap-1 font-semibold text-zinc-950"
                  >
                    Uredi
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-10 text-center">
              <h2 className="text-lg font-semibold text-zinc-950">
                Još nema pregleda
              </h2>
              <p className="mt-2 text-sm text-zinc-600">
                Kada korisnici otvore javne profile studija, ovde će se
                pojaviti najgledaniji profili.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
