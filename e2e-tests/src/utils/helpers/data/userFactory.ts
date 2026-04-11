import { generateShortAlphanumericRandomString } from "./randomStingsFactory";

export function generateRandomMail(prefix: string): string {
  return `${prefix}_user_${generateShortAlphanumericRandomString()}@test.com`;
}
