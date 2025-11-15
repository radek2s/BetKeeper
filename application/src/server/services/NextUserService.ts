import { UserService } from "@domain/user";
import { NextFriendListRepository } from "../repositories/NextFriendListRepository";
import NextUserRepository from "../repositories/NextUserRepository";
import { NextUserRequestRepository } from "../repositories/NextUserRequestRepository";

const NextUserService = new UserService(
  new NextUserRepository(),
  new NextUserRequestRepository(),
  new NextFriendListRepository(),
);

export default NextUserService;
