import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type StudioType } from "../lib/generated/prisma/client";
import { slugify } from "../lib/slug";

type RealStudioSeed = {
  name: string;
  city: string;
  municipality?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  instagram?: string;
  whatsapp?: string;
  type?: StudioType;
  serviceSlugs: string[];
  sourceLabel: string;
  sourceUrl: string;
};

const DEFAULT_SERVICES = [
  "dubinsko-pranje",
  "poliranje-automobila",
  "detailing-enterijera",
  "detailing-eksterijera",
];

const realStudios: RealStudioSeed[] = [
  {
    name: "MAGNA Detailing",
    city: "Beograd",
    phone: "+381637441144",
    website: "https://magna-detailing.rs/",
    serviceSlugs: [
      "dubinsko-pranje",
      "poliranje-automobila",
      "keramicka-zastita",
      "detailing-enterijera",
      "detailing-eksterijera",
    ],
    sourceLabel: "zvanični sajt MAGNA Detailing",
    sourceUrl: "https://magna-detailing.rs/",
  },
  {
    name: "M Polish",
    city: "Beograd",
    phone: "+381659696965",
    email: "mpolish.info@gmail.com",
    website: "https://mpolish.com/",
    serviceSlugs: [
      "dubinsko-pranje",
      "poliranje-automobila",
      "keramicka-zastita",
      "detailing-enterijera",
      "detailing-eksterijera",
    ],
    sourceLabel: "zvanični sajt M Polish",
    sourceUrl: "https://mpolish.com/",
  },
  {
    name: "Vanguard Detailing",
    city: "Beograd",
    phone: "+381655585188",
    website: "https://vanguard-dc.com/",
    serviceSlugs: [
      "dubinsko-pranje",
      "poliranje-automobila",
      "keramicka-zastita",
      "ppf-folije",
      "detailing-enterijera",
      "detailing-eksterijera",
    ],
    sourceLabel: "zvanični sajt Vanguard Detailing",
    sourceUrl: "https://vanguard-dc.com/",
  },
  {
    name: "Detailing Garage 035",
    city: "Ćuprija",
    website: "https://detailinggarage035.com/",
    serviceSlugs: [
      "dubinsko-pranje",
      "poliranje-automobila",
      "keramicka-zastita",
      "detailing-enterijera",
      "detailing-eksterijera",
    ],
    sourceLabel: "zvanični sajt Detailing Garage 035",
    sourceUrl: "https://detailinggarage035.com/",
  },
  {
    name: "Dominanz Auto Detailing",
    city: "Beograd",
    municipality: "Novi Beograd",
    address: "Marka Čelebonovića 18",
    phone: "0691716000",
    email: "info@dominanz.rs",
    website: "https://www.dominanz.rs/",
    serviceSlugs: [
      "poliranje-automobila",
      "keramicka-zastita",
      "ppf-folije",
      "detailing-enterijera",
      "detailing-eksterijera",
    ],
    sourceLabel: "zvanični sajt Dominanz",
    sourceUrl: "https://www.dominanz.rs/",
  },
  {
    name: "Auto Detailing Workshop",
    city: "Beograd",
    municipality: "Zemun",
    address: "Zadrugarska 3d",
    phone: "0642566278",
    email: "info@autodetailingworkshop.rs",
    website: "https://autodetailingworkshop.rs/",
    serviceSlugs: [
      "dubinsko-pranje",
      "poliranje-automobila",
      "keramicka-zastita",
      "ppf-folije",
      "detailing-enterijera",
      "detailing-eksterijera",
    ],
    sourceLabel: "zvanični sajt Auto Detailing Workshop",
    sourceUrl: "https://autodetailingworkshop.rs/",
  },
  {
    name: "Sredi Auto",
    city: "Beograd",
    website: "https://srediauto.rs/",
    serviceSlugs: [
      "dubinsko-pranje",
      "poliranje-automobila",
      "poliranje-farova",
      "detailing-enterijera",
      "detailing-eksterijera",
    ],
    sourceLabel: "zvanični sajt Sredi Auto",
    sourceUrl: "https://srediauto.rs/",
  },
  {
    name: "Paulin Detailing",
    city: "Novi Sad",
    address: "Devet Jugovića 9",
    phone: "+38163350038",
    email: "info@paulindetailing.rs",
    website: "https://paulindetailing.rs/",
    serviceSlugs: [
      "poliranje-automobila",
      "keramicka-zastita",
      "ppf-folije",
      "detailing-enterijera",
      "detailing-eksterijera",
    ],
    sourceLabel: "zvanični sajt Paulin Detailing",
    sourceUrl: "https://paulindetailing.rs/",
  },
  {
    name: "Bacić Auto Detailing",
    city: "Novi Sad",
    address: "Temerinski put 10a",
    phone: "+381603862855",
    email: "bacicdetailing@gmail.com",
    website: "https://autodetailingns.com/",
    serviceSlugs: DEFAULT_SERVICES,
    sourceLabel: "zvanični sajt Bacić Auto Detailing",
    sourceUrl: "https://autodetailingns.com/",
  },
  {
    name: "M Auto Detailing",
    city: "Kragujevac",
    address: "Milovana Gušića 49",
    phone: "062646087",
    website: "https://www.mautodetailing.rs/",
    serviceSlugs: [
      "dubinsko-pranje",
      "poliranje-automobila",
      "keramicka-zastita",
      "ppf-folije",
      "detailing-enterijera",
      "detailing-eksterijera",
    ],
    sourceLabel: "zvanični sajt M Auto Detailing",
    sourceUrl: "https://www.mautodetailing.rs/",
  },
  {
    name: "Maestro Detailing",
    city: "Niš",
    address: "Prvomajska 44",
    phone: "0642270200",
    website: "https://maestro-detailing.rs/",
    serviceSlugs: [
      "dubinsko-pranje",
      "poliranje-automobila",
      "keramicka-zastita",
      "detailing-enterijera",
      "detailing-eksterijera",
    ],
    sourceLabel: "zvanični sajt Maestro Detailing",
    sourceUrl: "https://maestro-detailing.rs/",
  },
  {
    name: "Auto Oaza",
    city: "Niš",
    address: "Donjovrežinska 25",
    phone: "0600344222",
    email: "autooaza.info@gmail.com",
    website: "https://autooaza.rs/",
    serviceSlugs: DEFAULT_SERVICES,
    sourceLabel: "zvanični sajt Auto Oaza",
    sourceUrl: "https://autooaza.rs/",
  },
  {
    name: "Auto Centar BMF",
    city: "Niš",
    address: "Bubanjskih heroja 1",
    phone: "063426267",
    email: "office@autocentar-bmf.rs",
    website: "https://autocentar-bmf.rs/",
    serviceSlugs: DEFAULT_SERVICES,
    sourceLabel: "zvanični sajt Auto Centar BMF",
    sourceUrl: "https://autocentar-bmf.rs/",
  },
  {
    name: "Zoki Magic",
    city: "Niš",
    address: "Stevana Nemanje 74",
    phone: "0659882972",
    website: "https://zokimagic.rs/",
    serviceSlugs: DEFAULT_SERVICES,
    sourceLabel: "zvanični sajt Zoki Magic",
    sourceUrl: "https://zokimagic.rs/",
  },
  {
    name: "CarDetailing NIS",
    city: "Niš",
    website: "https://cardetailingnis.rs/",
    serviceSlugs: [
      "dubinsko-pranje",
      "poliranje-automobila",
      "keramicka-zastita",
      "detailing-enterijera",
      "detailing-eksterijera",
    ],
    sourceLabel: "zvanični sajt CarDetailing NIS",
    sourceUrl: "https://cardetailingnis.rs/",
  },
  {
    name: "Arhont",
    city: "Beograd",
    address: "Dragoslava Srejovića 86b",
    phone: "+381648266525",
    website: "https://arhont.rs/",
    serviceSlugs: ["ppf-folije", "keramicka-zastita", "detailing-eksterijera"],
    sourceLabel: "zvanični sajt Arhont",
    sourceUrl: "https://arhont.rs/",
  },
  {
    name: "Auto Detailing Clear",
    city: "Beograd",
    website: "https://detailingclear.rs/",
    serviceSlugs: [
      "dubinsko-pranje",
      "keramicka-zastita",
      "ppf-folije",
      "detailing-enterijera",
      "detailing-eksterijera",
    ],
    sourceLabel: "zvanični sajt Auto Detailing Clear",
    sourceUrl: "https://detailingclear.rs/",
  },
  {
    name: "DS Auto Cleaning",
    city: "Beograd",
    municipality: "Surčin",
    address: "Vojvođanska 420",
    phone: "+381642550305",
    website: "https://dsautocleaning.rs/",
    serviceSlugs: [
      "dubinsko-pranje",
      "poliranje-automobila",
      "keramicka-zastita",
      "ppf-folije",
      "detailing-enterijera",
      "detailing-eksterijera",
    ],
    sourceLabel: "zvanični sajt DS Auto Cleaning",
    sourceUrl: "https://dsautocleaning.rs/",
  },
  {
    name: "Mobilni Detailing PRIMUS",
    city: "Valjevo",
    type: "MOBILE",
    website: "https://www.mobilnidetailingprimus.rs/",
    serviceSlugs: [
      "mobilno-pranje-na-adresi",
      "dubinsko-pranje",
      "poliranje-automobila",
      "poliranje-farova",
    ],
    sourceLabel: "zvanični sajt Mobilni Detailing PRIMUS",
    sourceUrl: "https://www.mobilnidetailingprimus.rs/",
  },
  {
    name: "DetailKing Studio",
    city: "Beograd",
    serviceSlugs: DEFAULT_SERVICES,
    sourceLabel: "OnlyCar javni direktorijum",
    sourceUrl: "https://www.onlycar.rs/auto-centar/detailking-studio/",
  },
  {
    name: "AAA Auto Detailing",
    city: "Beograd",
    address: "Višnjički venac 20",
    phone: "063418124",
    serviceSlugs: DEFAULT_SERVICES,
    sourceLabel: "Titanium javni direktorijum",
    sourceUrl: "https://titanium.rs/gde-srediti-auto/",
  },
  {
    name: "MTM Auto Detailing",
    city: "Temerin",
    address: "Prote Mateje Nenadovića 9",
    phone: "0631456869",
    serviceSlugs: DEFAULT_SERVICES,
    sourceLabel: "Titanium javni direktorijum",
    sourceUrl: "https://titanium.rs/gde-srediti-auto/",
  },
  {
    name: "VV Car Detailing",
    city: "Beograd",
    address: "Dvadesetsedmog marta 44",
    phone: "0629088148",
    serviceSlugs: DEFAULT_SERVICES,
    sourceLabel: "Titanium javni direktorijum",
    sourceUrl: "https://titanium.rs/gde-srediti-auto/",
  },
  {
    name: "Premium Shine Detailing",
    city: "Ljig",
    address: "Radovana Petrovića 69",
    phone: "0649585855",
    serviceSlugs: DEFAULT_SERVICES,
    sourceLabel: "Titanium javni direktorijum",
    sourceUrl: "https://titanium.rs/gde-srediti-auto/",
  },
  {
    name: "Level Pro",
    city: "Donja Borina",
    address: "Selo Donja Borina",
    phone: "0649972188",
    serviceSlugs: DEFAULT_SERVICES,
    sourceLabel: "Titanium javni direktorijum",
    sourceUrl: "https://titanium.rs/gde-srediti-auto/",
  },
  {
    name: "Aleksandar Autostyling",
    city: "Vojka",
    address: "Braće Micić 28",
    phone: "063522040",
    serviceSlugs: DEFAULT_SERVICES,
    sourceLabel: "Titanium javni direktorijum",
    sourceUrl: "https://titanium.rs/gde-srediti-auto/",
  },
  {
    name: "Drobac Pit Stop",
    city: "Beograd",
    municipality: "Zemun",
    address: "Matije Gupca 3a",
    phone: "0643871223",
    serviceSlugs: DEFAULT_SERVICES,
    sourceLabel: "Titanium javni direktorijum",
    sourceUrl: "https://titanium.rs/gde-srediti-auto/",
  },
  {
    name: "DUO System Koceljeva",
    city: "Koceljeva",
    address: "Svetosavska 66",
    phone: "0628109090",
    serviceSlugs: DEFAULT_SERVICES,
    sourceLabel: "Titanium javni direktorijum",
    sourceUrl: "https://titanium.rs/gde-srediti-auto/",
  },
  {
    name: "BMB Detailing",
    city: "Beograd",
    address: "Ivana Mičurina 23",
    website: "https://bmbdetailing.rs/",
    serviceSlugs: [
      "poliranje-automobila",
      "detailing-enterijera",
      "detailing-eksterijera",
    ],
    sourceLabel: "zvanični sajt BMB Detailing",
    sourceUrl: "https://bmbdetailing.rs/",
  },
];

