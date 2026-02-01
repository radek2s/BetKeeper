import { PrismaClient } from "@database/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

export function getPostgresClient() {
  const connectionString = `${process.env.DATABASE_URL_PG}`;

  const pool = new Pool({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false },
    max: 10,
  });

  const adapter = new PrismaPg(pool);
  const prismaClient = new PrismaClient({ adapter });

  return prismaClient;
}
