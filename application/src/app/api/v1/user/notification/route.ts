import { UserNotificationSettings } from "@app/features/notification/user/model";
import { OkResponse } from "@app/lib/utils/fetchUtils";
import { getAuth } from "@app/server/auth/authenticatorFactory";
import { ExceptionHandler } from "@app/server/exceptions/ExceptionHandler";
import NextUserNotificationRepository from "@app/server/repositories/NextUserNotificationRepository";
import logger from "application/logger";

/**
 * Get user email notification settings
 * @tag Profle
 * @description Get user notification settings
 * @response UserNotificationSettingsType
 * @openapi
 */
export async function GET(req: Request) {
  try {
    const user = await getAuth().getUser(req);
    const notificationRepository = new NextUserNotificationRepository();
    return OkResponse(
      (await notificationRepository.findById(user.id)).toObject(),
    );
  } catch (e) {
    return ExceptionHandler(e);
  }
}

/**
 * Update user notification settings
 * @tag Profle
 * @description Update user mailing notification settings
 * @body UserNotificationSettingsType
 * @response UserNotificationSettingsType
 * @openapi
 */
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const user = await getAuth().getUser(req);
    const repository = new NextUserNotificationRepository();
    const settings = UserNotificationSettings.reconstitute(
      user.id,
      body.friendInvitation,
      body.betRequestInvitation,
      body.betRequestAggreed,
      body.betResolved,
      body.betCompleted,
    );
    await repository.save(settings);
    logger.info(`[UserNotificationSettings][${user.id}][Updated]`);
    return OkResponse(settings.toObject());
  } catch (e) {
    return ExceptionHandler(e);
  }
}
