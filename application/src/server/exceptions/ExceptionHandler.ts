import { DomainError } from "@domain/shared/DomainError";
import logger from "application/logger";
import z from "zod";
import { AuthenticationError } from "./AuthenticationError";
import type { ExceptionResponseBody } from "./exception.interface";

export type ExceptionHandlerI = (
  e: Error,
) => { body: ExceptionResponseBody; status: number } | null;

export function ExceptionHandler(e: unknown, handler?: ExceptionHandlerI) {
  if (e instanceof Error) {
    console.error(e);
    logger.error(e.message);

    try {
      if (handler) {
        const response = handler(e);
        if (response)
          return Response.json(response.body, { status: response.status });
      }
    } catch {}
    if (e instanceof z.ZodError) {
      const body: ExceptionResponseBody & { issues: z.core.$ZodIssue[] } = {
        error: "Invalid request data",
        message: e.message,
        issues: e.issues,
      };
      return Response.json(body, { status: 400 });
    }
    if (e instanceof AuthenticationError) {
      return AuthExceptionHandler(e);
    }
    if (e instanceof DomainError) {
      return DomainExceptionHanlder(e);
    }
    const body: ExceptionResponseBody = { error: "Internal server error" };
    return Response.json(body, { status: 500 });
  }
  throw e;
}

export function AuthExceptionHandler(e: AuthenticationError) {
  const body: ExceptionResponseBody = {
    error: "Authentication Error",
    message: e.message,
  };
  return Response.json(body, { status: 403 });
}

export function DomainExceptionHanlder(e: DomainError) {
  const body: ExceptionResponseBody = {
    error: "Business rules error",
    message: e.message,
  };
  return Response.json(body, { status: 400 });
}
