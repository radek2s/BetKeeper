import { OkResponse } from "@app/lib/utils/fetchUtils";
import { getAuth } from "@app/server/auth/authenticatorFactory";
import { ExceptionHandler } from "@app/server/exceptions/ExceptionHandler";
import type { ExceptionResponseBody } from "@app/server/exceptions/exception.interface";
import { NextUserService } from "@app/server/services/NextUserService";
import { Email } from "@domain/user";
import logger from "application/logger";

export async function GET(req: Request) {
  try {
    const user = await getAuth().getUser(req);
    return OkResponse(user.toObject());
  } catch (e) {
    return ExceptionHandler(e);
  }
}
export async function POST(req: Request) {
  try {
    const user = await getAuth().getUser(req);
    const { email } = await req.json();
    if (!email) {
      const response: ExceptionResponseBody = {
        error: "Invalid Form Data",
        message: "Send payload with email property",
      };
      return Response.json(response, { status: 400 });
    }

    const friendEmail = new Email(email);
    const userExists = await NextUserService.userExists(friendEmail);

    if (userExists) {
      const response: ExceptionResponseBody = {
        error: "Invalid Form Data",
        message: "User with given email already exists",
      };
      return Response.json(response, { status: 409 });
    }

    const userRequest = await NextUserService.sendUserRequest(
      user.id,
      friendEmail,
    );
    logger.info(
      `[User Request][${userRequest.id}][Created] - Invited ${userRequest.inviteeEmail} by ${user.id}`,
    );
    return OkResponse(userRequest.toObject());
  } catch (e) {
    return ExceptionHandler(e);
  }
}
