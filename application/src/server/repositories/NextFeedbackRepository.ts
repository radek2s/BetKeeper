import { UserFeedback } from "@app/features/feedback/UserFeedback";
import type { FeedbackIssueType } from "@app/features/feedback/UserFeedbackSchema";
import prisma from "../db";
import { handleDbError } from "../db/exceptions";

export interface IFeedbackRepository {
  findAll(): Promise<UserFeedback[]>;
  save(feedback: UserFeedback): Promise<void>;
  markAsSeen(feedbackId: string): Promise<void>;
}

export class NextFeedbackRepository implements IFeedbackRepository {
  private table = prisma.userFeedbackTable;

  async findAll(): Promise<UserFeedback[]> {
    const feedback = await this.table.findMany();
    return feedback.map((item) =>
      UserFeedback.reconstitute(
        item.feedbackId,
        item.userId,
        item.issueType as FeedbackIssueType,
        item.message,
        item.createdAt,
        item.seen,
      ),
    );
  }

  async save(feedback: UserFeedback): Promise<void> {
    try {
      await this.table.upsert({
        where: { feedbackId: feedback.id },
        update: {
          seen: feedback.seen,
        },
        create: {
          feedbackId: feedback.id,
          userId: feedback.userId,
          createdAt: feedback.createdAt,
          issueType: feedback.issueType,
          message: feedback.message,
          seen: feedback.seen,
        },
      });
    } catch (e) {
      throw handleDbError(e);
    }
  }

  async markAsSeen(feedbackId: string): Promise<void> {
    try {
      await this.table.update({
        where: { feedbackId },
        data: {
          seen: true,
        },
      });
    } catch (e) {
      throw handleDbError(e);
    }
  }
}
