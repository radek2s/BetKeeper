import type { User } from "@domain/user";

export interface AuthenticationProvider {
  getUser(request?: Request): Promise<User>;
}
