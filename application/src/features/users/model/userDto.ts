import type NextUserRepository from "@app/server/repositories/NextUserRepository";
import type { UserType } from "@domain/user/entities";

export async function userIdToUserType(
  userId: string,
  repository: NextUserRepository,
): Promise<UserType> {
  const user = await repository.findById(userId);
  if (!user) throw new Error(`Unable to find user with id ${userId}`);
  return user.toObject();
}
