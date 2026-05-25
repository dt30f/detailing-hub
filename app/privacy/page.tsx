import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Politika privatnosti za DetailingHub MVP.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-semibold tracking-tight">Privacy Policy</h1>
      <div className="mt-6 space-y-4 text-sm leading-7 text-zinc-700">
        <p>
          DetailingHub MVP prikuplja samo podatke koje korisnik dobrovoljno
          unese kroz forme za upit ili preuzimanje profila.
        </p>
        <p>
          Podaci se koriste za obradu upita, administraciju profila i kontakt sa
          vlasnicima studija. Ne prodajemo lične podatke trećim licima.
        </p>
        <p>
          Vlasnik studija može da zatraži izmenu ili uklanjanje profila, a
          korisnik može da zatraži brisanje podataka koje je poslao kroz formu.
        </p>
      </div>
    </div>
  );
}
