import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { loginAdminAction } from "@/lib/admin-actions";
import { getAdminSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin login",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [params, session] = await Promise.all([searchParams, getAdminSession()]);

  if (session) {
    redirect("/admin");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-md bg-zinc-950 text-white">
            <LockKeyhole size={18} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Admin login</h1>
            <p className="text-sm text-zinc-600">MVP pristup za uređivanje baze.</p>
          </div>
        </div>

        {params.error ? (
          <div className="mt-5 rounded-md border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-800">
            Pogrešan email ili lozinka.
          </div>
        ) : null}

        <form action={loginAdminAction} className="mt-6 space-y-4">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium">Email</span>
            <input
              required
              type="email"
              name="email"
              defaultValue={process.env.ADMIN_EMAIL || "admin@detailinghub.rs"}
              className="h-11 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-500"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium">Lozinka</span>
            <input
              required
              type="password"
              name="password"
              placeholder="Unesite admin lozinku"
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
