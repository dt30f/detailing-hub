import { PrismaClient, type Prisma } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";
import { sampleCities, sampleServices, sampleStudios } from "../lib/sample-data";

const prisma = new PrismaClient({
  adapter: new PrismaPg(
    process.env.DATABASE_URL ||
      "postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public",
  ),
});

async function main() {
  for (const city of sampleCities) {
    await prisma.city.upsert({
      where: { slug: city.slug },
      update: { name: city.name },
      create: { name: city.name, slug: city.slug },
    });
  }

  for (const service of sampleServices) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {
        name: service.name,
        category: service.category,
        description: service.description,
      },
      create: {
        name: service.name,
        slug: service.slug,
        category: service.category,
        description: service.description,
      },
    });
  }

  const adminEmail = (process.env.ADMIN_EMAIL || "admin@detailinghub.rs").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "admin12345";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: "ADMIN",
      name: "DetailingHub Admin",
    },
    create: {
      email: adminEmail,
      passwordHash: await hash(adminPassword, 10),
      name: "DetailingHub Admin",
      role: "ADMIN",
    },
  });

  for (const studio of sampleStudios) {
    const city = await prisma.city.findUniqueOrThrow({
      where: { slug: studio.city.slug },
    });

    const workingHours = studio.workingHours as
      | Prisma.InputJsonValue
      | undefined;

    const savedStudio = await prisma.detailingStudio.upsert({
      where: { slug: studio.slug },
      update: {
        name: studio.name,
        shortDescription: studio.shortDescription,
        description: studio.description,
        cityId: city.id,
        address: studio.address,
        municipality: studio.municipality,
        phone: studio.phone,
        email: studio.email,
        website: studio.website,
        instagram: studio.instagram,
        whatsapp: studio.whatsapp,
        workingHours,
        type: studio.type,
        status: studio.status,
        sourceNote: studio.sourceNote,
        isFeatured: studio.isFeatured,
        isPremium: studio.isPremium,
        isActive: studio.isActive,
      },
      create: {
        name: studio.name,
        slug: studio.slug,
        shortDescription: studio.shortDescription,
        description: studio.description,
        cityId: city.id,
        address: studio.address,
        municipality: studio.municipality,
        phone: studio.phone,
        email: studio.email,
        website: studio.website,
        instagram: studio.instagram,
        whatsapp: studio.whatsapp,
        workingHours,
        type: studio.type,
        status: studio.status,
        sourceNote: studio.sourceNote,
        isFeatured: studio.isFeatured,
        isPremium: studio.isPremium,
        isActive: studio.isActive,
      },
    });

    await prisma.studioService.deleteMany({
      where: { studioId: savedStudio.id },
    });

    for (const studioService of studio.services) {
      const service = await prisma.service.findUniqueOrThrow({
        where: { slug: studioService.service.slug },
      });

      await prisma.studioService.create({
        data: {
          studioId: savedStudio.id,
          serviceId: service.id,
          priceFrom: studioService.priceFrom,
          priceTo: studioService.priceTo,
          durationMin: studioService.durationMin,
          description: studioService.description,
        },
      });
    }
  }

  console.log("Seed complete: cities, services, demo studios and admin user.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
