import type { AuthorizedUser } from "@app/lib/user/AuthorizedUser";

export interface AuthenticationProvider {
  getUser(request?: Request): Promise<AuthorizedUser>;
}
