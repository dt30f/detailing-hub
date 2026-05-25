import type { PublicCity, PublicService, PublicStudio } from "@/lib/types";

export const sampleCities: PublicCity[] = [
  { id: "city-beograd", name: "Beograd", slug: "beograd" },
  { id: "city-novi-sad", name: "Novi Sad", slug: "novi-sad" },
  { id: "city-nis", name: "Niš", slug: "nis" },
  { id: "city-kragujevac", name: "Kragujevac", slug: "kragujevac" },
  { id: "city-subotica", name: "Subotica", slug: "subotica" },
  { id: "city-cacak", name: "Čačak", slug: "cacak" },
];

export const sampleServices: PublicService[] = [
  {
    id: "service-dubinsko-pranje",
    name: "Dubinsko pranje",
    slug: "dubinsko-pranje",
    category: "Enterijer",
    description:
      "Detaljno čišćenje enterijera, tekstila, sedišta, tepiha i teško dostupnih zona.",
  },
  {
    id: "service-poliranje-automobila",
    name: "Poliranje automobila",
    slug: "poliranje-automobila",
    category: "Eksterijer",
    description:
      "Korekcija laka, uklanjanje sitnih ogrebotina i vraćanje dubine sjaja.",
  },
  {
    id: "service-keramicka-zastita",
    name: "Keramička zaštita",
    slug: "keramicka-zastita",
    category: "Zaštita",
    description:
      "Dugotrajnija zaštita laka uz hidrofobni efekat i lakše održavanje vozila.",
  },
  {
    id: "service-ppf-folije",
    name: "PPF folije",
    slug: "ppf-folije",
    category: "Zaštita",
    description:
      "Zaštitne transparentne folije za delove vozila koji su izloženi oštećenjima.",
  },
  {
    id: "service-detailing-enterijera",
    name: "Detailing enterijera",
    slug: "detailing-enterijera",
    category: "Enterijer",
    description:
      "Temeljno sređivanje kabine, plastike, kože, tekstila i prtljažnika.",
  },
  {
    id: "service-detailing-eksterijera",
    name: "Detailing eksterijera",
    slug: "detailing-eksterijera",
    category: "Eksterijer",
    description:
      "Ručno pranje, dekontaminacija, priprema laka i zaštita spoljašnosti vozila.",
  },
  {
    id: "service-pranje-motora",
    name: "Pranje motora",
    slug: "pranje-motora",
    category: "Specijalne usluge",
    description:
      "Pažljivo čišćenje motornog prostora uz kontrolisanu primenu hemije i vode.",
  },
  {
    id: "service-poliranje-farova",
    name: "Poliranje farova",
    slug: "poliranje-farova",
    category: "Eksterijer",
    description:
      "Obnova zamućenih farova radi boljeg izgleda i sigurnije noćne vožnje.",
  },
  {
    id: "service-mobilno-pranje",
    name: "Mobilno pranje na adresi",
    slug: "mobilno-pranje-na-adresi",
    category: "Mobilne usluge",
    description:
      "Dolazak na adresu korisnika za pranje ili osnovni detailing vozila.",
  },
  {
    id: "service-uklanjanje-dlaka",
    name: "Uklanjanje dlaka kućnih ljubimaca",
    slug: "uklanjanje-dlaka-kucnih-ljubimaca",
    category: "Enterijer",
    description:
      "Specijalizovano čišćenje sedišta, tepiha i tapacirunga od dlaka ljubimaca.",
  },
  {
    id: "service-zastita-koze-plastike",
    name: "Zaštita kože i plastike",
    slug: "zastita-koze-i-plastike",
    category: "Zaštita",
    description:
      "Nega i zaštita kožnih, plastičnih i vinil površina u enterijeru.",
  },
  {
    id: "service-detailing-motocikala",
    name: "Detailing motocikala",
    slug: "detailing-motocikala",
    category: "Motocikli",
    description:
      "Pranje, poliranje i zaštita motocikala uz pažnju prema sitnim delovima.",
  },
];

const getCity = (slug: string) =>
  sampleCities.find((city) => city.slug === slug) ?? sampleCities[0];

const getService = (slug: string) =>
  sampleServices.find((service) => service.slug === slug) ?? sampleServices[0];

