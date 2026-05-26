import Link from "next/link";
import { LogOut } from "lucide-react";
import { logoutOwnerAction } from "@/lib/owner-actions";

const links = [
  { href: "/studio", label: "Pregled" },
  { href: "/studio/profil", label: "Profil" },
  { href: "/studio/usluge", label: "Usluge i cene" },
  { href: "/studio/slike", label: "Slike" },
];

export function OwnerNav({ email }: { email: string }) {
  return (
    <div className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-zinc-500">Studio panel</p>
            <p className="font-semibold text-zinc-950">{email}</p>
          </div>
          <form action={logoutOwnerAction}>
            <button className="inline-flex h-10 items-center gap-2 rounded-md border border-zinc-200 px-4 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100">
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
              className="rounded-md px-3 py-2 text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
