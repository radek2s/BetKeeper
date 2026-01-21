import { UserStatus } from "@domain/user";
import type { UserType } from "@domain/user/entities";

export const DEFAULT_USER: UserType = {
  id: "user-01",
  firstName: "Peter",
  lastName: "King",
  email: "peter@test.com",
  avatarUrl: "avatar-01",
  role: "",
  status: UserStatus.ACTIVE,
};
