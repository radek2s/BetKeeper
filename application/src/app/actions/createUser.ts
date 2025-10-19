"use server";
import prisma from "../../lib/prisma";

export async function createUser({
  email,
  name,
}: {
  email: string;
  name: string;
}) {
  return await prisma.user.create({
    data: {
      email,
      firstName: name,
      lastName: name,
      status: "RANDOM",
    },
  });
}
