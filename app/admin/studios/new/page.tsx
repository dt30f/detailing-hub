import type { Metadata } from "next";
import { AdminNav } from "@/components/admin/AdminNav";
import { StudioForm } from "@/components/admin/StudioForm";
import { createStudioAction } from "@/lib/admin-actions";
import { getCities, getServices } from "@/lib/data";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Novi studio",
};

export default async function NewStudioPage() {
  const [session, cities, services] = await Promise.all([
    requireAdmin(),
    getCities(),
    getServices(),
  ]);

  return (
    <div>
      <AdminNav email={session.email} />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight">Dodaj studio</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Za neoverene profile koristi samo osnovne javno dostupne podatke i
          bez tuđih slika ili kopiranog teksta.
        </p>
        <div className="mt-6">
          <StudioForm action={createStudioAction} cities={cities} services={services} />
        </div>
      </div>
    </div>
  );
}
