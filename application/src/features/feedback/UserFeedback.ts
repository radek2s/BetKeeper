import { generateId } from "@domain/shared";
import type { FeedbackIssueType } from "./UserFeedbackSchema";

export class UserFeedback {
  readonly id: string;
  readonly issueType: FeedbackIssueType;
  readonly createdAt: Date;
  readonly userId: string;
  readonly message: string;
  seen: boolean;

  constructor(
    userId: string,
    issueType: FeedbackIssueType,
    message: string,
    id?: string,
    createdAt?: Date,
  ) {
    this.id = id ?? generateId();
    this.userId = userId;
    this.issueType = issueType;
    this.message = message;
    this.createdAt = createdAt ?? new Date();
    this.seen = false;
  }

  static reconstitute(
    id: string,
    userId: string,
    issueType: FeedbackIssueType,

    message: string,
    createdAt: Date,
    seen: boolean,
  ) {
    const feedback = new UserFeedback(
      userId,
      issueType,
      message,
      id,
      createdAt,
    );
    feedback.seen = seen;
    return feedback;
  }
}
