import type { UUID } from "@domain/shared";
import {
  Email,
  type IUserRepository,
  User,
  type UserStatus,
} from "@domain/user";
import { PrismaClientKnownRequestError } from "application/generated/prisma/runtime/edge-esm";
import prisma from "application/src/lib/prisma";

class NextUserRepository implements IUserRepository {
  private table = prisma.userTable;

  async findAll(): Promise<User[]> {
    try {
      const users = await this.table.findMany();
      return users.map((user) =>
        User.reconstitute(
          user.id,
          new Email(user.email),
          user.firstName,
          user.lastName,
          user.status as UserStatus,
          user.avatarUrl ?? undefined,
          user.role ?? undefined,
        ),
      );
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async findById(id: UUID): Promise<User | null> {
    try {
      const user = await this.table.findUnique({ where: { id } });
      if (!user) return null;

      return User.reconstitute(
        user.id,
        new Email(user.email),
        user.firstName,
        user.lastName,
        user.status as UserStatus,
        user.avatarUrl ?? undefined,
        user.role ?? undefined,
      );
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
  async findByEmail(email: Email): Promise<User | null> {
    try {
      const user = await this.table.findUnique({
        where: { email: email.value },
      });
      if (!user) return null;

      return User.reconstitute(
        user.id,
        new Email(user.email),
        user.firstName,
        user.lastName,
        user.status as UserStatus,
        user.avatarUrl ?? undefined,
        user.role ?? undefined,
      );
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
  async save(user: User): Promise<void> {
    try {
      const userEntity = await this.findByEmail(user.email);
      if (userEntity) {
        console.debug("User does already exists");
        await this.table.update({
          where: { id: userEntity.id },
          data: {
            firstName: user.firstName,
            lastName: user.lastName,
            status: user.status,
            avatarUrl: user.avatarUrl,
          },
        });
      } else {
        console.debug("New User created");
        await this.table.create({
          data: {
            id: user.id,
            email: user.email.value,
            firstName: user.firstName,
            lastName: user.lastName,
            status: user.status,
            avatarUrl: user.avatarUrl ?? null,
          },
        });
      }
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        console.error(e.message);
        throw new Error(e.message);
      }
      throw e;
    }
  }
  async exists(email: Email): Promise<boolean> {
    return !!(await this.findByEmail(email));
  }
}

export default NextUserRepository;
