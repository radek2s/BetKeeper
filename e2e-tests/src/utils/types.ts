import { UUID } from "crypto";
import { UserStatus } from "./enums";

export interface InviteUserResponse {
    id: UUID;
    requesterId: UUID;
    inviteeEmail: string;
    status: UserStatus;
    createdAt: Date;
}