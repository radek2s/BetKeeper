/**
 * Request Status Enumeration
 * Represents the various states of friend requests and invitation requests
 */
export enum RequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired'
}

/**
 * User Status Enumeration
 * Represents the status of a user in the system
 */
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_ACTIVATION = 'pending_activation'
}

/**
 * Friend Request Type Enumeration
 * Distinguishes between different types of friend-related requests
 */
export enum FriendRequestType {
  FRIEND_REQUEST = 'friend_request',
  INVITATION_REQUEST = 'invitation_request'
}

/**
 * Type guard functions for better type safety
 */
export const RequestStatusGuards = {
  isPending: (status: RequestStatus): boolean => status === RequestStatus.PENDING,
  isApproved: (status: RequestStatus): boolean => status === RequestStatus.APPROVED,
  isRejected: (status: RequestStatus): boolean => status === RequestStatus.REJECTED,
  isCancelled: (status: RequestStatus): boolean => status === RequestStatus.CANCELLED,
  isExpired: (status: RequestStatus): boolean => status === RequestStatus.EXPIRED,
  isFinal: (status: RequestStatus): boolean => 
    [RequestStatus.APPROVED, RequestStatus.REJECTED, RequestStatus.CANCELLED, RequestStatus.EXPIRED].includes(status)
};

export const UserStatusGuards = {
  isActive: (status: UserStatus): boolean => status === UserStatus.ACTIVE,
  canReceiveFriendRequests: (status: UserStatus): boolean => 
    [UserStatus.ACTIVE, UserStatus.PENDING_ACTIVATION].includes(status),
  canSendFriendRequests: (status: UserStatus): boolean => status === UserStatus.ACTIVE
};
