import { Prisma } from "@db/*";
import logger from "application/logger";

export class DatabaseError extends Error {
  constructor(
    message: string,
    public code: string,
  ) {
    super(message);
    this.name = "Database error";
  }
}

export function handleDbError(e: unknown) {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    logger.error(`${e.code}: ${e.message}`);
    return new DatabaseError(e.message, e.code);
  } else {
    return e;
  }
}
