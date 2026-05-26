import { ShieldCheck } from "lucide-react";
import { submitClaimRequestAction } from "@/app/actions";
import type { PublicStudio } from "@/lib/types";

export function ClaimProfileBox({ studio }: { studio: PublicStudio }) {
  if (studio.status !== "UNCLAIMED") {
    return null;
  }

  return (
    <section className="rounded-lg border border-amber-200 bg-amber-50 p-5">
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 text-amber-700" size={20} />
        <div>
          <h2 className="font-semibold text-amber-950">Preuzimanje profila</h2>
          <p className="mt-2 text-sm leading-6 text-amber-900">
            Ovaj profil je napravljen na osnovu javno dostupnih informacija.
            Vlasnik može da preuzme, izmeni ili zatraži uklanjanje profila.
          </p>
        </div>
      </div>

      <form action={submitClaimRequestAction} className="mt-5 space-y-3">
        <input type="hidden" name="studioId" value={studio.id} />
        <input type="hidden" name="studioSlug" value={studio.slug} />
        <input
          aria-hidden="true"
          tabIndex={-1}
          autoComplete="off"
          name="website"
          className="hidden"
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <input
            required
            name="ownerName"
            placeholder="Ime vlasnika"
            className="h-10 rounded-md border border-amber-200 bg-white px-3 text-sm outline-none focus:border-amber-500"
          />
          <input
            required
            type="email"
            name="email"
            placeholder="Email"
            className="h-10 rounded-md border border-amber-200 bg-white px-3 text-sm outline-none focus:border-amber-500"
          />
        </div>
        <input
          name="phone"
          placeholder="Telefon"
          className="h-10 w-full rounded-md border border-amber-200 bg-white px-3 text-sm outline-none focus:border-amber-500"
        />
        <textarea
          name="message"
          rows={3}
          placeholder="Kratka poruka za admina"
          className="w-full rounded-md border border-amber-200 bg-white px-3 py-2 text-sm outline-none focus:border-amber-500"
        />
        <button className="inline-flex h-10 items-center rounded-md bg-amber-700 px-4 text-sm font-semibold text-white transition hover:bg-amber-800">
          Preuzmi profil
        </button>
      </form>
    </section>
  );
}
