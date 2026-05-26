import Link from "next/link";
import { Heart, Menu, Search } from "lucide-react";

const navItems = [
  { href: "/studiji", label: "Studiji" },
  { href: "/usluge/dubinsko-pranje", label: "Usluge" },
  { href: "/#kako-radi", label: "Kako radi" },
  { href: "/#za-studije", label: "Podrška" },
  { href: "/#za-studije", label: "O nama" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-black text-zinc-950">
          Detailing<span className="text-sky-500">Hub</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-zinc-700 md:flex">
          {navItems.map((item) => (
            <Link
              href={item.href}
              className="transition hover:text-zinc-950"
              key={item.href + item.label}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/studiji"
            aria-label="Pretraži studije"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-zinc-950 transition hover:bg-zinc-100 sm:inline-flex"
          >
            <Search size={21} />
          </Link>
          <Link
            href="/studiji"
            aria-label="Sačuvani studiji"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-zinc-950 transition hover:bg-zinc-100 sm:inline-flex"
          >
            <Heart size={21} />
          </Link>
          <Link
            href="/studiji"
            aria-label="Otvori meni"
            className="inline-flex h-10 w-14 items-center justify-center rounded-full bg-zinc-950 text-white shadow-sm transition hover:bg-zinc-800"
          >
            <Menu size={22} />
          </Link>
        </div>
      </div>
    </header>
  );
}
