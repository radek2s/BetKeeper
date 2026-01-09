import { UserService } from "@domain/user";
import { ServerDispatcher } from "../events/EventDispatcher";
import { NextFriendListRepository } from "../repositories/NextFriendListRepository";
import NextUserRepository from "../repositories/NextUserRepository";
import { NextUserRequestRepository } from "../repositories/NextUserRequestRepository";

export const NextUserService = new UserService(
  new NextUserRepository(),
  new NextUserRequestRepository(),
  new NextFriendListRepository(),
  ServerDispatcher,
);
