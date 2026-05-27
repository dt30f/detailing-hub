import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock, MapPin, ShieldAlert } from "lucide-react";
import { ClaimProfileBox } from "@/components/public/ClaimProfileBox";
import { ContactButtons } from "@/components/public/ContactButtons";
import { InquiryForm } from "@/components/public/InquiryForm";
import { ServiceBadge } from "@/components/public/ServiceBadge";
import { StatusBadge } from "@/components/public/StatusBadge";
import { StudioVisual } from "@/components/public/StudioVisual";
import { StudioViewTracker } from "@/components/public/StudioViewTracker";
import { getStudioBySlug } from "@/lib/data";
import { buildStudioJsonLd, jsonLdScriptProps } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sent?: string; claim?: string }>;
};

function formatPrice(from?: number | null, to?: number | null) {
  if (!from && !to) {
    return "Cena na upit";
  }

  const formatter = new Intl.NumberFormat("sr-RS");

  if (from && to) {
    return `${formatter.format(from)} - ${formatter.format(to)} RSD`;
  }

  return `Od ${formatter.format(from || to || 0)} RSD`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const studio = await getStudioBySlug(slug);

  if (!studio) {
    return { title: "Studio nije pronađen" };
  }

  return {
    title: `${studio.name} - ${studio.city.name}`,
    description:
      studio.shortDescription ||
      `${studio.name}: auto detailing usluge u gradu ${studio.city.name}.`,
    alternates: {
      canonical: `/studiji/${studio.slug}`,
    },
  };
}

export default async function StudioPage({ params, searchParams }: Props) {
  const [{ slug }, flags] = await Promise.all([params, searchParams]);
  const studio = await getStudioBySlug(slug);

  if (!studio) {
    notFound();
  }

  const studioJsonLd = buildStudioJsonLd(studio);
  const isAcceptedProfile =
    studio.status === "CLAIMED" || studio.status === "VERIFIED";
  const isPendingProfile = studio.status === "PENDING_REVIEW";
  const SourceNoteIcon = isAcceptedProfile ? CheckCircle2 : ShieldAlert;
  const sourceNoteClassName = isAcceptedProfile
    ? "border-emerald-200 bg-emerald-50 text-emerald-900"
    : isPendingProfile
      ? "border-violet-200 bg-violet-50 text-violet-900"
      : "border-amber-200 bg-amber-50 text-amber-900";
  const sourceNoteIconClassName = isAcceptedProfile
    ? "text-emerald-700"
    : isPendingProfile
      ? "text-violet-700"
      : "text-amber-700";
  const sourceNoteText = isAcceptedProfile
    ? studio.status === "VERIFIED"
      ? "Profil je verifikovan i podaci su potvrđeni."
      : "Profil je preuzeo vlasnik i podaci su ažurirani iz studio panela."
    : isPendingProfile
      ? "Profil je poslao vlasnik i čeka admin proveru."
      : studio.sourceNote ||
        "Ovaj profil je napravljen na osnovu javno dostupnih informacija. Vlasnik može da preuzme, izmeni ili ukloni profil.";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScriptProps(studioJsonLd)}
      />
      <StudioViewTracker
        studioId={studio.id}
        pathname={`/studiji/${studio.slug}`}
      />
      {flags.sent ? (
        <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
          Upit je poslat studiju. U demo režimu bez baze prikazuje se samo
          potvrda slanja.
        </div>
      ) : null}

      {flags.claim ? (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-900">
          Zahtev za preuzimanje profila je poslat.
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-5">
          <StudioVisual studio={studio} />
          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <h2 className="text-lg font-semibold">Kontakt</h2>
            <div className="mt-4">
              <ContactButtons studio={studio} />
            </div>
          </div>
          {studio.status === "UNCLAIMED" ? (
            <ClaimProfileBox studio={studio} />
          ) : null}
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-zinc-200 bg-white p-6">
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={studio.status} />
              <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-semibold text-zinc-700">
                {studio.type === "MOBILE"
                  ? "Mobilna usluga"
                  : studio.type === "BOTH"
                    ? "Studio i mobilno"
                    : "Studio"}
              </span>
            </div>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-950">
              {studio.name}
            </h1>
            <p className="mt-3 flex items-center gap-2 text-sm text-zinc-600">
              <MapPin size={16} />
              {[studio.city.name, studio.municipality, studio.address]
                .filter(Boolean)
                .join(", ")}
            </p>

            {studio.description || studio.shortDescription ? (
              <p className="mt-5 text-base leading-8 text-zinc-700">
                {studio.description || studio.shortDescription}
              </p>
            ) : null}

            <div className={`mt-5 rounded-lg border p-4 ${sourceNoteClassName}`}>
              <div className="flex gap-3">
                <SourceNoteIcon
                  className={`mt-0.5 ${sourceNoteIconClassName}`}
                  size={19}
                />
                <p className="text-sm leading-6">
                  {sourceNoteText ||
                    "Ovaj profil je napravljen na osnovu javno dostupnih informacija. Vlasnik može da preuzme, izmeni ili ukloni profil."}
                </p>
              </div>
            </div>
          </div>

          <section className="rounded-lg border border-zinc-200 bg-white p-6">
            <h2 className="text-2xl font-semibold tracking-tight">Usluge</h2>
            <div className="mt-5 grid gap-3">
              {studio.services.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-zinc-200 bg-zinc-50 p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <ServiceBadge service={item.service} />
                      {item.description ? (
                        <p className="mt-3 text-sm leading-6 text-zinc-600">
                          {item.description}
                        </p>
                      ) : null}
                    </div>
                    <div className="text-sm font-semibold text-zinc-950">
                      {formatPrice(item.priceFrom, item.priceTo)}
                    </div>
                  </div>
                  {item.durationMin ? (
                    <p className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
                      <Clock size={14} />
                      Oko {Math.round(item.durationMin / 60)}h
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-zinc-200 bg-white p-6">
            <h2 className="text-2xl font-semibold tracking-tight">Pošalji upit</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Opišite šta vam treba i ostavite kontakt. Studio ćete kontaktirati
              direktno ili će upit kasnije biti prosleđen kroz platformu.
            </p>
            <div className="mt-5">
              <InquiryForm studio={studio} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
