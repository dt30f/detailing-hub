import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";

const demoSlugs = [
  "demo-detailing-beograd",
  "mobilni-sjaj-demo",
  "ppf-studio-demo-nis",
  "premium-wash-demo",
];

const prisma = new PrismaClient({
  adapter: new PrismaPg(
    process.env.DIRECT_URL ||
      process.env.DATABASE_URL ||
      "postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public",
  ),
});

async function main() {
  const result = await prisma.detailingStudio.updateMany({
    where: { slug: { in: demoSlugs } },
    data: {
      status: "HIDDEN",
      isActive: false,
      isFeatured: false,
      isPremium: false,
    },
  });

  console.log(`Hidden ${result.count} demo studio profiles.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
