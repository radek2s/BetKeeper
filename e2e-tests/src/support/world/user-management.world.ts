import { RequestStatus, UserStatus } from "@domain/user";
import { BaseWorld } from "./base.world";

export class UserManagementWorld extends BaseWorld {
    adminUserId?: string;

    inviteUserRequest?: {
        inviteeEmail: string;
    };

    inviteUserResponse?: {
        status: RequestStatus;
        inviteeEmail: string;
    }

    pendingUserRequest?: {
        inviteeEmail: string;
    };

    pendingUserResponse?: {
        id: string;
        status: RequestStatus;
        inviteeEmail: string;
    }

    acceptUserRequest?: {
        id: string;
        firstName: string;
        lastName: string;
    }

    acceptUserResponse?: {
        status: UserStatus;
        firstName: string;
        lastName: string;
    };
}