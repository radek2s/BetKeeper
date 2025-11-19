import NextUserRepository from "../repositories/NextUserRepository";

const TEST_USER_ID =
  process.env.TEST_USER_ID || "00000000-0000-0000-0000-000011110000";

export async function getTestUser() {
  const user = await new NextUserRepository().findById(TEST_USER_ID);
  if (!user) throw new Error("User with given ID was not found!");
  return user;
}
