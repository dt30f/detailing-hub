"use client";

type DeleteStudioButtonProps = {
  action: (formData: FormData) => Promise<void>;
  studioId: string;
  studioName: string;
};

export function DeleteStudioButton({
  action,
  studioId,
  studioName,
}: DeleteStudioButtonProps) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        const confirmed = window.confirm(
          `Trajno obrisati profil "${studioName}"? Ovo brise profil, upite, claim zahteve, preglede i povezane podatke.`,
        );

        if (!confirmed) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="studioId" value={studioId} />
      <button className="h-9 rounded-md border border-red-200 px-3 text-xs font-semibold text-red-700 transition hover:bg-red-50">
        Obriši
      </button>
    </form>
  );
}
