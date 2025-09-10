import { User } from "../../src/user/entities/User";
import { Email } from "../../src/user/value-objects/Email";
import { IUserRepository } from "../../src/user/services/UserService";
import { UUID } from "../../src/shared/Uuid";

export class InMemoryUserRepository implements IUserRepository {
  private users: User[] = [];

  async findById(id: UUID): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    return this.users.find((user) => user.email.equals(email)) || null;
  }

  async save(user: User): Promise<void> {
    const existingUser = await this.findByEmail(user.email);
    if (existingUser) {
      this.users = this.users.map((u) => (u.id === existingUser.id ? user : u));
    } else {
      this.users.push(user);
    }
  }

  async exists(email: Email): Promise<boolean> {
    return (await this.findByEmail(email)) !== null;
  }
}
