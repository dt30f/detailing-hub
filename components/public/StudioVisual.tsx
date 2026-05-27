"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Images } from "lucide-react";
import type { PublicStudio } from "@/lib/types";

type StudioVisualProps = {
  studio: PublicStudio;
  enableGallery?: boolean;
};

export function StudioVisual({
  studio,
  enableGallery = false,
}: StudioVisualProps) {
  const images = studio.images;
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] || images[0];
  const showGalleryControls = enableGallery && images.length > 1;
  const initials = studio.name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  function showPreviousImage() {
    setActiveIndex((current) =>
      current === 0 ? images.length - 1 : current - 1,
    );
  }

  function showNextImage() {
    setActiveIndex((current) =>
      current === images.length - 1 ? 0 : current + 1,
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative flex aspect-[16/10] min-h-40 overflow-hidden rounded-lg bg-zinc-950 text-white">
        {activeImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeImage.url}
              alt={activeImage.alt || studio.name}
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

        {showGalleryControls ? (
          <>
            <button
              type="button"
              onClick={showPreviousImage}
              aria-label="Prethodna slika"
              className="absolute left-3 top-1/2 z-20 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/45 text-white shadow-lg backdrop-blur transition hover:bg-black/65"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={showNextImage}
              aria-label="Sledeća slika"
              className="absolute right-3 top-1/2 z-20 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/45 text-white shadow-lg backdrop-blur transition hover:bg-black/65"
            >
              <ChevronRight size={20} />
            </button>
            <div className="absolute right-4 top-4 z-20 inline-flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              <Images size={14} />
              {activeIndex + 1}/{images.length}
            </div>
          </>
        ) : null}

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

      {showGalleryControls ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              type="button"
              key={image.id}
              onClick={() => setActiveIndex(index)}
              aria-label={`Prikaži sliku ${index + 1}`}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-md border transition ${
                index === activeIndex
                  ? "border-zinc-950 ring-2 ring-zinc-950/15"
                  : "border-zinc-200 hover:border-zinc-400"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt={image.alt || `${studio.name} slika ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
