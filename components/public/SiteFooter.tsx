import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-zinc-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>DetailingHub MVP direktorijum auto detailing usluga u Srbiji.</p>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-zinc-950">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-zinc-950">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
