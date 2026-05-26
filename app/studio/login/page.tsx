import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { getOwnerSession } from "@/lib/auth";
import { loginOwnerAction } from "@/lib/owner-actions";

export const metadata: Metadata = {
  title: "Studio login",
};

export default async function StudioLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ database?: string; error?: string }>;
}) {
  const [params, session] = await Promise.all([searchParams, getOwnerSession()]);

  if (session) {
    redirect("/studio");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-md bg-zinc-950 text-white">
            <LockKeyhole size={18} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Studio login</h1>
            <p className="text-sm text-zinc-600">
              Pristup za vlasnike preuzetih profila.
            </p>
          </div>
        </div>

        {params.error ? (
          <div className="mt-5 rounded-md border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-800">
            Pogrešan email ili lozinka.
          </div>
        ) : null}

        {params.database ? (
          <div className="mt-5 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm font-medium text-amber-900">
            Baza nije povezana, owner login nije dostupan.
          </div>
        ) : null}

        <form action={loginOwnerAction} className="mt-6 space-y-4">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium">Email</span>
            <input
              required
              type="email"
              name="email"
              className="h-11 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-500"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium">Lozinka</span>
            <input
              required
              minLength={8}
              type="password"
              name="password"
              className="h-11 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-500"
            />
          </label>
          <button className="h-11 w-full rounded-md bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800">
            Prijavi se
          </button>
        </form>
      </div>
    </div>
  );
}
