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

interface SendUserRequestType {
  requesterId: UUID;
  inviteeEmail: string;
}
export async function sendUserRequest({
  requesterId,
  inviteeEmail,
}: SendUserRequestType) {
  console.log(inviteeEmail);
  try {
    await prisma.userRequestTable.create({
      data: {
        requesterId,
        inviteeEmail,
        createdAt: new Date().toISOString(),
        status: RequestStatus.PENDING,
      },
    });
  } catch (e) {
    console.error(e);
  }
}
