import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Mail,
  Search,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Za detailing studije",
  description:
    "Preuzmite, izmenite ili uklonite profil detailing studija na DetailingHub direktorijumu.",
  alternates: {
    canonical: "/za-studije",
  },
};

const steps = [
  {
    title: "Pronađite svoj profil",
    description:
      "Otvorite listu studija i pretražite po nazivu, gradu ili usluzi koju nudite.",
  },
  {
    title: "Pošaljite zahtev",
    description:
      "Na profilu popunite kratku formu za preuzimanje, izmenu ili uklanjanje profila.",
  },
  {
    title: "Admin proverava zahtev",
    description:
      "Proveravamo da zahtev dolazi od vlasnika ili ovlašćene osobe pre izmene podataka.",
  },
];

export default function StudiosLandingPage() {
  return (
    <div>
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-700">
              Za detailing studije
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-zinc-950 sm:text-5xl">
              Preuzmite profil i držite podatke tačnim.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-600 sm:text-lg">
              DetailingHub prikazuje osnovne neoverene profile na osnovu javno
              dostupnih informacija. Vlasnik može da zatraži preuzimanje,
              izmenu ili uklanjanje profila.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/studiji"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-zinc-950 px-6 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                Pronađi svoj profil
                <ArrowRight size={16} />
              </Link>
              <Link
                href="#kontakt"
                className="inline-flex h-12 items-center rounded-full border border-zinc-300 px-6 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100"
              >
                Kako nas kontaktirati
              </Link>
              <Link
                href="/studio/login"
                className="inline-flex h-12 items-center rounded-full border border-zinc-300 px-6 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100"
              >
                Studio login
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6">
            <ShieldCheck className="text-amber-700" size={28} />
            <h2 className="mt-5 text-2xl font-semibold text-zinc-950">
              Šta dobijate preuzimanjem profila?
            </h2>
            <div className="mt-6 grid gap-4">
              {[
                "Ispravka naziva, grada, opštine i kontakt podataka.",
                "Dodavanje tačnih usluga koje studio zaista pruža.",
                "Jasna oznaka da je profil preuzet ili verifikovan.",
                "Osnova za buduće premium isticanje i analitiku pregleda.",
              ].map((item) => (
                <div className="flex gap-3" key={item}>
                  <BadgeCheck
                    className="mt-0.5 shrink-0 text-teal-600"
                    size={18}
                  />
                  <p className="text-sm leading-6 text-zinc-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-700">
              Proces
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-zinc-950">
              Kako radi preuzimanje profila
            </h2>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {steps.map((step, index) => (
              <article
                className="rounded-lg border border-zinc-200 bg-white p-6"
                key={step.title}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-950 text-sm font-semibold text-white">
                  {index + 1}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-zinc-950">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="kontakt" className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="rounded-lg border border-zinc-200 bg-white p-6">
            <Search className="text-sky-600" size={24} />
            <h2 className="mt-4 text-xl font-semibold text-zinc-950">
              Ako profil već postoji
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Otvorite profil studija i popunite formu “Preuzimanje profila”.
              Tako zahtev odmah vezujemo za tačan studio u admin panelu.
            </p>
            <Link
              href="/studiji"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-zinc-950"
            >
              Pretraži studije
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-zinc-950 p-6 text-white">
            <Mail className="text-teal-300" size={24} />
            <h2 className="mt-4 text-xl font-semibold">Ako profil ne postoji</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-300">
              Za sada je najbrže da nam pošaljete osnovne podatke studija kroz
              poruku na najbližem relevantnom profilu ili da nas kontaktirate
              direktno kada otvorimo javni kontakt kanal. U sledećoj fazi
              dodajemo posebnu formu za prijavu novog studija.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
