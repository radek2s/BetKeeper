import { OkResponse } from "@app/lib/utils/fetchUtils";
import { getAuth } from "@app/server/auth/authenticatorFactory";
import { AuthenticationError } from "@app/server/exceptions/AuthenticationError";
import { ExceptionHandler } from "@app/server/exceptions/ExceptionHandler";
import { NextFeedbackRepository } from "@app/server/repositories/NextFeedbackRepository";
import logger from "application/logger";

interface RouteParams {
  id: string;
}
/**
 * Delete feedback - mark as seen.
 * @tag Admin
 * @description Mark user feedback as seen. Remove from list.
 * @openapi
 */
export async function DELETE(
  req: Request,
  { params }: { params: RouteParams },
) {
  try {
    const user = await getAuth().getUser(req);
    if (user.role !== "ADMINISTRATOR")
      throw new AuthenticationError("User is not allowed to use this endpoint");

    const { id: feedbackId } = await params;

    const feedbackRepository = new NextFeedbackRepository();
    await feedbackRepository.markAsSeen(feedbackId);

    logger.info(`[User Feedback][${feedbackId}][Marked as seen] by ${user.id}`);

    return OkResponse(null);
  } catch (e) {
    return ExceptionHandler(e);
  }
}