export const sampleStudios: PublicStudio[] = [
  {
    id: "studio-demo-beograd",
    name: "Demo Detailing Beograd",
    slug: "demo-detailing-beograd",
    shortDescription:
      "Primer profila za studio koji radi dubinsko pranje, poliranje i zaštitu laka.",
    description:
      "Ovo je demo profil za razvoj MVP-a. U produkciji se ovde unose samo provereni javni podaci ili podaci koje studio pošalje.",
    cityId: "city-beograd",
    city: getCity("beograd"),
    municipality: "Novi Beograd",
    address: "Primer adresa 1",
    phone: "+381 60 000 0000",
    instagram: "https://instagram.com",
    website: "https://example.com",
    whatsapp: "+381600000000",
    workingHours: { monFri: "09:00-18:00", sat: "10:00-15:00" },
    type: "STUDIO",
    status: "UNCLAIMED",
    sourceNote:
      "Demo profil. Produkcioni neovereni profili moraju biti označeni kao napravljeni na osnovu javno dostupnih informacija.",
    isFeatured: true,
    isPremium: false,
    isActive: true,
    services: [
      {
        id: "ss-demo-bg-dubinsko",
        priceFrom: 8000,
        priceTo: 18000,
        durationMin: 240,
        service: getService("dubinsko-pranje"),
      },
      {
        id: "ss-demo-bg-poliranje",
        priceFrom: 16000,
        priceTo: 45000,
        durationMin: 480,
        service: getService("poliranje-automobila"),
      },
      {
        id: "ss-demo-bg-keramika",
        priceFrom: 30000,
        priceTo: null,
        durationMin: 720,
        service: getService("keramicka-zastita"),
      },
    ],
    images: [],
  },
  {
    id: "studio-mobilni-sjaj",
    name: "Mobilni Sjaj Demo",
    slug: "mobilni-sjaj-demo",
    shortDescription:
      "Primer mobilnog detailera za pranje i detailing enterijera na adresi.",
    description:
      "Demo profil za proveru filtera mobilnih usluga i kontakt dugmadi.",
    cityId: "city-novi-sad",
    city: getCity("novi-sad"),
    municipality: "Limani",
    phone: "+381 61 000 0000",
    instagram: "https://instagram.com",
    whatsapp: "+381610000000",
    type: "MOBILE",
    status: "UNCLAIMED",
    sourceNote: "Demo profil za lokalni razvoj.",
    isFeatured: false,
    isPremium: true,
    isActive: true,
    services: [
      {
        id: "ss-mobilni-pranje",
        priceFrom: 2500,
        priceTo: 6000,
        durationMin: 90,
        service: getService("mobilno-pranje-na-adresi"),
      },
      {
        id: "ss-mobilni-enterijer",
        priceFrom: 7000,
        priceTo: 15000,
        durationMin: 180,
        service: getService("detailing-enterijera"),
      },
      {
        id: "ss-mobilni-dlake",
        priceFrom: 3000,
        priceTo: null,
        durationMin: 90,
        service: getService("uklanjanje-dlaka-kucnih-ljubimaca"),
      },
    ],
    images: [],
  },
  {
    id: "studio-ppf-nis",
    name: "PPF Studio Demo Niš",
    slug: "ppf-studio-demo-nis",
    shortDescription:
      "Primer specijalizovanog studija za PPF folije i keramičku zaštitu.",
    description:
      "Demo profil koji pokazuje kako će izgledati premium profil sa zaštitnim uslugama.",
    cityId: "city-nis",
    city: getCity("nis"),
    municipality: "Medijana",
    phone: "+381 62 000 0000",
    website: "https://example.com",
    type: "STUDIO",
    status: "VERIFIED",
    sourceNote: "Demo profil za lokalni razvoj.",
    isFeatured: true,
    isPremium: true,
    isActive: true,
    services: [
      {
        id: "ss-ppf-nis",
        priceFrom: 120000,
        priceTo: null,
        durationMin: 1440,
        service: getService("ppf-folije"),
      },
      {
        id: "ss-keramika-nis",
        priceFrom: 35000,
        priceTo: 90000,
        durationMin: 720,
        service: getService("keramicka-zastita"),
      },
      {
        id: "ss-eksterijer-nis",
        priceFrom: 9000,
        priceTo: 25000,
        durationMin: 240,
        service: getService("detailing-eksterijera"),
      },
    ],
    images: [],
  },
  {
    id: "studio-premium-wash-kg",
    name: "Premium Wash Demo",
    slug: "premium-wash-demo",
    shortDescription:
      "Primer premium perionice koja nudi detailing enterijera i poliranje farova.",
    description:
      "Demo profil za MVP listu studija i SEO stranice po gradovima.",
    cityId: "city-kragujevac",
    city: getCity("kragujevac"),
    municipality: "Centar",
    phone: "+381 63 000 0000",
    type: "BOTH",
    status: "CLAIMED",
    sourceNote: "Demo profil za lokalni razvoj.",
    isFeatured: false,
    isPremium: false,
    isActive: true,
    services: [
      {
        id: "ss-kg-enterijer",
        priceFrom: 6000,
        priceTo: 14000,
        durationMin: 180,
        service: getService("detailing-enterijera"),
      },
      {
        id: "ss-kg-farovi",
        priceFrom: 4000,
        priceTo: 9000,
        durationMin: 120,
        service: getService("poliranje-farova"),
      },
      {
        id: "ss-kg-motor",
        priceFrom: 2500,
        priceTo: 5000,
        durationMin: 60,
        service: getService("pranje-motora"),
      },
    ],
    images: [],
  },
];
