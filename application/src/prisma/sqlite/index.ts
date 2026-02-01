import "dotenv/config";
import * as path from "node:path";
import { PrismaClient } from "@database/generated/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

function normalizeSqliteUrl(raw: string | undefined) {
  if (!raw) throw new Error("Env DATABASE_URL is undefined!");

  if (!raw.startsWith("file:")) return raw;

  const filePart = raw.slice(5);
  const isRelative =
    filePart.startsWith("./") ||
    filePart.startsWith("../") ||
    !path.isAbsolute(filePart);
  const base = process.env.PROJECT_DIR || process.cwd();

  let abs = filePart;
  if (isRelative) {
    abs = path.resolve(base, filePart);
  }

  // Ensure forward slashes for Prisma on Windows
  const normalized = abs.split(path.sep).join("/");
  return `file:${normalized}`;
}

export function getSqliteClient() {
  const connectionString = normalizeSqliteUrl(process.env.DATABASE_URL);

  const adapter = new PrismaBetterSqlite3({ url: connectionString });
  const prismaClient = new PrismaClient({ adapter });

  return prismaClient;
}
