"use server";
import { Email, RequestStatus, UserService, type UUID } from "@domain/index";
import { NextFriendListRepository } from "application/src/core/repositories/NextFriendListRepository";
import NextUserRepository from "application/src/core/repositories/NextUserRepository";
import { NextUserRequestRepository } from "application/src/core/repositories/NextUserRequestRepository";
import prisma from "../../lib/prisma";

const NextUserService = new UserService(
  new NextUserRepository(),
  new NextUserRequestRepository(),
  new NextFriendListRepository(),
);

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
