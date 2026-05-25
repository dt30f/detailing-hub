import Link from "next/link";
import { ArrowRight, BadgeCheck, MapPin, Search, ShieldCheck } from "lucide-react";
import { Filters } from "@/components/public/Filters";
import { ServiceBadge } from "@/components/public/ServiceBadge";
import { StudioCard } from "@/components/public/StudioCard";
import {
  getCities,
  getServices,
  listStudios,
} from "@/lib/data";

export default async function Home() {
  const [cities, services, studios] = await Promise.all([
    getCities(),
    getServices(),
    listStudios(),
  ]);
  const visibleStudios = studios.slice(0, 6);

  return (
    <div>
      <section className="bg-zinc-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-300">
              Auto detailing Srbija
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Pronađi detailing studio za dubinsko pranje, poliranje, keramiku
              i PPF.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">
              Centralizovan direktorijum studija i mobilnih detailera, spreman
              da preraste u marketplace sa preuzimanjem profila, isticanjem i
              online zakazivanjem.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/studiji"
                className="inline-flex h-11 items-center gap-2 rounded-md bg-teal-500 px-5 text-sm font-semibold text-white transition hover:bg-teal-400"
              >
                Pretraži studije
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/usluge/dubinsko-pranje"
                className="inline-flex h-11 items-center gap-2 rounded-md border border-white/20 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Popularne usluge
              </Link>
            </div>
          </div>

          <div className="relative min-h-80 overflow-hidden rounded-lg border border-white/10 bg-zinc-900 p-6 shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(20,184,166,0.4),transparent_24%),linear-gradient(135deg,#18181b_0%,#27272a_55%,#e5e7eb_100%)]" />
            <div className="absolute left-8 right-8 top-1/2 h-16 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 shadow-2xl backdrop-blur-sm" />
            <div className="absolute bottom-10 left-10 right-10 h-3 rounded-full bg-black/35 blur-md" />
            <div className="relative z-10 grid h-full content-between gap-8">
              <div className="flex justify-between gap-3">
                <div className="rounded-lg bg-white/10 p-4 backdrop-blur">
                  <p className="text-3xl font-semibold">{studios.length}</p>
                  <p className="mt-1 text-sm text-zinc-300">profila</p>
                </div>
                <div className="rounded-lg bg-white/10 p-4 backdrop-blur">
                  <p className="text-3xl font-semibold">{services.length}</p>
                  <p className="mt-1 text-sm text-zinc-300">usluga</p>
                </div>
              </div>
              <div className="rounded-lg bg-white p-5 text-zinc-950 shadow-xl">
                <div className="flex items-center gap-3">
                  <Search className="text-teal-600" size={22} />
                  <div>
                    <p className="font-semibold">MVP direktorijum</p>
                    <p className="text-sm text-zinc-600">
                      Filter po gradu, usluzi, tipu i nazivu studija.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Filters cities={cities} services={services} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-700">
              Usluge
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Najtraženije detailing usluge
            </h2>
          </div>
          <Link
            href="/studiji"
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-950"
          >
            Svi studiji
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {services.slice(0, 12).map((service) => (
            <ServiceBadge service={service} key={service.id} />
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-700">
                Direktorijum
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                Novi profili u bazi
              </h2>
            </div>
            <Link
              href="/grad/beograd"
              className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-950"
            >
              <MapPin size={16} />
              Studiji u Beogradu
            </Link>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visibleStudios.map((studio) => (
              <StudioCard studio={studio} key={studio.id} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-12 sm:px-6 md:grid-cols-2 lg:px-8">
        <div className="rounded-lg border border-zinc-200 bg-white p-6">
          <BadgeCheck className="text-teal-600" size={24} />
          <h2 className="mt-4 text-xl font-semibold">Za vlasnike vozila</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Brzo pronađite studio po gradu i usluzi, pogledajte kontakt kanale i
            pošaljite upit bez obilaska desetina profila.
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-6">
          <ShieldCheck className="text-amber-700" size={24} />
          <h2 className="mt-4 text-xl font-semibold">Za detailing studije</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Neovereni profili su jasno označeni. Vlasnik može da zatraži izmenu,
            preuzimanje ili uklanjanje profila.
          </p>
        </div>
      </section>
    </div>
  );
}
