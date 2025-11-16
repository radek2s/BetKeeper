import type { UUID } from "@domain/shared";
import { type Email, UserStatus } from "@domain/user";
import { User, type UserType } from "@domain/user/entities";

export class AuthorizedUser extends User {
  providerId: string;

  constructor(
    email: Email,
    firstName: string,
    lastName: string,
    status: UserStatus = UserStatus.PENDING_ACTIVATION,
    providerId: string,
    avatarUrl?: string,
    id?: UUID,
  ) {
    super(email, firstName, lastName, status, avatarUrl, id);
    this.providerId = providerId;
  }

  static reconstituteAuth(
    id: UUID,
    email: Email,
    firstName: string,
    lastName: string,
    status: UserStatus,
    providerId: string,
    avatarUrl?: string,
    role?: string,
  ): AuthorizedUser {
    const user = new AuthorizedUser(
      email,
      firstName,
      lastName,
      status,
      providerId,
      avatarUrl,
      id,
    );
    user._role = role;
    return user;
  }
}

export type AuthorizedUserType = UserType & {
  providerId: string;
};
