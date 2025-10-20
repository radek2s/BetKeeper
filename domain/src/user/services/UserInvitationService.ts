import { User } from "../entities/User";

import { IEventDispatcher, UUID } from "@domain/shared";
import { Email } from "../value-objects";
import { UserFriendList, UserRequest } from "../entities";
import { IFriendListRepository, IUserRepository } from "./UserService";

/**
 * Invitation Request Repository Interface
 * Defines the contract for invitation request persistence operations
 */
export interface IInvitationRequestRepository {
  findById(id: string): Promise<UserRequest | null>;
  findPendingByEmail(email: Email): Promise<UserRequest[]>;
  save(request: UserRequest): Promise<void>;
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
    private readonly eventDispatcher?: IEventDispatcher,
  ) {}

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
   * Gets all pending invitation requests for an email
   */
  async getPendingInvitationRequestsForEmail(
    email: Email,
  ): Promise<UserRequest[]> {
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
