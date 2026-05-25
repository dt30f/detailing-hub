import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const databaseUrl =
  process.env.DATABASE_URL ||
  "postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public";

function getPoolMax() {
  const value = Number.parseInt(process.env.DATABASE_POOL_MAX || "3", 10);

  return Number.isFinite(value) && value > 0 ? value : 3;
}

function createPrismaClient() {
  const pool = new Pool({
    connectionString: databaseUrl,
    max: getPoolMax(),
  });

  return new PrismaClient({
    adapter: new PrismaPg(pool),
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export function isDatabaseConfigured() {
  const url = process.env.DATABASE_URL;

  return Boolean(
    url &&
      !url.includes("johndoe:randompassword") &&
      !url.includes("USER:PASSWORD"),
  );
}
