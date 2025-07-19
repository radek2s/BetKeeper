export { Email } from "./value-objects/Email";

export {
  RequestStatus,
  UserStatus,
  FriendRequestType,
  RequestStatusGuards,
  UserStatusGuards,
} from "./types/RequestStatus";

export { User } from "./entities/User";
export { FriendRequest } from "./entities/FriendRequest";
export { UserInvitationRequest } from "./entities/UserInvitationRequest";
export { UserFriendList } from "./entities/UserFriendList";

export { DomainEvent } from "./events/DomainEvent";
export { UserCreatedEvent } from "./events/UserCreatedEvent";
export { UserStatusChangedEvent } from "./events/UserStatusChangedEvent";
export {
  FriendRequestSentEvent,
  FriendRequestApprovedEvent,
  FriendRequestRejectedEvent,
  FriendRemovedEvent,
  InvitationRequestSentEvent,
  InvitationRequestApprovedEvent,
} from "./events/FriendRequestEvents";

// Services
export { UserService } from "./services/UserService";
export type {
  IUserRepository,
  IFriendListRepository,
} from "./services/UserService";

export type { IInvitationRequestRepository } from "./services/UserInvitationService";
