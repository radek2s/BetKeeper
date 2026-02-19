import { MailtrapClient } from "mailtrap";

const mailtrapApiKey = process.env.MAILTRAP_API_KEY;

export const mailtrapClinet: MailtrapClient | null = mailtrapApiKey
  ? new MailtrapClient({
      token: mailtrapApiKey,
    })
  : null;
