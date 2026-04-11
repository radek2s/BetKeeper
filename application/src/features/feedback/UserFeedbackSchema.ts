import z from "zod";

export const FeedbackIssueTypeSchema = z.enum(["BUG", "IMPROVEMENT"]);
export type FeedbackIssueType = z.infer<typeof FeedbackIssueTypeSchema>;

export const UserFeedbackRequestSchema = z.object({
  issueType: FeedbackIssueTypeSchema,
  message: z.string(),
});

export type UserFeedbackRequestType = z.infer<typeof UserFeedbackRequestSchema>;

export const UserFeedbackResponseSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  issueType: FeedbackIssueTypeSchema,
  message: z.string(),
});

export type UserFeedbackResponseType = z.infer<
  typeof UserFeedbackResponseSchema
>;

export const UserProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
});

export type UserProfileSchemaType = z.infer<typeof UserProfileSchema>;

export const UserFeedbackAdminResponseSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  createdBy: UserProfileSchema,
  issueType: FeedbackIssueTypeSchema,
  message: z.string(),
  seen: z.boolean(),
});

export type UserFeedbackAdminResponseSchemaType = z.infer<
  typeof UserFeedbackAdminResponseSchema
>;
