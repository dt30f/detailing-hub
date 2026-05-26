import Link from "next/link";

const navItems = [
  { href: "/studiji", label: "Studiji" },
  { href: "/usluge/dubinsko-pranje", label: "Usluge" },
  { href: "/#kako-radi", label: "Kako radi" },
  { href: "/za-studije", label: "Za studije" },
  { href: "/za-studije#kontakt", label: "Kontakt" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-black text-zinc-950">
          Detailing<span className="text-sky-500">Hub</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-zinc-700 lg:flex">
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

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/studiji"
            className="hidden h-11 items-center justify-center rounded-full px-4 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100 sm:inline-flex"
          >
            Pronađi studio
          </Link>
          <Link
            href="/za-studije"
            className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-950 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800"
          >
            Preuzmi profil
          </Link>
        </div>
      </div>
    </header>
  );
}
