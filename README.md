# DetailingHub MVP

Marketplace direktorijum za auto detailing usluge u Srbiji. MVP pokriva javni direktorijum, SEO landing stranice, admin CRUD osnovu, lead formu i claim zahtev.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma 7 + `@prisma/adapter-pg`
- Zod validacija
- Jednostavan admin cookie login

## Lokalno pokretanje

```bash
npm install
npm run dev
```

Public deo radi i bez povezane baze preko demo fallback podataka.

Admin login za lokalni demo:

```txt
admin@detailinghub.rs
admin12345
```

## PostgreSQL setup

1. Kopirati `.env.example` u `.env`.
2. Podesiti `DATABASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `AUTH_SECRET` i
   `ANALYTICS_SALT`.
   Za Supabase koristiti Supavisor Session pooler string na portu `5432`. Direct
   `db.<project-ref>.supabase.co` string često zahteva IPv6 i može da ne radi iz
   lokalnog okruženja bez IPv6 podrške.
3. Po želji podesiti `DIRECT_URL`. Ako nije podešen, Prisma CLI koristi
   `DATABASE_URL`.
   `DATABASE_POOL_MAX` može ostati `3` za Supabase pooler u MVP fazi.
4. Pokrenuti:

```bash
npm run db:push
npm run db:seed
npm run dev
```

Korisne komande:

```bash
npm run lint
npm run build
npm run db:studio
```

## Glavne rute

- `/` početna strana
- `/studiji` lista i filteri
- `/studiji/[slug]` profil studija
- `/usluge/[slug]` SEO stranica za uslugu
- `/grad/[slug]` SEO stranica za grad
- `/admin` admin pregled
- `/admin/analytics` analitika pregleda profila
- `/admin/studios` admin CRUD za studije
- `/admin/services` usluge
- `/admin/cities` gradovi
- `/admin/inquiries` upiti
- `/admin/claims` zahtevi za preuzimanje profila

## Legal napomena

Za neoverene profile ne koristiti tuđe slike, logotipe ili kopiran tekst. Unositi samo osnovne javno dostupne podatke ili informacije koje studio sam pošalje, uz jasnu oznaku da profil nije potvrđen.
