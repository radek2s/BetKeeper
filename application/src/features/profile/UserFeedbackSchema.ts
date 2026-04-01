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
