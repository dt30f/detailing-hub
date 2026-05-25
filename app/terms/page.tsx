import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description: "Uslovi korišćenja za DetailingHub MVP.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-semibold tracking-tight">Terms</h1>
      <div className="mt-6 space-y-4 text-sm leading-7 text-zinc-700">
        <p>
          DetailingHub je direktorijum auto detailing usluga. Neovereni profili
          nisu prikaz partnerstva, preporuke ili potvrđene saradnje.
        </p>
        <p>
          Ne koristimo tuđe slike, logotipe ili kopirane opise bez dozvole.
          Osnovni podaci se unose ručno iz javno dostupnih izvora ili na osnovu
          informacija koje studio dostavi.
        </p>
        <p>
          Cene, dostupnost i radno vreme su informativni kada nisu direktno
          potvrđeni. Korisnik treba da proveri detalje direktno sa studijom.
        </p>
      </div>
    </div>
  );
}
