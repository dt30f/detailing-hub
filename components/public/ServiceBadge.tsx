import Link from "next/link";
import type { PublicService } from "@/lib/types";

export function ServiceBadge({ service }: { service: PublicService }) {
  return (
    <Link
      href={`/usluge/${service.slug}`}
      className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-950"
    >
      {service.name}
    </Link>
  );
}
