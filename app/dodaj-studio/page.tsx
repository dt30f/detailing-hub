import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { submitStudioAction } from "@/app/actions";
import { getCities, getServices } from "@/lib/data";

export const metadata: Metadata = {
  title: "Dodaj svoj studio",
  description:
    "Prijavite auto detailing studio na DetailingHub i otvorite owner nalog za upravljanje profilom.",
  alternates: {
    canonical: "/dodaj-studio",
  },
};

const errorMessages: Record<string, string> = {
  "database-missing": "Baza nije povezana, prijava trenutno nije dostupna.",
  "email-role-conflict":
    "Ovaj email se već koristi za admin nalog. Koristite drugi owner email.",
  "invalid-password":
    "Email već ima owner nalog, ali lozinka nije tačna. Prijavite se postojećom lozinkom ili kontaktirajte admina za reset.",
  spam: "Prijava nije prihvaćena.",
};

export default async function AddStudioPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [params, cities, services] = await Promise.all([
    searchParams,
    getCities(),
    getServices(),
  ]);
  const error = params.error ? errorMessages[params.error] : null;

  return (
    <div>
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-700">
              Prijava studija
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-zinc-950">
              Dodajte svoj detailing studio na DetailingHub.
            </h1>
            <p className="mt-5 text-base leading-8 text-zinc-600">
              Napravite owner nalog i pošaljite profil na proveru. Profil se ne
              prikazuje javno dok ga admin ne odobri.
            </p>
            <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="flex gap-3">
                <ShieldCheck
                  className="mt-0.5 shrink-0 text-amber-700"
                  size={20}
                />
                <p className="text-sm leading-6 text-amber-900">
                  Ako već imate owner nalog, unesite isti email i postojeću
                  lozinku. Novi studio će biti dodat na isti nalog i čekati
                  admin proveru.
                </p>
              </div>
            </div>
            <Link
              href="/studio/login"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-zinc-950"
            >
              Već imate nalog? Studio login
              <ArrowRight size={16} />
            </Link>
          </div>

          <form
            action={submitStudioAction}
            className="rounded-lg border border-zinc-200 bg-zinc-50 p-5"
          >
            {error ? (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800">
                {error}
              </div>
            ) : null}

            <input
              aria-hidden="true"
              tabIndex={-1}
              autoComplete="off"
              name="websiteTrap"
              className="hidden"
            />

            <section className="rounded-lg border border-zinc-200 bg-white p-5">
              <h2 className="text-lg font-semibold text-zinc-950">
                Podaci studija
              </h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium">Naziv studija</span>
                  <input
                    required
                    name="studioName"
                    className="h-11 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-500"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-sm font-medium">Grad</span>
                  <select
                    required
                    name="cityId"
                    defaultValue=""
                    className="h-11 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-500"
                  >
                    <option value="">Izaberite grad</option>
                    {cities.map((city) => (
                      <option value={city.id} key={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium">Opština</span>
                  <input
                    name="municipality"
                    className="h-11 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-500"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-sm font-medium">Adresa</span>
                  <input
                    name="address"
                    className="h-11 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-500"
                  />
                </label>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium">Telefon</span>
                  <input
                    name="phone"
                    className="h-11 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-500"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-sm font-medium">Email studija</span>
                  <input
                    type="email"
                    name="email"
                    className="h-11 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-500"
                  />
                </label>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium">Instagram</span>
                  <input
                    name="instagram"
                    placeholder="https://..."
                    className="h-11 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-500"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-sm font-medium">Web sajt</span>
                  <input
                    name="website"
                    placeholder="https://..."
                    className="h-11 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-500"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-sm font-medium">WhatsApp</span>
                  <input
                    name="whatsapp"
                    className="h-11 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-500"
                  />
                </label>
              </div>

              <label className="mt-4 block space-y-1.5">
                <span className="text-sm font-medium">Tip</span>
                <select
                  name="type"
                  defaultValue="STUDIO"
                  className="h-11 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-500"
                >
                  <option value="STUDIO">Studio</option>
                  <option value="MOBILE">Mobilna usluga</option>
                  <option value="BOTH">Studio i mobilno</option>
                </select>
              </label>

              <label className="mt-4 block space-y-1.5">
                <span className="text-sm font-medium">Kratak opis</span>
                <input
                  name="shortDescription"
                  className="h-11 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-500"
                />
              </label>

              <label className="mt-4 block space-y-1.5">
                <span className="text-sm font-medium">Opis</span>
                <textarea
                  name="description"
                  rows={4}
                  className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                />
              </label>
            </section>

            <section className="mt-5 rounded-lg border border-zinc-200 bg-white p-5">
              <h2 className="text-lg font-semibold text-zinc-950">Usluge</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {services.map((service) => (
                  <label
                    className="flex items-center gap-2 rounded-md border border-zinc-200 p-3 text-sm font-medium"
                    key={service.id}
                  >
                    <input
                      type="checkbox"
                      name="serviceIds"
                      value={service.id}
                      className="size-4 rounded border-zinc-300"
                    />
                    {service.name}
                  </label>
                ))}
              </div>
            </section>

            <section className="mt-5 rounded-lg border border-zinc-200 bg-white p-5">
              <h2 className="text-lg font-semibold text-zinc-950">
                Owner nalog
              </h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium">Ime vlasnika</span>
                  <input
                    required
                    name="ownerName"
                    className="h-11 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-500"
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-sm font-medium">Owner email</span>
                  <input
                    required
                    type="email"
                    name="ownerEmail"
                    className="h-11 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-500"
                  />
                </label>
              </div>
              <label className="mt-4 block space-y-1.5">
                <span className="text-sm font-medium">Lozinka</span>
                <input
                  required
                  minLength={8}
                  type="password"
                  name="password"
                  className="h-11 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-500"
                />
              </label>
            </section>

            <button className="mt-6 h-12 rounded-full bg-zinc-950 px-7 text-sm font-semibold text-white transition hover:bg-zinc-800">
              Pošalji na proveru
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
