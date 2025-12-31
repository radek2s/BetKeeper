import { Email, User } from "@domain/user";
import type { UserRequestType, UserType } from "@domain/user/entities";

export function userToObject(user: User): UserType {
  return user.toObject();
}

export function objectToUser(user: UserType): User {
  return User.reconstitute(
    user.id,
    new Email(user.email),
    user.firstName,
    user.lastName,
    user.status,
    user.avatarUrl,
    user.role,
  );
}

export type UserRequestWithRequester = UserRequestType & {
  requesterName: string;
  requesterEmail: string;
};

export function mapUserRequestWithRequester(
  request: UserRequestType,
  user: UserType | undefined,
): UserRequestWithRequester {
  if (!user) throw new Error("User does not existsis");
  return {
    ...request,
    requesterName: `${user.firstName} ${user.lastName}`,
    requesterEmail: user.email,
  };
}
