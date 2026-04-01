import type { UserFeedback } from "@app/features/profile/UserFeedback";
import prisma from "../db";
import { handleDbError } from "../db/exceptions";

export interface IFeedbackRepository {
  save(feedback: UserFeedback): Promise<void>;
}

export class NextFeedbackRepository implements IFeedbackRepository {
  private table = prisma.userFeedbackTable;

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
}
