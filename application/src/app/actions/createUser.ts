"use server";
import { Email, RequestStatus, type UUID } from "@domain/index";
import NextUserService from "application/src/core/services/NextUserService";
import prisma from "../../lib/prisma";

export async function createUser({
  email,
  firstName,
  lastName,
}: {
  email: string;
  firstName: string;
  lastName: string;
}) {
  await NextUserService.createUser(new Email(email), firstName, lastName);
}