const prisma = new PrismaClient({
  adapter: new PrismaPg(
    process.env.DIRECT_URL ||
      process.env.DATABASE_URL ||
      "postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public",
  ),
});

function sourceNoteFor(studio: RealStudioSeed) {
  return `Neoveren profil napravljen ručnim unosom osnovnih javno dostupnih informacija. Izvor: ${studio.sourceLabel} (${studio.sourceUrl}). Vlasnik može da zatraži izmenu ili uklanjanje profila.`;
}

function shortDescriptionFor(studio: RealStudioSeed) {
  const typeLabel =
    studio.type === "MOBILE" ? "mobilne auto detailing usluge" : "auto detailing usluge";

  return `Neoveren profil za ${typeLabel} u gradu ${studio.city}.`;
}

function descriptionFor() {
  return `Ovaj profil je dodat u DetailingHub kao neoveren unos za osnovnu pretragu detailing usluga. Podaci su ručno uneti iz javno dostupnog izvora i korisnik treba da proveri kontakt, cene i dostupnost direktno sa studijom.`;
}

async function main() {
  const services = await prisma.service.findMany();
  const servicesBySlug = new Map(services.map((service) => [service.slug, service.id]));

  for (const studio of realStudios) {
    const missingServices = studio.serviceSlugs.filter((slug) => !servicesBySlug.has(slug));

    if (missingServices.length > 0) {
      throw new Error(
        `${studio.name} references missing services: ${missingServices.join(", ")}`,
      );
    }
  }

  let importedCount = 0;

  for (const studio of realStudios) {
    const citySlug = slugify(studio.city);
    const city = await prisma.city.upsert({
      where: { slug: citySlug },
      update: { name: studio.city },
      create: { name: studio.city, slug: citySlug },
    });

    const savedStudio = await prisma.detailingStudio.upsert({
      where: { slug: slugify(studio.name) },
      update: {
        name: studio.name,
        shortDescription: shortDescriptionFor(studio),
        description: descriptionFor(),
        cityId: city.id,
        address: studio.address,
        municipality: studio.municipality,
        phone: studio.phone,
        email: studio.email,
        website: studio.website,
        instagram: studio.instagram,
        whatsapp: studio.whatsapp,
        type: studio.type ?? "STUDIO",
        status: "UNCLAIMED",
        sourceNote: sourceNoteFor(studio),
        isActive: true,
        isFeatured: false,
        isPremium: false,
      },
      create: {
        name: studio.name,
        slug: slugify(studio.name),
        shortDescription: shortDescriptionFor(studio),
        description: descriptionFor(),
        cityId: city.id,
        address: studio.address,
        municipality: studio.municipality,
        phone: studio.phone,
        email: studio.email,
        website: studio.website,
        instagram: studio.instagram,
        whatsapp: studio.whatsapp,
        type: studio.type ?? "STUDIO",
        status: "UNCLAIMED",
        sourceNote: sourceNoteFor(studio),
        isActive: true,
        isFeatured: false,
        isPremium: false,
      },
    });

    await prisma.studioService.deleteMany({
      where: { studioId: savedStudio.id },
    });

    await prisma.studioService.createMany({
      data: studio.serviceSlugs.map((serviceSlug) => ({
        studioId: savedStudio.id,
        serviceId: servicesBySlug.get(serviceSlug) as string,
      })),
      skipDuplicates: true,
    });

    importedCount += 1;
  }

  console.log(`Imported ${importedCount} real unclaimed studio profiles.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
