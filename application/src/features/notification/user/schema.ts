import z from "zod";

export const UserNotificationSettingsSchema = z.object({
  userId: z.string(),
  friendInvitation: z.boolean(),
  betRequestInvitation: z.boolean(),
  betRequestAgreed: z.boolean(),
  betResolved: z.boolean(),
  betCompleted: z.boolean(),
});

export type UserNotificationSettingsType = z.infer<
  typeof UserNotificationSettingsSchema
>;
