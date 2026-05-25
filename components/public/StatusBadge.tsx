import type { StudioStatus } from "@/lib/types";

const STATUS_LABELS: Record<StudioStatus, string> = {
  UNCLAIMED: "Neoveren profil",
  CLAIMED: "Preuzet profil",
  VERIFIED: "Verifikovan",
  HIDDEN: "Sakriven",
};

const STATUS_CLASSES: Record<StudioStatus, string> = {
  UNCLAIMED: "border-amber-200 bg-amber-50 text-amber-800",
  CLAIMED: "border-sky-200 bg-sky-50 text-sky-800",
  VERIFIED: "border-emerald-200 bg-emerald-50 text-emerald-800",
  HIDDEN: "border-zinc-200 bg-zinc-100 text-zinc-600",
};

export function StatusBadge({ status }: { status: StudioStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${STATUS_CLASSES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
