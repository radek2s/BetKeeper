import "dotenv/config";
import { PrismaClient } from "@database/generated/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

export function getSqliteClient() {
  const connectionString = `${process.env.DATABASE_URL}`;

  const adapter = new PrismaBetterSqlite3({ url: connectionString });
  const prismaClient = new PrismaClient({ adapter });

  return prismaClient;
}
