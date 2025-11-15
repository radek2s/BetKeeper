import NextUserRepository from "@app/server/repositories/NextUserRepository";
import { Email, User } from "@domain/user";

describe("UserRepository", () => {
  const repository = new NextUserRepository();
  it("should pass", async () => {
    const email = "tester@email.com";
    await repository.save(new User(new Email(email), "John", "Doe"));

    const result = await repository.findByEmail(new Email(email));
    expect(result?.email.value).toBe(email);
  });
});
