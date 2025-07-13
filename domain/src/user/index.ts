// Value Objects
export { UserId } from './value-objects/UserId';
export { Email } from './value-objects/Email';
export { UserName } from './value-objects/UserName';
export { RequestId } from './value-objects/RequestId';

// Types and Enums
export { 
  RequestStatus, 
  UserStatus, 
  FriendRequestType,
  RequestStatusGuards,
  UserStatusGuards 
} from './types/RequestStatus';

// Entities
export { User } from './entities/User';
export { FriendRequest } from './entities/FriendRequest';
export { InvitationRequest } from './entities/InvitationRequest';

// Aggregates
export { FriendList } from './aggregates/FriendList';

// Domain Events
export { DomainEvent } from './events/DomainEvent';
export { UserCreatedEvent } from './events/UserCreatedEvent';
export { UserStatusChangedEvent } from './events/UserStatusChangedEvent';
export { 
  FriendRequestSentEvent,
  FriendRequestApprovedEvent,
  FriendRequestRejectedEvent,
  FriendRemovedEvent,
  InvitationRequestSentEvent,
  InvitationRequestApprovedEvent
} from './events/FriendRequestEvents';

// Services
export { 
  UserService,
  IUserRepository,
  IFriendListRepository
} from './services/UserService';
export { 
  InvitationService,
  IInvitationRequestRepository
} from './services/InvitationService';
