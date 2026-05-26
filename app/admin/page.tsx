import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Eye, Inbox, MapPinned, Wrench } from "lucide-react";
import { AdminNav } from "@/components/admin/AdminNav";
import { DatabaseNotice } from "@/components/admin/DatabaseNotice";
import { getDashboardStats } from "@/lib/data";
import { requireAdmin } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Admin pregled",
};

export default async function AdminPage() {
  const [session, stats] = await Promise.all([requireAdmin(), getDashboardStats()]);
  const dbReady = isDatabaseConfigured();

  const cards = [
    {
      href: "/admin/studios",
      label: "Studiji",
      value: stats.studios,
      icon: Building2,
    },
    {
      href: "/admin/services",
      label: "Usluge",
      value: stats.services,
      icon: Wrench,
    },
    {
      href: "/admin/cities",
      label: "Gradovi",
      value: stats.cities,
      icon: MapPinned,
    },
    {
      href: "/admin/inquiries",
      label: "Novi upiti",
      value: stats.inquiries,
      icon: Inbox,
    },
    {
      href: "/admin/studios",
      label: "Čeka proveru",
      value: stats.pendingReview,
      icon: Building2,
    },
    {
      href: "/admin/analytics",
      label: "Pregledi 7 dana",
      value: stats.profileViews7Days,
      icon: Eye,
    },
  ];

  return (
    <div>
      <AdminNav email={session.email} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {!dbReady ? (
          <div className="mb-6">
            <DatabaseNotice />
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-700">
              Admin
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Pregled MVP baze
            </h1>
          </div>
          <Link
            href="/admin/studios/new"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Dodaj studio
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                href={card.href}
                key={card.href}
                className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <Icon className="text-teal-700" size={22} />
                <p className="mt-5 text-3xl font-semibold">{card.value}</p>
                <p className="mt-1 text-sm text-zinc-600">{card.label}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
