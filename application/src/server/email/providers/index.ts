import NextUserRepository from "@app/server/repositories/NextUserRepository";
import logger from "application/logger";
import type { EmailProvider } from "../emailProvider.interface";
import MailtrapProvider from "./MailtrapProvider";

const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER;

function getEmailProvider(): EmailProvider | null {
  if (EMAIL_PROVIDER && EMAIL_PROVIDER === "MAILTRAP") {
    return new MailtrapProvider(new NextUserRepository());
  }

  logger.info("Email provider not configured. Emails will not be sent.");
  return null;
}
export default getEmailProvider;
