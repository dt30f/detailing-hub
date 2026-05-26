import type { PublicStudio } from "@/lib/types";

export function StudioVisual({ studio }: { studio: PublicStudio }) {
  const image = studio.images[0];
  const initials = studio.name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="relative flex aspect-[16/10] min-h-40 overflow-hidden rounded-lg bg-zinc-950 text-white">
      {image ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.url}
            alt={image.alt || studio.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(45,212,191,0.35),transparent_30%),linear-gradient(135deg,#111827_0%,#27272a_45%,#f8fafc_100%)]" />
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.22)_48%,transparent_58%)]" />
          <div className="absolute left-6 right-6 top-1/2 h-10 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 shadow-2xl backdrop-blur-sm" />
          <div className="absolute bottom-5 left-6 right-6 h-2 rounded-full bg-black/40 blur-md" />
        </>
      )}
      <div className="relative z-10 mt-auto flex w-full items-end justify-between p-5">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-white/70">
            Detailing profil
          </p>
          <p className="mt-1 text-2xl font-semibold">{initials}</p>
        </div>
        <p className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
          {studio.city.name}
        </p>
      </div>
    </div>
  );
}
