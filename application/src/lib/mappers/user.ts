import { Email, User } from "@domain/user";
import type { UserType } from "@domain/user/entities";

export function userToObject(user: User): UserType {
  return user.toObject();
}

export function objectToUser(user: UserType): User {
  console.log(user);
  return User.reconstitute(
    user.id,
    new Email(user.email),
    user.firstName,
    user.lastName,
    user.status,
    user.avatarUrl,
  );
}
