import { getPostgresClient } from "./postgres";
import { getSqliteClient } from "./sqlite";

const adapterType = process.env.DATABASE_SCHEMA;

if (!adapterType) throw new Error("Env DATABASE_SCHEMA is undefined!");

/**
 * Prisma Client strategy
 * @param adapterType schema_sqlite | schema_pg
 * @returns
 */
function getClient(adapterType: string) {
  switch (adapterType) {
    case "schema_sqlite":
      return getSqliteClient();
    case "schema_pg":
      return getPostgresClient();
    default:
      throw new Error(`Unsupported adapter type=${adapterType}`);
  }
}

const prisma = getClient(adapterType);
export { prisma };
