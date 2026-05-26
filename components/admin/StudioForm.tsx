import type { PublicCity, PublicService, PublicStudio } from "@/lib/types";

type StudioFormProps = {
  action: (formData: FormData) => Promise<void>;
  cities: PublicCity[];
  services: PublicService[];
  studio?: PublicStudio | null;
};

const statusOptions = [
  ["UNCLAIMED", "Neoveren"],
  ["PENDING_REVIEW", "Čeka proveru"],
  ["CLAIMED", "Preuzet"],
  ["VERIFIED", "Verifikovan"],
  ["HIDDEN", "Sakriven"],
];

export function StudioForm({ action, cities, services, studio }: StudioFormProps) {
  const selectedServices = new Set(
    studio?.services.map((item) => item.service.id) ?? [],
  );
  const contactFields: Array<{
    name: string;
    label: string;
    value?: string | null;
  }> = [
    { name: "address", label: "Adresa", value: studio?.address },
    { name: "phone", label: "Telefon", value: studio?.phone },
    { name: "email", label: "Email", value: studio?.email },
    { name: "website", label: "Web sajt", value: studio?.website },
    { name: "instagram", label: "Instagram", value: studio?.instagram },
    { name: "whatsapp", label: "WhatsApp", value: studio?.whatsapp },
  ];
  const flags = [
    { name: "isFeatured", label: "Featured", checked: studio?.isFeatured ?? false },
    { name: "isPremium", label: "Premium", checked: studio?.isPremium ?? false },
    { name: "isActive", label: "Aktivan", checked: studio?.isActive ?? true },
  ];

  return (
    <form action={action} className="space-y-6">
      {studio ? <input type="hidden" name="id" value={studio.id} /> : null}

      <section className="rounded-lg border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-semibold">Osnovni podaci</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-sm font-medium">Naziv</span>
            <input
              required
              name="name"
              defaultValue={studio?.name}
              className="h-11 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-500"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-medium">Slug</span>
            <input
              name="slug"
              defaultValue={studio?.slug}
              placeholder="automatski ako ostane prazno"
              className="h-11 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-500"
            />
          </label>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-sm font-medium">Grad</span>
            <select
              required
              name="cityId"
              defaultValue={studio?.cityId || ""}
              className="h-11 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-500"
            >
              <option value="">Izaberi grad</option>
              {cities.map((city) => (
                <option value={city.id} key={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-medium">Opština</span>
            <input
              name="municipality"
              defaultValue={studio?.municipality || ""}
              className="h-11 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-500"
            />
          </label>
        </div>

        <label className="mt-4 block space-y-1.5">
          <span className="text-sm font-medium">Kratak opis</span>
          <input
            name="shortDescription"
            defaultValue={studio?.shortDescription || ""}
            className="h-11 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-500"
          />
        </label>

        <label className="mt-4 block space-y-1.5">
          <span className="text-sm font-medium">Opis</span>
          <textarea
            name="description"
            defaultValue={studio?.description || ""}
            rows={5}
            className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-500"
          />
        </label>
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-semibold">Kontakt i status</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {contactFields.map(({ name, label, value }) => (
            <label className="space-y-1.5" key={name}>
              <span className="text-sm font-medium">{label}</span>
              <input
                name={name}
                defaultValue={value || ""}
                className="h-11 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-500"
              />
            </label>
          ))}
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-sm font-medium">Tip</span>
            <select
              name="type"
              defaultValue={studio?.type || "STUDIO"}
              className="h-11 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-500"
            >
              <option value="STUDIO">Studio</option>
              <option value="MOBILE">Mobilna usluga</option>
              <option value="BOTH">Studio i mobilno</option>
            </select>
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-medium">Status</span>
            <select
              name="status"
              defaultValue={studio?.status || "UNCLAIMED"}
              className="h-11 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-500"
            >
              {statusOptions.map(([value, label]) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="mt-4 block space-y-1.5">
          <span className="text-sm font-medium">Source note</span>
          <textarea
            name="sourceNote"
            defaultValue={studio?.sourceNote || ""}
            rows={3}
            className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-500"
          />
        </label>

        <div className="mt-4 flex flex-wrap gap-4">
          {flags.map(({ name, label, checked }) => (
            <label className="flex items-center gap-2 text-sm font-medium" key={name}>
              <input
                type="checkbox"
                name={name}
                defaultChecked={Boolean(checked)}
                className="size-4 rounded border-zinc-300"
              />
              {label}
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-semibold">Usluge</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <label
              className="flex items-center gap-2 rounded-md border border-zinc-200 p-3 text-sm font-medium"
              key={service.id}
            >
              <input
                type="checkbox"
                name="serviceIds"
                value={service.id}
                defaultChecked={selectedServices.has(service.id)}
                className="size-4 rounded border-zinc-300"
              />
              {service.name}
            </label>
          ))}
        </div>
      </section>

      <button className="h-11 rounded-md bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800">
        Sačuvaj profil
      </button>
    </form>
  );
}
