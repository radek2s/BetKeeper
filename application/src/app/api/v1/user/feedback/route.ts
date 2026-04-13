import { UserFeedback } from "@app/features/feedback/UserFeedback";
import { UserFeedbackRequestSchema } from "@app/features/feedback/UserFeedbackSchema";
import { OkResponse } from "@app/lib/utils/fetchUtils";
import { getAuth } from "@app/server/auth/authenticatorFactory";
import { ExceptionHandler } from "@app/server/exceptions/ExceptionHandler";
import { NextFeedbackRepository } from "@app/server/repositories/NextFeedbackRepository";
import logger from "application/logger";

/**
 * Send user feedback
 * @tag Profile
 * @description Send bug or improvement suggestion
 * @body UserFeedbackRequestType
 * @response UserFeedbackResponseType
 * @openapi
 */
export async function POST(req: Request) {
  try {
    const user = await getAuth().getUser(req);
    const body = UserFeedbackRequestSchema.parse(await req.json());

    const feedback = new UserFeedback(user.id, body.issueType, body.message);
    const repository = new NextFeedbackRepository();
    repository.save(feedback);

    logger.info(`[User Feedback][${feedback.id}][Created] - by ${user.id}`);
    return OkResponse(null);
  } catch (e) {
    return ExceptionHandler(e);
  }
}
