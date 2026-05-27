import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { Filters } from "@/components/public/Filters";
import { ServiceBadge } from "@/components/public/ServiceBadge";
import { StudioCard } from "@/components/public/StudioCard";
import { getCities, getServices, listStudios } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [cities, services, studios] = await Promise.all([
    getCities(),
    getServices(),
    listStudios(),
  ]);
  const visibleStudios = studios.slice(0, 6);
  const heroImage = "/Hero/hero.webp";

  return (
    <div>
      <section className="relative min-h-[560px] overflow-hidden bg-zinc-950 text-white sm:min-h-[640px] lg:min-h-[720px]">
        <Image
          src={heroImage}
          alt="Pranje automobila u detailing studiju"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-black/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_78%,rgba(14,165,233,0.22),transparent_30%),linear-gradient(90deg,rgba(0,0,0,0.68),rgba(0,0,0,0.16)_58%,rgba(0,0,0,0.35))]" />

        <div className="relative z-10 mx-auto flex min-h-[560px] max-w-7xl flex-col justify-between px-4 py-12 sm:min-h-[640px] sm:px-6 sm:py-14 lg:min-h-[720px] lg:px-8 lg:py-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-xl backdrop-blur-md">
              <Sparkles size={16} />
              Auto detailing Srbija
            </p>
            <h1 className="mt-10 max-w-6xl text-5xl font-black leading-none text-white/58 sm:text-7xl lg:text-8xl">
              Svi Studiji
              <span className="block">Na Jednom Mestu</span>
            </h1>
          </div>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-md">
              <p className="text-base leading-7 text-white sm:text-lg">
                Pronađite najbolji detailing studio u vašem gradu. Svi na
                jednom mestu, brzo i jednostavno.
              </p>
              <div className="mt-7">
                <Link
                  href="/studiji"
                  className="inline-flex h-14 items-center justify-center rounded-full bg-white px-9 text-base font-semibold text-zinc-950 shadow-xl transition hover:bg-zinc-100"
                >
                  Pronađi Studio
                </Link>
              </div>
            </div>

            <Link
              href="/studiji"
              className="hidden w-72 rounded-2xl bg-white p-5 text-zinc-950 shadow-2xl transition hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(0,0,0,0.28)] md:block"
            >
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 text-sky-500" size={22} />
                <div>
                  <p className="text-xl font-semibold leading-6">
                    Pronađi Studio
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">
                    {studios.length} profila u bazi
                  </p>
                </div>
              </div>
              <div className="mt-10 flex items-center justify-between">
                <span className="text-sm font-semibold text-zinc-500">
                  DetailingHub
                </span>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-zinc-950 text-white">
                  <ArrowRight size={17} />
                </span>
              </div>
            </Link>
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
            <h2 className="mt-2 text-3xl font-semibold">
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
              <h2 className="mt-2 text-3xl font-semibold">
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

          {visibleStudios.length > 0 ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {visibleStudios.map((studio) => (
                <StudioCard studio={studio} key={studio.id} />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-10 text-center">
              <h2 className="text-xl font-semibold text-zinc-950">
                Profili se trenutno pripremaju
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Direktorijum je spreman, a javni profili će biti prikazani čim
                produkciona baza bude povezana.
              </p>
            </div>
          )}
        </div>
      </section>

      <section
        id="kako-radi"
        className="mx-auto grid max-w-7xl gap-5 px-4 py-12 sm:px-6 md:grid-cols-2 lg:px-8"
      >
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
          <Link
            href="/za-studije"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-zinc-950"
          >
            Kako preuzeti profil
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
