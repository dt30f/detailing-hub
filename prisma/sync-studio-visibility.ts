import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const visibleStatuses = ["UNCLAIMED", "CLAIMED", "VERIFIED"] as const;
const hiddenStatuses = ["PENDING_REVIEW", "HIDDEN"] as const;

const pool = new Pool({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
  max: 1,
});

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

async function main() {
  const visibleResult = await prisma.detailingStudio.updateMany({
    where: {
      status: { in: [...visibleStatuses] },
      isActive: false,
    },
    data: { isActive: true },
  });

  const hiddenResult = await prisma.detailingStudio.updateMany({
    where: {
      status: { in: [...hiddenStatuses] },
      isActive: true,
    },
    data: { isActive: false },
  });

  console.log(
    JSON.stringify(
      {
        activatedVisibleProfiles: visibleResult.count,
        deactivatedHiddenProfiles: hiddenResult.count,
      },
      null,
      2,
    ),
  );
}

main()
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
