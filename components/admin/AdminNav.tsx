import Link from "next/link";
import { LogOut } from "lucide-react";
import { logoutAdminAction } from "@/lib/admin-actions";

const links = [
  { href: "/admin", label: "Pregled" },
  { href: "/admin/analytics", label: "Analitika" },
  { href: "/admin/studios", label: "Studiji" },
  { href: "/admin/services", label: "Usluge" },
  { href: "/admin/cities", label: "Gradovi" },
  { href: "/admin/inquiries", label: "Upiti" },
  { href: "/admin/claims", label: "Claim" },
];

export function AdminNav({ email }: { email: string }) {
  return (
    <div className="border-b border-zinc-200 bg-zinc-950 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-zinc-400">Admin panel</p>
            <p className="font-semibold">{email}</p>
          </div>
          <form action={logoutAdminAction}>
            <button className="inline-flex h-10 items-center gap-2 rounded-md border border-white/15 px-4 text-sm font-semibold transition hover:bg-white/10">
              <LogOut size={16} />
              Logout
            </button>
          </form>
        </div>
        <nav className="flex flex-wrap gap-2 text-sm font-medium">
          {links.map((link) => (
            <Link
              href={link.href}
              key={link.href}
              className="rounded-md px-3 py-2 text-zinc-300 transition hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
