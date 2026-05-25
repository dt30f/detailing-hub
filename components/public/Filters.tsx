import { Search, SlidersHorizontal } from "lucide-react";
import type { PublicCity, PublicService, StudioType } from "@/lib/types";

type FiltersProps = {
  cities: PublicCity[];
  services: PublicService[];
  selectedCity?: string;
  selectedService?: string;
  selectedType?: StudioType | "";
  query?: string;
  action?: string;
};

export function Filters({
  cities,
  services,
  selectedCity,
  selectedService,
  selectedType,
  query,
  action = "/studiji",
}: FiltersProps) {
  return (
    <form
      action={action}
      className="grid gap-3 rounded-lg border border-zinc-200 bg-white p-3 shadow-sm md:grid-cols-[1.2fr_1fr_1fr_1fr_auto]"
    >
      <label className="relative">
        <span className="sr-only">Pretraga</span>
        <Search
          size={17}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
        />
        <input
          name="q"
          defaultValue={query}
          placeholder="Naziv studija ili usluga"
          className="h-11 w-full rounded-md border border-zinc-200 bg-white pl-10 pr-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-500"
        />
      </label>

      <label>
        <span className="sr-only">Grad</span>
        <select
          name="city"
          defaultValue={selectedCity || ""}
          className="h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none transition focus:border-zinc-500"
        >
          <option value="">Svi gradovi</option>
          {cities.map((city) => (
            <option value={city.slug} key={city.id}>
              {city.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span className="sr-only">Usluga</span>
        <select
          name="service"
          defaultValue={selectedService || ""}
          className="h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none transition focus:border-zinc-500"
        >
          <option value="">Sve usluge</option>
          {services.map((service) => (
            <option value={service.slug} key={service.id}>
              {service.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span className="sr-only">Tip usluge</span>
        <select
          name="type"
          defaultValue={selectedType || ""}
          className="h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none transition focus:border-zinc-500"
        >
          <option value="">Svi tipovi</option>
          <option value="STUDIO">Studio</option>
          <option value="MOBILE">Mobilna usluga</option>
          <option value="BOTH">Studio i mobilno</option>
        </select>
      </label>

      <button className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800">
        <SlidersHorizontal size={16} />
        Filtriraj
      </button>
    </form>
  );
}
