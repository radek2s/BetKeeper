import { getPostgresClient } from "./postgres";
import { getSqliteClient } from "./sqlite";

function createClient() {
  const adapterType = process.env.DATABASE_SCHEMA;
  if (!adapterType) throw new Error("Env DATABASE_SCHEMA is undefined!");

  switch (adapterType) {
    case "schema_sqlite":
      return getSqliteClient();
    case "schema_pg":
      return getPostgresClient();
    default:
      throw new Error(`Unsupported adapter type=${adapterType}`);
  }
}

const prisma = createClient();
export { prisma };
