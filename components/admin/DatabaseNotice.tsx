export function DatabaseNotice() {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
      PostgreSQL baza nije povezana ili je ostavljen placeholder `DATABASE_URL`.
      Public deo koristi demo podatke, a admin izmene će raditi nakon podešavanja
      baze i pokretanja `npm run db:push` i `npm run db:seed`.
    </div>
  );
}
