import { Send } from "lucide-react";
import { submitInquiryAction } from "@/app/actions";
import type { PublicStudio } from "@/lib/types";

export function InquiryForm({ studio }: { studio: PublicStudio }) {
  return (
    <form action={submitInquiryAction} className="space-y-4">
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
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-zinc-800">Ime</span>
          <input
            required
            name="name"
            className="h-11 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-500"
          />
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-zinc-800">Telefon</span>
          <input
            name="phone"
            className="h-11 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-500"
          />
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-zinc-800">Email</span>
          <input
            name="email"
            type="email"
            className="h-11 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-500"
          />
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-medium text-zinc-800">Usluga</span>
          <select
            name="serviceId"
            className="h-11 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-500"
          >
            <option value="">Nisam siguran</option>
            {studio.services.map((item) => (
              <option value={item.service.id} key={item.id}>
                {item.service.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-zinc-800">Poruka</span>
        <textarea
          required
          name="message"
          rows={5}
          placeholder="Napišite šta vam treba, model vozila i okviran termin."
          className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-500"
        />
      </label>

      <button className="inline-flex h-11 items-center gap-2 rounded-md bg-teal-600 px-5 text-sm font-semibold text-white transition hover:bg-teal-700">
        <Send size={16} />
        Pošalji upit
      </button>
    </form>
  );
}
