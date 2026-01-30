"use server";

import NextUserRepository from "@app/server/repositories/NextUserRepository";

export async function getUserDetails(userId: string) {
  const user = await new NextUserRepository().findById(userId);
  if (!user) throw new Error("User not found");
  return user;
}
