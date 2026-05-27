import type { Metadata } from "next";
import Link from "next/link";
import { OwnerNav } from "@/components/owner/OwnerNav";
import { requireOwner } from "@/lib/auth";
import { updateOwnerPasswordAction } from "@/lib/owner-actions";

export const metadata: Metadata = {
  title: "Studio nalog",
};

const errorMessages: Record<string, string> = {
  current: "Trenutna lozinka nije tacna.",
  invalid: "Nova lozinka mora imati bar 8 karaktera i potvrda mora biti ista.",
  same: "Nova lozinka mora biti drugacija od trenutne.",
};

export default async function StudioAccountPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const [session, params] = await Promise.all([requireOwner(), searchParams]);
  const errorMessage = params.error ? errorMessages[params.error] : null;

  return (
    <div>
      <OwnerNav email={session.email} />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-700">
              Nalog
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-zinc-950">
              Podešavanja naloga
            </h1>
          </div>
          <Link href="/studio" className="text-sm font-semibold text-zinc-950">
            Nazad na pregled
          </Link>
        </div>

        {params.saved ? (
          <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
            Lozinka je promenjena.
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800">
            {errorMessage}
          </div>
        ) : null}

        <section className="mt-8 rounded-lg border border-zinc-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-zinc-950">
            Promena lozinke
          </h2>
          <p className="mt-1 text-sm leading-6 text-zinc-600">
            Unesite trenutnu lozinku, zatim novu lozinku koju ćete koristiti za
            buduće prijave u studio panel.
          </p>

          <form action={updateOwnerPasswordAction} className="mt-5 space-y-4">
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">Trenutna lozinka</span>
              <input
                required
                type="password"
                name="currentPassword"
                autoComplete="current-password"
                className="h-11 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-500"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-sm font-medium">Nova lozinka</span>
                <input
                  required
                  minLength={8}
                  type="password"
                  name="newPassword"
                  autoComplete="new-password"
                  className="h-11 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-500"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-sm font-medium">
                  Potvrdi novu lozinku
                </span>
                <input
                  required
                  minLength={8}
                  type="password"
                  name="confirmPassword"
                  autoComplete="new-password"
                  className="h-11 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-500"
                />
              </label>
            </div>

            <button className="h-11 rounded-md bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800">
              Sačuvaj novu lozinku
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
