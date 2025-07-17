import { User } from "../entities/User";

import { Email } from "../value-objects/Email";
import { IUserRepository, IFriendListRepository } from "./UserService";
import { UUID } from "domain/src/shared/Uuid";
import { UserInvitationRequest } from "../entities/UserInvitationRequest";
import { UserFriendList } from "../entities/UserFriendList";

/**
 * Invitation Request Repository Interface
 * Defines the contract for invitation request persistence operations
 */
export interface IInvitationRequestRepository {
  findById(id: string): Promise<UserInvitationRequest | null>;
  findPendingByEmail(email: Email): Promise<UserInvitationRequest[]>;
  save(request: UserInvitationRequest): Promise<void>;
}

/**
 * Invitation Domain Service
 * Handles invitation-related business operations
 */
export class InvitationService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly friendListRepository: IFriendListRepository,
    private readonly invitationRequestRepository: IInvitationRequestRepository,
  ) {}

  /**
   * Sends an invitation request for a non-existing user
   */
  async sendInvitationRequest(
    requesterId: UUID,
    inviteeEmail: Email,
  ): Promise<UserInvitationRequest> {
    const requester = await this.userRepository.findById(requesterId);
    if (!requester) {
      throw new Error("Requester not found");
    }

    if (!requester.canSendFriendRequests()) {
      throw new Error("Requester cannot send invitation requests");
    }

    const existingUser = await this.userRepository.findByEmail(inviteeEmail);
    if (existingUser) {
      throw new Error("User already exists. Send a friend request instead.");
    }

    const requesterFriendList =
      await this.friendListRepository.findByUserId(requesterId);
    if (!requesterFriendList) {
      throw new Error("Requester friend list not found");
    }

    const invitationRequest =
      requesterFriendList.sendInvitationRequest(inviteeEmail);

    await this.friendListRepository.save(requesterFriendList);
    await this.invitationRequestRepository.save(invitationRequest);

    return invitationRequest;
  }

  /**
   * Approves an invitation request and creates a new user account
   */
  async approveInvitationRequest(
    requestId: string,
    approvedById: UUID,
    inviteeFirstName: string,
    inviteeLastName: string,
  ): Promise<User> {
    const invitationRequest =
      await this.invitationRequestRepository.findById(requestId);
    if (!invitationRequest) {
      throw new Error("Invitation request not found");
    }

    const approver = await this.userRepository.findById(approvedById);
    if (!approver) {
      throw new Error("Approver not found");
    }

    invitationRequest.approve(approvedById);

    const newUser = User.create(
      invitationRequest.inviteeEmail,
      inviteeFirstName,
      inviteeLastName,
    );
    newUser.activate();

    const newUserFriendList = UserFriendList.create(newUser.id);

    const requesterFriendList = await this.friendListRepository.findByUserId(
      invitationRequest.requesterId,
    );
    if (!requesterFriendList) {
      throw new Error("Requester friend list not found");
    }

    requesterFriendList.addFriend(newUser.id);
    newUserFriendList.addFriend(invitationRequest.requesterId);

    await this.userRepository.save(newUser);
    await this.friendListRepository.save(newUserFriendList);
    await this.friendListRepository.save(requesterFriendList);
    await this.invitationRequestRepository.save(invitationRequest);

    return newUser;
  }

  /**
   * Rejects an invitation request
   */
  async rejectInvitationRequest(requestId: string): Promise<void> {
    const invitationRequest =
      await this.invitationRequestRepository.findById(requestId);
    if (!invitationRequest) {
      throw new Error("Invitation request not found");
    }

    invitationRequest.reject();
    await this.invitationRequestRepository.save(invitationRequest);
  }

  /**
   * Cancels an invitation request (by the requester)
   */
  async cancelInvitationRequest(
    requesterId: UUID,
    requestId: string,
  ): Promise<void> {
    const invitationRequest =
      await this.invitationRequestRepository.findById(requestId);
    if (!invitationRequest) {
      throw new Error("Invitation request not found");
    }

    if (!(invitationRequest.requesterId === requesterId)) {
      throw new Error("Only the requester can cancel the invitation request");
    }

    const requesterFriendList =
      await this.friendListRepository.findByUserId(requesterId);
    if (!requesterFriendList) {
      throw new Error("Requester friend list not found");
    }

    requesterFriendList.cancelInvitationRequest(requestId);
    invitationRequest.cancel();

    await this.friendListRepository.save(requesterFriendList);
    await this.invitationRequestRepository.save(invitationRequest);
  }

  /**
   * Gets all pending invitation requests for an email
   */
  async getPendingInvitationRequestsForEmail(
    email: Email,
  ): Promise<UserInvitationRequest[]> {
    return await this.invitationRequestRepository.findPendingByEmail(email);
  }

  /**
   * Checks if there are pending invitation requests for an email
   */
  async hasPendingInvitationRequests(email: Email): Promise<boolean> {
    const requests = await this.getPendingInvitationRequestsForEmail(email);
    return requests.length > 0;
  }
}
