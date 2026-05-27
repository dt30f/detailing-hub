import type { Metadata } from "next";
import Link from "next/link";
import { ImagePlus, Trash2 } from "lucide-react";
import { OwnerNav } from "@/components/owner/OwnerNav";
import { requireOwner } from "@/lib/auth";
import { getOwnerStudioById } from "@/lib/data";
import {
  addOwnerStudioImageAction,
  deleteOwnerStudioImageAction,
} from "@/lib/owner-actions";

export const metadata: Metadata = {
  title: "Slike studija",
};

const imageTypes = [
  ["GENERAL", "Opšta slika"],
  ["BEFORE_AFTER", "Pre/posle"],
  ["WORKSHOP", "Radionica"],
  ["EXTERIOR", "Eksterijer"],
];

export default async function StudioImagesPage({
  searchParams,
}: {
  searchParams: Promise<{
    deleted?: string;
    image?: string;
    saved?: string;
    studioId?: string;
  }>;
}) {
  const [session, params] = await Promise.all([requireOwner(), searchParams]);
  const studio = await getOwnerStudioById(session.id, params.studioId);

  return (
    <div>
      <OwnerNav email={session.email} />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-700">
              Slike
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-zinc-950">
              Slike profila
            </h1>
          </div>
          <Link
            href="/studio"
            className="text-sm font-semibold text-zinc-950"
          >
            Nazad na pregled
          </Link>
        </div>

        {params.saved || params.deleted ? (
          <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
            Izmene slika su sačuvane.
          </div>
        ) : null}

        {params.image === "missing" ? (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800">
            Izaberite sliku za upload.
          </div>
        ) : null}

        {params.image === "type" ? (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800">
            Dozvoljeni formati su JPG, PNG i WebP.
          </div>
        ) : null}

        {params.image === "size" ? (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800">
            Slika može imati najviše 5 MB.
          </div>
        ) : null}

        {params.image === "storage" ? (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800">
            Upload nije uspeo. Proverite Supabase Storage podešavanja.
          </div>
        ) : null}

        {!studio ? (
          <div className="mt-8 rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center text-sm text-zinc-600">
            Nema povezanog studija za ovaj nalog.
          </div>
        ) : (
          <div className="mt-8 grid gap-6">
            <section className="rounded-lg border border-zinc-200 bg-white p-5">
              <h2 className="text-lg font-semibold text-zinc-950">
                Dodaj sliku
              </h2>
              <p className="mt-1 text-sm leading-6 text-zinc-600">
                Uploadujte JPG, PNG ili WebP sliku koju studio ima pravo da
                koristi. Maksimalna veličina je 5 MB.
              </p>
              <form
                action={addOwnerStudioImageAction}
                encType="multipart/form-data"
                className="mt-5 space-y-4"
              >
                <input type="hidden" name="studioId" value={studio.id} />
                <label className="block space-y-1.5">
                  <span className="text-sm font-medium">Slika</span>
                  <input
                    required
                    name="image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="block w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-zinc-950 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                  />
                </label>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-1.5">
                    <span className="text-sm font-medium">Alt tekst</span>
                    <input
                      name="alt"
                      placeholder={studio.name}
                      className="h-11 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-500"
                    />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-sm font-medium">Tip slike</span>
                    <select
                      name="type"
                      className="h-11 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-500"
                    >
                      {imageTypes.map(([value, label]) => (
                        <option value={value} key={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <button className="inline-flex h-11 items-center gap-2 rounded-md bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800">
                  <ImagePlus size={16} />
                  Uploaduj sliku
                </button>
              </form>
            </section>

            <section className="rounded-lg border border-zinc-200 bg-white p-5">
              <h2 className="text-lg font-semibold text-zinc-950">
                Trenutne slike
              </h2>
              {studio.images.length === 0 ? (
                <p className="mt-4 text-sm text-zinc-600">
                  Ovaj profil još nema dodate slike.
                </p>
              ) : null}
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {studio.images.map((image) => (
                  <article
                    className="overflow-hidden rounded-lg border border-zinc-200"
                    key={image.id}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.url}
                      alt={image.alt || studio.name}
                      className="h-56 w-full object-cover"
                    />
                    <div className="p-4">
                      <p className="text-sm font-semibold text-zinc-950">
                        {image.alt || studio.name}
                      </p>
                      <p className="mt-1 text-xs font-medium text-zinc-500">
                        {image.type}
                      </p>
                      <form
                        action={deleteOwnerStudioImageAction}
                        className="mt-4"
                      >
                        <input
                          type="hidden"
                          name="studioId"
                          value={studio.id}
                        />
                        <input
                          type="hidden"
                          name="imageId"
                          value={image.id}
                        />
                        <button className="inline-flex h-10 items-center gap-2 rounded-md border border-red-200 px-4 text-sm font-semibold text-red-700 transition hover:bg-red-50">
                          <Trash2 size={16} />
                          Ukloni
                        </button>
                      </form>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
