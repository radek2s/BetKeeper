import { InvitationService } from "@domain/user/services/UserInvitationService";
import { NextFriendListRepository } from "../repositories/NextFriendListRepository";
import NextUserRepository from "../repositories/NextUserRepository";
import { NextUserRequestRepository } from "../repositories/NextUserRequestRepository";

const NextUserInvitationService = new InvitationService(
  new NextUserRepository(),
  new NextFriendListRepository(),
  new NextUserRequestRepository(),
);

export default NextUserInvitationService;
