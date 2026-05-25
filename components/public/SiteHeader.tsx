import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-bold tracking-tight text-zinc-950">
          DetailingHub
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-zinc-700">
          <Link href="/studiji" className="hover:text-zinc-950">
            Studiji
          </Link>
          <Link href="/usluge/dubinsko-pranje" className="hover:text-zinc-950">
            Usluge
          </Link>
          <Link href="/admin" className="hover:text-zinc-950">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
