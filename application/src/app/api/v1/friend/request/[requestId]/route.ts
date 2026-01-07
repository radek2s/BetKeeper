import { OkResponse } from "@app/lib/utils/fetchUtils";
import { getAuth } from "@app/server/auth/authenticatorFactory";
import { ExceptionHandler } from "@app/server/exceptions/ExceptionHandler";
import type { ExceptionResponseBody } from "@app/server/exceptions/exception.interface";
import { NextUserService } from "@app/server/services/NextUserService";
import logger from "application/logger";

/**
 * Accept or reject received FriendRequest
 */
export async function PUT(
  req: Request,
  { params }: { params: { requestId: string } },
) {
  try {
    const user = await getAuth().getUser(req);
    const { requestId } = await params;
    const { action } = await req.json();
    if (!action) {
      const response: ExceptionResponseBody = {
        error: "Invalid form data",
        message: "Required action property is missing.",
      };
      return Response.json(response, { status: 400 });
    }
    if (action === "accept") {
      await NextUserService.approveFriendRequest(user.id, requestId);
      logger.info(
        `[FriendRequest][${requestId}][Approved] - Approved by ${user.id}`,
      );
    } else if (action === "reject") {
      await NextUserService.rejectFriendRequest(user.id, requestId);
      logger.info(
        `[FriendRequest][${requestId}][Rejected] - Rejected by ${user.id}`,
      );
    }
    return OkResponse(null);
  } catch (e) {
    return ExceptionHandler(e);
  }
}

/**
 * Cancel sending FriendRequest
 */
export async function DELETE(
  req: Request,
  { params }: { params: { requestId: string } },
) {
  try {
    const user = await getAuth().getUser(req);
    const { requestId } = await params;
    await NextUserService.cancelFriendRequest(requestId);
    logger.info(
      `[FriendRequest][${requestId}][Deleted] - Deleted by ${user.id}`,
    );
    return Response.json(null);
  } catch (e) {
    return ExceptionHandler(e);
  }
}
