import "dotenv/config";
import { PrismaClient } from "@database/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";

export function getPostgresClient() {
  const connectionString = `${process.env.DATABASE_URL_PG}`;

  const adapter = new PrismaPg({ url: connectionString });
  const prismaClient = new PrismaClient({ adapter });

  return prismaClient;
}
