import {
  AtSign,
  ExternalLink,
  Globe,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";
import type { PublicStudio } from "@/lib/types";

function whatsappHref(value?: string | null) {
  if (!value) {
    return null;
  }

  const digits = value.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : null;
}

export function ContactButtons({ studio }: { studio: PublicStudio }) {
  const whatsapp = whatsappHref(studio.whatsapp || studio.phone);

  return (
    <div className="flex flex-wrap gap-2">
      {studio.phone ? (
        <a
          href={`tel:${studio.phone.replace(/\s/g, "")}`}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800"
        >
          <Phone size={16} />
          Pozovi
        </a>
      ) : null}

      {whatsapp ? (
        <a
          href={whatsapp}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-10 items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-4 text-sm font-semibold text-emerald-800 transition hover:border-emerald-300"
        >
          <MessageCircle size={16} />
          WhatsApp
        </a>
      ) : null}

      {studio.instagram ? (
        <a
          href={studio.instagram}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-10 items-center gap-2 rounded-md border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-800 transition hover:border-zinc-400"
        >
          <AtSign size={16} />
          Instagram
        </a>
      ) : null}

      {studio.website ? (
        <a
          href={studio.website}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-10 items-center gap-2 rounded-md border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-800 transition hover:border-zinc-400"
        >
          <Globe size={16} />
          Web sajt
          <ExternalLink size={14} />
        </a>
      ) : null}

      {studio.email ? (
        <a
          href={`mailto:${studio.email}`}
          className="inline-flex h-10 items-center gap-2 rounded-md border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-800 transition hover:border-zinc-400"
        >
          <Mail size={16} />
          Email
        </a>
      ) : null}
    </div>
  );
}
