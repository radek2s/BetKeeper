import { Email, User } from "@domain/user";
import NextUserRepository from "application/src/core/repositories/NextUserRepository";

describe("UserRepository", () => {
  const repository = new NextUserRepository();
  it("should pass", async () => {
    const email = "tester@email.com";
    await repository.save(new User(new Email(email), "John", "Doe"));

    const result = await repository.findByEmail(new Email(email));
    expect(result?.email.value).toBe(email);
  });
});
