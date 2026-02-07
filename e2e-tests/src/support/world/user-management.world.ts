import { Email, RequestStatus, UserStatus } from "@domain/user";
import { BaseWorld } from "./base.world";

export class UserManagementWorld extends BaseWorld {
    adminUserId?: string;
    invitedUser?: {
        id?: string;
        status?: RequestStatus;
        inviteeEmail?: string;
    };
    pendingUser?: {
        id?: string;
        status?: RequestStatus;
        inviteeEmail?: string;
    };
    activeUser?: {
        id?: string;
        status?: UserStatus;
        email?: Email;
        firstName?: string;
        lastName?: string;
    };
}