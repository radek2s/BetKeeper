import type z from "zod";

export async function handleErrorResponse(
  res: Response,
  message: string = "Unhandled error reponse",
) {
  const data = await res.json();
  if (data.error === "Invalid request data") {
    throw new InvalidRequestDataError(data);
  }
  throw new Error(message);
}

export class InvalidRequestDataError extends Error {
  issues: z.core.$ZodIssue[];

  // biome-ignore lint/suspicious/noExplicitAny: Data should be validated
  constructor(data: any) {
    super(data.error);
    this.issues = data.issues;
  }
}
