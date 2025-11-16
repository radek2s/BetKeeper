import { AuthorizedUser } from "@app/lib/user/AuthorizedUser";
import type { UUID } from "@domain/shared";
import { Email, type IUserRepository, type UserStatus } from "@domain/user";
import prisma from "../db";
import { handleDbError } from "../db/exceptions";

class NextUserRepository implements IUserRepository {
  private table = prisma.userTable;

  async findAll(): Promise<AuthorizedUser[]> {
    try {
      const users = await this.table.findMany();
      return users.map((user) =>
        AuthorizedUser.reconstituteAuth(
          user.id,
          new Email(user.email),
          user.firstName,
          user.lastName,
          user.status as UserStatus,
          user.providerId,
          user.avatarUrl ?? undefined,
          user.role ?? undefined,
        ),
      );
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async findById(id: UUID): Promise<AuthorizedUser | null> {
    try {
      const user = await this.table.findUnique({ where: { id } });
      if (!user) return null;

      return AuthorizedUser.reconstituteAuth(
        user.id,
        new Email(user.email),
        user.firstName,
        user.lastName,
        user.status as UserStatus,
        user.providerId,
        user.avatarUrl ?? undefined,
        user.role ?? undefined,
      );
    } catch (e) {
      throw handleDbError(e);
    }
  }

  async findByProviderId(providerId: string): Promise<AuthorizedUser | null> {
    try {
      const user = await this.table.findUnique({ where: { providerId } });
      if (!user) return null;

      return AuthorizedUser.reconstituteAuth(
        user.id,
        new Email(user.email),
        user.firstName,
        user.lastName,
        user.status as UserStatus,
        user.providerId,
        user.avatarUrl ?? undefined,
        user.role ?? undefined,
      );
    } catch (e) {
      throw handleDbError(e);
    }
  }
  async findByEmail(email: Email): Promise<AuthorizedUser | null> {
    try {
      const user = await this.table.findUnique({
        where: { email: email.value },
      });
      if (!user) return null;

      return AuthorizedUser.reconstituteAuth(
        user.id,
        new Email(user.email),
        user.firstName,
        user.lastName,
        user.status as UserStatus,
        user.providerId,
        user.avatarUrl ?? undefined,
        user.role ?? undefined,
      );
    } catch (e) {
      throw handleDbError(e);
    }
  }
  async save(user: AuthorizedUser): Promise<void> {
    try {
      await this.table.upsert({
        where: { email: user.email.value },
        update: {
          firstName: user.firstName,
          lastName: user.lastName,
          status: user.status,
          avatarUrl: user.avatarUrl,
        },
        create: {
          id: user.id,
          email: user.email.value,
          firstName: user.firstName,
          lastName: user.lastName,
          status: user.status,
          avatarUrl: user.avatarUrl ?? null,
          providerId: user.providerId,
        },
      });
    } catch (e) {
      throw handleDbError(e);
    }
  }

  async attachProviderId(userId: string, providerId: string) {
    try {
      await this.table.update({
        where: { id: userId },
        data: {
          providerId,
        },
      });
    } catch (e) {
      throw handleDbError(e);
    }
  }
  async exists(email: Email): Promise<boolean> {
    return !!(await this.findByEmail(email));
  }
}

export default NextUserRepository;
